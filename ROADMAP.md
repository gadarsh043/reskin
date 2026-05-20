# Roadmap

What's next. Ordered loosely by impact, not committed timelines.

---

## Now

**Tighten the 22-theme catalog.** A handful of themes (Plain, Specimen, Salon, Linen) bleed into each other on first read — same paper-band, similar accent footprint, similar display role. Audit each theme's three diversification axes (paper-band / display-style / accent-hue), pull overlapping pairs apart, and add 4–6 new themes in underserved corners (mid-band warm chromatic, dark-monochrome editorial, high-contrast print-poster, warm dark with handwritten accent). Each new theme ships with its own tokens block and stamp axis.

**Nanobanana hook for image-heavy briefs.** Today the integration is recommend-only — Hallmark tells the user to go generate something and bring it back. Image-heavy briefs (e-commerce, travel, food, lookbook) route to typography-only and feel underserved. Add a first-class hook that writes a prompt, invokes the API, ingests the returned image, and wires it into the build (cache by prompt hash). Pair with a new image-led theme (working title *Plate*) tuned for full-bleed photographic compositions.

---

## Next

**Theme-aware motion tokens.** Per-theme `--dur-micro` / `--dur-short` / `--dur-long`, scaled by the table already in [`microinteractions.md`](references/microinteractions.md). Atelier should feel slower than Brutal; today they share durations. One pass through the tokens file.

**`hallmark variant`** — produce three structurally distinct versions of the same brief side-by-side; the user picks one or asks for a fourth. The biggest cause of "AI feel" is users accepting the first output because they didn't know it could be different.

**Structural cookbook.** [`structure.md`](references/structure.md) catalogues the *axes* of variety but doesn't show what a left-margin-headed, hairline-divided, no-image page actually looks like assembled. Twelve to twenty worked fingerprints with short HTML/CSS sketches — patterns are easier to reach for than principles.

**Tactile-rebellion reference.** Controlled imperfection — handmade textures, hand-drawn SVG paths, controlled-jitter typography (a 0.5° tilt on one mark is taste; on every word it's chaos). Where the field is going.

**Data-viz canon.** Tufte-leaning charts: small multiples, restrained colour, banned types (3D donut, dual-axis line, rainbow categorical). Dashboards are half data viz; AI-generated charts are especially bad.

**Multi-page coherence.** The structural-variety rule is correct for variety, wrong for brand consistency inside a multi-page product. Lock the brand axes (type, colour, divider language); vary the page-voice axes (heading placement, body composition, button voice). Different *pages* of the same site, not different *sites*.

**`hallmark extract`** — read an existing codebase, identify tokens + structural fingerprint, emit a `design.md` to hand to other agents or back to Hallmark. Most users come with an existing codebase, not a greenfield brief.

---

## Later

- **`hallmark explain`** — narrate the choices axis by axis. The skill teaches; users start making the same calls themselves.
- **Negative-capability rules** — for each anti-pattern, the perceptual or cognitive reason it fails. Understanding it beats knowing it.
- **Emotion-first prompting** — *nostalgic · optimistic · sceptical* instead of *editorial · brutalist · austere*. Today's tone words don't reach.
- **Sound + haptic policy** — when web sound is acceptable (gaming, accessibility-augmenting) without crossing into kitsch.
- **Live preview as an MCP server** — watch the file, render in a sandbox, screenshot, feed the screenshot back for self-critique against the slop test. Closes the loop between generation and audit.

---

## Won't do

- **A fifth verb** before the existing four are battle-tested. Comprehensibility beats surface area.
- **More themes than the catalog can hold.** If anything, cut underperforming ones.
- **A UI library.** Hallmark is a taste skill, not a component kit. shadcn/ui and Geist exist; point users there.
- **A Figma plugin.** The skill works in code; that's a feature.
- **URL scraping on the default verb.** Brand-match by URL is somebody else's job. `study` accepts URLs read-only, with refusal heuristics.
- **Image generation as a core feature.** Out of scope. "Use real photos" or "no image" is usually the right answer. (The Nanobanana hook above is a thin integration, not a generation pipeline.)
