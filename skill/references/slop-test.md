# Slop test — 50 gates

Run this list before handing back any output. Every answer must be **no**. Update the Step 5 preview block's `Slop test` row to reflect the actual outcome of this run.

Some gates are **universal** (apply to every genre); some are **genre-scoped** (apply only when the active genre is editorial, atmospheric, modern-minimal, or playful). Genre overrides are noted inline. Where a gate has *no* genre note, treat it as universal.

---

## Visual

1. Is the display font Inter, Roboto, Open Sans, Poppins, Lato, or a system default?
2. Is there a purple-to-blue (or cyan-to-magenta) gradient anywhere? *Genre note: atmospheric allows radial gradients on background only — never on text or pill buttons.*
3. Is there a 3-equal-column card grid with icon-above-heading tiles?
4. Is any card nested inside another card?
5. Is there a `background-clip: text` gradient headline? (Universal — no genre allows gradient text.)
6. Is any card using a thick coloured left/right side-stripe border?
7. Is the hero `min-height: 100vh` with everything centred? *Genre note: atmospheric and playful allow centred heroes when the canvas itself is the design (Suno-style).*
8. Is pure `#000` or pure `#fff` used as a base colour anywhere? *Genre note: modern-minimal allows pure `#fff` paper (the Stripe / ElevenLabs school).*

## Structural

9. Does the page use the *same* structural fingerprint as the last page you built? (Hero → 3 features → CTA → footer is the AI structural template; reject it.)
10. Are sections separated only by equal whitespace, with no rule, no ornament, no colour shift — every section identical in rhythm?

## Microinteractions

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

## Variety

21. Is the `/* Hallmark · macrostructure: <name> · ... */` stamp missing from the top of the CSS? (It must be present.)
22. Is the macrostructure I picked the same as a previous Hallmark output's stamp in this project? (Read the file system; if a stamp exists, mine must differ.)
23. Did I default to the **Specimen** macrostructure (numbered left-margin labels + huge serif + asymmetric spans + typographic-only CTA) when the brief did not explicitly call for editorial / foundry / specimen energy? (Specimen fall-through is banned.) *Genre note: atmospheric, modern-minimal, and playful never default to Specimen — only editorial does, and only when the brief signals it.*

## Implementation gates

24. Does any neutral / surface colour have `oklch(... 0 ...)` (zero chroma)? Pure greys read as flat. Tint every neutral toward the anchor hue — minimum 0.005 chroma. *Genre note: modern-minimal allows zero-chroma neutrals (the monochrome Stripe / ElevenLabs school).*
25. Does the accent colour cover more than ~5 % of any single viewport (count by area: solid fills, large headings in accent, full-bleed accent backgrounds)? If yes, retreat — accent is for emphasis, not for filling. *Genre note: atmospheric allows accent-tinted radial blooms covering up to ~20 % of the canvas, since the bloom is the design.*
26. Is any padding / gap / margin a value that isn't on the named spacing scale (`--space-3xs` … `--space-5xl`, multiples of 4 px)? Arbitrary `padding: 17px` is a tell.
27. Is any prose container's `max-width` outside the 45–75 ch range? Measure must read; under 45 ch is choppy, over 75 ch loses the eye.
28. Does any interactive element lack `:focus-visible`, `:active`, OR `:disabled` styling? (Eight states is the rule. Default + hover is two; you need at least default + hover + focus-visible + active + disabled present in code.)
29. Is there any `transform` / `animation` keyframe that is NOT covered by a `@media (prefers-reduced-motion: reduce)` fallback? Every motion gets a reduced-motion alternative.

## Hero enrichment gates

(When the page carries enrichment — see [`hero-enrichment.md`](hero-enrichment.md).)

30. If the page has a demo video, does it autoplay with sound, lack a `poster`, lack `fetchpriority="high"`, or use `loading="lazy"` on the LCP element? (LCP-killers fail this gate.)
31. If the page has an abstract background, is it more than one accent colour, more than ~5 % footprint, or animating mesh-gradient on the whole page? (Aurora blobs and mesh-on-everything fail this gate.) *Genre note: atmospheric allows up to two warm-toned radial blooms covering ~20–30 % of the canvas, fixed-attached, no animation.*
32. Does the page mix two or more icon libraries? (Material + Heroicons + Lucide on the same page = the icon-set tell.)
33. If the page has illustration, did I default to a Lottie library when a hand-built SVG or pure-CSS shape would have worked? (Lottie is last resort, not the default.)

## Diversification gates

(Cross-reference `.hallmark/log.json` when present.)

34. If I used the same archetype as a previous Hallmark output (per `.hallmark/log.json` or the latest macrostructure stamp), did I pick at least one different *variation knob*? Two Bento Grids with `tiles=6, spans=irregular, accent=corner-only` are the same Bento — the within-archetype knobs in [`component-cookbook.md`](component-cookbook.md) exist precisely to prevent that. State the knob deltas in the stamp.
35. Does any visual-only `<svg>`, custom-art `<div>`, `<canvas>`, or decorative figure lack `aria-label` or `aria-hidden="true"`? Hand-built CSS art and SVG illustrations need an accessible name *or* an explicit hide. Skipping this is the new accessibility tell.

## Layout-safety gates

(The page must survive every viewport.)

36. Does the page horizontally scroll on any viewport between 320 px and 1920 px? Open the rendered page; drag the dev-tools width slider across that range. If a horizontal scrollbar appears at any width, fail. The fix is `html { overflow-x: clip; }` plus `body { overflow-x: clip; }` as a safety net for any clipped-edge enrichment that pushes past the viewport. Use `overflow-x: clip` (not `hidden`) — `clip` preserves `position: sticky` and `position: fixed` on descendants. (Cross-reference: [`layout-and-space.md` § Page-edge clipping](layout-and-space.md).)
37. For every decorative effect on text — highlighter `<mark>` / `<em>` band / accent stroke / underline — did I visually confirm the position and size? A highlighter band must sit behind the x-height (`linear-gradient(180deg, transparent ~38%, accent ~38%, accent ~92%, transparent ~92%)`), **not** at the baseline (which reads as a fat underline). Underlines must be 1–2 px and offset 1–2 px from the baseline, never 5+ px. Decorative strokes must not exceed 5 % of the viewport (gate 25). The check is *visual*: imagine the rendered output and confirm the band lands in the right vertical zone.
38. Are interactive bars (nav, toolbar, command bar, hero CTA row, footer link strip) explicitly vertically centered? Default flex layouts inherit `align-items: stretch`, which makes a button taller than its sibling text and breaks the visual baseline. Every flex row mixing height-different elements (button + text, icon + text, mark + body) must declare `align-items: center` and `line-height: 1` on the items with intrinsic height. Inheriting `line-height: 1.55` from `html` fights the row's vertical rhythm.

## Typography discipline gates

(Three faces is the ceiling. See [`typography.md` § The 2+1 rule](typography.md).)

39. Does the page use **more than three** distinct `font-family` families? Count: `--font-display`, `--font-body`, and at most one outlier (`--font-outlier` for wordmark / hero stat / pull quote). A fourth family on the page — e.g. body + display + mono in code blocks + a separate display for the hero — is slop. Same family at different weights counts as one family. Mono counts as a family if used in any non-code context (captions, labels, numerals). If you find four, drop one back to the body or display face.
40. Is the **outlier face used in more than two slots** on the page? The outlier is a register, not a third surface — wordmark + hero stat is the canonical pair, or wordmark + masthead, or hero stat + pull quote. Three slots = the outlier is now a third body font; collapse it back to the body face.

## Input-state gates

(Inputs are where almost-right UIs lose. See [`interaction-and-states.md` § Input field states](interaction-and-states.md).)

41. Does any input, textarea, or select field change `border-width` between states (default → hover → focus → error)? Default is 1 px; hover, focus, and error must keep `border-width: 1px`. Border-width changes cause layout shift. State changes go to `background-color`, `outline`, `box-shadow`, or `border-color` — never `border-width`.
42. Does the input focus ring use `border` instead of `outline`? The focus ring must be `outline: 2px solid var(--color-focus)` with `outline-offset: 1px`. Reserving `outline: 2px solid transparent` in the default state prevents geometry shift on activate. A focus ring built from a `border` change is a tell.
43. Is the input height different from the height of an adjacent button on the same form? Form inputs and the form's submit button share a single base height (44 px floor). 38 px input + 44 px button is the most common form-tuning slop and reads as un-designed.
44. Is the helper-text container collapsed when no helper or error is shown? The helper slot must reserve `min-height: 1lh` even when empty so that an error appearing doesn't push the page down. Vertical jump on validation is a tell.
45. Is the disabled input state signalled by *only* `opacity: 0.5`? Disabled needs three independent signals: `opacity: 0.55` AND `cursor: not-allowed` AND `aria-disabled="true"` (or the native `disabled` attribute). One channel is missable; three are not.

## Contrast & readability

Universal — apply to every genre. These gates catch the real-world failures the user flagged: black-text-on-black-button, dark sections with unreadable text, ink-on-ink slop where the LLM forgot to flip the text colour after flipping the surface.

Contrast computation: for every `(color, background-color)` pair on the page, run **APCA Lc** OR **WCAG 2.1 ratio**. OKLCH lightness is a fast pre-check — if `|L_text − L_bg| < 50 %`, the pair likely fails 4.5:1 — confirm with a full calculation.

Thresholds:
- Body text (under 24 px regular OR under 18 px bold): **WCAG 4.5:1 / APCA Lc ≥ 60**.
- Large text / icons / focus rings: **WCAG 3:1 / APCA Lc ≥ 45**.

46. Does any **body text** have a contrast ratio below **4.5:1** against its computed background? Pair every `color` declaration with its effective `background-color` and verify. The most-missed cases are: text inside cards that inherit `color` but the card switched to `background: var(--color-paper-2)` and the text is now too close in lightness; muted text (`color: var(--color-muted)`) on `background: var(--color-paper-3)` — both are mid-lightness and fail.

47. Does any **large text** (≥ 24 px regular OR ≥ 18 px bold) or **icon** or **`:focus-visible` ring** have a contrast ratio below **3:1** against its background? Same calculation, looser threshold. Specifically check focus rings — `outline: 2px solid var(--color-focus)` only passes if `--color-focus` has ≥ 3:1 contrast against *both* the element and the page surface.

48. Does any **button** have `color` ≈ `background-color` on its fill? The canary check: if the computed text colour and the computed background colour are within **5 % lightness AND 0.05 chroma** in OKLCH, fail the gate. This catches the common bug where `color: var(--color-ink)` sits on `background: var(--color-ink)` (black-on-black slop) — the LLM forgot to use `--color-accent-ink` (or `--color-paper`) for text-on-fill.

49. When `--color-accent` is used as a fill anywhere on the page (button, badge, surface), is `--color-accent-ink` **also defined** (in `:root` or theme tokens) AND used as the `color` for text on that fill? If `--color-accent-ink` is missing, Hallmark output is one careless `color: white` away from a low-contrast accident. The token must exist, must verify ≥ APCA Lc 60 / WCAG 4.5:1 against `--color-accent`, and must be applied wherever accent fills a surface that carries text.

50. Does any **dark section** (a section or panel whose `background-color` has OKLCH lightness < 50 %) carry text that uses the page-default `color: var(--color-ink)` — i.e. ink-on-ink in a section that flipped its surface? Sections that swap to a dark surface MUST also swap their text colour (typically to `--color-paper`) and ensure nested children inherit. The fix is explicit: any class that sets `background: <dark>` must also set `color: <light>` in the same rule, OR be wrapped in a parent that does. The most common failure: a `.vs__col:first-child` painted with the accent or ink colour but the inner panels still using default ink-coloured text.

The CSS stamp at Step 6 should record the result: `· contrast: pass (46–50)` if all five gates pass, or `· contrast: FAIL gates <list>` if any are open. Fix before shipping.

---

If any answer is **yes**, fix it. Do not ship slop.
