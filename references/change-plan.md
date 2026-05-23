# Change plan — structure + dial (control layer)

Reskin's **control layer**. A two-tier interview during **`reskin redesign`** that produces the final plan the build follows — **after** comprehension is confirmed and **after** the concept step (whether a concept was set or skipped), **before** macrostructure selection or any code.

**Order is non-negotiable:** **Structure first** (global) → **Change dial second** (per unit). You cannot set per-page dials until you know whether the site stays multi-page, collapses to one scrolling page, or adopts a proposed structure.

Load [`comprehension.md`](comprehension.md) (map + intents), optional [`concept.md`](concept.md) (restraint map), and this file together.

---

## When to run

**Always** on `reskin redesign` once:

1. Comprehension is confirmed (or scoped for static targets), and  
2. Concept is confirmed or explicitly skipped (`concept: null`).

**Do not** run on greenfield default builds, `reskin audit`, or `reskin study` unless the user is explicitly entering a redesign with a plan.

---

## Tier 1 · Structure (global — ask first)

Ask **one** structure question. Offer exactly these three choices (plain language):

> **How should the site structure change?**
>
> 1. **Keep current structure** — same pages and routes as today (multi-page stays multi-page).
> 2. **Collapse to single page** — merge the site into one scrolling page; today's pages become sections.
> 3. **Let the concept / design decide** — I'll propose a structure from comprehension + concept, then you approve before we set dials.

Record the answer as `structure.mode`:

| User choice | `structure.mode` | What it means for Tier 2 units |
| --- | --- | --- |
| Keep current structure | `multi-page` | **Unit = page** (each route from comprehension `pages[]`). Components inside inherit the page's dial unless user overrides per-component later. |
| Collapse to single page | `single-page` | **Unit = section** (each former page → one section on one route). Nav becomes in-page anchors. |
| Let it decide | `proposed` | Reskin drafts a structure proposal → user approves → units = whatever that structure defines (pages or sections). |

### Multi-page → single-page collapse

When the user chooses **collapse**:

1. Use `.reskin/understanding.md` `pages[]` — each page becomes a **section** on the new single route.
2. State the mapping explicitly in the Change Plan:

   | Former route | New section `id` | Anchor (if used) |
   | --- | --- | --- |
   | `/` | `section-home` | `#home` |
   | `/projects` | `section-projects` | `#projects` |

3. **Navigation:** global nav links → smooth-scroll anchors; update labels in the plan. Shared layout may collapse to one shell file.
4. **Data-bound components:** unchanged — same hooks, same `dataSources`, same `protectedPaths`. Only presentation and client routing change. Do not modify protected files to "make collapse work" without explicit approval.
5. **Routing implementation** is a structural change — list files you expect to create/modify in the Change Plan; get confirmation if it implies deleting route files.

### "Let the concept / design decide"

1. Propose structure in plain text (and a small diagram or bullet list): e.g. *"Single scrolling spellbook: Cover (home) → Folio of works (projects) → Experience (resume) → Owl post (contact)."*
2. **Pause** for structure approval before Tier 2.
3. Once approved, set `structure.mode` to `single-page` or `multi-page` per the proposal and define units accordingly.

---

## Tier 2 · Change dial (per unit — after structure is fixed)

Only after Tier 1 is settled and units are named.

### Dial scale (plain language — not math)

| Dial | ≈ | Build behavior |
| --- | --- | --- |
| **Full** | 100% | Reimagine this unit; macrostructure may change; concept goes maximal (within slop gates). |
| **Heavy** | 75% | Strong redesign; layout bones still recognizable. |
| **Moderate** | 50% | Refresh look and feel; keep layout familiar. |
| **Light** | 25% | Polish and theming only; structure intact. |
| **Leave** | 0% | **Do not touch** this unit — no CSS/markup changes. |

**Hard rules:**

- **Leave** → zero edits to that unit's files. Skip in build; stamp notes `dial: leave`.
- **Light** → keep layout and component tree; tokens, type, colour, micro-motion only.
- **Moderate / Heavy / Full** → increasing freedom to change section rhythm, macrostructure voice, and concept treatment on that unit.
- **69 slop-test gates** and **protected paths** apply at every dial level. Full is not permission to ship slop. Light still cannot break data bindings.

### Defaults (pre-filled — user overrides)

Seed each unit's dial from **two** sources; present as a table the user can accept or edit.

**1. Concept restraint map** (if `concept` is active) — map page/section-level treatment from component restrains:

| Concept `restraint` | Default dial |
| --- | --- |
| `full` | Full |
| `light` | Light |
| `none` | Leave |

When a page mixes components (e.g. home has `full` hero + `light` footer), use the **highest** treatment on that page unless the user wants per-component dials — default plan is **per page/section**; note mixed pages in the plan.

**2. Intent cap from comprehension** — constrains the **maximum** dial:

| Intent signal | Default cap | Warning if user requests above cap |
| --- | --- | --- |
| Legibility / read clearly / hiring / legal / form frictionless | **Moderate** | Flag if user sets Heavy or Full |
| Scan / browse / personality / wonder | **Full** allowed | — |
| Trust / low-friction contact | **Light** default, **Moderate** max | Flag Full |

**Warning template** (required when user overrides above intent cap):

> Pushing **`<unit>`** to **Full** may hurt legibility — its intent is *"<intent quote from comprehension>"*. Confirm you want Full anyway?

User may confirm; record `intentCapWarned: true` on that unit in `preflight.json`.

### Shortcuts

Accept bulk answers and expand to units:

- *"everything Full"* / *"all Full"*
- *"everything Light"* / *"all Light"*
- *"home Full, resume Leave, projects Heavy"* — parse per unit
- Per-unit labels from comprehension: *"the projects page Heavy"*

---

## Output · the Change Plan

Produce **one** Change Plan. Show in chat **before** macrostructure pick or code.

### Summary block (chat + top of file)

```markdown
## Change Plan

**Structure:** multi-page (keep current routes)
**Concept:** harry-potter-spellbook
**Protected paths:** 12 (unchanged)

| Unit | Scope | Dial | Notes |
| --- | --- | --- | --- |
| home | page `/` | Full | concept: full hero |
| projects | page `/projects` | Heavy | concept: manuscript cards |
| resume | page `/resume` | Light | intent cap Moderate; seeded from concept none |
| contact | page `/contact` | Light | concept: light |

**Confirmed:** pending
```

### Persistence

**Human:** `.reskin/change-plan.md`

**Machine:** `.reskin/preflight.json` → `changePlan` object:

```json
{
  "changePlan": {
    "structure": {
      "mode": "multi-page",
      "proposal": null,
      "collapseMap": []
    },
    "units": [
      {
        "id": "home",
        "scope": "page",
        "route": "/",
        "dialLevel": "Full",
        "intentCap": "Full",
        "intentCapWarned": false,
        "seededFrom": "concept:home-hero-full"
      },
      {
        "id": "resume",
        "scope": "page",
        "route": "/resume",
        "dialLevel": "Light",
        "intentCap": "Moderate",
        "intentCapWarned": false,
        "seededFrom": "concept:none + intent:legibility"
      }
    ],
    "confirmed": false
  }
}
```

**Field rules:**

- `structure.mode` — `multi-page` | `single-page` | `proposed` (while awaiting structure approval, then resolve to multi or single).
- `structure.collapseMap` — `{ formerRoute, sectionId, anchor }[]` when collapsed.
- `structure.proposal` — text when mode was `proposed`; cleared or kept after approval.
- `units[].id` — stable slug (`home`, `section-projects`, …).
- `units[].scope` — `page` | `section`.
- `units[].dialLevel` — `Full` | `Heavy` | `Moderate` | `Light` | `Leave`.
- `units[].intentCap` — max recommended dial from intent.
- `units[].intentCapWarned` — `true` if user overrode above cap after warning.
- `changePlan.confirmed` — `true` only after `plan confirmed`.

### CSS stamp

When a Change Plan exists:

```css
/* Reskin · … · change-plan: multi-page · dials: home=Full, projects=Heavy, resume=Light, contact=Light */
```

---

## Checkpoint

After writing `.reskin/change-plan.md` and updating `preflight.json`:

1. Present the full Change Plan (structure + unit table).
2. **Stop.** No macrostructure. No theme pick. No files edited (except Leave units later).

Ask:

> **Change Plan ready** — saved to `.reskin/change-plan.md`.
>
> Review structure and each unit's dial. Say **"plan confirmed"** or edit (e.g. "collapse to single page", "resume Leave", "projects Full").
>
> I won't build until you confirm.

On edits, update both files and re-ask. Set `changePlan.confirmed: true` only after explicit approval.

---

## How the plan drives the build

| Dial | Macrostructure | Concept | Files |
| --- | --- | --- | --- |
| Leave | — | — | **Untouched** |
| Light | Keep existing layout | Theming only | Same tree, tokens/CSS |
| Moderate | Light structural refresh | Partial vocabulary | In-place |
| Heavy | New voice, familiar grid | Most vocabulary | In-place or additive |
| Full | May pick new macrostructure for unit | Full restraint allowance | May reshape sections |

- **Per-unit macrostructure:** allowed on Full/Heavy units; prefer one macrostructure family across the site when `design.md` exists.
- **Concept:** applies fully only where dial and concept restraint allow; **none** on Leave; Light gets borders/type/colour only.
- **Slop test:** run per emitted unit (or whole page if single-file).
- **Protected paths:** never modified regardless of dial.

---

## Worked example — multi-page portfolio · Harry Potter concept active

**Inputs:**

- Comprehension: pages `/`, `/projects`, `/resume`, `/contact` with intents as in [`concept.md`](concept.md) worked example.
- Concept: `harry-potter-spellbook` — restraint map: `home-hero` full, `project-cards` full, `resume` none, `contact` light.

---

### Tier 1 interview (chat)

> **How should the site structure change?**
>
> 1. **Keep current structure** — same four routes.
> 2. **Collapse to single page** — one scrolling spellbook.
> 3. **Let the concept / design decide.**

**User:** *"Keep current structure"*

**Recorded:** `structure.mode: multi-page` · units = **pages**: `home`, `projects`, `resume`, `contact`.

*(If user had chosen collapse, plan would list `section-home` ← `/`, etc., and nav → `#anchors`.)*

---

### Tier 2 interview (chat)

**Pre-filled dials (shown to user):**

| Unit | Seeded from | Default dial | Intent cap |
| --- | --- | --- | --- |
| home | concept full (hero) | **Full** | Full |
| projects | concept full (cards) | **Full** | Full |
| resume | concept **none** | **Leave** → agent offers **Light** as compromise | **Moderate** |
| contact | concept light | **Light** | Moderate |

Agent presents:

> Here's the seeded plan from your spellbook concept + intents:
>
> - **home** → Full  
> - **projects** → Full  
> - **resume** → Light *(concept said none; intent: read experience clearly — I'm not leaving it untouched unless you want Leave)*  
> - **contact** → Light  
>
> Override anytime: *"everything Full"*, *"resume Leave"*, etc.

**User:** *"home Full, projects Heavy, resume Full, contact Light"*

**Intent-cap warning fires:**

> Pushing **resume** to **Full** may hurt legibility — its intent is *"Let hiring managers read my roles and dates without friction."* The spellbook concept explicitly yielded runes and parchment on this section. Confirm Full anyway?

**User:** *"OK make resume Light instead"*

**User:** *"plan confirmed"*

---

### Final Change Plan (`.reskin/change-plan.md`)

```markdown
# Change Plan — portfolio

**Structure:** multi-page (keep `/`, `/projects`, `/resume`, `/contact`)
**Concept:** harry-potter-spellbook
**Protected paths:** unchanged (lib/firebase/**, app/api/**, …)

| Unit | Route | Dial | Intent cap | Notes |
| --- | --- | --- | --- | --- |
| home | `/` | Full | Full | Spellbook cover; framed portraits |
| projects | `/projects` | Heavy | Full | Manuscript cards; not Full to avoid redoing detail routes |
| resume | `/resume` | Light | Moderate | User declined Full after warning; concept none |
| contact | `/contact` | Light | Moderate | Owl-post inscription tone only |

**Confirmed:** 2026-05-23 · plan confirmed
```

**`preflight.json` excerpt:**

```json
"changePlan": {
  "structure": { "mode": "multi-page", "collapseMap": [] },
  "units": [
    { "id": "home", "scope": "page", "route": "/", "dialLevel": "Full", "intentCap": "Full", "intentCapWarned": false },
    { "id": "projects", "scope": "page", "route": "/projects", "dialLevel": "Heavy", "intentCap": "Full", "intentCapWarned": false },
    { "id": "resume", "scope": "page", "route": "/resume", "dialLevel": "Light", "intentCap": "Moderate", "intentCapWarned": true },
    { "id": "contact", "scope": "page", "route": "/contact", "dialLevel": "Light", "intentCap": "Moderate", "intentCapWarned": false }
  ],
  "confirmed": true
}
```

Build may proceed: macrostructure/theme picks respect per-unit dials; **resume** files get token/theme pass only; **home** may take Marquee Hero or Letter with full concept vocabulary.

---

## Output contract summary

1. Comprehension confirmed.  
2. Concept confirmed or skipped.  
3. **Tier 1** structure question → units defined.  
4. **Tier 2** dials seeded (concept + intent cap) → user adjusts → warnings if needed.  
5. Write `.reskin/change-plan.md` + `changePlan` in `preflight.json` → **plan confirmed**.  
6. Macrostructure / theme / build — follow the plan.  
7. Stamp includes change-plan summary when useful.
