---
name: hallmark
description: Use this skill when the user asks to design, build, redesign, audit, refine, or study a UI, web page, landing page, dashboard, component, or interface — or when they ask to make something "feel less AI-generated." Hallmark forces intentional design decisions (typography, color, layout, motion, interaction, structure) and refuses to default to the generic AI-UI template. Trigger phrases include "design a", "build a landing page", "make a dashboard", "redesign this site", "redesign the page", "refine this UI", "audit this design", "this looks AI-generated", "fix the design", "polish this", "give this a different look", and any request that will produce HTML / CSS / JSX / Tailwind output. **Also trigger when the user attaches a screenshot of a design they admire** — that is the `hallmark study` verb (extracts design DNA, never pixel-clones).
version: 0.7.0
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

The default Design flow always picks a theme. By default it picks one of the **16 named themes** — the *catalog* — and rotates among them per the diversification rule. There is also a quiet *custom* branch that constructs a one-off OKLCH palette + free-font pairing for the brief; the custom route fires **only when the brief carries a creative-intent signal** (the user names a brand colour, names a multi-attribute vibe the catalog can't carry, or explicitly asks for a custom theme). For vanilla briefs, the user never sees the words "catalog" or "custom" — the catalog runs silently. See Step 1 (signal detection) and Step 2.6 (dispatch); the protocol lives in [`references/custom-theme.md`](references/custom-theme.md).

---

## Design flow (default)

### 0. Pre-flight scan

If the project already has code — a `package.json`, a `tailwind.config.*`, an `index.html`, any CSS — Hallmark should **read it before asking the user anything**. Stomping on an established palette or font stack is the difference between a skill the user keeps and a skill the user uninstalls.

**Five signal sources, scanned in order:**

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

**Theme route — only surface when the brief signals it.** Hallmark has two theme routes: **catalog** (the 16 named themes — Specimen, Atelier, Pastel, Brutal, Salon, Newsprint, Linen, Studio, Manifesto, Plain, Terminal, Midnight, Almanac, Garden, Quiet, Riso) and **custom** (an OKLCH palette + free-font pairing tuned to this one brief). **Catalog is the default.** Do **not** offer the user a choice on every prompt — that's friction, not discipline. Surface the route only when the brief carries one of these signals:

- The user explicitly says **custom theme** / **tailored to our brand** / **make it ours** / **something unique** / **play with the colors and fonts**.
- The user names a **specific brand colour** as the anchor (e.g., "use our terracotta", "the brand red is hex #c0392b", "anchor on sea-blue").
- The user describes a **multi-attribute aesthetic that doesn't map to a single catalog theme** — three or more vibe words pointing at a specific feel (e.g., "moss, lichen, soft pink, herbal" / "sun-drenched, market-day, carbon-black" / "late-night, neon, brutalist deli"). One adjective ("warm", "technical", "playful") is *not* a custom signal — that's a tone, and the catalog already carries it.
- The user attaches a **brand-mood reference** (a colour swatch, a moodboard, a Pantone chip) without asking to study a screenshot.

If any of those fires, ask one short follow-up before picking: *"This brief reads like a custom palette would fit better than the 16 named themes. Want me to construct a custom OKLCH palette + free-font pairing tuned to <one-line summary of the vibe>, or stay on the catalog for variety + speed?"* Wait for the user to say custom (or catalog). Default is still catalog — silence routes to catalog, not custom.

If none of the signals fires, **proceed with catalog silently. Do not mention the fork.** Most briefs don't need a custom theme — the catalog's 16 themes plus the rotation rule already deliver structural variety. See Step 2.6 for the dispatch.

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
2. **The user named catalog** (or implicitly accepted it by not naming custom) → pick one of the 16 named themes per the diversification rule above. Existing flow — continue to Step 3.
3. **Neither was discussed** (Step 1's signals didn't fire — vanilla brief) → default to **catalog**. Do not pause. Do not ask. Continue to Step 3.

**Custom is a quiet branch, not a default question.** Most briefs route to catalog and the user never sees the words "catalog" or "custom." The 16 named themes plus the rotation rule already deliver structural variety; the fork is reserved for when the brief specifically asks for a tuned look the catalog can't carry.

A custom theme is a **complete** OKLCH palette + font pairing tuned to the brief — not a one-off colour swap, not an excuse to bypass the rules. Every constraint in [`color.md`](references/color.md), [`typography.md`](references/typography.md), and [`anti-patterns.md`](references/anti-patterns.md) still applies. The 38 slop-test gates fire unchanged. The Step 5 preview block surfaces the palette + pairing in plain text **before** any code is emitted, so the user can redirect.

The diversification rule is theme-route-blind: a custom run that follows another custom (or a catalog) must differ on at least one of the three axes from the previous entry, same as catalog-vs-catalog. Custom entries record their three axes explicitly into `.hallmark/log.json` (see [`custom-theme.md`](references/custom-theme.md) § F).

### 3. Load the visual ruleset

The non-negotiables live in [`references/`](references/). Read only what you need:

- [`typography.md`](references/typography.md) — fonts, scale, pairing, weights, measure
- [`color.md`](references/color.md) — OKLCH, palette construction, accent discipline, dark mode
- [`layout-and-space.md`](references/layout-and-space.md) — 4pt scale, grid-breaks, asymmetry, depth
- [`macrostructures.md`](references/macrostructures.md) — twenty-one named whole-page shapes (Bento Grid, Long Document, Marquee Hero, Stat-Led, Workbench, etc.); pick one before writing code
- [`component-cookbook.md`](references/component-cookbook.md) — thirty-two component archetypes (six hero shapes, five section-head shapes, five feature blocks, four CTA shapes, four testimonials, four footers, four navigations) you can compose into any macrostructure
- [`structure.md`](references/structure.md) — the six primitive axes underlying the macrostructures, for when you need to deviate
- [`motion.md`](references/motion.md) — durations, easings, what to animate, reduced-motion
- [`microinteractions.md`](references/microinteractions.md) — per-interaction recipes (button press, focus, modal, toast, optimistic update, command palette, drag, copy-to-clipboard, search-as-you-type) and the named microinteraction tells
- [`interaction-and-states.md`](references/interaction-and-states.md) — the eight states, focus, hit-targets, forms
- [`responsive.md`](references/responsive.md) — mobile-first, content-driven breakpoints, safe areas
- [`copy.md`](references/copy.md) — verbs, labels, error structure, link text
- [`anti-patterns.md`](references/anti-patterns.md) — the named tells you must not emit
- [`hero-enrichment.md`](references/hero-enrichment.md) — when (and when not) to add a demo video / illustration / mockup / animated loop / abstract background to the hero, plus the eight enrichment archetypes (load when reaching Step 4)
- [`custom-craft.md`](references/custom-craft.md) — *how* to hand-build hero artwork: pure CSS art, hand-built SVG, declarative animation (`@property`, `animation-timeline`, View Transitions), JS-driven (Motion / GSAP), and when Three.js earns its place. Load only when an enrichment archetype requires construction.
- [`assets.md`](references/assets.md) — the sourcing catalogue: icons (Lucide / Phosphor / Heroicons / Tabler), brand logos (Simple Icons / SVGL), generated illustration (Nanobanana 2 / Recraft V4 / Midjourney), library illustration, app mockups, hero video, photography, abstract backgrounds, Lottie. Per-category rules and what to avoid. Load only when an enrichment archetype actually needs an external asset.
- [`study.md`](references/study.md) — vision-extraction protocol for the `hallmark study` verb (load only when that verb runs)
- [`study-examples.md`](references/study-examples.md) — three worked DNA-extractions (Pentagram-style portfolio · Klim-style specimen · Rauno-style personal site) showing the diagnose → confirm → build flow end-to-end. Load whenever `study` runs and the user wants to see what a good DNA-extraction looks like before pasting their own screenshot.
- [`recipes.md`](references/recipes.md) — eight worked briefs with the prompt, inferred trio, picked macrostructure + theme + enrichment, and a one-paragraph excerpt of the output. The first recipe (Coffeebox) is the canonical try-it prompt the README points users at. Load when the user asks "what does Hallmark output look like?" or wants a near-match for a brief in hand.

For most design work you need `macrostructures`, `component-cookbook`, `typography`, `color`, `layout-and-space`, and `anti-patterns`. **Load `microinteractions` whenever the output has *any* interactive element** — buttons, links, inputs, forms, modals, tabs, dropdowns, toasts, drag handles, command palettes, copy buttons, anything with hover/focus/active states. That is most pages.

### 4. Decide on hero enrichment

Most pages don't need it. The strongest hero is often a typographic one. **Reach for [`hero-enrichment.md`](references/hero-enrichment.md) only when the brief points there** — a SaaS / dev-tool brief wants a demo video or mockup; a bakery / café / atelier brief wants a hand-built illustration; a manifesto wants nothing.

Eyeball the brief or ask one short question. State the decision in one sentence (e.g., *"Enrichment: E1 Clipped-Edge Demo Video, Tier-A CSS-art mockup."* or *"Enrichment: none — typography only."*). The decision goes into the macrostructure stamp at Step 6.

**The enrichment hierarchy is non-negotiable.** Reach for the highest tier you can ship: typography only → Tier A pure CSS art → Tier B hand-built SVG → Tier C generated still (Nanobanana / Recraft) → Tier D library + customisation → **Tier E Lottie is last resort**, only for complex character motion that hand-build can't reach. Reaching for Lottie when CSS would have built it is the new tell.

When an enrichment archetype requires construction, also load [`custom-craft.md`](references/custom-craft.md). When it requires an external asset, load [`assets.md`](references/assets.md).

### 5. Preview

Before emitting any code, output a tight summary of what you're about to ship. This is the user's TL;DR — they should be able to scan it in five seconds and tell you to redirect *before* you write 500 lines of CSS that don't match their intent.

**Format** (Markdown bullets, not ASCII boxes — they render reliably across every chat client and terminal):

```markdown
**Hallmark · v0.7.0**

- **Macrostructure** · Stat-Led
- **Theme** · Plain (#fff paper · cool greys · ink-blue accent)
- **Enrichment** · none (typography only)
- **Sections** · Hero · Logos · Stats · Features · Testimonials · Pricing · FAQ · CTA · Footer
- **Motion** · counter · pricing-lift · pulse-once
- **Slop test** · 38 / 38 ✓ (run after Build)
- **Diversification** · differs from Pastel on display style + accent hue
```

**Six required bullets, one optional:**

1. **Macrostructure** — the named pick from [`macrostructures.md`](references/macrostructures.md).
2. **Theme** — for catalog: name + one-line palette summary (paper colour band · accent hue · display style). For custom: `custom (vibe: "<4–8 words>" · paper oklch(<L%> <C> <H>) · accent oklch(<L%> <C> <H>) <one-word hue label> · <display face> + <body face>)`.
3. **Enrichment** — the chosen archetype + tier, or *none (typography only)*.
4. **Sections** — section names separated by ` · `, in DOM order.
5. **Motion** — microinteraction primitives separated by ` · `, or *none — typography only*. Always under three primitives per the [`microinteractions.md`](references/microinteractions.md) hard rules.
6. **Slop test** — `38 / 38 ✓` if all gates pass, or `N / 38 — fails: <gate numbers>` if any are open. Run the slop test BEFORE writing this row; the slop test is Step 7.
7. **Diversification** *(optional, only when `.hallmark/log.json` has prior entries)* — what axes differ vs the previous run.

**Three more sample preview blocks** for the model to imitate, varied across macrostructure types:

*Long Document (editorial, motion-cut):*
> **Hallmark · v0.7.0**
>
> - **Macrostructure** · Long Document
> - **Theme** · Linen (cool slate paper · steel-blue accent · geometric sans)
> - **Enrichment** · Tier-B hand-built SVG (a 60-line coffee bean with `@property --rise` 6 s breathing-loop)
> - **Sections** · Masthead · Letter · Three Notes · Visit · Colophon
> - **Motion** · breathing-loop on bean only (respects `prefers-reduced-motion`)
> - **Slop test** · 38 / 38 ✓
> - **Diversification** · first run for this project

*Bento Grid (SaaS, motion-on):*
> **Hallmark · v0.7.0**
>
> - **Macrostructure** · Bento Grid
> - **Theme** · Pastel (light cool paper · indigo accent · geometric Geist)
> - **Enrichment** · E1 Clipped-Edge Demo Video, Tier-A CSS-art trace waterfall
> - **Sections** · Hero · 6-tile Bento (stat · sparkline · quote · code · integrations · spotlight) · Index Footer
> - **Motion** · counter · pricing-lift · CSS marquee on integrations strip
> - **Slop test** · 38 / 38 ✓
> - **Diversification** · differs from Plain on paper hue (light-cool vs pure-white) + accent (indigo vs ink-blue)

*Manifesto (declarative, no enrichment):*
> **Hallmark · v0.7.0**
>
> - **Macrostructure** · Manifesto
> - **Theme** · Manifesto (dark · Inter Tight 900 · single red bleed)
> - **Enrichment** · none (typography only — voice carries the brand)
> - **Sections** · Masthead · Title · Five Declarations · Bleed Band · What We Refuse · Working Rules · Practice · Reading · Colophon
> - **Motion** · none — typography only
> - **Slop test** · 38 / 38 ✓
> - **Diversification** · differs from Linen on paper band (dark vs light) + display style (display-heavy vs geometric-sans)

*Custom (Coffeebox archival café):*
> **Hallmark · v0.7.0**
>
> - **Macrostructure** · Long Document
> - **Theme** · custom (vibe: "archival warmth, hand-set, no varnish" · paper oklch(94% 0.020 65) · accent oklch(58% 0.16 35) terracotta · Fraunces italic display + Source Serif 4 body)
> - **Enrichment** · Tier-A pure-CSS coffee bean (60-line SVG, breathing-loop optional)
> - **Sections** · Masthead · Letter · Three Notes · Visit · Colophon
> - **Motion** · breathing-loop on bean (with reduced-motion fallback)
> - **Slop test** · 38 / 38 ✓
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

### 7. The slop test

Before handing back, run the output through these thirty-eight questions. Every answer must be **no**. Run this BEFORE writing the Slop test row in the Step 5 preview block — that row reflects the actual outcome of this step.

**Visual:**

1. Is the display font Inter, Roboto, Open Sans, Poppins, Lato, or a system default?
2. Is there a purple-to-blue (or cyan-to-magenta) gradient anywhere?
3. Is there a 3-equal-column card grid with icon-above-heading tiles?
4. Is any card nested inside another card?
5. Is there a `background-clip: text` gradient headline?
6. Is any card using a thick coloured left/right side-stripe border?
7. Is the hero `min-height: 100vh` with everything centred?
8. Is pure `#000` or pure `#fff` used as a base colour anywhere?

**Structural:**

9. Does the page use the *same* structural fingerprint as the last page you built? (Hero → 3 features → CTA → footer is the AI structural template; reject it.)
10. Are sections separated only by equal whitespace, with no rule, no ornament, no colour shift — every section identical in rhythm?

**Microinteractions:**

11. Is `transition-all` (or `transition: all`) used anywhere? (Specify the properties.)
12. Is `hover:scale-105` (or any uniform hover-scale) applied across multiple unrelated elements?
13. Are bouncy / overshoot easings (`cubic-bezier(0.34, 1.56, ...)`, etc.) used on UI state changes — buttons, modals, tooltips? (Reserve overshoots for physical interactions only.)
14. Does any element have *more than one* hover effect at the same time (translate + scale + shadow + colour + rotate)?
15. Are you animating `width`, `height`, `top`, `left`, `margin`, or `padding` anywhere?
16. Does the focus ring transition into existence (fade in)? (Focus rings must appear instantly — keyboard users need an immediate indicator.)
17. Is there a celebratory success toast for an action whose effect the user can already see? (Silent success is taste; toasts are for failures and invisible effects.)
18. Are tooltip hover-delay and focus-delay equal? (Hover should delay 800–1000 ms; focus should be 0 ms.)
19. Is auto-rotating content (carousel, banner, stats) lacking pause-on-hover-and-focus? (WCAG 2.2.2.)
20. Is there a placeholder name "Jane Doe / John Smith" or a startup cliché (Acme, Nexus, Seamless, Unleash)?

**Variety:**

21. Is the `/* Hallmark · macrostructure: <name> · ... */` stamp missing from the top of the CSS? (It must be present.)
22. Is the macrostructure I picked the same as a previous Hallmark output's stamp in this project? (Read the file system; if a stamp exists, mine must differ.)
23. Did I default to the **Specimen** macrostructure (numbered left-margin labels + huge serif + asymmetric spans + typographic-only CTA) when the brief did not explicitly call for editorial / foundry / specimen energy? (Specimen fall-through is banned.)

**Implementation gates** (the rules that used to be advice; now they're checks):

24. Does any neutral / surface colour have `oklch(... 0 ...)` (zero chroma)? Pure greys read as flat. Tint every neutral toward the anchor hue — minimum 0.005 chroma.
25. Does the accent colour cover more than ~5 % of any single viewport (count by area: solid fills, large headings in accent, full-bleed accent backgrounds)? If yes, retreat — accent is for emphasis, not for filling.
26. Is any padding / gap / margin a value that isn't on the named spacing scale (`--space-3xs` … `--space-5xl`, multiples of 4 px)? Arbitrary `padding: 17px` is a tell.
27. Is any prose container's `max-width` outside the 45–75 ch range? Measure must read; under 45 ch is choppy, over 75 ch loses the eye.
28. Does any interactive element lack `:focus-visible`, `:active`, OR `:disabled` styling? (Eight states is the rule. Default + hover is two; you need at least default + hover + focus-visible + active + disabled present in code.)
29. Is there any `transform` / `animation` keyframe that is NOT covered by a `@media (prefers-reduced-motion: reduce)` fallback? Every motion gets a reduced-motion alternative.

**Hero enrichment gates** (when the page carries enrichment — see [`references/hero-enrichment.md`](references/hero-enrichment.md)):

30. If the page has a demo video, does it autoplay with sound, lack a `poster`, lack `fetchpriority="high"`, or use `loading="lazy"` on the LCP element? (LCP-killers fail this gate.)
31. If the page has an abstract background, is it more than one accent colour, more than ~5 % footprint, or animating mesh-gradient on the whole page? (Aurora blobs and mesh-on-everything fail this gate.)
32. Does the page mix two or more icon libraries? (Material + Heroicons + Lucide on the same page = the icon-set tell.)
33. If the page has illustration, did I default to a Lottie library when a hand-built SVG or pure-CSS shape would have worked? (Lottie is last resort, not the default.)

**Diversification gates** (cross-reference [`.hallmark/log.json`](#25-check-project-memory) when present):

34. If I used the same archetype as a previous Hallmark output (per `.hallmark/log.json` or the latest macrostructure stamp), did I pick at least one different *variation knob*? Two Bento Grids with `tiles=6, spans=irregular, accent=corner-only` are the same Bento — the within-archetype knobs in [`component-cookbook.md`](references/component-cookbook.md) exist precisely to prevent that. State the knob deltas in the stamp.
35. Does any visual-only `<svg>`, custom-art `<div>`, `<canvas>`, or decorative figure lack `aria-label` or `aria-hidden="true"`? Hand-built CSS art and SVG illustrations need an accessible name *or* an explicit hide. Skipping this is the new accessibility tell.

**Layout-safety gates** (the page must survive every viewport):

36. Does the page horizontally scroll on any viewport between 320 px and 1920 px? Open the rendered page; drag the dev-tools width slider across that range. If a horizontal scrollbar appears at any width, fail. The fix is `html { overflow-x: clip; }` plus `body { overflow-x: clip; }` as a safety net for any clipped-edge enrichment that pushes past the viewport. Use `overflow-x: clip` (not `hidden`) — `clip` preserves `position: sticky` and `position: fixed` on descendants. (Cross-reference: [`layout-and-space.md` § Page-edge clipping](references/layout-and-space.md).)
37. For every decorative effect on text — highlighter `<mark>` / `<em>` band / accent stroke / underline — did I visually confirm the position and size? A highlighter band must sit behind the x-height (`linear-gradient(180deg, transparent ~38%, accent ~38%, accent ~92%, transparent ~92%)`), **not** at the baseline (which reads as a fat underline). Underlines must be 1–2 px and offset 1–2 px from the baseline, never 5+ px. Decorative strokes must not exceed 5 % of the viewport (gate 25). The check is *visual*: imagine the rendered output and confirm the band lands in the right vertical zone.
38. Are interactive bars (nav, toolbar, command bar, hero CTA row, footer link strip) explicitly vertically centered? Default flex layouts inherit `align-items: stretch`, which makes a button taller than its sibling text and breaks the visual baseline. Every flex row mixing height-different elements (button + text, icon + text, mark + body) must declare `align-items: center` and `line-height: 1` on the items with intrinsic height. Inheriting `line-height: 1.55` from `html` fights the row's vertical rhythm.

If any answer is yes, fix it. Do not ship slop.

---

## `hallmark audit`

Read the file(s) the user pointed at. For each finding, return:

- **Tell** — the named anti-pattern from `anti-patterns.md`.
- **Where** — file path and line range.
- **Severity** — `critical` (ships as slop), `major` (looks AI-generated), `minor` (small taste issue).
- **Fix** — one-line concrete correction.

Group by severity. Do not edit. Do not redesign. End with a count: `N critical · M major · K minor`.

Audit *also* checks structural fingerprint: if the page uses the AI template (centered hero, 3 equal feature cards, CTA, footer, with no asymmetry or surprise), flag it as a critical structural finding even if the visual treatment is fine.

**Stamp-vs-page check.** If the audited file contains a `/* Hallmark · macrostructure: <name> · ... */` stamp, verify the page actually matches that name. If the stamp says **Bento Grid** but the page is a centered single-column hero with a CTA, flag it as a critical structural finding: `stamp lies` — the stamp must reflect what shipped or be removed. This catches drift where a previous Hallmark run stamped one thing and a later edit pulled the page back toward the AI template.

---

## `hallmark refine`

The user has code they are happy with structurally but wants polished. Your job is to apply the ruleset with the smallest possible diff.

- Do not move or rename elements unless necessary.
- Do not restructure the DOM.
- Do swap fonts, rewrite colour tokens to OKLCH, tighten the type scale, correct easings, add missing states, fix any flagged anti-patterns.
- At the end, list what you changed and which reference file prompted each change.

---

## `hallmark redesign`

The user wants a different page from the same content. They are not happy with the current structure — typically because it reads as templated, generic, or AI-shaped. Your job is to throw the structure out and build a new one.

**What to preserve:**
- The copy (every word, ideally)
- The information architecture (which sections exist, in roughly what order)
- The brand (colours and fonts they've named, if any)
- The primary action

**What to replace:**
- The structural fingerprint — pick a **different** combination from `structure.md` than the source had.
- The component voice — different button style, different divider language, different image treatment.
- The reveal pattern — if the original faded everything in on scroll, the new one might have no reveals at all.
- The visual rhythm — different sections having different padding, different alignments, deliberate breaks.

**Optional `--mood <name>` argument:**

If the user specifies a mood (`hallmark redesign ./hero.tsx --mood luxury`), pick a tone aligned to that mood and let it drive the structural fingerprint. Mood names map to tones from `references/typography.md` and `references/structure.md`. If no mood is given, ask the user what *feeling* they want — one word — and proceed.

**Output:**

Return the redesigned code, plus a short note explaining:

- The structural fingerprint you picked, axis by axis.
- Why this combination fits the brief better than the original.
- One thing you removed and why.

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

## Output contract

When producing new work:

- Put design tokens in one place at the top of the stylesheet (`:root` custom properties) or in a `tokens.css` / `tokens.ts` file if the project uses one.
- Name tokens by semantic role, not value. `--color-ink`, not `--color-black`.
- If the project uses Tailwind, extend the theme; do not inline arbitrary values across components.
- If the project uses a framework, match the framework's file conventions — don't reinvent them.
- Include a short comment block at the top of the stylesheet naming the tone the user picked, the palette's anchor hue, and the structural fingerprint. This is the only comment you need.

---

## Scope and limits

Hallmark is a *taste* skill. It will not:

- Invent product copy. If the user hasn't given you the words, ask.
- Pick a brand identity. It will follow one you give it.
- Enforce a specific style (dark mode, glassmorphism, brutalism). It will execute whichever tone the user committed to.
- Build logic — state management, data fetching, business rules. It is a visual / interaction layer only.

If a request falls outside taste — "build the auth flow", "wire up Stripe" — do the work, but apply Hallmark to the rendered surface.

---

## Credits

Built on the research and open work of [impeccable](https://github.com/pbakaus/impeccable) (Paul Bakaus), [kami](https://github.com/tw93/kami) (tw93), [taste-skill](https://github.com/Leonxlnx/taste-skill) (Leonxlnx), Anthropic's [frontend-design skill](https://github.com/anthropics/skills) and [canvas-design skill](https://github.com/anthropics/skills), [DESIGN.md](https://getdesign.md) (Google Stitch), MC Dean's [63 design skills collection](https://marieclairedean.substack.com/p/i-built-63-design-skills-for-claude), the [Slopless](https://slopless.design) tactile-rebellion canon, and the Claude [frontend aesthetics cookbook](https://platform.claude.com/cookbook/coding-prompting-for-frontend-aesthetics). Where rules overlapped across those sources, Hallmark adopted them. Where they diverged, Hallmark picked.

MIT licensed. Powered by Together AI.
