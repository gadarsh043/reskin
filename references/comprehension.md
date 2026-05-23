# Comprehension pass — understand before you redesign

Loaded by [`verbs/redesign.md`](verbs/redesign.md) when `reskin redesign` targets a **wired-up codebase**. This pass is what separates Reskin from a generic design skill: the agent must know what the site **is**, what each piece **does**, and **why** it exists before changing how it looks.

**Do not run this pass** on greenfield builds, static single-file HTML with no app shell, or empty repos. See § When to run.

This file works **with** the Implementation safety rail and Non-destructive implementation rule in [`SKILL.md`](../SKILL.md) and [`verbs/redesign.md`](verbs/redesign.md). The **protected paths** list you emit here is how those rules become concrete and enforceable.

---

## When to run

**Run the comprehension pass** when **all** of the following are true:

1. The redesign target lives inside a project that has a **`package.json`** at the root (or the monorepo package that owns the target).
2. At least one of these directories exists at that package root: **`src/`**, **`app/`**, or **`components/`** (also accept `pages/`, `routes/`, `src/app/` as routing roots — treat them as part of the same wired-up signal).

**Skip the comprehension pass** when:

- The target is a single static `.html` / `.css` file with no `package.json`.
- The project is greenfield, empty, or scratch with no framework layout.
- The user explicitly says *"skip comprehension"* or *"ignore the codebase map"* — then emit one line and proceed, but warn that data-bound components may break.

On skip: also skip **change plan** and **verification**; **concept** remains optional after the redesign target is scoped. See skip table in [`SKILL.md` § `reskin redesign`](../SKILL.md#reskin-redesign) and [`verbs/redesign.md`](verbs/redesign.md).

**Re-run** (full pass, not cache-only) when:

- The user says *"refresh comprehension"* or corrects `.reskin/understanding.md` materially (new routes, renamed components, new data sources).
- `package.json` or the route tree changed since the last comprehension (`comprehension.scannedAt` older than those files' mtimes).

---

## What to produce

You deliver **two artifacts** and **one user-facing report**:

| Artifact | Path | Audience |
| --- | --- | --- |
| **Site Understanding** (human) | `.reskin/understanding.md` | User reviews, corrects intent labels, approves before redesign |
| **Comprehension cache** (machine) | `.reskin/preflight.json` | Next Reskin runs; extends existing pre-flight cache |
| **Chat summary** | *(in the conversation)* | Short Site Understanding report — same content as the markdown file, scannable in five seconds |

Create `.reskin/` if it does not exist. Respect `.gitignore` (the directory may be local-only).

---

## How to investigate

Read code. Trace imports. Follow route files to page components to children. **Detect the data layer — do not ask the user** what stack they use; infer it from `package.json`, file patterns, and call sites.

**Signal sources (non-exhaustive):**

| Layer | Look for |
| --- | --- |
| **Routing** | `app/**/page.tsx`, `pages/`, `src/routes/`, `react-router`, `vue-router`, `+page.svelte`, `astro` pages |
| **Components** | `components/`, colocated `*.tsx` under routes, layout files |
| **Data fetch** | `fetch(`, `useQuery`, `useSWR`, `useMutation`, `createServerClient`, Firebase/Supabase SDKs, `getServerSideProps`, `loader`, `action`, `trpc`, GraphQL clients |
| **Server** | `app/api/`, `pages/api/`, `server/`, `*.server.ts`, middleware |
| **State** | Redux/Zustand/Context providers, stores under `stores/` |
| **Config / secrets** | `.env*`, `prisma/`, `drizzle/`, `supabase/migrations`, auth config |

Cite **file paths** (and line ranges when helpful) so the user can verify.

---

## Site Understanding report — required sections

Write `.reskin/understanding.md` using the template below. The in-chat report mirrors these five sections.

### 1. Routing & pages

Walk the route tree. For **each page/route**:

- **Path** — URL or file path (e.g. `/`, `/projects/[slug]`, `app/about/page.tsx`)
- **Purpose** — one sentence in plain language
- **Visitor action** — what someone does here (read, browse, submit, sign in, etc.)

Order routes the way a visitor would encounter them (home first, then primary flows).

### 2. Component inventory

For **each significant UI region** on each page (hero, nav, card grid, modal, footer, widget — not every atom):

| Field | Required | Notes |
| --- | --- | --- |
| **label** | yes | Plain language the **user** will say aloud — e.g. *"the box with two photos at the top"*, not only `HeroSection` |
| **id** | yes | Short stable slug: `home-hero`, `project-cards`, `project-detail-modal` — kebab-case, unique project-wide |
| **route** | yes | Which page(s) it appears on |
| **file** | yes | Primary component file path |
| **does** | yes | What it shows and how it behaves |
| **copy** | if any | Key headings, CTAs, labels (summarize; don't paste entire CMS dumps) |
| **intent** | yes | **Why does this exist?** What should the visitor feel or do? Inference, stated clearly — e.g. *"The circadian widget gives a sense of the person behind the portfolio, not just their work."* |

Skip purely presentational wrappers with no user-visible role. Include shared layout pieces (nav, footer) once with `route: all` or list each route.

### 3. Data layer

**Detect; do not questionnaire the user.**

For **each data access point**:

- **id** — stable slug, e.g. `firebase-projects`, `api-checkout-session`
- **kind** — `sdk` · `hook` · `server-action` · `api-route` · `loader` · `store` · `context` · `other`
- **file** — where fetch/mutation is defined
- **returns** — shape in plain language or TypeScript-ish sketch (`Project[]`, `{ user, session }`)
- **consumers** — component `id`s from §2 that read this data

Then produce **`dataBoundComponents`** — the list of component ids that **must keep working** after redesign (same data contract, same hooks/imports, same loading/error behaviour unless the user explicitly approves a logic change).

Rules:

- If a component only renders props, trace props upward until you hit a fetch or store.
- If redesign might touch a file that **defines** a fetch, that file is protected (§4), not redesigned in place.

### 4. Protected paths

From the data-layer scan and project layout, emit an explicit **READ-ONLY allowlist** during redesign.

**Always protect (glob-style patterns — adapt to repo):**

- Data access: `**/api/**`, `**/server/**`, `**/*.server.ts`, `**/actions/**`, `**/loaders/**`
- SDK clients: `**/lib/firebase*`, `**/lib/supabase*`, `**/lib/prisma*`, `**/db/**`
- Auth: `**/auth/**`, middleware, session helpers
- Schema / env: `prisma/**`, `drizzle/**`, `.env*`, `**/migrations/**`
- Config: `next.config.*`, `vite.config.*`, `astro.config.*`, CI/deploy configs

**Plus** every file path you identified in §3 as defining fetch/mutation/schema.

The redesign may **read** protected files to understand contracts. It must **never modify** them unless the user explicitly approves a separate "logic change" task.

State aloud: *"These N paths are protected. Redesign is visual/interaction only inside non-protected UI files."*

### 5. Navigation & linking

- **Global nav** — where it lives, which routes it links, mobile behaviour if visible in code
- **Layouts** — shared `layout.tsx` / `_app` / shell components
- **Cross-page flows** — e.g. list → detail, modal over home, query-param tabs
- **Shared state** — anything that survives route changes (context, URL state, stores)

---

## `.reskin/understanding.md` template

````markdown
# Site Understanding — <project name>

Generated by Reskin comprehension pass · <ISO date>
Target: <path user asked to redesign>

> User: edit intent lines freely. Say "comprehension confirmed" when this matches your site.

## 1. Routing & pages

| Path | Purpose | Visitor action |
| --- | --- | --- |
| `/` | … | … |

## 2. Component inventory

### `<id>` — <label>

- **Routes:** …
- **File:** …
- **Does:** …
- **Copy:** …
- **Intent:** …

(repeat)

## 3. Data layer

| id | kind | file | returns | consumers |
| --- | --- | --- | --- | --- |

**Data-bound components (must keep working):** `id-1`, `id-2`, …

## 4. Protected paths

- `path/or/glob`
- …

## 5. Navigation & linking

…

## Confirmation

- [ ] User confirmed or corrected this document (required before redesign)
````

---

## `.reskin/preflight.json` — `comprehension` object

Merge into the existing pre-flight object. **Do not wipe** font/palette/motion fields from a prior scan — extend them. **Canonical JSON shape:** [`SKILL.md` § Preflight JSON schema](../SKILL.md#preflight-json-schema) (`comprehension` key).

**Field rules:**

- `comprehension.confirmed` — set `true` only after the user explicitly confirms the Site Understanding (see § Hard checkpoint). Until then, **do not redesign**.
- `pages[]` — one entry per route.
- `components[]` — `{ label, id, intent }` required; include `route`, `file`, `does`, `copy` when known.
- `dataSources[]` — every detected fetch/mutation/store read.
- `dataBoundComponents[]` — flat list of component `id` strings.
- `protectedPaths[]` — globs or repo-relative paths; redesign tooling must treat as read-only.

On subsequent runs, if `comprehension.confirmed === true` and sources unchanged, you may skip re-walking the tree — emit *"Comprehension cached. Say 'refresh comprehension' to re-scan."* Still show the user the component labels you will use for this redesign.

---

## Hard checkpoint — user confirmation required

After writing `.reskin/understanding.md` and updating `.reskin/preflight.json`, **stop**. Do not pick a macrostructure. Do not edit UI files.

Ask once:

> **Site Understanding ready** — I wrote `.reskin/understanding.md` (and cached the map in `.reskin/preflight.json`).
>
> Please skim it, especially the **Intent** line for each component. Tell me:
> - **"comprehension confirmed"** — or corrections ("the circadian widget is decorative, not about personality", rename labels, add a missing section).
>
> Wrong comprehension → wrong redesign. I won't change visuals until you confirm.

If the user corrects intent or labels, **update both files** and ask again. Only proceed to redesign (macrostructure, theme, visual edits) after explicit confirmation.

Record confirmation in chat and set `comprehension.confirmed: true` in `preflight.json`.

---

## During redesign — use the map

- Refer to components by **`label`** in chat with the user; use **`id`** in plans and stamps.
- **Never modify** paths in `protectedPaths`.
- **Data-bound components** — preserve import paths to data modules, hook call order, prop shapes, and loading/error UI. Restyle markup and CSS only.
- If a visual change would require touching a protected file, stop and explain the conflict.

---

## Relationship to other Reskin steps

| Step | Interaction |
| --- | --- |
| **Pre-flight scan** ([`SKILL.md`](../SKILL.md) §0) | Comprehension extends `preflight.json`. Run design-token pre-flight before or after comprehension, but both must complete before visual redesign on wired-up apps. |
| **Multi-page `design.md`** ([`verbs/redesign.md`](verbs/redesign.md)) | Run comprehension **before** writing `design.md`. The system lock should reflect the real app, not guesswork. |
| **Single-page redesign** | Same comprehension gate when wired-up; scope may be one route but the map still documents shared nav/data. |
| **`reskin audit`** | May read `understanding.md` to know intended intent vs what shipped. |

---

## Output contract summary

1. Detect wired-up codebase → load this file.
2. Investigate five sections → write `.reskin/understanding.md`.
3. Merge `comprehension` object into `.reskin/preflight.json`.
4. Present Site Understanding in chat → **hard pause** for user confirmation.
5. Only then continue with redesign per [`verbs/redesign.md`](verbs/redesign.md).
