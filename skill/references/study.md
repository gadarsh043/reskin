# Study — extracting design DNA from a screenshot

This file is loaded when the `hallmark study` verb runs. It defines the protocol for reading a screenshot the user attached, naming what makes it work, and producing a *diagnosis report* the user can accept or amend before any code is built.

**The promise.** `study` extracts the **DNA** of a design — its macrostructure, its component archetypes, its type-pairing role, its colour anchor, its rhythm — and lets the user apply that DNA to their own content. It does not copy pixels. It does not claim to identify exact fonts. It does not output a façade of the source.

**The mental model.** A designer who likes a reference site does not photocopy it. They look at it long enough to say "ah — that's a Marquee Hero with a single column body, italic-editorial display paired with monospace labels, anchored on a desaturated forest green at maybe 3 % footprint, with hairline rules and one orchestrated entrance." Then they go build something *different* with the same skeleton. That sentence is what `study` outputs. The build is what `default` or `redesign` does after.

---

## Refusal — when not to study

Run this check **before** extracting anything. If any of the following is true, refuse politely and offer an alternative.

| If the screenshot is… | Then… |
| --- | --- |
| A paid template marketplace listing (ThemeForest, Gumroad templates, Webflow templates, Framer templates, Notion templates) | Refuse. Suggest: "Tell me what you like about it and I'll build with `hallmark default` instead." |
| A live competitor's marketing page where the user's intent is replication | Refuse. Suggest: "I can extract the structural pattern but won't reproduce a competitor's surface. Would the pattern alone be useful?" |
| A famous designer's signature work (Pentagram project pages, Klim foundry specimens, Mathieu Triay's portfolio, etc.) being treated as a template | Soft-refuse. Acknowledge the source by name, extract DNA only, and refuse to copy distinctive choices that read as that designer's signature. |
| Copyrighted artwork, photography, or illustrations as the design's centerpiece | Refuse to reproduce the artwork. The DNA can still be extracted (the *fact* that the page uses one big image as its hero is structural; the specific image is not). |
| A user's own previous work | Proceed. |
| A public reference site the user is using for inspiration on their own brand | Proceed. State the source if known. |
| Anything ambiguous | **Ask once:** *"Is this your own work, a public reference, or someone else's live site? If it's a competitor or a marketplace template, I'll skip the build and just give you the diagnosis."* |

**Never** silently proceed when you suspect the screenshot is a marketplace listing or a competitor. The user must explicitly confirm. The cost of asking is low; the cost of building a knockoff is reputational.

---

## The five-step protocol

Read the screenshot in this order. Each step builds on the previous; do not skip ahead.

### Step 1 — Surface

Before reading any text, look at the page's *colour temperament*.

- **Paper lightness band.** Is the background dark (L < 30 %), light (L > 85 %), or mid (between)? You don't need an exact value — pick a band.
- **Paper hue.** Does the background tilt warm (yellow/orange/red, hue 30–90), cool (blue/indigo, 220–290), neutral-warm (slight 60–80), neutral-cool (slight 240–270), or chromatic (clearly purple/green/etc.)?
- **Anchor accent hue.** What single colour appears as accent — links, marks, buttons, small flourishes? Estimate the hue band: warm-red (10–30), orange (40–60), yellow (80–110), green (130–160), teal (180–210), cyan-blue (210–240), indigo (260–290), magenta (300–340), neutral (no chromatic accent — just ink-on-paper).
- **Accent footprint.** Is the accent a small mark (≤ 5 % of viewport), a recurring underline (5–15 %), or a flood (large blocks, > 15 %)? This dictates how loud the page is.
- **Distinctive treatments.** Off-register text-shadow (riso), grain overlay, glassmorphism, dark-mode-with-lightness-elevation, paper texture? Note them.

### Step 2 — Type

Read the type *roles*, not the typeface names. You will be wrong if you guess a typeface from a screenshot — even your best guess is unreliable. Name what each face is *doing*.

- **Display role.** What is carrying the headline? Pick from: *italic editorial serif · roman editorial serif · heavy condensed sans · soft geometric sans · expressive variable sans · monospace · pixel · ornamental script*.
- **Body role.** What is carrying the prose? *roman serif · italic serif · neutral grotesque · soft geometric sans · monospace*.
- **Label role.** What is carrying eyebrows, captions, micro-labels? *small-caps serif · monospace · uppercase grotesque · italic body · none (no labels visible)*.
- **Pairing logic.** Same family with weight/italic split, or two different families? If two, what's the contrast — *editorial serif + grotesque body, mono labels* (the modern editorial agency look), or *condensed display + body sans + mono labels* (technical), etc.?
- **Display weight.** Light (≤ 300), regular (400–500), heavy (700+), extra-bold (800+).

Do not write "this is Söhne" or "this is Inter". Write "this is a neutral grotesque body".

### Step 3 — Structure

Match the page to one of the twenty-one named macrostructures in [`macrostructures.md`](macrostructures.md). Pick the *closest*; if it's between two, name both and say which it leans toward.

For each section visible in the screenshot, also pick an archetype from [`component-cookbook.md`](component-cookbook.md):

- **Hero** → H1–H6 (or F6 for product-led pages).
- **Pitch / first content block** → F1–F5 (or F6 for catalogue).
- **Testimonial / proof** (if visible) → T1–T4.
- **Footer** → Ft1–Ft4.

For each archetype, also pick **variation knobs** from the cookbook's variation-knob table. *"H2 Split Diptych · ratio=7/5 · right-side=proof column · divider=hairline."* The knobs are what distinguishes one Bento from another; capturing them is what makes the diagnosis useful.

### Step 4 — Motion

If the screenshot is static, skip this section but note: *"motion not visible in static capture — assuming default reveals."*

If the screenshot is animated (a GIF, a recorded screen, or the user describes the motion in text):

- **Reveal pattern.** None · fade-up stagger · horizontal sweep · type-unmask · number-tick · typewriter.
- **Easing voice.** Conservative (ease-out exponential) · physical (slight overshoot, drag-release) · none.
- **Microinteraction tells.** Bouncy hovers, transition-all, hover-scale on cards, gradient hover sweeps — flag any. These are anti-patterns to *not* carry forward.

### Step 5 — Rhythm

The hardest one. Look at the *density and pacing*:

- **Section padding rhythm.** Equal across sections (templated) or varied (intentional)?
- **Heading-to-body ratio.** Short heading + long body (editorial) · long heading + short body (declarative) · roughly equal (technical / utilitarian)?
- **Negative space discipline.** Generous (luxury / atelier / specimen) · medium (modern editorial) · dense (newsprint / catalogue / index)?
- **Asymmetry.** Centred symmetric (formal, Apple-product-page energy) · left-biased (editorial) · right-biased (rare, atelier-like) · asymmetric grid spans (specimen, bento)?

---

## The structured fields

After the five-step pass, fill out this schema. The diagnosis report is built from it.

```
{
  "source":            "user-described | public-reference | unknown",
  "refusal":           "ok | refused (paid-template) | refused (competitor) | soft-refusal (signature work)",
  "macrostructure":    "<name from macrostructures.md>",
  "macrostructure_alt":"<second-closest, if it leans>",
  "hero": {
    "archetype":       "H1-Marquee | H2-Split | H3-Quote-Led | H4-Stat-Led | H5-Letter | H6-Photographic | F6-Product-grid",
    "knobs": { "<knob A>": "<value>", "<knob B>": "<value>" }
  },
  "pitch":             { "archetype": "...", "knobs": { ... } },
  "footer":            { "archetype": "...", "knobs": { ... } },
  "display_role":      "italic editorial serif | heavy condensed sans | ...",
  "body_role":         "neutral grotesque | italic serif | ...",
  "label_role":        "monospace | small-caps serif | uppercase grotesque | none",
  "pairing_logic":     "single family / two families / three families",
  "paper_band":        "dark <30 | mid 30-85 | light >85",
  "paper_hue":         "warm | cool | neutral-warm | neutral-cool | chromatic-<hue>",
  "accent_hue_band":   "warm-red | orange | yellow | green | teal | cyan-blue | indigo | magenta | neutral",
  "accent_footprint":  "small ≤5% | recurring 5-15% | flood >15%",
  "density":           "generous | medium | dense",
  "asymmetry":         "centred | left-biased | right-biased | asymmetric-grid",
  "treatments":        ["riso", "grain-overlay", "glassmorphism", "dark-elevation-lightness", "..."],
  "reveal":            "none | fade-up | sweep | type-unmask | number-tick | typewriter | (not-visible)",
  "anti_patterns":     ["bouncy hover", "transition-all", "..."]
}
```

Every field is required (no nulls; if a field is genuinely unknowable from the image, write `"unknown"`). The schema is the contract; the diagnosis report is the human-readable rendering of it.

---

## Theme mapping

After the schema is filled, map the source to one of Hallmark's named themes — but **only as a candidate**. The user may pick a different theme for their build.

| If the schema looks like… | Suggest theme |
| --- | --- |
| `display_role: italic editorial serif`, `body_role: neutral grotesque`, `paper_band: light`, `accent: green` | **Studio** |
| `display_role: roman editorial serif`, `paper_hue: warm`, `density: medium`, `treatments: hairline rules` | **Specimen** |
| `paper_band: dark`, `accent: indigo`, `display: condensed/heavy` | **Midnight** |
| `paper_band: dark`, `font: mono throughout`, `treatments: phosphor green or amber` | **Terminal** |
| `paper_hue: warm-pink`, `treatments: riso / grain / off-register`, `display: heavy lowercase` | **Riso** |
| `paper_hue: cool-lavender`, `display: soft geometric sans`, `accent: low-chroma indigo` | **Pastel** |
| `paper_band: light`, `display: heavy black sans`, `accent: red flood` | **Brutal** |
| `paper_band: dark`, `display: heavy uppercase`, `accent: red flood` | **Manifesto** |
| `paper_hue: cool`, `density: dense`, `body: 2-3 column justified` | **Newsprint** |
| `paper_hue: warm`, `density: generous`, `display: ornamental serif`, `dividers: fleuron` | **Salon** |
| `paper_hue: warm`, `density: medium`, `display: roman serif`, `body: italic serif` | **Linen** |
| `paper_band: light cool`, `font: mono labels`, `density: dense`, `tabular numbers` | **Almanac** |
| `display: italic display`, `accent: red`, `tabular numbers`, `motion: horizontal sweep` | **Sport** |
| `display: ornamental script`, `paper: cream`, `density: medium-generous` | **Garden** |
| Anything else | **Specimen** *(only if the brief is editorial)* — otherwise propose one of the eight that's closest by *paper hue + display role*, and note the mismatch. |

If two themes are equally close, pick whichever is more *categorically distant* from any previous Hallmark output for this user (read the existing CSS for a `/* Hallmark · macrostructure: ... */` stamp and avoid that theme's family).

---

## The diagnosis report

After the schema and the theme map, produce a one-page report in this shape. Keep it short — about ten sentences. The user reads this *before* approving any code.

```
You sent me a [macrostructure name].

The hero is an [archetype name] with [knob values]. The pitch below it is
an [archetype]. The footer is an [archetype].

The type pairing is [display role] with [body role][, labels in <label role>].
I won't try to identify exact typefaces from a screenshot — fonts to consider:
[1–2 candidates from the canon].

The surface is [paper band, hue]. The accent is [hue band] used at
[footprint]. Density reads as [density]; the page is [asymmetry].

Distinctive treatments I noticed: [list, or "none beyond the basics"].

Anti-patterns I'd skip: [list anything from anti-patterns.md visible in
the screenshot — bouncy hovers, transition-all, three-feature grid, etc.
If there are none, say so.]

If you adopt this DNA, the closest theme in the catalog is [theme name].
That's a candidate, not a requirement — your content might point elsewhere.

Want me to build with this DNA, or change one axis first?
```

The last line is the **confirmation question**. Wait for the user before building.

---

## Worked example

**Screenshot:** the user pastes a capture of a fictional "studio.example" page — a beige cream background, a single italic display headline reading *"A studio for the patient."* set in 7rem italic, with a single right-aligned column of three captioned project thumbnails on the right side of the fold, and a 4-column index footer at the bottom with monospace category labels and serif body links.

**Schema** (filled by the model after a vision pass):

```
{
  "source": "user-described",
  "refusal": "ok",
  "macrostructure": "Split Studio",
  "macrostructure_alt": null,
  "hero": {
    "archetype": "H2-Split",
    "knobs": { "ratio": "6/6", "right side": "proof column", "divider": "negative space" }
  },
  "pitch": null,
  "footer": {
    "archetype": "Ft3-Index columns",
    "knobs": { "columns": "4", "heading style": "monospace", "bullet": "none" }
  },
  "display_role": "italic editorial serif",
  "body_role": "neutral grotesque",
  "label_role": "monospace",
  "pairing_logic": "two families",
  "paper_band": "light >85",
  "paper_hue": "warm",
  "accent_hue_band": "neutral",
  "accent_footprint": "small ≤5%",
  "density": "generous",
  "asymmetry": "split-equal",
  "treatments": [],
  "reveal": "(not-visible)",
  "anti_patterns": []
}
```

**Diagnosis returned to user:**

> You sent me a Split Studio.
>
> The hero is an H2 Split Diptych at a 6/6 ratio — italic display on the left, a column of three captioned projects on the right, divided by negative space rather than a rule. The pitch slot is empty in your capture; I can fill it or leave it. The footer is an Ft3 four-column Index with monospace category headings and roman link rows.
>
> The type pairing is italic editorial serif with neutral grotesque body, monospace for labels. I won't guess the exact serif from a screenshot — fonts to consider: **Instrument Serif** (free, 2026's most-used italic display) or **Tobias** (paid). For body and labels: **Geist** + **Geist Mono**.
>
> The surface is warm cream, paper L roughly 95 %. The accent is neutral — no chromatic colour beyond ink-on-paper, which is why the page reads composed rather than excited. Density is generous; the page is asymmetric-balanced (split equal but content is right-weighted).
>
> Distinctive treatments: none beyond the basics — that's the point. Restraint is the design.
>
> Anti-patterns I'd skip: nothing from this screenshot stands out as carry-over risk. The reference is clean.
>
> If you adopt this DNA, the closest theme in the catalog is **Studio** (Instrument Serif italic display + Geist body + forest-green accent). Note: the screenshot's accent is neutral; Studio uses a small green mark — if you want neutral, I can desaturate the accent in the build.
>
> Want me to build with this DNA, or change one axis first?

**If the user says "build it":** the skill picks **Studio**, picks **H2-Split** for the hero, fills the pitch with content from the user's brief (a feature/proof block — F4 Step sequence, say), keeps the Ft3 footer, stamps:

```css
/* Hallmark · macrostructure: Split Studio · H2 hero knobs: ratio=6/6, right=proof, divider=negative-space
 * Ft3 footer knobs: cols=4, heading=mono · theme: Studio · accent: neutral (override from default green)
 * studied: yes · DNA-source: user reference (described as own work)
 */
```

**If the user says "change the macrostructure":** offer two alternatives from the same family — say, Bento Grid (modular feature-led) or Long Document (prose-led). Whichever the user picks becomes the new macrostructure; the rest of the DNA carries.

---

## Limits and disclaimers

State these to the user when returning the diagnosis. Do not bury them.

1. **Fonts cannot be identified from screenshots reliably.** Even with What The Font, FontInDetail, or vision-LM guesses, the output is wrong roughly half the time on custom or modified faces. Hallmark names *roles* and proposes 1–2 candidates from its canon. The user owns the final call.
2. **Imagery is never copied.** The skill's build replaces the screenshot's photography with structurally-equivalent placeholders. If the user wants real assets, they provide them.
3. **Theme drift is allowed.** The user's content might point to a different theme than the screenshot's surface implies. The DNA is the macrostructure + archetype tuple + colour-anchor band + type-pairing role. The dress (specific typeface, specific accent hex) can change.
4. **One screenshot, one diagnosis.** Do not let the user paste five screenshots and ask for a "blend". Pick one as the primary reference; the others can inform individual axis choices but the DNA backbone comes from one source. Five blended references is how you produce template-soup.
5. **No surprise edits.** The diagnosis is for the user to accept. Do not write code in the same turn as the diagnosis. Wait for confirmation.

If any limit is being violated, say so plainly in the diagnosis report — *"I can't reliably identify this typeface; here are two candidates I'm guessing at"* — and let the user redirect.

---

## When `study` should hand off

`study` is the diagnosis verb. It is not for fresh builds and not for refining existing pages.

- If after the diagnosis the user says *"now build me the same kind of page for my brand"*: hand off to the **default** verb with the schema filled in as inferred design-context, and build per the standard flow — but with the studied DNA stamped.
- If the user says *"now refactor my existing site to match this DNA"*: hand off to **`hallmark redesign`** with the schema attached. Redesign preserves the user's content; study supplied the new shape.
- If the user only wanted the diagnosis and is satisfied: stop. The diagnosis report is a complete deliverable on its own.

Do not chain verbs without the user's explicit go-ahead. The diagnosis is the contract; the build is a separate decision.
