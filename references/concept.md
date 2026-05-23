# Concept injection — optional creative vision

Reskin's signature capability. The user supplies **one line of creative vision** — *"make my portfolio a Harry Potter spellbook"* · *"make it feel like a Dragon Ball Z fight"* — and Reskin expands it into a **Concept Brief**: a coherent design vocabulary that drives macrostructure, type, colour, motion, and enrichment so the result **embodies a concept** instead of defaulting to generic tasteful slop.

**Concept is optional.** A real-estate site that wants *"clean and professional"* has **no concept**. Set `concept: null`, skip this file, and run the existing genre / theme / macrostructure system unchanged. Concept is an **additive creative mode**, never forced.

Load this file during **`reskin redesign`** after comprehension is confirmed (wired-up codebases) or after the redesign target is clear (static / single-file). Load **before** macrostructure selection.

---

## 1. Concept prompt (elicitation)

After **comprehension confirmation** (or, if comprehension was skipped, once you know which page/components you are redesigning), ask **once**:

> **Concept (optional)** — Do you have a concept or vision for this redesign? One line is enough — even the weirdest version of it.
>
> Examples: *"my portfolio as a Harry Potter spellbook"* · *"make it feel like a Dragon Ball Z fight"* · *"a 90s mall food court menu board"*
>
> Or say **"no concept"** / **"keep it clean and professional"** / **"skip"** to proceed with the normal genre and theme system.

**If they decline or give a non-concept answer** (*clean*, *professional*, *modern*, *you pick*, *no concept*):

- Set `concept: null` in `.reskin/preflight.json`.
- Emit one line: *"Concept skipped — proceeding with catalog genre/theme."*
- **Do not** load the rest of this file for this run. Proceed to scope detection and macrostructure pick.

**If they supply a concept line** → continue to §2 Concept expansion.

**Do not** ask for a concept on `reskin audit` or greenfield default builds unless the user volunteered one in the brief.

---

## 2. Concept expansion

Given the user's one-line concept, expand it into a **Concept Brief**. **Anchor every vocabulary row to real component `id`s from `.reskin/understanding.md`** (or, if comprehension was skipped, to stable ids you define for the target page's regions).

### Concept Brief — required fields

| Field | What it contains |
| --- | --- |
| **name** | Short slug: `harry-potter-spellbook`, `dbz-fight`, `mall-food-court` |
| **metaphor** | The controlling idea in **one sentence**. |
| **vocabulary** | Translation table: **component `id`** → concept-specific treatment (not generic decoration). |
| **motion language** | What movement *means* in this world — feeds [`motion.md`](motion.md) and [`microinteractions.md`](microinteractions.md). |
| **type & color direction** | How the concept biases display/body pairing and OKLCH palette — still obey [`color.md`](color.md) contrast and ≤5 % accent rules. |
| **enrichment hooks** | Where [`custom-craft.md`](custom-craft.md) / [`hero-enrichment.md`](hero-enrichment.md) bring the concept alive (Tier A/B SVG, CSS art); note intensity. |
| **optional sensory** | Ambient audio or interaction sounds — **opt-in only**, user toggle, **off by default**, never autoplay; respect `prefers-reduced-motion` (motion collapses per [`motion.md`](motion.md)). |
| **restraint map** | Per component `id`: **full** · **light** · **none** — where the concept holds back so intent and legibility win. |

### Vocabulary table format

Use the site's own inventory, not abstract UI jargon alone:

| component `id` | label (from comprehension) | concept treatment |
| --- | --- | --- |
| `home-hero` | the box with two photos at the top | … |
| `project-cards` | the grid of work thumbnails | … |

Include **global chrome** (`site-nav`, `footer`, `cursor` if custom) when they exist.

### Feeds the change plan

Per-unit **intensity** is set in the next step: [`change-plan.md`](change-plan.md) Tier 2. The restraint map (`full` / `light` / `none`) **seeds** default dials (Full / Light / Leave) per page or section after Tier 1 structure is fixed. Intent caps from comprehension may lower or warn on those defaults.

---

## 3. Concept × intent rule (anti-slop core)

**Hard rule:** For every component, the concept treatment must **advance** that component's **confirmed intent** from comprehension (or the intent you inferred for a static target).

- If a concept idea would **undermine** why the component exists, **the concept yields** — intent wins.
- Decoration for its own sake is slop with a theme skin. The concept is a **lens on purpose**, not a sticker pack.

**Test each vocabulary row:** *"Does this treatment help the visitor do what this component's intent describes?"* If no → downgrade to `light` in the restraint map or drop the idea.

**Examples of yielding:**

- Intent: *"Let visitors read my experience clearly"* → no illegible script fonts on the resume; no parallax that fights scanning.
- Intent: *"Make contact frictionless"* → no sound effects on every keystroke; form fields stay standard shapes.
- Intent: *"Show work at a glance"* → cards stay scannable; concept frames thumbnails, doesn't hide titles.

State violations explicitly in the Concept Brief under **restraint map** or a short **yielded ideas** list.

---

## 4. Checkpoint — approve before code

After expanding the Concept Brief:

1. Write **`.reskin/concept.md`** (human-readable; template in § Persistence).
2. Merge the **`concept`** object into `.reskin/preflight.json`.
3. Present the brief in chat — metaphor, vocabulary table, restraint map, one yielded idea if any.
4. **Stop.** Do not pick macrostructure. Do not edit UI.

Ask:

> **Concept Brief ready** — saved to `.reskin/concept.md`.
>
> Skim the vocabulary and restraint map. Say **"concept confirmed"** or tell me what to change (e.g. "go harder on the hero, keep resume plain").
>
> I'll only generate code after you confirm — same discipline as comprehension.

On corrections, update both files and ask again. Set `concept.confirmed: true` only after explicit approval.

---

## 5. How it feeds the pipeline

The approved Concept Brief **constrains** choices; it does **not** override Reskin's guardrails.

| System | Relationship to concept |
| --- | --- |
| **Macrostructure** | Pick a shape the metaphor can support — a spellbook may favor Long Document or Letter; a DBZ fight may favor Marquee Hero or Manifesto energy. Concept narrows; it doesn't excuse the AI template. |
| **Genre / theme** | Concept may push custom OKLCH ([`custom-theme.md`](custom-theme.md)) or bias catalog pick — diversification rules still apply unless `design.md` locks the system. |
| **Slop test (69 gates)** | **Gates win.** If the concept fights a gate (gradient text, invented metrics, tag-left eyebrows), the gate wins. Concept decorates **above** the floor. |
| **Protected paths** | Unchanged. Concept never touches data/API/auth files. |
| **Data-bound components** | Hooks and contracts stay. Concept reskins markup/CSS around them. |
| **Comprehension map** | Vocabulary keys must use comprehension `id`s. Intent + restraint map are authoritative. |

When concept is active, state in the Step 5 preview block: *Concept: `<name>` · metaphor: … · restraint: N components light/full*.

---

## Persistence

### `.reskin/concept.md` (human)

````markdown
# Concept — <name>

One-line input: "<user's exact words>"
Confirmed: <date> · concept confirmed by user

## Metaphor
<one sentence>

## Vocabulary

| id | label | treatment |
| --- | --- | --- |
| home-hero | … | … |

## Motion language
…

## Type & color direction
…

## Enrichment hooks
…

## Optional sensory
Off by default. Toggle: … Accessibility: prefers-reduced-motion …

## Restraint map

| id | level | why |
| --- | --- | --- |
| resume | none | intent: legible experience for hiring |
| home-hero | full | intent: personality first |

## Yielded ideas
- <idea that lost to intent>
````

If `concept: null`, **do not** create this file.

### `.reskin/preflight.json` — `concept` object

```json
{
  "concept": {
    "name": "harry-potter-spellbook",
    "input": "my portfolio as a Harry Potter spellbook",
    "metaphor": "The site is a living spellbook the visitor opens and turns through.",
    "vocabulary": [
      { "id": "home-hero", "treatment": "framed Hogwarts-style portraits in wax-seal mat" },
      { "id": "project-cards", "treatment": "illuminated manuscript pages with gilt corners" }
    ],
    "confirmed": false
  }
}
```

When skipped: `"concept": null` (key present, value null).

**Field rules:**

- `name` — slug for stamps and log rotation.
- `input` — user's verbatim one-liner.
- `metaphor` — one sentence.
- `vocabulary[]` — `{ id, treatment }` required per row; optional `label` echo from comprehension.
- `confirmed` — `true` only after checkpoint; blocks macrostructure until then.

### CSS stamp

When a concept is active, add to the first-line stamp (alongside macrostructure / theme):

```css
/* Reskin · macrostructure: Long Document · theme: custom · concept: harry-potter-spellbook
 * concept-metaphor: living spellbook the visitor turns through
 */
```

When `concept: null`, omit `concept:` from the stamp.

Record in `.reskin/log.json`: `"concept": "<name>"` or `"concept": "none"`.

---

## Worked example — Harry Potter spellbook · portfolio

**Comprehension inventory (abbreviated):**

| id | label | intent |
| --- | --- | --- |
| `home-hero` | the box with two photos at the top | Establish personality before the work grid — visitor should feel who I am, not just what I shipped |
| `project-cards` | the grid of work thumbnails | Let visitors scan projects quickly and open one that matches their interest |
| `resume` | the long experience section | Let hiring managers read my roles and dates without friction |
| `contact` | the email and social row at the bottom | Make reaching out feel low-friction and trustworthy |

**User concept:** *"my portfolio as a Harry Potter spellbook"*

### Concept Brief (generated)

**name:** `harry-potter-spellbook`

**metaphor:** The portfolio is a living spellbook the visitor opens, turns through, and consults — wonder first on the cover, clarity when the spell text matters.

**vocabulary:**

| id | label | treatment |
| --- | --- | --- |
| `home-hero` | two photos at top | Twin portraits in **Hogwarts-style frames** (dark wood mat, subtle gilt corner ornaments); names as **chapter dedication** line beneath; background: aged parchment texture at low contrast |
| `site-nav` | top links | **Chapter tabs** along the spine edge — Home · Work · Experience · Contact — active tab as ribbon bookmark |
| `project-cards` | work grid | Each card = **illuminated manuscript page**: deckled edge, faint marginalia, project title in serif small caps; thumbnail inset like a **pressed illustration** |
| `project-detail` | (if present) | **Full folio spread** — left page title + role, right page hero image; close control = wax-seal stamp |
| `resume` | experience section | See restraint map — **light** treatment only |
| `contact` | email / social | **Closing inscription** block — "Owl post" copy tone optional; inputs stay normal rectangles with parchment fill, no fantasy placeholders in fields |
| `cursor` | (global) | Optional **golden snitch** follower on desktop only — `prefers-reduced-motion`: system cursor |

**motion language:** Page-turn transitions between major sections (transform + opacity, ≤400ms, [`motion.md`](motion.md) easings); nav hover = bookmark lift 2px; project card hover = slight paper lift + shadow; no bounce. Spell-cast = one-shot accent flash on primary CTA only.

**type & color direction:** Display: **Cinzel** or **IM Fell English** for headings; body: **EB Garamond** or **Newsreader** for prose. Paper OKLCH ~92% 0.02 85 (parchment), ink ~25% 0.03 50, accent **gilt** ~75% 0.12 85. All pairs pass contrast gates; accent on borders and active tab, not full-bleed fills.

**enrichment hooks:** Tier-B SVG: wax seal on contact submit success; Tier-A CSS: candle-flicker gradient in hero margin (fixed, no mesh animation). Hero enrichment: optional HP1 vertical-rail polish only if it reads as spine — else skip.

**optional sensory:** Off by default. Toggle in footer: *"Ambient common room"* (loop, low volume). Page-turn **sound** on section change: off unless user enables. Never autoplay.

**restraint map:**

| id | level | why |
| --- | --- | --- |
| `home-hero` | full | Intent is personality — concept can go maximal within contrast rules |
| `project-cards` | full | Intent is scannable work — gilt frames OK; titles must stay ≥ text-md and high contrast |
| `resume` | **none** | Intent: read experience clearly — **no** all-caps Latin, no animated text, no parchment texture behind body copy |
| `contact` | light | Intent: low-friction trust — themed copy + border only; standard input sizes and focus rings |

**yielded ideas (concept × intent):**

- ~~Runes as body font for the whole resume~~ → **yielded.** Undermines `resume` intent; hiring managers need plain scanning.
- ~~Autoplay whisper sound on load~~ → **yielded.** Sensory off by default; violates accessibility and contact intent.
- ~~Replace project titles with spell names only~~ → **yielded.** Undermines `project-cards` intent to scan real work; use spell names as optional subtitle only.

---

## Output contract summary

1. Comprehension confirmed (or target scoped).
2. Ask concept prompt → skip (`concept: null`) **or** expand brief.
3. Write `.reskin/concept.md` + `preflight.json` → **checkpoint** → user confirms.
4. Macrostructure / theme / build — concept narrows choices; slop test + protected paths unchanged.
5. Stamp includes `concept: <name>` when active.
