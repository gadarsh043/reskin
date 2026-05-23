# Reskin

**A design skill for Claude Code, Cursor, and Codex that refuses to look AI-generated.**

Reskin is used for redesigning real codebases without breaking what already works. It encodes anti-AI-slop rules — typography, OKLCH colour, structural variety, motion discipline, and a 69-gate slop test — so generated UIs read as designed, not templated.

Twenty-two catalog themes live in [`references/tokens.css`](references/tokens.css). Five verbs cover greenfield builds, audits, redesigns, verification, and design DNA extraction.

---

## Verbs

| Verb | What it does |
| --- | --- |
| *(default)* | Build new UI. Pre-flight scan → macrostructure + theme → rules → slop test. |
| `reskin audit <target>` | Score existing code against anti-patterns. Punch list, no edits. |
| `reskin redesign <target>` | New visual structure inside existing routes and data boundaries. |
| `reskin study <screenshot \| URL>` | Extract design DNA (macrostructure, type, colour anchor). No pixel clones. |
| `reskin verify` | Re-check build, routes, data flow, and wiring after a redesign (wired-up apps). |

Verb fixtures (before/after examples): [`references/verb-examples/`](references/verb-examples/).

---

## Install

```bash
npx skills add adarshgella/reskin
```

Or copy [`SKILL.md`](SKILL.md) and [`references/`](references/) into:

- **Claude Code** — `~/.claude/skills/reskin/`
- **Cursor** — `.cursor/rules/reskin.mdc` (body of `SKILL.md`, no frontmatter)
- **Codex** — `~/.codex/skills/reskin/` (personal or project-scoped)

Worked prompts: [`docs/recipes.md`](docs/recipes.md) · study walkthroughs: [`docs/study-examples.md`](docs/study-examples.md).

---

## Licence

MIT. See [LICENSE](LICENSE).

## Credits

Reskin's design engine is built on Hallmark by Together AI, used under the MIT license. See LICENSE.
