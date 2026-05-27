# Structural transformation pass — JSX rewrite + concept motion

This pass is the difference between a visual refresh and a real redesign. It rewrites UI structure while preserving backend contracts.

Run during `reskin redesign` when **any** unit in `changePlan.units[]` meets at least one trigger:

- `dialLevel` is `Full` or `Heavy`
- the active concept vocabulary/restraint marks the component `full`
- the user explicitly asks for structural change

If no trigger fires, skip this pass and run the normal theming-first build.

---

## Position in flow

Wired-up redesign with concept + dials:

`comprehension -> concept -> change-plan -> structural transformation (triggered units only) -> SCSS/theme pass -> 69-gate slop test -> verify -> present`

For mixed plans:

- `Full` / `Heavy` units: structural transformation + theming
- `Moderate` / `Light` units: existing layout; theming-first treatment
- `Leave` units: untouched

---

## Inputs

- `.reskin/preflight.json`:
  - `comprehension` (`components[]`, `dataSources[]`, `dataBoundComponents[]`, `protectedPaths[]`)
  - `concept`
  - `changePlan`
- `.reskin/understanding.md` component inventory
- `.reskin/concept.md` concept vocabulary (metaphor + treatment per component id)

If concept is `null`, this pass may still run only when the user explicitly asks for structural change; otherwise fall back to standard build behavior.

---

## Structural transformation actions

### 1) Rewrite JSX (or framework-equivalent markup), not just SCSS

For each triggered unit:

1. Resolve unit -> component ids from comprehension inventory.
2. Open the component files (e.g. `.tsx`, `.jsx`, `.vue`, `.svelte`) for those ids.
3. Rewrite markup hierarchy to express concept vocabulary structurally.
4. Keep data contracts and handlers intact (guardrails below).

Structural rewrite examples for concept `harry-potter-spellbook`:

- `project-cards`: replace uniform card grid with facing-page folio spreads, manuscript index rows, or chapter-style grouped entries.
- `home-hero`: replace side-by-side photos with framed portrait plates and chapter-opening composition.
- `navbar`: replace flat horizontal links with chapter tabs/bookmark rail/spine metaphors.

Rule: choices come from concept vocabulary and metaphor, not generic "fancy" defaults.

### 2) Integrate motion library by project detection

Detect motion library from `package.json` and existing imports:

- If project already uses `framer-motion` -> reuse it.
- If project uses another motion library (`motion`, `gsap`, etc.) -> stay consistent with the existing library.
- If no suitable motion library is present and triggered units require structural transformation -> install `framer-motion` and log it in build notes.

Allowed dependency add in this pass:

```bash
npm install framer-motion
```

For each triggered unit, add motion derived from concept motion language.

Examples for `harry-potter-spellbook`:

- page-turn transitions for section changes
- ink-bleed reveal on content entry
- candle-flicker hover accents
- subtle snitch-style cursor follower

Motion discipline:

- one primary motion language per unit
- no motion pileups
- every motion has `prefers-reduced-motion` fallback (instant/opacity/no-motion)

### 3) Override macrostructure when concept requires

At `Full`/`Heavy` + active concept, macrostructure from earlier steps is a starting point, not a hard lock.

If concept expression requires a different page shape:

- override macrostructure for that unit
- log override + reason in build notes and `preflight.json`
- keep dials and guardrails authoritative

---

## Guardrails (load-bearing)

Structural transformation must **never** violate these:

1. **Protected paths are read-only.**
   - Never edit any file matching `comprehension.protectedPaths`.
   - Data layer, APIs, hooks, env/config are contract sources only.

2. **Data-bound contracts are immutable.**
   For every `dataBoundComponent`:
   - preserve data imports exactly
   - preserve hook/query invocation shape exactly
   - preserve props passed into data consumers exactly
   - preserve loading/error/empty states (can re-theme, cannot remove)

3. **Interaction behavior stays wired.**
   - preserve handlers (`onClick`, submit, analytics calls, link hrefs, etc.)
   - transformed UI must still trigger the same actions

4. **Inventory must stay mappable.**
   - after major structural rewrite, update `.reskin/understanding.md` component labels/descriptions for changed regions
   - component ids remain stable unless an explicit migration is recorded

---

## Anti-slop at structural layer

- No generic "fancy AI website" defaults (full-bleed gradients, glassmorphism-by-default, autoplay video backgrounds, parallax-everything) unless concept explicitly calls for them.
- Concept drives structure; decoration follows structure.
- If a structural choice does not serve both concept metaphor and component intent, remove it.
- `Heavy`/`Full` is not "max motion"; one coherent motion language per unit.
- 69-gate slop test still runs after build. Gates are floor, not ceiling.

---

## Required output after this pass

Before slop test and verification, emit a compact structural transformation report:

1. **Files rewritten**
   - list each component file and plain-language structural change
2. **Motion added**
   - list treatments and reduced-motion fallback
3. **Macrostructure overrides**
   - yes/no per unit + reason
4. **Protected paths check**
   - explicit "protected paths untouched" with any violations if found
5. **Inventory updates**
   - list updated component labels in `.reskin/understanding.md`

---

## `.reskin/preflight.json` persistence

Merge:

```json
"structuralTransformation": {
  "ranAt": "2026-05-27T20:00:00Z",
  "unitsTransformed": ["home", "projects"],
  "jsxFilesRewritten": [
    "app/projects/Projects.jsx",
    "components/home/Hero.jsx"
  ],
  "motionAdded": [
    "page-turn section transition",
    "ink-bleed reveal",
    "candle-flicker hover"
  ],
  "macrostructureOverridden": [
    {
      "unitId": "projects",
      "from": "Workbench",
      "to": "Long Document",
      "reason": "folio spread better expresses spellbook chapter metaphor"
    }
  ],
  "protectedPathsRespected": true
}
```

Rules:

- `unitsTransformed[]` uses `changePlan.units[].id`
- `jsxFilesRewritten[]` are repo-relative paths
- `macrostructureOverridden` empty array when no override
- `protectedPathsRespected` must be computed after rewrite pass

---

## Worked example — `projects` at Full (spellbook concept)

Context:

- concept: `harry-potter-spellbook`
- unit: `projects` at `Full`
- component id: `project-cards`
- file: `Projects.jsx`

Transformation summary:

- old: 3-column uniform cards with image/title/cta
- new: chapter-index + facing-page folio spreads, two projects per "turn"
- preserved:
  - existing data import and fetch hook
  - same loading/error/empty render branches
  - same outbound links and analytics handlers
- added motion:
  - page-turn transition between folio pairs
  - ink-bleed reveal for chapter heading
  - reduced-motion: immediate state swap + opacity-only reveal

Protected paths untouched:

- `lib/firebase/**`
- `app/api/**`
- `.env*`

Inventory update in `.reskin/understanding.md`:

- `project-cards`
  - old label: "three-card project grid"
  - new label: "folio spread chapter index for projects"
  - intent unchanged: "help visitors browse and open project details quickly"
