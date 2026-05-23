# `reskin verify`

Re-run the verification pass **without** redesigning. Use when the user wants confidence after manual fixes, after pulling the branch, or after someone else touched UI files.

Load [`verify.md`](../verify.md) and follow it end-to-end.

## When to run

- User says `reskin verify`, `verify the redesign`, `does it still work`, `run verification`.
- User fixed build errors from a previous verification report and wants a re-check.
- Optional post-merge sanity check on a wired-up codebase.

## Prerequisites

1. **Wired-up codebase** — `package.json` + `src/` / `app/` / `components/`. If not → refuse politely: *"Verification is for app codebases. For static HTML, open the file in a browser."*
2. **Comprehension map** — `.reskin/preflight.json` with `comprehension.confirmed: true`, or `.reskin/understanding.md`. If missing → *"Run comprehension first (`reskin redesign` through the Site Understanding step) or provide the project map."*

Optional but helpful: `.reskin/change-plan.md`, `.reskin/concept.md` (for Tier 4 concept interaction checks).

## What this verb does

- Same four tiers as post-redesign verification in [`verify.md`](../verify.md): build → routes → data → interactions.
- Writes / overwrites `.reskin/verify-report.md`.
- Sets `preflight.json` → `verification` with `"trigger": "standalone-verify"`.

## What this verb does NOT do

- **No redesign** — no macrostructure pick, no CSS rewrites, no slop-test-driven edits.
- **No audit** — for anti-pattern scoring, use `reskin audit`.
- **No live destructive tests** — no form submits, no payments, no production writes.

## Output

Return the Verification Report (PASSED / FAILED / NEEDS YOUR EYES). If build fails, lead with failures. End with:

> *"Say `reskin verify` again after fixes to re-run. Full report: `.reskin/verify-report.md`."*
