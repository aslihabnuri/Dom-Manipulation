# Dom-Manipulation

A workspace repo. It currently holds a [KIE.ai](https://kie.ai) integration for generating
image, video, and audio assets from the command line or from JavaScript, plus the
`impeccable` frontend-design skill.

## KIE.ai

```bash
cp .env.example .env.local          # add your key from https://kie.ai/api-key
node bin/kie.mjs doctor             # verify key, endpoint, credit balance

node bin/kie.mjs models --kind=image        # browse 124 models
node bin/kie.mjs show google/nano-banana    # inspect a model's inputs
node bin/kie.mjs run google/nano-banana --prompt="a red bicycle in the rain" --out=./art
```

Full reference: **[docs/kie.md](docs/kie.md)**.

| Path | What it is |
|---|---|
| `bin/kie.mjs` | CLI — `doctor`, `credits`, `models`, `show`, `run`, `status`, `wait`, `upload`, `chat` |
| `src/kie/` | zero-dependency client, config, and generated model registry |
| `.claude/skills/kie/` | skill so Claude Code sessions can use KIE directly |
| `test/` | registry and validation tests (`npm test`) |

Node 18+. No dependencies to install.

### Credentials

The API key is read from `KIE_API_KEY`, then `.env.local`, then `.env`, then
`~/.kie/credentials.json`. Every one of those is gitignored or outside the repo — no
tracked file should ever contain the key.

## Tests

```bash
npm test
```
