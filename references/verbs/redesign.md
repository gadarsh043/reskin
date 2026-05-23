# `reskin redesign`

The user wants a different page from the same content. They are not happy with the current visual structure — typically because it reads as templated, generic, or AI-shaped. Your job is to redesign the page's structure, rhythm, and component voice while respecting the existing implementation boundaries unless the user explicitly confirms a full rebuild.

## Non-destructive implementation rule

Reskin redesigns visual and interaction layers. It does not delete production files by default.

- Never delete existing route files, component directories, page trees, or the old website unless the user explicitly asks for deletion or approves a file-level plan that lists the deletions.
- Default to in-place edits of the named page/component files, or additive new components/tokens wired through the existing route.
- If the redesign would require removing multiple components, replacing a route tree, or collapsing the app into a single new page, stop and ask for confirmation first.
- Treat PDFs, README files, `.md` briefs, docs, transcripts, and pitch decks as source material for understanding the product. They are not page copy by default. Summarize and adapt them unless the user explicitly says to use their wording verbatim.
- Before editing, state the files you expect to modify, create, and delete. Any deletion needs explicit confirmation.
- During redesign of a wired-up codebase, **never modify** paths listed in `.reskin/preflight.json` → `comprehension.protectedPaths` (or §4 of `.reskin/understanding.md`). Those paths are read-only; the allowlist enforces this rule concretely.

## Comprehension pass · mandatory first step (wired-up codebases)

Before scope detection or any visual work, check whether the target is a **wired-up codebase**:

- **`package.json`** exists at the project (or package) root, **and**
- at least one of **`src/`**, **`app/`**, or **`components/`** exists.

If both are true → load [`comprehension.md`](../comprehension.md) and run the full comprehension pass. Produce `.reskin/understanding.md`, extend `.reskin/preflight.json` with the `comprehension` object (see that file for schema), present the Site Understanding report, and **hard-stop for user confirmation** (`comprehension confirmed` or corrections) before continuing.

If the target is static HTML, a single file with no app shell, or greenfield → **skip** comprehension; one line: *"Comprehension skipped — not a wired-up codebase."*

If `.reskin/understanding.md` exists and `comprehension.confirmed` is already `true` in `preflight.json`, you may reuse the map unless the user asked to refresh or routes/data changed — still state which component **labels** and **protected paths** govern this run.

**Do not** pick a macrostructure, write `design.md`, or edit UI until comprehension is confirmed.

## Concept injection · optional (after comprehension)

**When:** After comprehension is confirmed on a wired-up codebase, **or** after the redesign target is clear when comprehension was skipped. **Before** macrostructure selection, scope branching, or any UI edits.

Load [`concept.md`](../concept.md).

1. Ask the **concept prompt** (one message). User may supply a one-line vision or decline (*no concept*, *clean and professional*, *skip*).
2. If declined → set `concept: null` in `.reskin/preflight.json`, skip `concept.md`, proceed to Step 0. Genre / theme / macrostructure run unchanged.
3. If supplied → expand a **Concept Brief** using component `id`s from `.reskin/understanding.md` (§ Concept × intent rule is mandatory). Write `.reskin/concept.md`, merge `concept` into `preflight.json`, present the brief, and **hard-stop for `concept confirmed`** before continuing.
4. Approved concept **constrains** macrostructure, type, colour, motion, and enrichment — it does **not** disable slop-test gates, protected paths, or data-bound contracts.

**Do not** pick a macrostructure, write `design.md`, or edit UI until comprehension is confirmed **and** concept is either confirmed or explicitly skipped.

## Change plan · structure + dial (after concept)

**When:** After comprehension is confirmed **and** after the concept step (set or skipped). **Before** macrostructure selection, Step 0 scope branching, or any UI edits.

Load [`change-plan.md`](../change-plan.md).

1. **Tier 1 · Structure** — ask keep multi-page / collapse to single page / let concept decide. This fixes whether Tier 2 units are **pages** or **sections**. Collapse uses comprehension `pages[]` → section map; data bindings and protected paths stay unchanged.
2. **Tier 2 · Change dial** — for each unit, seed dials from concept restraint map (`full`→Full, `light`→Light, `none`→Leave) and cap by comprehension **intent** (legibility units default ≤ Moderate; warn if user pushes higher).
3. Accept shortcuts (*everything Full*, *home Full resume Leave*). Write `.reskin/change-plan.md` and `changePlan` in `.reskin/preflight.json`.
4. **Hard-stop for `plan confirmed`** before macrostructure or code.

**Build rules from dial:** **Leave** = do not touch that unit's files. **Light** = theming only, layout intact. **Moderate+** = increasing structural freedom; **Full** may reimagine macrostructure on that unit. Slop gates and protected paths apply at every level.

**Do not** pick a macrostructure, write `design.md`, or edit UI until comprehension is confirmed, concept is resolved, **and** the Change Plan is confirmed.

## Step 0 · Detect scope first

Before anything else, decide whether the redesign is **single-page** or **multi-page**. The behaviour diverges hard.

**Multi-page signals (any one fires):**
- The target is a directory (e.g. `./app/`, `./pages/`, `./src/routes/`).
- The target is a glob (`**/*.tsx`, `app/*/page.tsx`).
- The user names more than one file in the brief (`./hero.tsx and ./pricing.tsx`).
- The user says "the whole site", "every page", "the app", "all the pages", "the marketing site".
- The codebase has multiple route files (`app/page.tsx`, `app/about/page.tsx`, `app/pricing/page.tsx`, etc.) and the user pointed at the project root.

If any of those fires → **multi-page redesign**. Go to § Multi-page flow.
If none fires → **single-page redesign**. Go to § Single-page flow.

---

## § Multi-page flow — design.md first, then redesign

A web app needs a *design system*, not seventeen unrelated theme pickings. Reskin's diversification rule is wrong here: across pages of the same product, **consistency is the goal, not variety**. If you redesign every page with a different macrostructure / theme / accent, you've shipped a slop split-personality app, even if each individual page is fine.

The flow is:

### 1. Read the project, then pause

Before redesigning a single file:

- **Comprehension must be complete** for wired-up codebases (see § Comprehension pass). Use `.reskin/understanding.md` as the route/component/data map — do not re-guess from scratch.
- Walk the target directory. List every page-level file you found, with a one-line description of what it does. (Hero / pricing / docs / dashboard / etc.)
- Note any existing design assets: a `tokens.css`, a tailwind config with brand values, a logo, brand colours mentioned in `README`, a marketing screenshot.
- Check for an existing `.reskin/log.json` — if it has prior runs, read the most recent stamp; if all those entries are different macrostructures / themes, it confirms the user's complaint.

### 2. Produce `design.md` at the project root

Write a single file at the project root: `design.md` (or `DESIGN.md` — match the project's existing case convention). This file is the **one source of truth** every subsequent page redesign reads. Format:

````markdown
# Design — <Project name>

A locked design system for this app. Every page redesign reads this file before
emitting code. Do not regenerate per page — extend or amend this file when the
system needs to grow.

## Genre
<editorial · modern-minimal · atmospheric · playful>

## Macrostructure family
Pick one base macrostructure for marketing pages, one for app pages, one for
content pages (if applicable). Pages within a family share the family's shape;
they vary only in component archetypes.

- Marketing pages: <macrostructure name + the 1–2 archetypes that vary>
- App pages:       <macrostructure name + variation knobs>
- Content pages:   <macrostructure name + variation knobs>

## Theme
- `--color-paper`   oklch(<L> <C> <H>)
- `--color-paper-2` oklch(<L> <C> <H>)
- `--color-ink`     oklch(<L> <C> <H>)
- `--color-ink-2`   oklch(<L> <C> <H>)
- `--color-rule`    oklch(<L> <C> <H>)
- `--color-accent`  oklch(<L> <C> <H>)
- `--color-focus`   oklch(<L> <C> <H>)

## Typography
- Display: <face>, weight <N>, style <normal/italic>
- Body:    <face>, weight <N>
- Mono:    <face>, weight <N>
- Display tracking: <em>
- Type scale anchor: <text-display> = clamp(...)

## Spacing
4-point named scale. The values are in `tokens.css`. Pages must use named
tokens (`var(--space-md)`), never raw values.

## Motion
- Easings: cubic-bezier(<x>, <y>, <z>, <w>) named `--ease-out`, etc.
- Reveal pattern: <fade only / fade + slide / none>
- Reduced-motion fallback: opacity-only, ≤ 150 ms.

## Microinteractions stance
- <silent success / celebratory toasts: never>
- <hover delay 800 ms · focus delay 0 ms>
- <other named choices>

## CTA voice
- Primary CTA: <fill style, shape, copy pattern>
- Secondary CTA: <outline style, shape, copy pattern>

## Per-page allowances
- Marketing pages MAY use enrichment (Tier-A CSS art, Tier-B SVG, etc.).
- App pages MUST NOT use enrichment — function carries the page.
- Content pages: typography only.

## What pages MUST share
- The wordmark / logotype.
- The accent colour and its placement (≤ 5 % per viewport).
- The display + body fonts.
- The CTA voice (button shape, border-radius, padding rhythm).
- Section heading rhythm (numeral + label + display heading pattern).

## What pages MAY differ on
- Macrostructure within the page-type family (a marketing page can be Marquee
  Hero on one route and Long Document on another — both still use the system's
  type, colour, and CTA voice).
- Hero archetype (within the family's allowance).
- Enrichment — only on marketing pages, only Tier-A or Tier-B.

## Exports

Drop-in formats for re-using this design system in other projects.
See [`export-formats.md`](../export-formats.md) for the canonical mapping.

### tokens.css
```css
:root {
  --color-paper:      oklch(<L> <C> <H>);
  --color-paper-2:    oklch(<L> <C> <H>);
  --color-ink:        oklch(<L> <C> <H>);
  --color-ink-2:      oklch(<L> <C> <H>);
  --color-rule:       oklch(<L> <C> <H>);
  --color-accent:     oklch(<L> <C> <H>);
  --color-accent-ink: oklch(<L> <C> <H>);
  --color-focus:      oklch(<L> <C> <H>);

  --font-display: "<face>", ...;
  --font-body:    "<face>", ...;
  --font-outlier: "<face>", ...;

  --space-3xs: 0.25rem;  --space-2xs: 0.5rem;  --space-xs: 0.75rem;
  --space-sm:  1rem;     --space-md:  1.5rem;  --space-lg: 2rem;
  --space-xl:  3rem;     --space-2xl: 4.5rem;  --space-3xl: 7rem;

  --text-xs: 0.75rem;  --text-sm: 0.875rem; --text-md: 1.125rem;
  --text-lg: 1.375rem; --text-xl: 1.75rem;  --text-2xl: 2.25rem;

  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --dur-short: 220ms;
  --radius-card: <px>; --radius-pill: <px>; --radius-input: <px>;
}
```

### Tailwind v4 `@theme`
```css
@theme {
  --color-paper:   oklch(<L> <C> <H>);
  --color-ink:     oklch(<L> <C> <H>);
  --color-accent:  oklch(<L> <C> <H>);
  --font-display:  "<face>", sans-serif;
  --font-body:     "<face>", sans-serif;
  --spacing-md:    1.5rem;
  --text-md:       1.125rem;
  --ease-out:      cubic-bezier(0.16, 1, 0.3, 1);
  /* mirror the rest of tokens.css with `--spacing-*` for Tailwind's spacing utilities */
}
```

### DTCG `tokens.json`
```json
{
  "color": {
    "paper":  { "$value": "oklch(<L> <C> <H>)", "$type": "color" },
    "ink":    { "$value": "oklch(<L> <C> <H>)", "$type": "color" },
    "accent": { "$value": "oklch(<L> <C> <H>)", "$type": "color" }
  },
  "font": {
    "display": { "$value": "<face>", "$type": "fontFamily" },
    "body":    { "$value": "<face>", "$type": "fontFamily" }
  },
  "space": {
    "md": { "$value": "1.5rem", "$type": "dimension" }
  }
}
```

### shadcn/ui CSS variables
```css
:root {
  --background:        <L>  <C>  <H>;   /* paper */
  --foreground:        <L>  <C>  <H>;   /* ink */
  --primary:           <L>  <C>  <H>;   /* accent */
  --primary-foreground: <L> <C>  <H>;   /* accent-ink */
  --muted:             <L>  <C>  <H>;   /* rule */
  --muted-foreground:  <L>  <C>  <H>;   /* muted */
  --border:            <L>  <C>  <H>;   /* rule */
  --input:             <L>  <C>  <H>;   /* rule */
  --ring:              <L>  <C>  <H>;   /* focus */
  --radius:            <px>;
}
```
````

State the picks aloud in plain text BEFORE writing the file. *"Genre: modern-minimal. Theme: a custom OKLCH palette anchored on your brand teal. Display: Geist 600. Body: Geist 400. Three macrostructure families: Marquee Hero (marketing), Workbench (app), Long Document (content)."* Then ask: *"Want me to proceed with this system across every page, or amend any of it first?"*

Wait for confirmation. Only after the user confirms (or says "go ahead") do you write `design.md` and start redesigning pages.

### 3. Redesign each page reading from `design.md`

For each target page:

- **Read `design.md` first.** It is now the rule of the project; the per-build references in [`references/`](../) defer to it. Where `design.md` and the references conflict, `design.md` wins.
- Pick the macrostructure from the family declared in `design.md` for this page's type (marketing / app / content). Within the family, you may vary archetypes — but only those `design.md` allows.
- Apply the locked theme. Do **not** swap to a different theme to "add variety". The variety lives in macrostructure / archetype choice, not theme.
- Apply the locked typography, spacing, motion, microinteractions stance.
- Stamp every page's CSS with: `/* Reskin · genre: <genre> · macrostructure: <name> · design-system: design.md · designed-as-app */`. The `designed-as-app` flag tells future Reskin runs to read `design.md`, not invent a new system.
- Write a single combined `.reskin/log.json` entry for the multi-page redesign, with `"scope": "app"` instead of one entry per page.

### 4. Diversification rule — INVERTED for multi-page

Across pages of the same app, the diversification rule is *inverted*: consecutive pages MUST share theme, accent, type pairing. They may differ on macrostructure within the family. The 55 slop-test gates that check "differs from previous Reskin run" are skipped for `designed-as-app` outputs — the system overrides the catalog rotation here.

Pages that drift from `design.md` are slop. The audit verb flags `design.md` drift as a critical structural finding (`stamp-vs-design.md disagreement`).

### 5. When to amend `design.md` instead of overriding

If a page genuinely needs something `design.md` doesn't allow (e.g. a marketing landing for a new sub-product wants a different theme), the rule is **amend `design.md` first**, not override locally. Add an explicit per-page allowance or a `## Variants` section. The file evolves; per-page overrides do not.

---

## § Single-page flow

(The classic redesign behaviour — plus comprehension when wired-up.)

**Comprehension gate.** If the project is wired-up (`package.json` + `src/` / `app/` / `components/`), the comprehension pass (§ above) must finish and the user must confirm `.reskin/understanding.md` before you redesign — even when only one page file is in scope. Shared nav, layout, and data hooks still matter.

**Concept gate.** After comprehension (or immediately if comprehension was skipped), run § Concept injection. Professional / no-concept briefs skip cleanly; creative one-liners require `concept confirmed` before visual work.

**Change-plan gate.** After concept, run § Change plan. Structure first, then per-unit dials. Requires `plan confirmed` before visual work. Leave units are skipped entirely in the build.

**What to preserve:**
- The copy intent, factual claims, product names, and primary message. Preserve exact wording only when it already lives in the target UI or the user explicitly asks for verbatim copy.
- The information architecture (which sections exist, in roughly what order)
- The brand (colours and fonts they've named, if any)
- The primary action
- The existing route/component ownership boundaries, unless the user has approved a full rebuild

**What to replace:**
- The structural fingerprint — pick a **different** combination from [`structure.md`](../structure.md) than the source had.
- The component voice — different button style, different divider language, different image treatment.
- The reveal pattern — if the original faded everything in on scroll, the new one might have no reveals at all.
- The visual rhythm — different sections having different padding, different alignments, deliberate breaks.

**What not to replace without confirmation:**
- Route trees, production component directories, or the old website's file structure.
- Working app logic, data fetching, auth, forms, analytics, or integration code — especially every **data-bound component** and every path in `comprehension.protectedPaths` / `.reskin/understanding.md` §4.
- Existing copy with pasted text from PDFs, docs, or markdown files unless the user requested verbatim copy.

**Optional `--mood <name>` argument:**

If the user specifies a mood (`reskin redesign ./hero.tsx --mood luxury`), pick a tone aligned to that mood and let it drive the structural fingerprint. Mood names map to tones from [`typography.md`](../typography.md) and [`structure.md`](../structure.md). If no mood is given, ask the user what *feeling* they want — one word — and proceed.

**Genre escape hatch.** If the user explicitly asks for a *kind* of design that the current genre doesn't fit (e.g. "redesign this editorial page as a modern SaaS hero"), switch genre too. Load [`genres/<new-genre>.md`](../genres/) and apply its rule overlay. Stamp the new genre into the output so future runs respect it.

**Project-level check.** Before treating this as a true single-page redesign, look for `design.md` at the project root. If it exists, the project is being designed as an app and **the single-page rules don't apply** — read `design.md` and follow it instead. The diversification rule reverses (consistency wins). If you actually want to break from the locked system, *update `design.md` first*, then redesign.

## Verification · final step (wired-up codebases only)

After **Step 6 (build)** and **Step 7 (slop test)** — not before.

Load [`verify.md`](../verify.md) and run the four-tier verification pass. Use `comprehension` + `changePlan` from `.reskin/preflight.json` as the checklist source.

**Order (full redesign):** comprehension → concept → change-plan → macrostructure / theme / build → slop test → **VERIFY** → handoff.

- If **Tier 1 (build) fails** during verification, **stop** — report errors; do not present the redesign as complete.
- Write `.reskin/verify-report.md` and merge `verification` into `preflight.json`.
- Present PASSED / FAILED / NEEDS YOUR EYES in chat — honest and specific (see verify.md core principle).

**Skip** for static single-file HTML or when user says *"skip verification"*.

User may re-run anytime with **`reskin verify`** ([`verbs/verify.md`](verify.md)) without redesigning.

---

**Output:**

Return the redesigned code, the **Verification Report** (if wired-up), plus a short note explaining:

- The structural fingerprint you picked, axis by axis.
- Why this combination fits the brief better than the original.
- One thing you removed and why.
- (If genre changed) why the new genre fits the user's stated kind of design.
- Verification summary: build pass/fail; data-bound status; count of manual checks.
