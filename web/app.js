/* Naratif studio UI. No framework — the surface is small enough that plain DOM
   is less code than any library would be, and it starts instantly. */

const $ = (id) => document.getElementById(id);
const el = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
};

const state = {
  meta: null,
  projects: [],
  current: null,
  activeTab: 'topik',
  poller: null,
};

/* ── API ──────────────────────────────────────────────────────────── */

async function api(path, options = {}) {
  const response = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || `HTTP ${response.status}`);
  return payload;
}

/* ── Boot ─────────────────────────────────────────────────────────── */

async function boot() {
  state.meta = await api('/api/meta');
  renderHealth();
  fillNewProjectForm();
  await refreshProjects();
  connectLogs();
  wireEvents();
  wireSetup();

  // Nothing in the app works without keys, so the gate opens itself on a
  // fresh install rather than letting the first click fail somewhere deeper.
  const { configured } = await api('/api/setup');
  if (!configured) openSetup({ firstRun: true });
}

/* ── Setup gate ───────────────────────────────────────────────────── */

function openSetup({ firstRun = false } = {}) {
  $('setup').hidden = false;
  $('setup-title').textContent = firstRun ? 'Sambungkan kunci API' : 'Pengaturan kunci API';
  $('btn-skip-setup').hidden = firstRun;
  $('setup-result').hidden = true;
  $('key-anthropic').focus();
}

function closeSetup() {
  $('setup').hidden = true;
}

function renderSetupResult(tests) {
  const host = $('setup-result');
  host.hidden = false;
  const row = (name, result) =>
    `<div class="line"><b>${name}</b>` +
    `<span class="${result.ok ? 'ok' : 'bad'}">${result.ok ? 'tersambung' : 'gagal'}</span>` +
    (result.ok ? '' : `<span class="why">${escapeHtml(result.why || '')}</span>`) +
    '</div>';
  host.innerHTML = row('Claude', tests.claude) + row('KIE', tests.kie);
}

function wireSetup() {
  $('btn-settings').addEventListener('click', () => openSetup());
  $('btn-skip-setup').addEventListener('click', closeSetup);

  $('btn-save-keys').addEventListener('click', async () => {
    const button = $('btn-save-keys');
    button.disabled = true;
    button.textContent = 'Menyimpan…';
    try {
      await api('/api/setup', {
        method: 'POST',
        body: {
          anthropicKey: $('key-anthropic').value.trim(),
          kieKey: $('key-kie').value.trim(),
          elevenLabsKey: $('key-eleven').value.trim(),
        },
      });

      button.textContent = 'Menguji koneksi…';
      const tests = await api('/api/setup/test', { method: 'POST' });
      renderSetupResult(tests);

      // Reflect the new capabilities in the header immediately.
      state.meta = await api('/api/meta');
      renderHealth();

      if (tests.claude.ok && tests.kie.ok) {
        button.textContent = 'Siap';
        setTimeout(closeSetup, 1100);
      } else {
        button.textContent = 'Simpan & uji lagi';
      }
    } catch (error) {
      $('setup-result').hidden = false;
      $('setup-result').innerHTML =
        `<div class="line"><span class="bad">${escapeHtml(error.message)}</span></div>`;
      button.textContent = 'Simpan & uji koneksi';
    } finally {
      button.disabled = false;
    }
  });
}

function renderHealth() {
  const host = $('health');
  host.innerHTML = '';
  const { capabilities: caps, toolchain } = state.meta;

  const items = [
    ['Claude', caps.claude.ready, caps.claude.why],
    ['KIE', caps.kie.ready, caps.kie.why],
    ['Dubbing', caps.dubbing.ready, caps.dubbing.why],
    ['ffmpeg', toolchain.ok, toolchain.why || ''],
  ];

  if (toolchain.ok && !toolchain.hasLibass) {
    items.push(['takarir', false, 'ffmpeg tanpa libass — takarir tidak bisa dibakar']);
  }

  for (const [label, ok, why] of items) {
    const chip = el('span', `chip ${ok ? 'ok' : 'bad'}`, label);
    if (!ok && why) chip.title = why;
    host.append(chip);
  }
}

function fillNewProjectForm() {
  const categorySelect = $('f-category');
  categorySelect.innerHTML = '';
  for (const category of state.meta.categories) {
    categorySelect.append(new Option(category.label, category.id));
  }

  const modeSelect = $('f-mode');
  modeSelect.innerHTML = '';
  for (const mode of state.meta.modes) {
    modeSelect.append(new Option(mode.label, mode.id));
  }

  updateEstimate();
  $('f-duration').addEventListener('change', updateEstimate);
  $('f-mode').addEventListener('change', updateEstimate);
}

function updateEstimate() {
  const seconds = Number($('f-duration').value);
  const mode = $('f-mode').value;
  const segments = Math.round(seconds / 1.15);
  // Mirrors src/pipeline/orchestrator.mjs → estimateCost.
  const claude = 0.06 * 4;
  const dubbing = segments * (0.012 + 0.006) * 1.4;
  const visuals = mode === 'aigen' ? segments * 0.4 : segments * 0.035 * 1.1;
  const total = claude + dubbing + visuals;
  $('f-estimate').textContent =
    `Perkiraan ~${segments} segmen, biaya sekitar $${total.toFixed(2)} ` +
    `(batas kamu: $${state.meta.settings.maxCost.toFixed(2)}).`;
}

/* ── Projects ─────────────────────────────────────────────────────── */

async function refreshProjects() {
  const { projects } = await api('/api/projects');
  state.projects = projects;
  const list = $('project-list');
  list.innerHTML = '';

  if (!projects.length) {
    list.append(el('li', 'muted', 'Belum ada proyek.'));
    return;
  }

  for (const project of projects) {
    const li = el('li');
    if (state.current?.id === project.id) li.classList.add('is-active');

    li.append(el('div', 'pl-title', project.title || project.product));

    const meta = el('div', 'pl-meta');
    const dotClass = project.status?.startsWith('gagal')
      ? 'fail'
      : project.status === 'selesai'
        ? 'done'
        : 'busy';
    meta.append(el('span', `status-dot ${dotClass}`));
    meta.append(el('span', '', project.status));
    if (project.costUsd) meta.append(el('span', '', `$${project.costUsd.toFixed(2)}`));
    li.append(meta);

    li.addEventListener('click', () => openProject(project.id));
    list.append(li);
  }
}

async function openProject(id) {
  const { project } = await api(`/api/projects/${id}`);
  state.current = project;
  $('empty-state').classList.add('hidden');
  $('project-view').classList.remove('hidden');
  renderProject();
  refreshProjects();
  startPolling();
}

function renderProject() {
  const project = state.current;
  if (!project) return;

  $('pv-title').textContent = project.script?.title || project.chosenTopic?.title || project.product;
  $('pv-sub').textContent =
    `${project.category === 'fnb' ? 'Makanan & Minuman' : 'Fashion'} · ` +
    `${project.product}${project.brand ? ` · ${project.brand}` : ''} · ` +
    `target ${project.durationSeconds} detik`;
  $('pv-cost').textContent = `$${(project.costUsd || 0).toFixed(2)}`;

  renderPipeline();
  renderActiveTab();
}

function renderPipeline() {
  const project = state.current;
  const host = $('pipeline');
  host.innerHTML = '';

  const reached = {
    riset: project.topics?.length > 0,
    naskah: Boolean(project.script),
    dubbing: Boolean(project.dub),
    visual: Boolean(project.visuals),
    rakit: Boolean(project.video),
    qc: Boolean(project.qc),
    caption: Boolean(project.captions),
  };

  for (const stage of state.meta.stages) {
    const li = el('li');
    const done = reached[stage.id];
    const failed = project.status === `gagal-${stage.id}`;
    if (failed) li.classList.add('fail');
    else if (done) li.classList.add('done');
    else if (project.status === stage.id) li.classList.add('busy');

    li.append(el('div', 'st-label', stage.label));
    li.append(el('div', 'st-note', done ? 'selesai' : `biaya: ${stage.paid}`));
    host.append(li);
  }
}

/* ── Tabs ─────────────────────────────────────────────────────────── */

function renderActiveTab() {
  for (const tab of document.querySelectorAll('.tab')) {
    tab.classList.toggle('is-active', tab.dataset.tab === state.activeTab);
  }
  for (const body of document.querySelectorAll('.tab-body')) {
    body.classList.add('hidden');
  }
  const host = $(`tab-${state.activeTab}`);
  host.classList.remove('hidden');
  host.innerHTML = '';

  ({
    topik: renderTopics,
    naskah: renderScript,
    dubbing: renderDubbing,
    visual: renderVisuals,
    hasil: renderResult,
    caption: renderCaptions,
  })[state.activeTab](host);
}

function stageButton(host, label, path, body) {
  const button = el('button', 'btn btn-primary', label);
  button.addEventListener('click', async () => {
    button.disabled = true;
    button.textContent = 'Menjalankan…';
    try {
      await api(`/api/projects/${state.current.id}${path}`, { method: 'POST', body: body || {} });
      startPolling();
    } catch (error) {
      alert(error.message);
      button.disabled = false;
      button.textContent = label;
    }
  });
  host.append(button);
  return button;
}

/* ── Tab: topics ──────────────────────────────────────────────────── */

function renderTopics(host) {
  const project = state.current;
  const actions = el('div', 'stage-actions');
  host.append(actions);
  stageButton(actions, project.topics?.length ? 'Riset ulang' : 'Riset topik', '/research');

  if (!project.topics?.length) {
    host.append(
      el('p', 'muted', 'Belum ada topik. Klik "Riset topik" untuk mencari sudut cerita yang segar.'),
    );
    return;
  }

  project.topics.forEach((topic, index) => {
    const card = el('div', 'card');
    if (project.chosenTopic?.title === topic.title) card.classList.add('selected');

    const head = el('div', 'card-head');
    head.append(el('h3', '', topic.title));

    const scores = el('div', 'scores');
    const hookScore = el('span', 'score');
    hookScore.innerHTML = `hook <strong>${topic.hookStrength}</strong>`;
    const sellScore = el('span', 'score');
    sellScore.innerHTML = `halus <strong>${topic.softSellScore}</strong>`;
    scores.append(hookScore, sellScore);
    head.append(scores);
    card.append(head);

    card.append(el('div', 'hook', topic.hook));
    card.append(el('div', 'card-body', topic.premise));

    const bridge = el('div', 'card-body');
    bridge.style.marginTop = '8px';
    bridge.innerHTML = `<strong>Jembatan ke produk:</strong> ${escapeHtml(topic.bridgeToProduct)}`;
    card.append(bridge);

    if (topic.factsToVerify?.length) {
      const facts = el('div', 'card-body');
      facts.style.marginTop = '8px';
      facts.innerHTML =
        `<strong>Perlu dicek:</strong> ${topic.factsToVerify.map(escapeHtml).join(' · ')}`;
      card.append(facts);
    }

    const actions = el('div', 'stage-actions');
    actions.style.marginTop = '12px';
    actions.style.marginBottom = '0';
    stageButton(actions, 'Pakai topik ini → tulis naskah', '/script', { topicIndex: index });
    card.append(actions);

    host.append(card);
  });
}

/* ── Tab: script ──────────────────────────────────────────────────── */

function renderScript(host) {
  const script = state.current.script;
  if (!script) {
    host.append(el('p', 'muted', 'Naskah belum dibuat. Pilih topik dulu di tab Topik.'));
    return;
  }

  const lint = script.ttsLint;
  const notice = el(
    'div',
    `notice ${lint.summary.errors ? 'error' : lint.summary.warnings ? 'warn' : 'ok'}`,
  );
  notice.textContent = lint.summary.errors
    ? `${lint.summary.errors} masalah pelafalan memblokir produksi. Perbaiki dulu sebelum dubbing.`
    : lint.summary.warnings
      ? `Naskah lolos. ${lint.summary.warnings} peringatan — periksa sebelum lanjut.`
      : 'Naskah bersih. Tidak ada risiko pelafalan yang terdeteksi.';
  host.append(notice);

  const metrics = el('div', 'metrics');
  metrics.style.marginBottom = '18px';
  for (const [label, value] of [
    ['Segmen', script.segments.length],
    ['Kata', lint.summary.words],
    ['Perkiraan durasi', `${lint.summary.estimatedSeconds}s`],
    ['Error', lint.summary.errors],
    ['Peringatan', lint.summary.warnings],
  ]) {
    const metric = el('div', 'metric');
    metric.append(el('div', 'm-label', label));
    metric.append(el('div', 'm-value', String(value)));
    metrics.append(metric);
  }
  host.append(metrics);

  if (lint.findings.length) {
    const details = el('details');
    details.append(el('summary', '', `Temuan pemeriksa bahasa (${lint.findings.length})`));
    const box = el('div');
    box.style.marginTop = '10px';
    for (const finding of lint.findings.slice(0, 40)) {
      const row = el('div', `finding ${finding.severity}`);
      row.append(el('span', 'sev', finding.severity));
      const body = el('div');
      body.innerHTML =
        `${escapeHtml(finding.message)}<div class="fix">Perbaikan: ${escapeHtml(finding.fix)}</div>`;
      row.append(body);
      box.append(row);
    }
    details.append(box);
    host.append(details);
  }

  const segments = el('div', 'segments');
  segments.style.marginTop = '18px';
  for (const segment of script.segments) {
    const row = el('div', 'segment');
    row.append(el('div', 'num', String(segment.index + 1).padStart(2, '0')));

    const body = el('div');
    body.append(el('div', 'vo', segment.voiceover));

    const meta = el('div', 'meta');
    meta.append(el('span', 'tag section', segment.section));
    if (segment.sfx) meta.append(el('span', 'tag', `sfx: ${segment.sfx}`));
    if (segment.onScreenText) meta.append(el('span', 'tag', `layar: ${segment.onScreenText}`));
    if (segment.normalizations?.length) {
      meta.append(el('span', 'tag', `${segment.normalizations.length} normalisasi`));
    }
    meta.append(el('span', 'tag', segment.visualSubject));
    body.append(meta);

    row.append(body);
    segments.append(row);
  }
  host.append(segments);

  const actions = el('div', 'stage-actions');
  actions.style.marginTop = '18px';
  host.append(actions);
  stageButton(actions, 'Tulis ulang naskah', '/script', { topicIndex: 0 });
  const next = stageButton(actions, 'Lanjut ke dubbing', '/dub');
  if (lint.summary.errors) next.disabled = true;
}

/* ── Tab: dubbing ─────────────────────────────────────────────────── */

function renderDubbing(host) {
  const dub = state.current.dub;
  const actions = el('div', 'stage-actions');
  host.append(actions);
  stageButton(actions, dub ? 'Ulangi dubbing' : 'Mulai dubbing', '/dub');

  if (!dub) {
    host.append(
      el(
        'p',
        'muted',
        'Setiap segmen akan disuarakan lalu ditranskripsi ulang dan dibandingkan dengan naskah. ' +
          'Segmen yang meleset otomatis diulang dengan setelan suara yang lebih stabil.',
      ),
    );
    return;
  }

  const failed = dub.takes.filter((t) => !t.ok);
  const notice = el('div', `notice ${failed.length ? 'error' : 'ok'}`);
  notice.textContent = failed.length
    ? `${failed.length} segmen masih meleset dari naskah. Perbaiki kalimatnya, lalu ulangi dubbing.`
    : `Semua segmen cocok dengan naskah. Selisih rata-rata ${(dub.meanWer * 100).toFixed(1)}%.`;
  host.append(notice);

  const segments = el('div', 'segments');
  for (const take of dub.takes) {
    const script = state.current.script.segments.find((s) => s.index === take.segmentIndex);
    const row = el('div', 'segment');
    row.append(el('div', 'num', String(take.segmentIndex + 1).padStart(2, '0')));

    const body = el('div');
    body.append(el('div', 'vo', script?.voiceover || ''));

    const meta = el('div', 'meta');
    meta.append(
      el('span', `tag ${take.ok ? 'wer-ok' : 'wer-bad'}`, `WER ${(take.wer * 100).toFixed(1)}%`),
    );
    meta.append(el('span', 'tag', `${take.attempts}x percobaan`));
    body.append(meta);

    if (!take.ok && take.mismatches?.length) {
      const detail = el('div', 'card-body');
      detail.style.marginTop = '6px';
      detail.innerHTML =
        'Terdengar berbeda: ' +
        take.mismatches
          .slice(0, 6)
          .map((m) => `<code>${escapeHtml(m.expected || '—')}</code> → <code>${escapeHtml(m.heard || '—')}</code>`)
          .join(', ');
      body.append(detail);
    }

    const audio = el('audio');
    audio.controls = true;
    audio.preload = 'none';
    audio.style.marginTop = '8px';
    audio.style.width = '100%';
    audio.style.height = '32px';
    audio.src = `/media?file=${encodeURIComponent(take.file)}`;
    body.append(audio);

    row.append(body);
    segments.append(row);
  }
  host.append(segments);

  if (!failed.length) {
    const next = el('div', 'stage-actions');
    next.style.marginTop = '18px';
    host.append(next);
    stageButton(next, 'Lanjut buat gambar', '/visuals');
  }
}

/* ── Tab: visuals ─────────────────────────────────────────────────── */

function renderVisuals(host) {
  const visuals = state.current.visuals;
  const actions = el('div', 'stage-actions');
  host.append(actions);
  stageButton(actions, visuals ? 'Buat ulang gambar' : 'Buat gambar', '/visuals');

  if (!visuals) {
    host.append(el('p', 'muted', 'Gambar dibuat satu per segmen, mengikuti gaya kolase editorial Vox.'));
    return;
  }

  const failed = visuals.shots.filter((s) => !s.ok);
  if (failed.length) {
    const notice = el('div', 'notice error', `${failed.length} gambar gagal dibuat.`);
    host.append(notice);
  }

  const grid = el('div', 'thumbs');
  for (const shot of visuals.shots) {
    if (!shot.ok) {
      const bad = el('div', 'thumb');
      bad.title = shot.error || 'gagal';
      grid.append(bad);
      continue;
    }
    const img = el('img', 'thumb');
    img.loading = 'lazy';
    img.src = `/media?file=${encodeURIComponent(shot.file)}`;
    img.title = `${shot.shotType}\n${shot.prompt?.slice(0, 180) || ''}`;
    grid.append(img);
  }
  host.append(grid);

  if (!failed.length) {
    const next = el('div', 'stage-actions');
    next.style.marginTop = '18px';
    host.append(next);
    stageButton(next, 'Rakit video', '/assemble');
  }
}

/* ── Tab: result ──────────────────────────────────────────────────── */

function renderResult(host) {
  const project = state.current;
  if (!project.video) {
    host.append(el('p', 'muted', 'Video belum dirakit.'));
    const actions = el('div', 'stage-actions');
    actions.style.marginTop = '12px';
    host.append(actions);
    stageButton(actions, 'Rakit video', '/assemble');
    return;
  }

  const grid = el('div', 'result-grid');

  const video = el('video', 'video-frame');
  video.controls = true;
  video.src = `/media?file=${encodeURIComponent(project.video.file)}`;
  grid.append(video);

  const side = el('div');

  if (project.qc) {
    const notice = el('div', `notice ${project.qc.ok ? 'ok' : 'error'}`);
    notice.textContent = project.qc.ok
      ? `QC lolos. ${project.qc.summary.warnings} peringatan.`
      : `QC menemukan ${project.qc.summary.errors} masalah yang harus diperbaiki.`;
    side.append(notice);

    for (const check of project.qc.checks) {
      const row = el('div', `finding ${check.severity}`);
      row.append(el('span', 'sev', check.severity));
      row.append(el('div', '', check.message));
      side.append(row);
    }

    const metrics = el('div', 'metrics');
    metrics.style.marginTop = '14px';
    const m = project.qc.metrics;
    for (const [label, value] of [
      ['Durasi', `${m.duration?.toFixed(1)}s`],
      ['Ukuran', `${m.sizeMb} MB`],
      ['Bitrate', `${m.bitrateKbps} kbps`],
      ['Loudness', `${m.loudness?.lufs} LUFS`],
      ['True peak', `${m.loudness?.truePeak} dB`],
      ['Frame hitam', m.blackFrames],
    ]) {
      const metric = el('div', 'metric');
      metric.append(el('div', 'm-label', label));
      metric.append(el('div', 'm-value', String(value)));
      metrics.append(metric);
    }
    side.append(metrics);
  }

  const actions = el('div', 'stage-actions');
  actions.style.marginTop = '16px';
  side.append(actions);
  stageButton(actions, project.qc ? 'Ulangi QC' : 'Jalankan QC', '/qc');
  stageButton(actions, 'Tulis caption', '/captions');

  const download = el('a', 'btn btn-ghost', 'Unduh video');
  download.href = `/media?file=${encodeURIComponent(project.video.file)}`;
  download.download = `${project.id}.mp4`;
  actions.append(download);

  grid.append(side);
  host.append(grid);
}

/* ── Tab: captions ────────────────────────────────────────────────── */

function renderCaptions(host) {
  const captions = state.current.captions;
  const actions = el('div', 'stage-actions');
  host.append(actions);
  stageButton(actions, captions ? 'Tulis ulang caption' : 'Tulis caption', '/captions');

  if (!captions) {
    host.append(el('p', 'muted', 'Caption dibuat setelah naskah final.'));
    return;
  }

  if (captions.flagged?.length) {
    host.append(
      el(
        'div',
        'notice warn',
        `Caption di ${captions.flagged.join(', ')} mengandung bahasa jualan. Periksa manual.`,
      ),
    );
  }

  const blocks = [
    ['TikTok', captions.tiktok.caption, captions.tiktok.hashtags],
    ['Instagram Reels', captions.instagram.caption, captions.instagram.hashtags],
    [
      'YouTube Shorts',
      `${captions.youtubeShorts.title}\n\n${captions.youtubeShorts.description}`,
      captions.youtubeShorts.hashtags,
    ],
    ['Komentar yang di-pin', captions.pinnedComment, []],
    ['Teks alternatif (aksesibilitas)', captions.altText, []],
  ];

  for (const [label, text, hashtags] of blocks) {
    const block = el('div', 'caption-block');
    block.append(el('h4', '', label));

    const box = el('div', 'caption-text', text);
    block.append(box);

    if (hashtags?.length) {
      const tags = el('div', 'hashtags');
      for (const tag of hashtags) tags.append(el('span', 'hashtag', `#${tag.replace(/^#/, '')}`));
      block.append(tags);
    }

    const copy = el('button', 'btn btn-ghost btn-sm', 'Salin');
    copy.style.marginTop = '8px';
    copy.addEventListener('click', async () => {
      const full = hashtags?.length
        ? `${text}\n\n${hashtags.map((t) => `#${t.replace(/^#/, '')}`).join(' ')}`
        : text;
      await navigator.clipboard.writeText(full);
      copy.textContent = 'Tersalin';
      setTimeout(() => (copy.textContent = 'Salin'), 1400);
    });
    block.append(copy);

    host.append(block);
  }
}

/* ── Polling & logs ───────────────────────────────────────────────── */

function startPolling() {
  clearInterval(state.poller);
  state.poller = setInterval(async () => {
    if (!state.current) return;
    try {
      const { status, job } = await api(`/api/projects/${state.current.id}/status`);
      if (job && !job.done) return; // still working; wait for it to land
      if (job?.error) {
        clearInterval(state.poller);
        alert(`Tahap gagal: ${job.error}`);
      }
      if (status !== state.current.status || job?.done) {
        const { project } = await api(`/api/projects/${state.current.id}`);
        state.current = project;
        renderProject();
        refreshProjects();
        if (job?.done) clearInterval(state.poller);
      }
    } catch {
      // Transient failure while a stage restarts the process; keep polling.
    }
  }, 2500);
}

function connectLogs() {
  const stream = new EventSource('/api/logs');
  const host = $('log-stream');
  stream.onmessage = (event) => {
    const record = JSON.parse(event.data);
    const line = el('div', `log-line ${record.level}`);
    line.append(el('span', 'lt', record.ts.slice(11, 19)));
    const message = el('span', 'lm');
    message.innerHTML = `<span class="ls">${escapeHtml(record.scope)}</span> ${escapeHtml(record.message)}`;
    line.append(message);
    host.append(line);
    while (host.children.length > 300) host.firstChild.remove();
    host.scrollTop = host.scrollHeight;
  };
}

/* ── Events ───────────────────────────────────────────────────────── */

function wireEvents() {
  const openModal = () => $('modal-new').showModal();
  $('btn-new').addEventListener('click', openModal);
  $('btn-new-2').addEventListener('click', openModal);
  $('btn-cancel').addEventListener('click', () => $('modal-new').close());

  $('form-new').addEventListener('submit', async (event) => {
    event.preventDefault();
    const body = {
      category: $('f-category').value,
      product: $('f-product').value.trim(),
      brand: $('f-brand').value.trim() || null,
      durationSeconds: Number($('f-duration').value),
      mode: $('f-mode').value,
    };
    try {
      const { project } = await api('/api/projects', { method: 'POST', body });
      $('modal-new').close();
      $('form-new').reset();
      await refreshProjects();
      await openProject(project.id);
    } catch (error) {
      alert(error.message);
    }
  });

  for (const tab of document.querySelectorAll('.tab')) {
    tab.addEventListener('click', () => {
      state.activeTab = tab.dataset.tab;
      renderActiveTab();
    });
  }

  $('btn-runall').addEventListener('click', async () => {
    if (!confirm('Jalankan seluruh alur sampai selesai? Tahap berbayar akan dieksekusi.')) return;
    await api(`/api/projects/${state.current.id}/run`, { method: 'POST', body: {} });
    startPolling();
  });

  $('btn-delete').addEventListener('click', async () => {
    if (!confirm('Hapus proyek ini?')) return;
    await api(`/api/projects/${state.current.id}`, { method: 'DELETE' });
    state.current = null;
    $('project-view').classList.add('hidden');
    $('empty-state').classList.remove('hidden');
    refreshProjects();
  });

  $('btn-clear-log').addEventListener('click', () => ($('log-stream').innerHTML = ''));
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (ch) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch],
  );
}

boot().catch((error) => {
  document.body.innerHTML =
    `<div style="padding:40px;font-family:sans-serif;color:#f87171">` +
    `<h2>Gagal memuat aplikasi</h2><p>${escapeHtml(error.message)}</p></div>`;
});
