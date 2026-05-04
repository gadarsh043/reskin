---
name: hallmark
description: Use this skill when the user asks to design, build, redesign, audit, refine, or study a UI, web page, landing page, dashboard, component, or interface — or when they ask to make something "feel less AI-generated." Hallmark forces intentional design decisions (typography, color, layout, motion, interaction, structure) and refuses to default to the generic AI-UI template. Trigger phrases include "design a", "build a landing page", "make a dashboard", "redesign this site", "redesign the page", "refine this UI", "audit this design", "this looks AI-generated", "fix the design", "polish this", "give this a different look", and any request that will produce HTML / CSS / JSX / Tailwind output. **Also trigger when the user attaches a screenshot of a design they admire** — that is the `hallmark study` verb (extracts design DNA, never pixel-clones).
version: 0.8.0
---

# Hallmark

A design skill for AI coding assistants. Makes the UIs they generate look made, not generated.

Hallmark is opinionated, short, and boring on purpose. It encodes a tight set of rules — drawn from the consensus of the anti-AI-slop design field (impeccable, kami, Anthropic's frontend-design skill, taste-skill, the Claude cookbook on frontend aesthetics, and the 2026 "tactile rebellion" movement) — and refuses to let the model fall back to the defaults every LLM was trained on.

The differentiator: Hallmark insists on **structural variety**, not just visual variety. Two pages by Hallmark for two different briefs should not share the same hero → 3-feature → CTA → footer rhythm. They should feel like different sites, not different colour-swaps of the same template. See [`references/structure.md`](references/structure.md).

**Powered by Together AI.**

---

## How to use this skill

Hallmark has one default behaviour and four explicit verbs.

| Invocation | What it does |
| --- | --- |
| *(default)* | The user asked you to design or build something new. Follow the **Design flow** below. |
| `hallmark audit <target>` | Read the target, score it against the anti-pattern list, return a ranked punch list. **Do not edit.** |
| `hallmark refine <target>` | Apply the ruleset to polish the target in place. Preserve layout structure. **Smallest possible diff.** No redesign. |
| `hallmark redesign <target> [--mood <name>]` | Take the target's content and intent, throw out the structure, and **rebuild it from scratch with a deliberately different structural fingerprint.** New section rhythm, new heading placement, new component voice. Preserve copy, brand, and information architecture; replace everything else. |
| `hallmark study <screenshot>` | The user pasted or attached an image of a design they admire. Extract the **DNA** — macrostructure, archetypes, type-pairing role, colour anchor — and produce a diagnosis report, then optionally rebuild the user's content using the extracted DNA. **Never copies pixels. Never claims to identify exact fonts. Refuses obvious template-marketplace or competitor-page screenshots.** Load [`references/study.md`](references/study.md) before this verb runs. |

If the user types anything that does not clearly map to `audit`, `refine`, `redesign`, or `study`, treat it as default. If the user attaches an image without a verb prefix, ask: *"Should I `study` this (extract the DNA), or should I treat it as a reference for a fresh build?"*

The default Design flow always picks a theme. By default it picks one of the **22 named themes** — the *catalog* — and rotates among them per the diversification rule. There is also a quiet *custom* branch that constructs a one-off OKLCH palette + free-font pairing for the brief; the custom route fires **only when the brief carries a creative-intent signal** (the user names a brand colour, names a multi-attribute vibe the catalog can't carry, or explicitly asks for a custom theme). For vanilla briefs, the user never sees the words "catalog" or "custom" — the catalog runs silently. See Step 1 (signal detection) and Step 2.6 (dispatch); the protocol lives in [`references/custom-theme.md`](references/custom-theme.md).

---

## When the brief is a component, not a page

Before entering the full Design flow, **check scope**. If any of these fire, run the Component-scope flow instead — most day-to-day dev requests are component-shaped, not page-shaped, and the page-level apparatus (macrostructure, hero enrichment, footer archetype, project memory) is wrong for them.

**Component-scope signals:**

- The brief names a single UI element: *a button · an input · a card · a modal · a dropdown · a tooltip · a select · a checkbox · a switch · a tab strip · a chip · a badge · a banner · a snackbar · a popover · a slider · a date picker · an avatar*.
- The brief is short (≤ 30 words) and refers to one element.
- The target file is a single component (e.g., `./Button.tsx`, `./components/Input.css`, `app/components/Card.vue`).
- The user explicitly says *"just the X"*, *"only the Y"*, *"this one element"*, *"a single ___"*.

If two signals fire, route component. If only the page flow fires (multi-section brief, "build me a landing page"), stay in Design flow.

### What Component-scope keeps from the page flow

- **Step 0 · Pre-flight scan** — same. Read existing tokens, fonts, framework, microinteraction stance. A button on a Geist-bodied Tailwind project must adopt those tokens, not invent new ones.
- **Step 1 · Genre detection** — same. Editorial / modern-minimal / atmospheric / playful. The component inherits its surroundings' genre (silent default to editorial when unknown).
- **Step 2.6 · Theme route** — same. If a `tokens.css` or `design.md` exists, the component uses those tokens. Otherwise it asks "is there a system to follow, or should I pick one?" — defaulting to *catalog* if the user is silent.
- **2+1 font discipline** — same.
- **State discipline — STRICTER.** Every interactive component MUST ship code for **all 8 states**: default · hover · `:focus-visible` · `:active` · disabled · loading · error · success. The 8-state checklist in [`interaction-and-states.md`](references/interaction-and-states.md) is mandatory, not advisory.
- **Slop test — universal-only subset.** Run the visual / microinteraction / contrast (gates 46–50) / a11y / typography gates. Skip the diversification gates (no `.hallmark/log.json` entry — components don't rotate) and skip the layout-safety gates that assume a full page.

### What Component-scope skips

- **Step 2 · Macrostructure pick.** Components don't have macrostructures. State this explicitly: *"Component-scope: skipping macrostructure."*
- **Step 4 · Enrichment.** No hero illustration, no demo video, no abstract background. The component IS the artifact.
- **Step 5 · Multi-section preview.** Replaced by the 8-state demo wrapper (below).
- **Project-memory append.** No `.hallmark/log.json` entry for component runs. The diversification rule doesn't apply.

### What Component-scope emits

**Two files, side by side:**

1. **The component artifact** — a single self-contained file matching the project's conventions:
   - React / Vue / Svelte: `Button.tsx` / `Button.vue` / `Button.svelte`
   - Vanilla web: `button.css` + `button.html`
   - Tailwind: a `.tsx` with `className` chains AND a `tokens.css` if missing
   - The component consumes Hallmark tokens by name (`var(--color-accent)`), never inlines OKLCH values.

2. **An 8-state demo wrapper** — `<ComponentName>.preview.html` (or `.preview.tsx`). A small standalone page that renders the component in **all 8 states** stacked vertically, each labelled. The user opens it once, sees the component working, then deletes it. The wrapper is not part of production code. Format:

   ```
   ┌──── Button — 8 states ────────────────────────┐
   │                                                │
   │ default       [ Click me                  ]    │
   │ hover         [ Click me                  ]    │  ← .is-hover forces :hover styling
   │ focus         [ Click me                  ]    │  ← .is-focus forces :focus-visible
   │ active        [ Click me                  ]    │  ← .is-active forces :active
   │ disabled      [ Click me                  ]    │  ← disabled attr
   │ loading       [ ⌛ Working…                ]    │  ← data-state="loading"
   │ error         [ ⚠ Try again               ]    │  ← data-state="error"
   │ success       [ ✓ Saved                   ]    │  ← data-state="success"
   │                                                │
   └────────────────────────────────────────────────┘
   ```

   Each labelled row uses a class (e.g. `.is-hover`) that the component's CSS targets in addition to the real pseudo-class, so all 8 states render at once on the demo page. Example:

   ```css
   .btn:hover, .btn.is-hover { background: var(--color-paper-3); }
   .btn:focus-visible, .btn.is-focus { outline: 2px solid var(--color-focus); }
   .btn:active, .btn.is-active { transform: translateY(1px); }
   ```

### Stamp format for component output

Components stamp differently from pages:

```css
/* Hallmark · component: <type> · genre: <genre> · theme: <theme>
 * states: default · hover · focus · active · disabled · loading · error · success
 * contrast: pass (46–50)
 */
```

The `component:` prefix tells future Hallmark runs this artifact is component-scoped and shouldn't trigger page-level diversification rules. The `states:` line is a checklist — every state listed must have actual styling in the file.

### When in doubt — ask once

If the brief is ambiguous between component and page (e.g. *"design a pricing section"* — could be one card, could be a whole page), ask one short question: *"One pricing card, or the whole pricing page?"* Default to **component** if the user doesn't engage — single-artifact output is cheaper to redirect than a multi-section page.

---

## Design flow (default)

### 0. Pre-flight scan

If the project already has code — a `package.json`, a `tailwind.config.*`, an `index.html`, any CSS — Hallmark should **read it before asking the user anything**. Stomping on an established palette or font stack is the difference between a skill the user keeps and a skill the user uninstalls.

**Six signal sources, scanned in order:**

0. **`design.md`** — at the project root (or `DESIGN.md`). If present, this is the **locked design system for the project** — written by a previous `hallmark redesign` run on the whole app, or by hand. **Read it first; it overrides everything else.** Subsequent picks (genre, theme, type, motion) defer to it. The diversification rule is *inverted* on `design.md`-managed projects: pages must share the system, not differ from each other. See [`verbs/redesign.md`](references/verbs/redesign.md) § Multi-page flow for how the file is produced and amended.
1. **Font stack** — `package.json` for `next/font`, `@fontsource/*`, `expo-google-fonts`, `geist`; any `<link rel="stylesheet" href="...fonts.googleapis.com/...">` in HTML / layout files; `tailwind.config.{js,ts}` `theme.extend.fontFamily`; `@import url("fonts.googleapis.com/...")` in any stylesheet.
2. **Palette** — OKLCH / HSL / hex values inside `:root` blocks; `tailwind.config` `theme.extend.colors`; any `tokens.json`, `design-tokens.{json,yaml}`, or DTCG-shaped file.
3. **Microinteraction stance** — `package.json` dependencies for `framer-motion`, `gsap`, `motion`, `lenis`, `lottie-react`, `@react-spring/*`, `auto-animate`. Any one of those = "motion-on" project. None = "motion-cut" project.
4. **Spacing scale** — Tailwind `theme.extend.spacing`; CSS `--space-*` custom-property pattern; presence of a 4-pt or 8-pt scale.
5. **Framework** — Next.js (`next` in deps), Astro (`astro`), Vue (`vue`), Svelte / SvelteKit (`svelte` / `@sveltejs/kit`), Remix (`@remix-run/*`), or vanilla HTML.

**Output format** — emit this block once, before Step 1, with file:line citations so the user can verify what you found:

```
Pre-flight findings:
· Font stack: Geist + Geist Mono (next/font, package.json L23)
· Palette: OKLCH custom properties (app/globals.css :root)
· Motion: framer-motion 11 installed (package.json L41)
· Spacing: Tailwind extend.spacing (4-pt scale, tailwind.config.ts L18)
· Framework: Next.js 15 (app router)

Hallmark will preserve: font stack, palette, spacing scale.
Hallmark will introduce: macrostructure, microinteraction discipline,
slop-test gates, hero enrichment recipe.

If you want Hallmark to override any preserved item, say so.
```

**Persistence.** Write the findings to `.hallmark/preflight.json` once. On subsequent runs, *re-use* the cached findings unless either:
- the user says "refresh pre-flight" (or "scan again", "re-scan"), or
- `package.json` / `tailwind.config.*` mtimes are newer than `preflight.json`.

If the cache is re-used, emit a one-line note instead of the full block: *"Pre-flight cached (last scan: 2026-04-30). Say 'refresh pre-flight' to re-scan."*

**Edge cases:**

- **`design.md` found** → emit *"`design.md` detected at project root — this is a system-managed project. Reading the locked design system; subsequent picks defer to it."* Then read the file in full and use it as the source of truth for genre / theme / typography / spacing / motion / CTA voice. Skip Step 1's catalog/custom dispatch; the system is already chosen. Proceed to macrostructure pick (Step 2) within the family `design.md` allows for this page's type.
- **No signals found** (vanilla HTML project, empty repo, scratch directory) → silent. One line only: *"No pre-flight signals — proceeding with full Hallmark stack."*
- **Conflicting signals** (e.g. `framer-motion` installed but no `motion.div` usage anywhere; or `Geist` import in `package.json` but `font-family: Inter` hard-coded in CSS) → flag the conflict explicitly: *"Conflict: Geist imported via next/font but a hard-coded `font-family: Inter` in app/globals.css L4. I'll preserve next/font Geist; please confirm or remove the Inter declaration."*
- **Empty project** (no `package.json`, no `index.html`) → silent.
- **The user said "ignore the existing project"** → skip pre-flight entirely; emit *"Pre-flight skipped at user request."* and proceed to Step 1.

**Two more sample outputs** for the model to imitate:

*Vanilla HTML project, motion-cut:*
> *Pre-flight findings: vanilla HTML, no framework detected. No motion library, no Tailwind, no design tokens. Hallmark will introduce: full token system, macrostructure, microinteraction discipline, slop-test gates. Nothing to preserve.*

*Astro + Tailwind + DTCG tokens already present:*
> *Pre-flight findings: Astro 5 (astro.config.mjs L1) · Tailwind v4 with @theme inline tokens (src/styles/global.css L3) · `tokens.json` at project root (DTCG format, 12 colour tokens, 6 font tokens). No motion library detected.*
> *Hallmark will preserve: Tailwind tokens, the `tokens.json` file (won't overwrite). Hallmark will introduce: macrostructure, microinteraction discipline, slop-test gates. Motion stance: motion-cut (no framer-motion / motion / gsap detected).*

The pre-flight block is the user's accountability line: *"here's what I noticed about your project before I touched anything."* Skipping it is the fastest way to lose the user's trust.

### 1. Design-context gate

Hallmark works best when you know three things before writing code:

1. **Audience.** Who will use this? What do they already know?
2. **Use case.** What single job does this interface do? What is the one action the user should be able to take?
3. **Tone.** Pick an extreme — *editorial, brutalist, soft, utilitarian, luxury, playful, technical, austere*. "Clean and modern" is not a tone.

**Ask once, then commit.** If any of the three is missing, ask for all missing items in **one** short message — not one at a time, not in a follow-up. Offer the user an opt-out at the end of that message: *"or say 'go ahead' and I'll infer from the brief — I'll tell you what I picked."*

**Genre — pick before themes.** Before the theme route, settle on a genre. Hallmark ships four: **editorial** (default · the canonical anti-slop voice), **modern-minimal** (Stripe / Linear / ElevenLabs school), **atmospheric** (Suno / Runway / dark-AI-tool school), **playful** (post-Linear soft school). The genre scopes which themes can rotate, which slop-test gates apply, and which voice fixtures the LLM picks from. Detection is signal-based — silent default to editorial unless the brief fires one of these:

- *AI tool, generative, music, video, voice, late-night, dark mode, atmospheric* → **atmospheric** → load [`references/genres/atmospheric.md`](references/genres/atmospheric.md)
- *SaaS, enterprise, API, platform, developer tool, infra, B2B, dev experience* → **modern-minimal** → load [`references/genres/modern-minimal.md`](references/genres/modern-minimal.md)
- *fun, consumer, casual, friendly, onboarding, family, community* → **playful** → load [`references/genres/playful.md`](references/genres/playful.md)

If two non-default signals fire (rare), ask one short follow-up: *"This brief fits both modern-minimal and atmospheric — which feels closer? \[modern-minimal · atmospheric]"*. Default with no signal: silent **editorial** → load [`references/genres/editorial.md`](references/genres/editorial.md). The chosen genre file is loaded eagerly (it scopes everything downstream); other genre files stay on disk.

State the genre out loud at Step 2.5 alongside the macrostructure and theme picks: *"Genre: atmospheric. Macrostructure: Marquee Hero. Theme: Bloom (atmospheric cluster)."*

**Theme route — only surface when the brief signals it.** Hallmark has two theme routes: **catalog** (the 22 named themes — Specimen, Atelier, Pastel, Brutal, Salon, Newsprint, Linen, Studio, Manifesto, Terminal, Midnight, Almanac, Garden, Quiet, Riso, Sport, Bloom) and **custom** (an OKLCH palette + free-font pairing tuned to this one brief). **Catalog is the default.** The catalog rotation is *scoped to the genre's theme cluster* — atmospheric rotates Bloom/Midnight/Terminal, modern-minimal stays on Quiet, playful stays on Pastel, editorial walks the remaining twelve. Do **not** offer the user a choice on every prompt — that's friction, not discipline. Surface the catalog/custom fork only when the brief carries one of these signals:

- The user explicitly says **custom theme** / **tailored to our brand** / **make it ours** / **something unique** / **play with the colors and fonts**.
- The user names a **specific brand colour** as the anchor (e.g., "use our terracotta", "the brand red is hex #c0392b", "anchor on sea-blue").
- The user describes a **multi-attribute aesthetic that doesn't map to a single catalog theme** — three or more vibe words pointing at a specific feel (e.g., "moss, lichen, soft pink, herbal" / "sun-drenched, market-day, carbon-black" / "late-night, neon, brutalist deli"). One adjective ("warm", "technical", "playful") is *not* a custom signal — that's a tone, and the catalog already carries it.
- The user attaches a **brand-mood reference** (a colour swatch, a moodboard, a Pantone chip) without asking to study a screenshot.

If any of those fires, ask one short follow-up before picking: *"This brief reads like a custom palette would fit better than the catalog. Want me to construct a custom OKLCH palette + free-font pairing tuned to <one-line summary of the vibe>, or stay on the catalog for variety + speed?"* Wait for the user to say custom (or catalog). Default is still catalog — silence routes to catalog, not custom.

If none of the signals fires, **proceed with catalog silently. Do not mention the fork.** Most briefs don't need a custom theme — the catalog's 22 themes plus the rotation rule already deliver structural variety. See Step 2.6 for the dispatch.

**If the user opts out** (says "go ahead", "you pick", "skip", "just build it", "don't ask", or simply doesn't engage with the question after one prompt):

- Infer audience, use case, and tone from the brief, the domain, and any visible context (filename, framework, surrounding code is fair game *now* — only because the user delegated).
- **State the inferences in one sentence at the top of your reply** — *"Going with: audience = X · use = Y · tone = Z. If any of those is wrong, tell me and I'll redirect."*
- Stamp them in the CSS comment alongside the macrostructure (Step 4 below). The stamp is now the durable record.
- Pick a **non-default** macrostructure — Specimen-fall-through is still banned, even on inferred briefs.

**Do not skip the inference disclosure.** The opt-out is a courtesy to lazy users, not an excuse for the skill to be opaque. If the user can't see what was inferred, they can't redirect when it's wrong.

Once the three are settled (asked or inferred), restate them in one sentence and proceed.

### 2. Pick a macrostructure FIRST

Before loading any visual ruleset, **pick one of the twenty-one named macrostructures in [`references/macrostructures.md`](references/macrostructures.md).** Each macrostructure is a complete page-shape — heading placement, body composition, divider language, button voice, image treatment, reveal — bundled as a single named choice. Picking one named macrostructure is faster and more varied than choosing six independent axes from scratch.

**Diversification rule (mandatory).** Before you pick:

1. Look in the target codebase for an existing `/* Hallmark · macrostructure: <name> · ... */` stamp at the top of any CSS file. If you find one, your pick must be a *different* macrostructure.
2. If you have produced any other Hallmark output for this user in this session, your pick must be a different macrostructure than the last one.
3. **The Specimen macrostructure (numbered left-margin labels + huge serif + asymmetric spans + typographic CTA) is no longer a default.** Reach for it only when the brief is explicitly editorial, foundry-adjacent, or the user has named it.

**Theme-diversification rule (mandatory).** Picking a different macrostructure isn't enough on its own — two consecutive Hallmark outputs can share a theme even if their structures differ, and the result reads as repetition. Two consecutive themes must differ on **at least one** of three axes:

- **Paper band** — dark (L < 30 %) / mid (30–85 %) / light (> 85 %), per the theme's `--color-paper` lightness
- **Display style** — italic-serif (Specimen, Studio, Atelier) / roman-serif (Newsprint, Salon, Linen) / geometric-sans (Pastel, Manifesto) / mono (Terminal) / display-condensed-italic (Sport) / display-heavy (Brutal) / system-native (Quiet) / risograph-bold (Riso)
- **Accent hue** — warm (red / orange / amber: 10–60°) / cool (blue / indigo / cyan: 200–300°) / neutral (no chromatic accent: Quiet) / chromatic-other (green: Studio · sage: Garden · phosphor: Terminal)

If the previous output was Specimen (light · italic-serif · warm), the next can be Studio (light · italic-serif · chromatic-green) — the *accent hue* differs. But the next can't be Salon (light · roman-serif · warm) which only differs on display style and shares both paper band and accent — pick a more distant theme.

The per-theme axis values live as comments at the top of each theme's tokens block in [`site/css/tokens.css`](../site/css/tokens.css). When in doubt, name your candidate theme out loud and identify its three axis values; if two of three match the previous output, redirect.

**State your pick.** Before writing any code, say "Macrostructure: <name>. Theme: <name>. Differs from the last on: <axes>." in plain text. This is a deliberate accountability step — picking on the page (not in your head) prevents the default-attractor sameness that kept the skill emitting Specimen output.

If the brief is genuinely vague (no theme, no tone), do **not** default. Offer the user three macrostructures from *categorically different* groups (e.g. one grid-led like Bento, one document-led like Long Document, one poster-led like Manifesto). Three concrete choices, not seven abstract tones.

The macrostructure picks five of the six structural axes for you; you only need to pick the reveal yourself. The deeper axis catalogue is still in [`references/structure.md`](references/structure.md) when you need to deviate from the macrostructure's defaults.

### 2.5. Check project memory

If the project has a `.hallmark/log.json` file (created by previous Hallmark runs), **read it before** picking the macrostructure or theme. The schema is a JSON array, newest entry first:

```json
[
  { "date": "2026-04-30", "macrostructure": "Bento Grid",   "theme": "Pastel",  "enrichment": "E1 clipped-edge",  "brief": "Tracejam · SaaS observability" },
  { "date": "2026-04-28", "macrostructure": "Long Document","theme": "Linen",   "enrichment": "E5 hand-built SVG", "brief": "Maple Street Bread · bakery" },
  { "date": "2026-04-25", "macrostructure": "Manifesto",    "theme": "Manifesto","enrichment": "none",            "brief": "Meridian · studio manifesto" }
]
```

Use the **last 3–5 entries** to inform diversification:
- Your macrostructure pick must not match any of the last three.
- Your theme pick must differ from the last on at least one axis (see the theme-diversification rule above).
- Your enrichment pick should not be the same enrichment archetype as the last (`E1 clipped` twice in a row reads as templated, even with different content).

If the file doesn't exist, this is the first Hallmark run for this project — no constraint, but **you'll create the file in Step 6**.

If the project has a CSS stamp but no `log.json`, infer one entry from the stamp and proceed.

**State the rotation in plain text before picking.** This is the user's accountability line for diversification — picking on the page (not in your head) is what keeps the skill from drifting back into Bento-Grid-by-default. The format:

> *"Last 5 builds: Bento Grid (Tracejam) · Bento Grid (Foundry) · Long Document (Maple) · Manifesto (Meridian) · Quote-Led (Tide). Bento Grid used 2 of 5 — picking from {Marquee Hero, Stat-Led, Workbench, Letter} this time. I'll go with Marquee Hero."*

Then the theme rotation, on the next line:

> *"Last 3 themes: Pastel · Plain · Salon. Picking from {Newsprint, Atelier, Linen, Studio} — Newsprint differs on display style and accent hue."*

**Three sample shapes** to imitate:

- **First-time** (no `log.json`, fresh project): no rotation block at all — just the macrostructure pick. *"This is the first Hallmark run for this project. Picking Long Document — fits the Coffeebox brief's editorial tone."*
- **Mature project** (5+ entries in `log.json`): the format above — frequency count, exclusion list, pick.
- **User overrode last run** ("use Bento Grid again, I want the same shape"): *"Last build was Bento Grid (you requested it). You've asked for it again — I'll pick different knob values. Knob deltas: tiles=8 (was 6), accent=full-bleed (was corner-only), spans=irregular (was even). Same archetype, different fingerprint."*

The rotation block keeps the user inside the discipline without making them read the rules. Skip it and the user starts thinking the diversification is theatre.

### 2.6. Theme route — catalog or custom

By the time you reach this step, one of three things is true:

1. **The user named custom** (because they said so, or because Step 1's signal detection fired and they confirmed) → load [`references/custom-theme.md`](references/custom-theme.md), ask the **one** follow-up (vibe in 4–8 words + optional anchor colour), construct the OKLCH palette + free-font pairing, compute the three axis values (paper-band / display-style / accent-hue), then continue to Step 3.
2. **The user named catalog** (or implicitly accepted it by not naming custom) → pick one of the 22 named themes per the diversification rule above. Existing flow — continue to Step 3.
3. **Neither was discussed** (Step 1's signals didn't fire — vanilla brief) → default to **catalog**. Do not pause. Do not ask. Continue to Step 3.

**Custom is a quiet branch, not a default question.** Most briefs route to catalog and the user never sees the words "catalog" or "custom." The 22 named themes plus the rotation rule already deliver structural variety; the fork is reserved for when the brief specifically asks for a tuned look the catalog can't carry.

A custom theme is a **complete** OKLCH palette + font pairing tuned to the brief — not a one-off colour swap, not an excuse to bypass the rules. Every constraint in [`color.md`](references/color.md), [`typography.md`](references/typography.md), and [`anti-patterns.md`](references/anti-patterns.md) still applies. The 50 slop-test gates fire unchanged. The Step 5 preview block surfaces the palette + pairing in plain text **before** any code is emitted, so the user can redirect.

The diversification rule is theme-route-blind: a custom run that follows another custom (or a catalog) must differ on at least one of the three axes from the previous entry, same as catalog-vs-catalog. Custom entries record their three axes explicitly into `.hallmark/log.json` (see [`custom-theme.md`](references/custom-theme.md) § F).

### 3. Load the visual ruleset

The non-negotiables live in [`references/`](references/). **Be precise about what to load when.** Loading every file every time costs ~40k tokens; loading only what's needed costs ~15k. Discipline matters.

**Always-load (the eager bundle, ~3 files):**
- The genre file picked in Step 1 — [`genres/editorial.md`](references/genres/editorial.md), [`genres/modern-minimal.md`](references/genres/modern-minimal.md), [`genres/atmospheric.md`](references/genres/atmospheric.md), or [`genres/playful.md`](references/genres/playful.md). Scopes everything downstream.
- [`macrostructures.md`](references/macrostructures.md) — 21 named whole-page shapes; you must pick one before writing code (Step 2 already required this).
- [`component-cookbook.md`](references/component-cookbook.md) — 32 component archetypes (hero shapes, section heads, feature blocks, CTA shapes, testimonials, footers, navigations) composable into any macrostructure.

**Load-per-build (universal rules — load every build):**
- [`typography.md`](references/typography.md) — fonts, scale, pairing, weights, measure
- [`color.md`](references/color.md) — OKLCH, palette construction, accent discipline
- [`layout-and-space.md`](references/layout-and-space.md) — 4 pt scale, grid-breaks, asymmetry, depth
- [`motion.md`](references/motion.md) — durations, easings, what to animate, reduced-motion
- [`copy.md`](references/copy.md) — verbs, labels, error structure, link text
- [`anti-patterns.md`](references/anti-patterns.md) — the named tells you must not emit

**Load-conditionally (only when the page actually needs it):**
- [`microinteractions.md`](references/microinteractions.md) — load whenever the output has *any* interactive element (buttons, inputs, modals, tabs, dropdowns, toasts, drag handles, copy buttons). That is most pages.
- [`interaction-and-states.md`](references/interaction-and-states.md) — load when the page has stateful UI (forms, command palettes, optimistic updates).
- [`responsive.md`](references/responsive.md) — load when mobile is in scope.
- [`structure.md`](references/structure.md) — load only when deviating from a named macrostructure.
- [`hero-enrichment.md`](references/hero-enrichment.md) — load at Step 4 if the brief asks for enrichment.
- [`custom-craft.md`](references/custom-craft.md) — load only when an enrichment archetype requires construction (CSS art, SVG, declarative animation, etc.).
- [`assets.md`](references/assets.md) — load only when an enrichment archetype needs an external asset (icons, illustration, photography, Lottie).
- [`custom-theme.md`](references/custom-theme.md) — load only when Step 2.6 routes to custom.

**Load-at-the-end:**
- [`slop-test.md`](references/slop-test.md) — load at Step 7 (the gate-check after build), not earlier.
- [`contract.md`](references/contract.md) — load at handoff time for output-contract + scope rules.
- [`export-formats.md`](references/export-formats.md) — load at Step 6 only when the project warrants multi-format exports (i.e. has a `design.md`). Single-page builds emit `tokens.css` from the in-memory token state and don't need this file.

**Verb-specific:**
- [`verbs/audit.md`](references/verbs/audit.md), [`verbs/refine.md`](references/verbs/refine.md), [`verbs/redesign.md`](references/verbs/redesign.md) — load only when that verb runs.
- [`study.md`](references/study.md) — load only when `hallmark study` runs.

**Human-only (do NOT auto-load):**
- [`../docs/recipes.md`](../docs/recipes.md) — eight worked briefs for human readers.
- [`../docs/study-examples.md`](../docs/study-examples.md) — three worked DNA-extractions for human readers.

### 4. Decide on hero enrichment

Most pages don't need it. The strongest hero is often a typographic one. **Reach for [`hero-enrichment.md`](references/hero-enrichment.md) only when the brief points there** — a SaaS / dev-tool brief wants a demo video or mockup; a bakery / café / atelier brief wants a hand-built illustration; a manifesto wants nothing.

Eyeball the brief or ask one short question. State the decision in one sentence (e.g., *"Enrichment: E1 Clipped-Edge Demo Video, Tier-A CSS-art mockup."* or *"Enrichment: none — typography only."*). The decision goes into the macrostructure stamp at Step 6.

**The enrichment hierarchy is non-negotiable.** Reach for the highest tier you can ship: typography only → Tier A pure CSS art → Tier B hand-built SVG → Tier C generated still (Nanobanana / Recraft) → Tier D library + customisation → **Tier E Lottie is last resort**, only for complex character motion that hand-build can't reach. Reaching for Lottie when CSS would have built it is the new tell.

When an enrichment archetype requires construction, also load [`custom-craft.md`](references/custom-craft.md). When it requires an external asset, load [`assets.md`](references/assets.md).

### 5. Preview

Before emitting any code, output a tight summary of what you're about to ship. This is the user's TL;DR — they should be able to scan it in five seconds and tell you to redirect *before* you write 500 lines of CSS that don't match their intent.

**Format** (Markdown bullets, not ASCII boxes — they render reliably across every chat client and terminal):

```markdown
**Hallmark · v0.8.0**

- **Macrostructure** · Stat-Led
- **Theme** · Plain (#fff paper · cool greys · ink-blue accent)
- **Enrichment** · none (typography only)
- **Sections** · Hero · Logos · Stats · Features · Testimonials · Pricing · FAQ · CTA · Footer
- **Motion** · counter · pricing-lift · pulse-once
- **Slop test** · 50 / 50 ✓ (run after Build)
- **Diversification** · differs from Pastel on display style + accent hue
```

**Six required bullets, one optional:**

1. **Macrostructure** — the named pick from [`macrostructures.md`](references/macrostructures.md).
2. **Theme** — for catalog: name + one-line palette summary (paper colour band · accent hue · display style). For custom: `custom (vibe: "<4–8 words>" · paper oklch(<L%> <C> <H>) · accent oklch(<L%> <C> <H>) <one-word hue label> · <display face> + <body face>)`.
3. **Enrichment** — the chosen archetype + tier, or *none (typography only)*.
4. **Sections** — section names separated by ` · `, in DOM order.
5. **Motion** — microinteraction primitives separated by ` · `, or *none — typography only*. Always under three primitives per the [`microinteractions.md`](references/microinteractions.md) hard rules.
6. **Slop test** — `50 / 50 ✓` if all gates pass, or `N / 50 — fails: <gate numbers>` if any are open. Run the slop test BEFORE writing this row; the slop test is Step 7.
7. **Diversification** *(optional, only when `.hallmark/log.json` has prior entries)* — what axes differ vs the previous run.

**Three more sample preview blocks** for the model to imitate, varied across macrostructure types:

*Long Document (editorial, motion-cut):*
> **Hallmark · v0.8.0**
>
> - **Macrostructure** · Long Document
> - **Theme** · Linen (cool slate paper · steel-blue accent · geometric sans)
> - **Enrichment** · Tier-B hand-built SVG (a 60-line coffee bean with `@property --rise` 6 s breathing-loop)
> - **Sections** · Masthead · Letter · Three Notes · Visit · Colophon
> - **Motion** · breathing-loop on bean only (respects `prefers-reduced-motion`)
> - **Slop test** · 50 / 50 ✓
> - **Diversification** · first run for this project

*Bento Grid (SaaS, motion-on):*
> **Hallmark · v0.8.0**
>
> - **Macrostructure** · Bento Grid
> - **Theme** · Pastel (light cool paper · indigo accent · geometric Geist)
> - **Enrichment** · E1 Clipped-Edge Demo Video, Tier-A CSS-art trace waterfall
> - **Sections** · Hero · 6-tile Bento (stat · sparkline · quote · code · integrations · spotlight) · Index Footer
> - **Motion** · counter · pricing-lift · CSS marquee on integrations strip
> - **Slop test** · 50 / 50 ✓
> - **Diversification** · differs from Plain on paper hue (light-cool vs pure-white) + accent (indigo vs ink-blue)

*Manifesto (declarative, no enrichment):*
> **Hallmark · v0.8.0**
>
> - **Macrostructure** · Manifesto
> - **Theme** · Manifesto (dark · Inter Tight 900 · single red bleed)
> - **Enrichment** · none (typography only — voice carries the brand)
> - **Sections** · Masthead · Title · Five Declarations · Bleed Band · What We Refuse · Working Rules · Practice · Reading · Colophon
> - **Motion** · none — typography only
> - **Slop test** · 50 / 50 ✓
> - **Diversification** · differs from Linen on paper band (dark vs light) + display style (display-heavy vs geometric-sans)

*Custom (Coffeebox archival café):*
> **Hallmark · v0.8.0**
>
> - **Macrostructure** · Long Document
> - **Theme** · custom (vibe: "archival warmth, hand-set, no varnish" · paper oklch(94% 0.020 65) · accent oklch(58% 0.16 35) terracotta · Fraunces italic display + Source Serif 4 body)
> - **Enrichment** · Tier-A pure-CSS coffee bean (60-line SVG, breathing-loop optional)
> - **Sections** · Masthead · Letter · Three Notes · Visit · Colophon
> - **Motion** · breathing-loop on bean (with reduced-motion fallback)
> - **Slop test** · 50 / 50 ✓
> - **Diversification** · custom axes: light / italic-serif / chromatic-terracotta — differs from previous catalog Linen on accent hue + display style

If any slop-test gate fails when you reach Step 7, return to the relevant Build step, fix it, and **re-emit the preview block** with the corrected slop-test row. The preview is the durable summary; it's wrong to ship if it lies.

### 6. Build

Emit code that satisfies the tone and structural fingerprint. Match the complexity of the code to the ambition of the tone — a brutalist page needs raw, heavy CSS; an austere page needs restraint.

Always:

- Use OKLCH for every colour. Declare tokens as CSS custom properties at `:root`.
- Use a 4pt spacing scale with semantic names (`--space-sm`, `--space-md`, …).
- Pick a distinctive display face and a refined body face. Pairings, not single-font pages — *unless* the single-font choice IS the design (a true terminal-aesthetic page is monospace-only on purpose; that's allowed).
- Design every interactive element for its full eight states (see [`interaction-and-states.md`](references/interaction-and-states.md)).
- Animate `transform` and `opacity` only — never layout properties.
- Use the three named easings (`--ease-out`, `--ease-in`, `--ease-in-out`) — never the browser default `ease`, never bounce/overshoot on UI state.
- Support `prefers-reduced-motion: reduce`. Spatial motion collapses to ≤150ms opacity crossfade.
- Include `:focus-visible` with a visible ring at ≥3:1 contrast. **Never animate the ring's appearance** — it must show instantly on focus.
- For each interaction in the output (button, input, modal, toast, drag, copy, etc.), apply the recipe in [`microinteractions.md`](references/microinteractions.md). Pick *silent success* over celebratory toasts. Pick *optimistic update + Undo* over confirmation dialogs. Pick *delay 800ms* on hover tooltips and *0ms* on focus tooltips.
- Cut motion before adding it. Most pages have too much, not too little. If removing an animation wouldn't lose the user information, remove it.
- **Stamp the output.** The first non-empty line of the produced CSS file (or the top of `<style>` if inline) MUST be a comment of the form: `/* Hallmark · macrostructure: <name> · tone: <tone> · anchor hue: <hue> */`. This stamp is the durable record of what you chose. The next time Hallmark runs in this project, it reads the stamp and picks a *different* macrostructure. **For custom themes**, the stamp also carries the vibe, paper + accent OKLCH values, the chosen display + body fonts, and the three diversification axes — the full multi-line format is in [`custom-theme.md`](references/custom-theme.md) § E.
- **Append to project memory.** After you write the stamp, update (or create) `.hallmark/log.json` at the project root. Append a new entry at the **front** of the array: `{ "date": "<YYYY-MM-DD>", "macrostructure": "<name>", "theme": "<name>", "enrichment": "<E# name or 'none'>", "brief": "<one-line summary>" }`. **Custom entries** also carry `"theme": "custom"` plus `"theme_axes": "<paper-band> / <display-style> / <accent-hue>"` and an optional `"vibe": "<4–8 words>"` — see [`custom-theme.md`](references/custom-theme.md) § F. Trim the file to the last 20 entries (rotate the oldest off). Create `.hallmark/` and the file if they don't exist; respect any existing `.gitignore` (the user may or may not want this committed). This file is what Step 2.5 reads on the next run.
- **Always emit `tokens.css`.** After writing the page CSS, also write `tokens.css` at the project root containing every `--color-*`, `--font-*`, `--space-*`, `--text-*`, `--ease-*`, `--dur-*`, `--rule-*`, and `--radius-*` token used in the build. The page CSS imports `tokens.css` (or, on framework projects, the project's existing entry-point includes it) — the page CSS must reference tokens by name, never inline raw values. Even single-page builds get a `tokens.css`. This is what makes the design system portable to the next project. Load [`export-formats.md`](references/export-formats.md) at this point only when the project warrants additional formats — see below.
- **Multi-format exports on `design.md` projects.** If a `design.md` exists at the project root (a system-managed project), append all four export formats — `tokens.css`, Tailwind v4 `@theme`, DTCG `tokens.json`, shadcn/ui CSS variables — into `design.md`'s `## Exports` section. Load [`export-formats.md`](references/export-formats.md) for the canonical mapping from Hallmark tokens to each format. Single-page projects skip this step (they get only `tokens.css`).

### 7. The slop test

Before handing back, run the output through the 50-gate slop test in [`references/slop-test.md`](references/slop-test.md). Every answer must be **no**. Load that file at this step (not earlier — it isn't needed until handoff). The active genre matters: some gates are universal, some are genre-scoped (atmospheric loosens the radial-bloom gate; modern-minimal loosens the zero-chroma neutral gate; etc.). The full per-genre overrides are listed inline in `slop-test.md`.

Run the slop test BEFORE writing the Slop test row in the Step 5 preview block — that row reflects the actual outcome of this step.

If any gate fails, fix it. Do not ship slop.

---

## `hallmark audit`

Load [`references/verbs/audit.md`](references/verbs/audit.md) and follow it.

---

## `hallmark refine`

Load [`references/verbs/refine.md`](references/verbs/refine.md) and follow it.

---

## `hallmark redesign`

Load [`references/verbs/redesign.md`](references/verbs/redesign.md) and follow it.

---

## `hallmark study`

The user has attached or pasted a screenshot of a design they admire. They want to learn from it — its shape, its type, its rhythm — and apply that *DNA* to their own content. They do not want a pixel-faithful copy.

**Critical position:** `study` extracts structure, not pixels. It names the macrostructure, the archetypes, the type-pairing role, the colour anchor, the rhythm. It produces a *diagnosis report* before any code, then offers to rebuild the user's content using the extracted DNA. Pixel-cloning is not a feature.

**Always read [`references/study.md`](references/study.md) before invoking this verb.** That file contains the vision-extraction protocol, the structured-fields schema, the refusal heuristics, and the type-role vocabulary. Do not work from intuition.

### Pipeline

1. **Refuse-or-proceed check.** Before extracting anything, run the refusal heuristics from `study.md`. If the screenshot is clearly a paid template marketplace listing, a competitor's live marketing page, or someone's published portfolio, ask: *"Is this your own work, a public reference for inspiration, or someone else's live site?"* Educational use of public references is fine; copying a competitor's live page is not.

2. **Vision pass.** Read the image into the structured-fields schema in `study.md`. Output ten fields: macrostructure name, hero archetype + variation knobs, pitch archetype + knobs, footer archetype, display family role (never a guessed font name), body family role, surface lightness band (paper L%), accent hue band + chroma, density verdict, type-pairing role.

3. **Diagnosis report.** Return a one-page "this is what you're looking at": names the macrostructure, names the archetypes, points at the type pairing, identifies one or two anti-patterns the screenshot has that the user should *not* carry over. The diagnosis is the deliverable for users who only want to learn.

4. **Confirmation question.** Ask: *"Adopt this DNA wholesale, or change one axis? For example, I could keep the macrostructure but pick a theme that better matches your tone."* Wait for the user's answer before building.

5. **Build.** Pick the closest matching theme from the catalog. Stamp the comment with the inferred macrostructure + archetypes + theme. The user's content goes in; the screenshot's content does not.

### Output contract for `study`

When `study` produces code, the macrostructure stamp must include a `studied: yes` flag and the theme picked, e.g.:

```css
/* Hallmark · macrostructure: Marquee Hero · H1 hero knobs: size=xxl, alignment=left-bias
 * theme: Studio · accent: forest-green ~3% · studied: yes · DNA-source: user reference
 */
```

The stamp signals to future Hallmark runs that this page's structure was extracted, not invented. That matters for the audit verb: a `studied: yes` page should be audited *more* leniently for "Specimen fall-through" (the user explicitly chose this DNA) but *more* strictly for "did you actually use the extracted DNA, or did you drift back to defaults?"

### Limits to spell out to the user

When you return the diagnosis, name the limits explicitly:

- **Fonts:** the skill names a *role* (e.g., "italic editorial serif", "heavy condensed sans", "monospace dev"), not a font ID. It proposes one or two real candidates from the canon and asks the user to confirm. Visual font identification is unreliable; do not pretend otherwise.
- **Imagery:** the skill never copies the screenshot's photography. It generates structurally-equivalent placeholders or asks for the user's own assets.
- **Theme drift is allowed.** If the screenshot is a Specimen and the user's content is a SaaS landing page, the skill picks a different theme. The DNA is the macrostructure + archetype + colour-anchor + type-pairing — not the dress.

If `references/study.md` cannot be loaded for any reason, refuse the verb politely and direct the user to `hallmark redesign` with a written description of what they want from the screenshot.

---

## Output contract & scope

Load [`references/contract.md`](references/contract.md) once, at handoff time, for the full output contract and scope-of-skill rules.

---

## Credits

Built on the research and open work of [impeccable](https://github.com/pbakaus/impeccable) (Paul Bakaus), [kami](https://github.com/tw93/kami) (tw93), [taste-skill](https://github.com/Leonxlnx/taste-skill) (Leonxlnx), Anthropic's [frontend-design skill](https://github.com/anthropics/skills) and [canvas-design skill](https://github.com/anthropics/skills), [DESIGN.md](https://getdesign.md) (Google Stitch), MC Dean's [63 design skills collection](https://marieclairedean.substack.com/p/i-built-63-design-skills-for-claude), the [Slopless](https://slopless.design) tactile-rebellion canon, and the Claude [frontend aesthetics cookbook](https://platform.claude.com/cookbook/coding-prompting-for-frontend-aesthetics). Where rules overlapped across those sources, Hallmark adopted them. Where they diverged, Hallmark picked.

MIT licensed. Powered by Together AI.
