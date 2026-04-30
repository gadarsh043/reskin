# Recipes — copy-paste prompts that ship Hallmark output

Eight worked briefs you can paste into Claude Code, Cursor, or Codex with the Hallmark skill installed. Each shows the prompt verbatim, the audience/use/tone the skill inferred, the macrostructure + theme + enrichment it picked, and a one-paragraph excerpt of the output. Live page links are included where the test exists in [`site/_tests/`](../../site/_tests/).

The first recipe is the **canonical try-it prompt** — paste it into a fresh project to verify the skill is installed and discover the flow before reading anything else.

---

## 00 · Try it · Coffeebox

**Prompt** (copy/paste verbatim):

> *"Build me a landing page for Coffeebox — a small-batch coffee subscription. Roast on Sunday, ship on Monday, drink Tuesday. Audience: people who already buy good coffee and want fewer trips to the shop. Tone: warm, hand-set, editorial — like a small café's chalkboard."*

**Inferred trio:** explicit (audience: serious-coffee buyers · use: subscribe · tone: editorial-warm).

**Picks:** Long Document · **Linen** (warm-paper roman-serif) · Tier-B hand-built SVG (a small coffee-bean icon, optional).

**Excerpt of the output:**

> *"Coffeebox · est. 2026 · n.º 12.* The first roast leaves the drum at 6:14 a.m. Sunday. By Monday morning it's in a paper bag in your post box. By Tuesday the kitchen smells like a café. Subscribe, skip a week, change the roast — all from the email. We bake what we baked yesterday. We ship what shipped well. We answer the email ourselves."

**Why this is the canonical try-it:** the brief has explicit context (no design-context-gate friction), an editorial tone (different from any AI-default landing page), and a domain (coffee subscription) that has zero overlap with SaaS/dev-tool clichés. If Hallmark produces *Linen-with-italic-Cormorant-and-warm-paper* for this prompt, the skill is wired correctly.

---

## 01 · Tide · Indie podcast

**Prompt:**

> *"Design a landing page for Tide — an indie podcast about long-form interviews with small-studio designers. Just go ahead, pick the rest yourself."*

**Inferred trio** (the user opted out): audience = designers, design-curious listeners · use = listen + subscribe · tone = quiet editorial.

**Picks:** Quote-Led · **Atelier** (warm cream, italic Newsreader) · no enrichment (typography only).

**Excerpt:**

> *"A page should arrive like a person — composed, deliberate, in good clothes." — from the salon.* The hero is the pull-quote. The page below: episode list, host bio, RSS feed. No mockups. No demo. The voice carries the brand.

**Live:** [`_tests/01-tide-podcast/`](../../site/_tests/01-tide-podcast/index.html)

---

## 02 · Streampipe · Open-source CLI

**Prompt:**

> *"Build me a landing page for Streampipe — a small, fast, single-binary CLI for parsing log and event streams from stdin. Filter, transform, route. Composes with anything that emits lines. Audience: developers. Use: install + read docs. Tone: technical. Use the Terminal theme."*

**Inferred trio:** explicit. **Theme requested.**

**Picks:** Workbench · **Terminal** (dark phosphor-green, mono everywhere) · Tier-A hand-built CSS-art terminal mockup (no Lottie, no real video).

**Excerpt:**

> *"$ streampipe --help.* A small, fast, single-binary CLI for parsing log and event streams from stdin. Filter, transform, route. Composes with anything that emits lines.* Then three install snippets in a phosphor-green code block: brew · npm · curl. To the right, a hand-built CSS-art terminal showing `streampipe parse access.log --filter status=5xx` with sample JSON output. Pure CSS, no scripts.

**Live:** [`_tests/02-streampipe-cli/`](../../site/_tests/02-streampipe-cli/index.html)

---

## 03 · Maple Street Bread · Artisan bakery

**Prompt:**

> *"Build a landing page for Maple Street Bread — a small artisan bakery in Lisbon. Sourdough, slow, by hand. We open at seven, thirty loaves, gone by noon, no online orders. Audience: locals. Use: see what we bake, find us. Tone: warm, hand-set."*

**Inferred trio:** explicit.

**Picks:** Long Document · **Linen** (warm-paper, geometric-sans display, low-chroma) · Tier-B hand-built SVG (a 60-line loaf with a `@property --rise` 6 s breathing-loop animation).

**Excerpt:**

> *"Maple Street · est. 2026 · n.º 47.* Saturday, 6:14 a.m. The dough went in at midnight. By the time the lights are on outside, the bench is dusted, the loaves are scored, and the oven is hotter than a summer roof.* Drop-cap "T" on the lede. Loaves list with prices in a margin-aligned column. Visit-and-hours in a colophon at the bottom. No CTA — the brief is "find us," not "convert."

**Live:** [`_tests/03-maple-bakery/`](../../site/_tests/03-maple-bakery/index.html)

---

## 04 · Meridian · Studio manifesto

**Prompt:**

> *"A studio manifesto for Meridian — a small environmental-products design practice in Lisbon. Declarative, no flashy stuff."*

**Inferred trio** (partial): audience = practice peers + clients · use = read it + sign on or move on · tone = declarative editorial.

**Picks:** Manifesto · **Manifesto** (dark, Inter Tight 900 display, single red accent band) · no enrichment.

**Excerpt:**

> *"WE ARE A STUDIO. WE ARE NOT A PLATFORM."* Then five numbered declarations, a bleed-colour band between III and IV ("This is not a roadmap. This is what we believe before we open the laptops."), then four supporting sections: § What we refuse (anti-list with strikethrough) · § Working rules (numbered ops) · § The practice (3-paragraph narrative with drop-cap) · § What we read (annotated bibliography).

**Live:** [`_tests/04-meridian-manifesto/`](../../site/_tests/04-meridian-manifesto/index.html)

---

## 05 · Tracejam · SaaS observability

**Prompt:**

> *"Build me a landing page for Tracejam — a tracing/observability tool for distributed systems. Audience: SREs and platform engineers. Use case: try it / contact sales. Tone: technical."*

**Inferred trio:** explicit.

**Picks:** Bento Grid · **Pastel** (light-cool paper, geometric Geist sans, low-chroma indigo accent) · Tier-A hand-built CSS-art trace waterfall (the right-clipped browser-frame mockup that pushes 12 vw past the viewport edge).

**Excerpt:**

> *"Tracejam · v0.4 · for SREs. Distributed tracing that explains itself.* Open the trace, find the span that regressed, and read why — in plain text — without a glossary, a YAML diff, or a status-page hunt.* Hero left-aligned with two CTAs (Try it free / Talk to sales). To the right, a clipped browser-frame mockup containing a hand-built CSS-art flame chart. Below the hero, a 6-tile Bento with stat / sparkline / pull-quote / code snippet / integrations list / spotlight.

**Live:** [`_tests/05-tracejam-saas/`](../../site/_tests/05-tracejam-saas/index.html)

---

## 06 · Anya · Personal one-pager

**Prompt:**

> *"Personal site for Anya — software architect in Lisbon. Don't ask, just figure it out."*

**Inferred trio** (the user opted out): audience = engineering hiring managers · use = read who I am, see my work · tone = austere, italic-editorial.

**Picks:** Long Document · **Studio** (cool grey paper, italic Fraunces display, forest-green accent) · no enrichment.

**Excerpt:**

> *"Hello, I'm Anya."* (with a green highlighter mark behind "Anya"). I help engineering organisations ship hard distributed-systems work — multi-region rollouts, payment graphs, eventually-consistent ledgers — without breaking the people doing the shipping.* Tabular work-sheet below: years per company, stripe-monzo-and-a-small-infra-startup-that-didn't-survive-2023.

**Live:** [`_tests/06-anya-portfolio/`](../../site/_tests/06-anya-portfolio/index.html)

---

## 07 · Foundry · Compliance SaaS

**Prompt:**

> *"Build me a landing page for Foundry — SOC 2 and ISO 27001 compliance automation for B2B SaaS. Show: how many companies got compliant, what it costs, who uses it. Audience: founders + CTOs. Tone: technical but trustworthy."*

**Inferred trio:** explicit.

**Picks:** Stat-Led · **Plain** (pure-white paper #ffffff, near-neutral cool greys, deep ink-blue accent, Inter Tight display-heavy + Bricolage Grotesque wordmark) · no enrichment.

**Excerpt:**

> *"847.* companies passed audit using Foundry. Average time to compliant: thirty-one days, against an industry average of nine months." — the "847" sized at 22 rem display, animated counting from 0 over 1.4 s on first viewport entry. Below: customer logo wall (8 monochrome wordmarks), three supporting stats, four feature cards, three pull-quote testimonials with role + company, three pricing tiers (Starter $299/mo · Team $899/mo recommended · Scale custom), eight-question conversational FAQ, single-line final CTA, four-column index footer.

**Live:** [`_tests/07-foundry-compliance/`](../../site/_tests/07-foundry-compliance/index.html)

---

## 08 · Cohort · Cohort-based courses

**Prompt:**

> *"Build a landing page for Cohort — the platform for cohort-based courses. Run live courses with 30 to 500 students. Built for educators, not LMS sales teams. Audience: course operators + indie creators. Tone: warm, salon-room, editorial."*

**Inferred trio:** explicit.

**Picks:** Marquee Hero · **Salon** (warm-cream paper, IBM Plex Mono display + Cormorant Garamond serif, warm-amber accent, centered emphasis) · Tier-A continuous CSS marquee (course titles + instructor names scrolling at 50 s, pauses on hover, stops on prefers-reduced-motion).

**Excerpt:**

> Marquee band scrolling across the top: *"Build a SaaS in 30 days · Sahil Lavingia · Writing Strong · David Perell · Notion for Operators · Marie Poulin..."* Below: *"Cohort runs live courses the way your favourite teacher would — with a date, a roster, and a room."* Two CTAs (Run your first cohort / 90-second tour). Then alternating-side feature rows with hand-built CSS card-stack / hours-grid / thread / report visuals. Two-tier pricing. Six-question FAQ. Centered Salon footer.

**Live:** [`_tests/08-cohort-courses/`](../../site/_tests/08-cohort-courses/index.html)

---

## How the recipes are organised

Every recipe shares the same four lines so you can scan a brief and immediately see *which combination Hallmark picks for what*:

1. **Prompt** — verbatim, copy/paste-ready.
2. **Inferred trio** — what the design-context-gate produces (audience · use · tone). Marked `explicit` if the user provided all three; `the user opted out` if not.
3. **Picks** — macrostructure · theme · enrichment archetype.
4. **Excerpt** — one paragraph of the produced copy or layout, so you can verify the output matches the brief without running the skill yet.

When generating something new, look for the closest match in this file and **note what's different** between your brief and the recipe. The macrostructure pick is usually inherited; the theme often shifts (per the diversification rule); enrichment may change tier.

## What the recipes are *not*

- Not templates. Hallmark's whole point is structural variety — duplicating a recipe verbatim is the **Specimen-fall-through** anti-pattern (gate 23 in [`SKILL.md`](../SKILL.md)).
- Not fixed picks. Two consecutive runs of recipe 00 (Coffeebox) on the same project should produce *different* macrostructures or themes — the [`.hallmark/log.json`](../SKILL.md) project memory enforces this.
- Not exhaustive. The 21 macrostructures × 16 themes × 8 enrichment archetypes = 2,688 distinct fingerprints. The 9 recipes here are a starter set; the next 50 are yours to discover.
