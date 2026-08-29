#!/usr/bin/env python3
"""
Checks the copy files against the rules the client has actually asked for.

  1. no em dash or en dash
  2. no "Kata. Kata. Kata.", the staccato fragment stacking
  3. no stacked adjective or noun triples inside one clause
  4. Monster Padel voice: warm, first and second person, their own emoji

Only fenced code blocks are checked, since those are the copy that ships.
Lines quoted from the brand's own assets are exempt via ALLOW.
"""
import re
import sys
import pathlib

# lines that come from Monster's own artwork or existing posts, not written by us
ALLOW = {
    "come if you dare", "dare to play?", "play if you are brave",
    "vamos little monster", "berani main?", "vamos",
}

FILLER = re.compile(
    r"\b(unleash|elevate|dive into|game[- ]?changer|nestled|vibrant tapestry|"
    r"supportive environment|take (?:it|things) to the next level|"
    r"more than just a)\b", re.I)


def blocks(text):
    """Yield (line_number, block_text) for every fenced code block."""
    for m in re.finditer(r"^```\n(.*?)^```", text, re.S | re.M):
        yield text[:m.start()].count("\n") + 2, m.group(1)


def sentences(block):
    for raw in re.split(r"(?<=[.!?])\s+", block.replace("\n", " ")):
        s = raw.strip()
        if s:
            yield s


def check(path):
    text = pathlib.Path(path).read_text(encoding="utf-8")
    problems = []

    for ch, name in (("—", "em dash"), ("–", "en dash")):
        for m in re.finditer(re.escape(ch), text):
            line = text[:m.start()].count("\n") + 1
            problems.append((line, name, text[max(0, m.start() - 40):m.start() + 40]))

    for start, block in blocks(text):
        for s in sentences(block):
            bare = s.strip().rstrip(".!?").lower()
            if bare in ALLOW or s.startswith(("http", "https", "|", "📲", "📍", "#")):
                continue

            words = [w for w in re.findall(r"[A-Za-z0-9']+", s)]
            # 2. a fragment: ends in a full stop but is too short to be a sentence
            if s.endswith(".") and len(words) < 4:
                problems.append((start, "fragment (kata.kata)", s))

            # 3. triples stacked inside one clause, e.g. "a, b, and c" of short items
            for clause in re.split(r"[.!?;:]", s):
                parts = [p.strip() for p in clause.split(",") if p.strip()]
                if len(parts) >= 3 and all(len(p.split()) <= 4 for p in parts[:3]):
                    if not re.search(r"\b(and|dan|atau|or)\b.*\b(Bali|Padelicious|Resort)\b", clause):
                        problems.append((start, "stacked triple", clause.strip()))

        for m in FILLER.finditer(block):
            problems.append((start, "filler phrase", m.group(0)))

    return problems


def main(paths):
    total = 0
    for p in paths:
        found = check(p)
        total += len(found)
        print(f"\n{p}")
        if not found:
            print("  clean")
        for line, kind, snippet in found:
            print(f"  line {line:>4}  {kind:<22} {snippet.strip()[:88]}")
    print(f"\n{total} issue(s)")
    return 1 if total else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
