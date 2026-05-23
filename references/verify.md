# Verification pass — close the loop after redesign

**Core principle:** Reskin verifies as much as it **genuinely can**, and is **honest** about what it cannot. Never declare *"everything works."* Declare exactly what **passed**, what **failed**, and what needs **human eyes**. A short, specific checklist beats a long generic one.

Verification closes the loop that [`comprehension.md`](comprehension.md) opened: comprehension built `protectedPaths` and `dataBoundComponents`; verification confirms they still function after visual changes.

**When to run:**

- **Mandatory** at the end of **`reskin redesign`** on **wired-up codebases** (`package.json` + `src/` / `app/` / `components/`) — after build (Step 6) and slop test (Step 7).
- **Optional standalone** via **`reskin verify`** — re-run checks without redesigning. See [`verbs/verify.md`](verbs/verify.md).

**Skip** for static single-file HTML, greenfield scratch pages with no app shell, or when the user says *"skip verification"*.

**Source of truth:** `.reskin/preflight.json` → `comprehension` (pages, `dataSources`, `dataBoundComponents`, `protectedPaths`). If missing, run a minimal comprehension read first or refuse: *"No comprehension map — run `reskin redesign` comprehension or point me at `.reskin/preflight.json`."*

---

## Redesign flow position

```
comprehension → concept → change-plan → macrostructure / theme / build → slop test → VERIFY → handoff
```

If **Tier 1 (build) fails**, **stop**. Do not present the redesign as done. Report build errors as top-priority fixes; later tiers may be skipped or marked *not run*.

---

## Tier 1 · Build & compile (automated — must pass)

1. **Detect scripts** from `package.json`: `build`, `lint`, `typecheck` / `tsc`, `test` (common names: `next build`, `vite build`, `astro build`, `npm run typecheck`).
2. **Run `build`.** If it fails → record errors (file, line, message). **STOP** — do not claim verification passed. Put failures in **FAILED**; do not proceed to Tier 2–4 until build is fixed or user accepts broken state.
3. **Run typecheck** (if script exists). Report errors; warnings noted but don't block unless project treats warnings as errors.
4. **Run lint** (if script exists). Report errors; warnings noted.
5. **Broken imports scan** — especially paths into **data-bound** and **protected** modules:
   - Did redesign change import paths to `comprehension.dataSources[].file` consumers?
   - Any removed `import` of hooks/SDK clients that `dataBoundComponents` still need?
   - Use `git diff` against pre-redesign state when available, or static import graph from component files.

Record: `build.command`, `build.exitCode`, `build.errors[]`, `typecheck`, `lint`.

---

## Tier 2 · Routes & render (automated where possible)

Use `comprehension.pages[]` and `changePlan.structure` (if present).

1. **Route existence** — each page file / route path still exists; no 404 route files deleted by mistake.
2. **Single-page collapse** (if `changePlan.structure.mode === single-page`):
   - Each `collapseMap[].anchor` target exists in DOM (`id` attribute).
   - Nav links point to `#anchor` or in-page scroll targets.
3. **Headless / dev-server render** (when environment allows):
   - Start dev server (`next dev`, `vite`, etc.) if feasible.
   - Load each route; capture **console errors on load** (not full E2E).
   - If **no browser / no network / no dev server** in this environment → **do not claim pass**. Record in **NEEDS YOUR EYES**: *"Couldn't run headless browser — please load each route and check console once."* Tier 2 status = `degraded` or `manual`.

Record: `routes.checked`, `routes.passed`, `routes.failed[]`, `headlessAvailable: true|false`.

---

## Tier 3 · Data still flows (critical)

This is why **in-place redesign on a branch with real `.env`** matters: live credentials may allow genuine fetch tests.

For each `comprehension.dataSources[]` and each `dataBoundComponents[]` id:

1. **Code path unchanged** — same hook/SDK import, same function name, same call site in the component file (diff against protected expectation). Redesign must not have inlined fetch logic or dropped `useQuery` / `useEffect` load.
2. **Protected paths intact** — `git diff` (or file list from this session) against `comprehension.protectedPaths`:
   - **Zero modifications** = pass.
   - **Any modification** = **VIOLATION** → **FAILED**, loud: *"Redesign touched protected path `<path>` — data layer contract broken."*
3. **Runtime data render** (when dev server + credentials work):
   - Load page containing the component; confirm data appears (e.g. Firebase projects still render in `project-cards`).
   - Loading / error states still wired (not blank forever).
4. **No destructive live tests** — do **not** submit contact forms, send email, charge cards, or write to production DB. Confirm **wiring only**: `onSubmit` / `action` still bound to same handler → add to **NEEDS YOUR EYES**: *"Confirm contact form actually sends a real email."*

Record per dataSource: `{ id, codePathUnchanged, runtimeVerified, notes }`.

---

## Tier 4 · Interactive elements (wiring check)

From comprehension components + concept (if active):

1. **Buttons, links, toggles, modals** — handler or `href` resolves; not `onClick={() => {}}` dead stubs unless intentional placeholder (flag those).
2. **Concept interactions** (page-turn, snitch cursor, etc.) — present in DOM/CSS; `@media (prefers-reduced-motion: reduce)` fallback exists per [`motion.md`](motion.md).
3. **Leave dial units** (`changePlan` units at **Leave**) — files should be unchanged; spot-check no accidental edits.

Record: `interactions.checked`, `interactions.wired`, `interactions.failed[]`.

---

## Output · Verification Report

Write **`.reskin/verify-report.md`** and summarize in chat. Use this shape:

```markdown
## Reskin Verification Report

**Ran:** 2026-05-23T15:00:00Z · wired-up · post-redesign
**Environment:** dev server yes/no · headless yes/no

### PASSED (automated)
- **Build:** ✓ (`next build`, 0 errors)
- **Typecheck:** ✓
- **Routes:** ✓ 4/4 resolve
- **Data:** ✓ `firebase-projects` — code path unchanged; projects render in `project-cards`
- **Protected paths:** ✓ 0 files modified in protected set
- **Interactions:** ✓ 12/12 wired

### FAILED (fix these)
- none

### NEEDS YOUR EYES (manual — short & specific)
- Load the site locally and click through once — headless browser not available in this environment (Tier 2 degraded).
- Confirm the contact form actually sends a real email — handler wired, live submit not tested (Tier 3).
- Confirm the golden-snitch cursor feels right on `/` — subjective motion (Tier 4).
```

### Rules for the manual list

- **Short and specific** — each item names *what* to check and *why* Reskin couldn't auto-verify.
- **Never** *"test everything"* or *"QA the site."*
- If a tier was skipped, say **which tier** and **why** — don't silently mark it passed.
- Cap manual list at **~5 items** unless more are truly distinct.

---

## Persistence · `.reskin/preflight.json`

Merge `verification` object (do not wipe other keys):

```json
{
  "verification": {
    "ranAt": "2026-05-23T15:00:00Z",
    "trigger": "redesign | standalone-verify",
    "build": {
      "command": "npm run build",
      "passed": true,
      "errors": []
    },
    "routes": {
      "checked": 4,
      "passed": 4,
      "headlessAvailable": false,
      "degraded": true
    },
    "data": {
      "sourcesChecked": 2,
      "sourcesPassed": 2,
      "boundComponentsChecked": 3,
      "boundComponentsPassed": 3,
      "protectedPathsIntact": true,
      "violations": []
    },
    "interactions": {
      "checked": 12,
      "wired": 12,
      "failed": []
    },
    "manualChecks": [
      "Load site locally — headless unavailable (Tier 2)",
      "Confirm contact form sends real email — submit not tested (Tier 3)"
    ],
    "overallPassed": false,
    "confirmed": false
  }
}
```

- `overallPassed` — `true` only when build passed, no FAILED tier results, no protected-path violations. Manual items don't block `overallPassed` but must still be listed.
- `confirmed` — user acknowledged report (optional; set when user says *"verification noted"*).

---

## Handoff discipline

After verification:

1. Present the report in chat — lead with **FAILED** if any, then **NEEDS YOUR EYES**, then PASSED summary.
2. If build failed: *"Redesign is not complete — fix build errors first."*
3. If protected-path violation: *"Data layer was touched — revert those files or confirm intentional logic change."*
4. Do not say *"all good"* if manual list is non-empty — say *"automated checks passed; N items need your eyes below."*

---

## Worked example — Next.js portfolio · Firebase · Harry Potter redesign

**Context:** Multi-page portfolio after spellbook redesign. Comprehension: 4 routes; `firebase-projects` dataSource; `project-cards` data-bound; 12 protected paths; concept `harry-potter-spellbook`.

**Tier 1:** `npm run build` (Next.js 15) → exit 0. `tsc --noEmit` → 0 errors. Import scan: `project-cards.tsx` still imports `useProjects` from `lib/firebase/projects.ts` ✓.

**Tier 2:** Route files exist for `/`, `/projects`, `/resume`, `/contact` ✓. Agent cannot run Playwright → `headlessAvailable: false`, `routes.degraded: true`.

**Tier 3:** `git diff` shows 0 files under `lib/firebase/**` ✓. Dev server started; `/projects` loads; project titles visible in manuscript-styled cards ✓. `contact` form: `onSubmit` → `submitContact` unchanged ✓ — live submit not fired.

**Tier 4:** 12 interactive elements checked; nav anchors wired; page-turn CSS has `@media (prefers-reduced-motion: reduce) { … opacity only }` ✓.

### Report (as shipped to user)

```markdown
## Reskin Verification Report

**Ran:** 2026-05-23 · post-redesign (harry-potter-spellbook)
**Environment:** dev server ✓ · headless ✗

### PASSED (automated)
- **Build:** ✓ (`next build`, 0 errors)
- **Typecheck:** ✓ (`tsc --noEmit`)
- **Routes:** ✓ 4/4 route files present and resolvable
- **Data:** ✓ `firebase-projects` — import unchanged; projects render in `project-cards` on `/projects`
- **Protected paths:** ✓ 0 modifications in protected set (12 paths)
- **Interactions:** ✓ 12/12 handlers or hrefs resolve; reduced-motion fallback present for page-turn

### FAILED (fix these)
- none

### NEEDS YOUR EYES (manual — short & specific)
- **Click through locally** — couldn't run a headless browser here; open `/`, `/projects`, `/resume`, `/contact` and check the console once (Tier 2).
- **Contact form live send** — `submitContact` is still wired; I didn't submit a real message (Tier 3).
- **Snitch cursor feel** — motion is subjective; confirm it doesn't distract on the home hero (Tier 4 / concept).
```

**Chat closing line:** *"Automated verification passed. Three items need your eyes above — not blockers for code merge, but I won't claim they're done."*

---

## Output contract summary

1. Load comprehension map from `preflight.json`.
2. Run Tier 1 → stop if build fails.
3. Run Tiers 2–4 honestly; degrade when environment limits.
4. Write `.reskin/verify-report.md` + `verification` in `preflight.json`.
5. Hand user the report — specific, never generic all-clear.
