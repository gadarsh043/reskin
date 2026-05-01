// Hallmark — landing-page interactions.
// Sticky banner theme picker + per-theme component archetype swap.
// Dogfoods the patterns in skill/references/microinteractions.md.

const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* — Page-load reveals (one orchestrated entrance) ——————————— */
const reveals = document.querySelectorAll(".reveal");
if (reduced || !("IntersectionObserver" in window)) {
  reveals.forEach((el) => el.classList.add("is-in"));
} else {
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.05, rootMargin: "0px 0px -2% 0px" }
  );
  reveals.forEach((el) => io.observe(el));
}

/* — Theme registry ————————————————————————————————————— */
const THEMES = {
  specimen: "Specimen",
  midnight: "Midnight",
  brutal: "Brutal",
  garden: "Garden",
  atelier: "Atelier",
  newsprint: "Newsprint",
  terminal: "Terminal",
  manifesto: "Manifesto",
  salon: "Salon",
  linen: "Linen",
  almanac: "Almanac",
  sport: "Sport",
  studio: "Studio",
  pastel: "Pastel",
  riso: "Riso",
  quiet: "Quiet",
  bloom: "Bloom",
};
const STORAGE_KEY = "hallmark-theme";

/* — Theme → archetype tuple map ——————————————————————————
   Each theme picks one cookbook entry per slot. The point is structural
   variety: switching themes literally rebuilds the page, not just
   recolours it. See skill/references/component-cookbook.md. */
const ARCHETYPES = {
  specimen: { hero: "marquee", footer: "masthead" },
  newsprint: { hero: "split", footer: "index" },
  atelier: { hero: "quote-led", footer: "inline" },
  garden: { hero: "letter", footer: "masthead" },
  salon: { hero: "quote-led", footer: "masthead" },
  linen: { hero: "letter", footer: "inline" },
  almanac: { hero: "stat-led", footer: "index" },
  midnight: { hero: "stat-led", footer: "index" },
  terminal: { hero: "marquee", footer: "dense" },
  brutal: { hero: "photographic", footer: "inline" },
  manifesto: { hero: "marquee", footer: "masthead" },
  sport: { hero: "stat-led", footer: "inline" },
  studio: { hero: "photographic", footer: "index" },
  pastel: { hero: "clipped", footer: "masthead" },
  riso: { hero: "quote-led", footer: "dense" },
  quiet: { hero: "split", footer: "masthead" },
  bloom: { hero: "marquee", footer: "masthead" },
};

/* — Theme → genre map ——————————————————————————————————
   Each theme belongs to one of four genres — a rule-set overlay that
   scopes which slop-test gates apply and which voice fixtures the
   skill picks from. See skill/references/genres/. */
const THEME_GENRES = {
  // editorial — the canonical Hallmark voice (12 themes)
  specimen:  "editorial",
  newsprint: "editorial",
  atelier:   "editorial",
  garden:    "editorial",
  salon:     "editorial",
  linen:     "editorial",
  almanac:   "editorial",
  studio:    "editorial",
  riso:      "editorial",
  sport:     "editorial",
  brutal:    "editorial",
  manifesto: "editorial",
  // modern-minimal — Stripe / Linear / ElevenLabs school
  quiet:     "modern-minimal",
  // atmospheric — Suno / Runway / dark-AI-tool school
  bloom:     "atmospheric",
  midnight:  "atmospheric",
  terminal:  "atmospheric",
  // playful — post-Linear soft school
  pastel:    "playful",
};

/* — Locked hero title —————————————————————————————————
   The H1 string is the same across every theme. Only the visual
   treatment swaps — italic vs roman, serif vs sans, all-caps vs not.
   The page is the demo: one sentence, sixteen distinct designs. */
const HERO_TITLE = "A design skill that refuses to look AI-generated.";

/* — Per-theme copy fixtures —————————————————————————————
   Distinct voice per theme so the page doesn't read like the same
   page in different fonts. The `title` is locked across themes;
   eyebrow, lede, quote, stat, salutation, etc. still vary. */
const COPY = {
  specimen: {
    eyebrow: "A design skill · Powered by Together AI",
    title: HERO_TITLE,
    lede: "Hallmark is a skill for Claude Code, Cursor, and Codex. It encodes the anti-slop consensus — typography, colour, layout, motion, interaction — into one holistic ruleset your AI assistant will actually follow.",
    ctaLabel: "01 ⁄ Install",
    proofLabel: "Proof",
    proofA: "21 macrostructures",
    proofB: "32 component archetypes",
    proofC: "29-question slop test",
    cta: "Read the rules",
    stat: "21",
    qualifier: "macrostructures",
    quote: "Two pages from two briefs feel like different sites — not colour-swaps of one template.",
    attrib: "The rule Hallmark is built around",
    salutation: "Dear designer,",
    letterBody: "Every LLM has been trained on the same templates. Without a firm hand, they all emit the same page. Hallmark is the firm hand. It refuses the defaults, asks the questions that matter, and stamps the page so the next run produces something genuinely different.",
    signoff: "With care,",
    captionA: "Plate 01",
    captionB: "From the working archive",
  },
  newsprint: {
    eyebrow: "Volume I · Issue 02 · 28 April 2026",
    title: HERO_TITLE,
    lede: "Twelve themes. Twenty-one named page shapes. Thirty-two component archetypes. A 29-question slop test that gates every output before it ships. Hallmark is the rulebook the LLM never read.",
    ctaLabel: "Distribution",
    proofLabel: "From the rule sheet",
    proofA: "Multi-column body, justified",
    proofB: "Hairline rules, not boxes",
    proofC: "Outlined CTAs, never pills",
    cta: "Read in full",
    stat: "29",
    qualifier: "gates",
    quote: "We compose the page like a broadsheet. Hairlines, columns, restraint.",
    attrib: "From the Hallmark rule sheet",
    salutation: "Letter from the editor.",
    letterBody: "There was a time when a printed page implied that a hand had been on it. We have tried, in this skill, to put a hand on every screen.",
    signoff: "Yours,",
    captionA: "Issue 02",
    captionB: "Press run",
  },
  atelier: {
    eyebrow: "An atelier note",
    title: HERO_TITLE,
    lede: "A small, opinionated craftsmanship engine that argues with your AI assistant on your behalf — and wins.",
    ctaLabel: "By appointment",
    proofLabel: "Marks of the house",
    proofA: "OKLCH-anchored palettes",
    proofB: "Italic display, weighted rest",
    proofC: "Negative space as divider",
    cta: "Request the manual",
    stat: "12",
    qualifier: "themes",
    quote: "Restraint, repeated, becomes a signature.",
    attrib: "Studio note",
    salutation: "A note from the studio.",
    letterBody: "We do not believe in defaults. The default is the average; we are looking for the specific. Every page Hallmark touches is a small refusal of the average, in favour of a page that knows what it is.",
    signoff: "— the studio",
    captionA: "Workbench",
    captionB: "12 April",
  },
  garden: {
    eyebrow: "A small dispatch",
    title: HERO_TITLE,
    lede: "Twelve themes that disagree with each other on purpose. Pick one and the whole page changes — not the colours, the bones.",
    ctaLabel: "Plant it",
    proofLabel: "What grows here",
    proofA: "Hairline rules · negative space",
    proofB: "Italic body · serif emphasis",
    proofC: "One accent, used sparingly",
    cta: "Begin",
    stat: "12",
    qualifier: "themes in the garden",
    quote: "A garden is not the absence of weeds. It is the presence of a plan.",
    attrib: "Hallmark, on design",
    salutation: "Hello,",
    letterBody: "This skill is small. It is opinionated about a few things and quiet about the rest. We have tended it like a garden: pulling out the loud, leaving the considered. We hope it produces, for you, pages that feel grown rather than generated.",
    signoff: "Yours,",
    captionA: "Plot 04",
    captionB: "Late spring",
  },
  salon: {
    eyebrow: "A salon",
    title: HERO_TITLE,
    lede: "Hallmark is composed, not generated. Twelve themes, twenty-one page shapes, thirty-two archetypes, all chosen with intent.",
    ctaLabel: "By invitation",
    proofLabel: "Of note",
    proofA: "Centred display · ornamental",
    proofB: "Fleuron dividers, tightly cropped",
    proofC: "One typographic CTA per fold",
    cta: "Be received",
    stat: "21",
    qualifier: "page shapes",
    quote: "A page should arrive like a person — composed, deliberate, in good clothes.",
    attrib: "From the salon",
    salutation: "With pleasure,",
    letterBody: "You are most welcome. We have arranged the room with care. Each theme is a different room, and you are invited to walk through all twelve. Take your time — they are all furnished with the same intention.",
    signoff: "À bientôt,",
    captionA: "Salon No. 7",
    captionB: "April",
  },
  linen: {
    eyebrow: "A note",
    title: HERO_TITLE,
    lede: "A skill that prefers the obvious thing done right. Hairline rules. Margin notes. Generous space. The page reads first, designs second.",
    ctaLabel: "Begin reading",
    proofLabel: "Plain rules",
    proofA: "Two-column asymmetric body",
    proofB: "Margin-aligned imagery",
    proofC: "Unstyled-link CTAs",
    cta: "Read on",
    stat: "32",
    qualifier: "archetypes",
    quote: "If you can leave it out and the page still works, leave it out.",
    attrib: "Linen rule",
    salutation: "Dear reader,",
    letterBody: "This is a longer letter than the other themes. It is a deliberate choice. Hallmark believes that prose-led pages still have a place — that not every product needs a hero, a stat, and a CTA stack. Sometimes, a paragraph is the page.",
    signoff: "With patience,",
    captionA: "Folio II",
    captionB: "Quiet hours",
  },
  almanac: {
    eyebrow: "Almanac · 2026 edition",
    title: HERO_TITLE,
    lede: "A reference book of structural choices, indexed and cross-referenced. Hallmark looks up the right page-shape for the brief and refuses to use the same one twice.",
    ctaLabel: "Open the index",
    proofLabel: "Catalogued",
    proofA: "21 macrostructures",
    proofB: "32 component archetypes",
    proofC: "29 slop-test gates",
    cta: "Open the index",
    stat: "252",
    qualifier: "theme × shape combinations",
    quote: "An almanac is a book that knows where to look.",
    attrib: "Almanac, frontispiece",
    salutation: "Reference note,",
    letterBody: "This page is a reference, not an argument. The numbers are the point: 21 macrostructures, 32 archetypes, 12 themes, 29 slop-test gates. Cross-referenced so the next page Hallmark builds is genuinely different from the last.",
    signoff: "— editor",
    captionA: "Vol. III",
    captionB: "Plate 12",
  },
  midnight: {
    eyebrow: "Built for the dark",
    title: HERO_TITLE,
    lede: "A dark theme that uses lightness for elevation, not shadow. Numbered display labels. Typewriter reveals. Indigo accent at low chroma.",
    ctaLabel: "Run it",
    proofLabel: "Console",
    proofA: "OKLCH dark palette · perceptual",
    proofB: "Lightness elevation, no shadow",
    proofC: "Numbered display headers",
    cta: "$ open",
    stat: "00",
    qualifier: "shadow halos",
    quote: "On dark surfaces, elevation is lightness — never glow.",
    attrib: "Midnight rule",
    salutation: "01 — HELLO.",
    letterBody: "This is a dark page that tries not to be a tinted-light page. The neutrals are mixed at low chroma in OKLCH so the steps feel even at the eye, not just at the value. Elevation is brighter surface, not heavier shadow.",
    signoff: "— Midnight",
    captionA: "Frame 03",
    captionB: "0240h",
  },
  terminal: {
    eyebrow: "$ hallmark",
    title: HERO_TITLE,
    lede: "Honest about its medium. Monospace top to bottom. No animations. The page is what it is.",
    ctaLabel: "Run",
    proofLabel: "Process",
    proofA: "Monospace, single column",
    proofB: "Underlined links · no hover scale",
    proofC: "No reveal animation",
    cta: "$ run",
    stat: "0",
    qualifier: "animations",
    quote: "$ tput sgr0",
    attrib: "End of file",
    salutation: "> hello",
    letterBody: "> a terminal page is not a page that pretends. it does not transition. it does not hover-scale. it is monospace because the work that made it was monospace. the rest of the page can read what it likes.",
    signoff: "> bye",
    captionA: "frame_07",
    captionB: "0241",
  },
  brutal: {
    eyebrow: "Brutal — uncompromised",
    title: HERO_TITLE,
    lede: "Heavy display. Hard edges. One accent that means it. The grid does not flex; the grid is the point.",
    ctaLabel: "Take it",
    proofLabel: "Stack",
    proofA: "Photographic full-bleed",
    proofB: "Bleed-colour dividers",
    proofC: "Oversized solid CTAs",
    cta: "GO",
    stat: "100",
    qualifier: "PERCENT.",
    quote: "A page that hedges is a page that fails.",
    attrib: "BRUTAL",
    salutation: "DEAR READER.",
    letterBody: "WE WILL NOT HEDGE. THE GRID DOES NOT FLEX. THE TYPE IS HEAVY. THE ACCENT IS RED. EVERY DECISION ON THIS PAGE IS A DECISION; NONE OF THEM ARE DEFAULTS. TAKE IT OR LEAVE IT.",
    signoff: "— BRUTAL",
    captionA: "BLOCK A",
    captionB: "PRINT 01",
  },
  manifesto: {
    eyebrow: "Manifesto",
    title: "The Design Skill.",
    lede: "The page is a statement. We don't soften it. The accent is a colour with a position. The headline is a belief.",
    ctaLabel: "Sign it",
    proofLabel: "Beliefs",
    proofA: "Bleed-colour dividers",
    proofB: "Oversized solid buttons",
    proofC: "Declarative large type",
    cta: "SIGN ON",
    stat: "23",
    qualifier: "tells, named.",
    quote: "WE BELIEVE A LANDING PAGE IS NOT A TEMPLATE.",
    attrib: "MANIFESTO",
    salutation: "TO WHOM IT CONCERNS.",
    letterBody: "WE BELIEVE THE PAGE IS A POSITION. WE BELIEVE THE TEMPLATE IS THE ENEMY. WE BELIEVE THAT EVERY DECISION SHOULD BE VISIBLE FROM ACROSS THE ROOM. WE BELIEVE THE ACCENT COLOUR IS A POLITICS. WE BELIEVE — AND THE PAGE BELIEVES WITH US.",
    signoff: "— THE UNDERSIGNED",
    captionA: "PLATE I",
    captionB: "POSTER",
  },
  sport: {
    eyebrow: "Sport · 2026",
    title: HERO_TITLE,
    lede: "Italic display. Tabular nums. Numbered display headers. The page moves like a scoreboard — fast, decisive, in motion.",
    ctaLabel: "Kick off",
    proofLabel: "Stats",
    proofA: "Italic display, oversized",
    proofB: "Tabular numbers everywhere",
    proofC: "Horizontal-sweep reveals",
    cta: "GO",
    stat: "+47%",
    qualifier: "FASTER · DECIDE LATE.",
    quote: "A FAST PAGE IS A FAST DECISION.",
    attrib: "SPORT",
    salutation: "READY?",
    letterBody: "YOU ARE TWO MINUTES FROM SHIPPING. THE PAGE IS WAITING. EVERY DECISION ON IT IS NUMBERED, TABULATED, INDEXED. THE ACCENT IS A STARTING GUN. RUN IT.",
    signoff: "— SPORT",
    captionA: "RACE 03",
    captionB: "LAP 12",
  },
  studio: {
    eyebrow: "Studio · 2026 selected work",
    title: HERO_TITLE,
    lede: "We design and build distinctive products for ambitious teams. Hallmark is our typography opinion, codified — fifteen themes, twenty-one shapes, no defaults.",
    ctaLabel: "Engage",
    proofLabel: "Selected work",
    proofA: "01 — A foundry rebrand",
    proofB: "02 — A reading app",
    proofC: "03 — A type specimen",
    cta: "See the work",
    stat: "21",
    qualifier: "named page shapes.",
    quote: "We don't believe in defaults. The default is the average; we are looking for the specific.",
    attrib: "Studio note · 2026",
    salutation: "Hello, friend.",
    letterBody: "We started this studio because we kept being asked to build the same page, twelve different ways. Hallmark is our argument: one brief, one shape — chosen, not defaulted to. Take a look.",
    signoff: "Yours,",
    captionA: "Studio · 2026",
    captionB: "Selected work",
  },
  pastel: {
    eyebrow: "v0.4 · post-Linear soft",
    title: HERO_TITLE,
    lede: "A design skill that prefers soft surfaces and exact rules. Buttery paper. Slate ink. One indigo accent at low chroma — never a gradient.",
    ctaLabel: "Open it",
    proofLabel: "What it does",
    proofA: "OKLCH-anchored palettes",
    proofB: "Geist sans + Geist Mono",
    proofC: "33-question slop test",
    cta: "Open Hallmark",
    stat: "33",
    qualifier: "gates, soft-spoken.",
    mockStat: "33",
    quote: "Software can be soft and exact at once. That's the trick.",
    attrib: "Pastel · field note",
    salutation: "Hey there.",
    letterBody: "This page is soft because the surface should be soft. The rules underneath are not — there are thirty-three of them, and the page passed every one. We hope it feels like the modern dev tools you already love, just with fewer gradients.",
    signoff: "Take care,",
    captionA: "Field note 04",
    captionB: "Pastel",
  },
  riso: {
    eyebrow: "ed. 12 · printed today",
    title: HERO_TITLE,
    lede: "warm paper, off-register accents, one bold lowercase headline. a page that feels printed, not generated.",
    ctaLabel: "press →",
    proofLabel: "colophon",
    proofA: "bricolage display, 800 weight",
    proofB: "newsreader italic body",
    proofC: "riso cyan + yellow accent pair",
    cta: "print one →",
    stat: "12",
    qualifier: "editions, hand-set.",
    quote: "design like print: warm, off-register, intentional.",
    attrib: "RISO · ed. 12",
    salutation: "from the press,",
    letterBody: "this is not a page that pretends to be paper. it is a page that remembers paper. the colors mis-register on purpose. the headline sits low. the body is a serif italic that wants to be read in a chair, not on a phone in a queue. take a seat.",
    signoff: "— the press",
    captionA: "ed. 12",
    captionB: "press · 04",
  },
  quiet: {
    eyebrow: "Polished minimal",
    title: HERO_TITLE,
    lede: "Geist sans. Pure white. One bold display. Generous space. The design decides what to leave out — and stands behind those choices.",
    ctaLabel: "Get started",
    proofLabel: "Decisions",
    proofA: "Pure-white paper, dark ink",
    proofB: "Geist sans, single weight",
    proofC: "Pill CTAs · monochrome accent",
    cta: "Get started",
    stat: "1",
    qualifier: "decision, made everywhere.",
    mockStat: "1",
    quote: "The work that looks effortless is the work where the choices were made.",
    attrib: "Quiet",
    salutation: "Hello.",
    letterBody: "A theme for the modern enterprise page — the Stripe / Linear / ElevenLabs school of restraint. Clean white, confident typography, pill CTAs. Minimalism with conviction, not absence.",
    signoff: "Yours,",
    captionA: "Quiet",
    captionB: "v0.8",
  },
  bloom: {
    eyebrow: "Atmospheric · 2026",
    title: HERO_TITLE,
    lede: "For the AI-creative product page. Dark canvas, warm bloom, declarative type. The aesthetic of a tool you'd actually want to use after dark.",
    ctaLabel: "Try it now",
    proofLabel: "Atmosphere",
    proofA: "Dark canvas with two warm blooms",
    proofB: "Geist sans, one weight, plain English",
    proofC: "Single warm accent — never gradient text",
    cta: "Try it now",
    stat: "1",
    qualifier: "warm canvas — many uses.",
    mockStat: "1",
    quote: "The page should feel like a place you could sit in.",
    attrib: "Bloom note",
    salutation: "Welcome,",
    letterBody: "A dark theme for the AI-creative tool page — Suno, Runway, the late-night software where atmosphere matters. Two soft colour blooms, plain confident type, a single warm accent. Restraint of a different kind.",
    signoff: "— Bloom",
    captionA: "Bloom",
    captionB: "Late-night",
  },
};

/* — Slot population ———————————————————————————————————— */
const root = document.documentElement;
const banner = document.querySelector(".banner");
const currentLabel = document.querySelector("[data-theme-current]");
const dots = document.querySelectorAll("[data-theme-btn]");
const slotEls = {
  hero: document.querySelector('[data-slot="hero"]'),
  footer: document.querySelector('[data-slot="footer"]'),
};

function interpolate(node, copy) {
  // Walk text nodes and attribute values, replace {{key}} with copy[key].
  const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null);
  const textNodes = [];
  let n; while ((n = walker.nextNode())) textNodes.push(n);
  for (const t of textNodes) {
    if (t.nodeValue.includes("{{")) {
      t.nodeValue = t.nodeValue.replace(/\{\{(\w+)\}\}/g, (_, k) => copy[k] ?? "");
    }
  }
  // Attributes
  const all = node.querySelectorAll("*");
  for (const el of all) {
    for (const attr of el.attributes) {
      if (attr.value.includes("{{")) {
        attr.value = attr.value.replace(/\{\{(\w+)\}\}/g, (_, k) => copy[k] ?? "");
      }
    }
  }
}

function buildDenseColophon(themeName) {
  // Pre-formatted dense block for the dense footer. Generated rather than
  // template-string'd so it stays monospace-aligned.
  const today = "2026-05-01";
  return [
    `# hallmark · v0.7.0 · ${themeName.toLowerCase()}`,
    `# build: ${today} · MIT · powered by together ai`,
    `#`,
    `# stats:  21 macrostructures · 32 archetypes · 17 themes · 38 gates`,
    `#         catalog (16 named) + custom (per-brand, opt-in)`,
    `#`,
    `# repo:   github.com/Luffixos/hallmark`,
  ].join("\n");
}

function swapArchetypes(theme) {
  const tuple = ARCHETYPES[theme] || ARCHETYPES.specimen;
  const copy = { ...COPY[theme], denseColophon: buildDenseColophon(THEMES[theme] || theme) };

  for (const slot of ["hero", "footer"]) {
    const region = slotEls[slot];
    if (!region) continue;
    const tplId = `${slot}-${tuple[slot]}`;
    const tpl = document.getElementById(tplId);
    if (!tpl) continue;

    const fragment = tpl.content.cloneNode(true);
    interpolate(fragment, copy);

    region.replaceChildren(fragment);
    region.dataset.archetype = tuple[slot];

    // Trigger a one-shot fade-in for the freshly-populated children.
    region.removeAttribute("data-populating");
    void region.offsetWidth; // restart animation
    region.setAttribute("data-populating", "");
  }

  // Re-attach copy buttons inside the new hero, since clone doesn't carry handlers.
  attachCopyButtons(slotEls.hero);
}

/* — Copy-to-clipboard (silent success, label swap pattern) ————— */
function attachCopyButtons(scope = document) {
  const btns = scope.querySelectorAll("[data-copy-btn]:not([data-copy-bound])");
  btns.forEach((btn) => {
    btn.dataset.copyBound = "true";
    btn.addEventListener("click", async () => {
      const source = btn.closest("[data-copy-source]");
      const textNode = source && source.querySelector("[data-copy-text]");
      const text = textNode ? textNode.textContent.trim() : "";
      if (!text) return;

      try {
        await navigator.clipboard.writeText(text);
      } catch (err) {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand("copy"); } catch (e) { }
        document.body.removeChild(ta);
      }

      btn.dataset.state = "copied";
      btn.setAttribute("aria-live", "polite");
      clearTimeout(btn._copyTimer);
      btn._copyTimer = setTimeout(() => {
        delete btn.dataset.state;
      }, 2200);
    });
  });
}
attachCopyButtons();

/* — Theme application ————————————————————————————————— */
/* Cached banner subnodes — populated once at startup. */
const themeLabelEl = document.querySelector(".banner__theme");
const themeGenreEl = document.querySelector("[data-theme-genre]");
const stampTextEl = document.querySelector("[data-stamp-text]");
const stampDetailEl = document.querySelector("[data-stamp-detail]");

function setPressed(theme) {
  dots.forEach((btn) => {
    const active = btn.dataset.themeBtn === theme;
    btn.setAttribute("aria-pressed", active ? "true" : "false");
  });
  const themeName = THEMES[theme] || "Specimen";
  const genre = THEME_GENRES[theme] || "editorial";
  const archetype = (ARCHETYPES[theme] && ARCHETYPES[theme].hero) || "marquee";

  if (themeLabelEl) themeLabelEl.textContent = themeName;
  if (themeGenreEl) themeGenreEl.textContent = genre;
  if (stampTextEl)  stampTextEl.textContent = `${archetype} · ${theme} · enrich-A`;
  if (stampDetailEl) stampDetailEl.textContent = `/* Hallmark · genre: ${genre} · macrostructure: ${archetype} · theme: ${theme} · enrichment: A */`;

  // Fallback for older callers — keep the public theme-current span up to date.
  if (currentLabel && !themeLabelEl) currentLabel.textContent = themeName;
}

function applyTheme(theme) {
  if (!THEMES[theme]) return;
  const apply = () => {
    root.dataset.theme = theme;
    setPressed(theme);
    swapArchetypes(theme);
    try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) { }
  };
  if (!reduced && document.startViewTransition) {
    document.startViewTransition(apply);
  } else {
    apply();
  }
}

const queried = (() => {
  try { return new URL(window.location.href).searchParams.get("theme"); } catch (e) { return null; }
})();
const stored = (() => {
  try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
})();
const initial = THEMES[queried] ? queried
  : THEMES[stored] ? stored
    : (root.dataset.theme || "specimen");

// First paint — populate slots without a transition (no flash).
root.dataset.theme = initial;
setPressed(initial);
swapArchetypes(initial);
try { localStorage.setItem(STORAGE_KEY, initial); } catch (e) { }

dots.forEach((btn) => {
  btn.addEventListener("click", () => {
    applyTheme(btn.dataset.themeBtn);
  });
});

/* — Shuffle button + R shortcut ——————————————————————————— */
const shuffleBtn = document.querySelector(".banner__shuffle, .banner__random");
function pickRandomTheme() {
  const keys = Object.keys(THEMES).filter((k) => k !== root.dataset.theme);
  return keys[Math.floor(Math.random() * keys.length)];
}
if (shuffleBtn) {
  shuffleBtn.addEventListener("click", () => applyTheme(pickRandomTheme()));
}

/* — T-key onboarding tooltip ————————————————————————————————
   First-time visitors don't know T cycles themes. After ~5s of no T
   presses (and only if they haven't seen the tooltip before), fade
   it in near the shuffle button. Dismisses on first T press, on
   click, or after 8s of being shown. localStorage flag is set on
   dismiss so it never returns. */
const T_TOOLTIP_KEY = "hallmark-t-tooltip-seen";
const T_TOOLTIP_DELAY_MS = 5000;
const T_TOOLTIP_AUTO_HIDE_MS = 8000;
const T_TOOLTIP_FADE_MS = 240;
const tTooltipEl = document.querySelector("[data-t-tooltip]");
let tTooltipShown = false;
let tTooltipTimer = null;
let tTooltipAutoHideTimer = null;

function tTooltipSeen() {
  try { return localStorage.getItem(T_TOOLTIP_KEY) === "1"; } catch (e) { return false; }
}

function markTTooltipSeen() {
  try { localStorage.setItem(T_TOOLTIP_KEY, "1"); } catch (e) { }
}

function showTTooltip() {
  if (!tTooltipEl || tTooltipShown || tTooltipSeen()) return;
  tTooltipShown = true;
  tTooltipEl.hidden = false;
  delete tTooltipEl.dataset.state;
  clearTimeout(tTooltipAutoHideTimer);
  tTooltipAutoHideTimer = setTimeout(hideTTooltip, T_TOOLTIP_AUTO_HIDE_MS);
}

function hideTTooltip() {
  if (!tTooltipEl || !tTooltipShown) return;
  clearTimeout(tTooltipAutoHideTimer);
  tTooltipEl.dataset.state = "closing";
  setTimeout(() => {
    tTooltipEl.hidden = true;
    delete tTooltipEl.dataset.state;
    tTooltipShown = false;
    markTTooltipSeen();
  }, T_TOOLTIP_FADE_MS);
}

if (tTooltipEl && !tTooltipSeen()) {
  tTooltipTimer = setTimeout(showTTooltip, T_TOOLTIP_DELAY_MS);
  tTooltipEl.addEventListener("click", hideTTooltip);
}

/* — Easter egg — "chill, designer." ————————————————————————
   Spam T fast enough and the page intervenes. We track timestamps in
   a rolling 3.2s window; if the user crosses the threshold (≈ a full
   catalog cycle inside the window), the overlay takes over. While
   it's visible, every keystroke is swallowed — no theme cycling, no
   shortcuts. After ~4s the overlay fades and the page returns. A 30s
   cooldown stops it from firing back-to-back. */
const easterEl = document.querySelector("[data-easter-egg]");
const EASTER_WINDOW_MS = 3200;
const EASTER_THRESHOLD = 12;       // ≈ 3.8 presses/sec
const EASTER_VISIBLE_MS = 3400;    // total time the overlay stays up
const EASTER_FADE_MS = 360;        // matches the fade-out animation
const EASTER_COOLDOWN_MS = 15000;
const EASTER_PUNCHLINES = [
  "chill, designer.",
  "you've seen them all.",
  "seventeen is plenty.",
  "pick. build. ship.",
  "easy on the keyboard.",
  "one theme will do.",
];
const tStamps = [];
let easterLastFired = 0;
let easterOpen = false;
let easterDismissTimer = null;
let easterFadeTimer = null;

function showEasterEgg() {
  if (!easterEl || easterOpen) return;
  const now = performance.now();
  const span = (now - tStamps[0]) / 1000;
  const cycles = (tStamps.length / Object.keys(THEMES).length).toFixed(1);

  // Re-mount the lines so the staggered fade-in animation re-runs each
  // time. Populate live values + a random punchline after replacement
  // so we don't write into a detached node.
  const lines = easterEl.querySelector(".easter__lines");
  if (lines) {
    const fresh = lines.cloneNode(true);
    lines.parentNode.replaceChild(fresh, lines);
  }
  const cyclesEl = easterEl.querySelector("[data-easter-cycles]");
  const secondsEl = easterEl.querySelector("[data-easter-seconds]");
  const lineEl = easterEl.querySelector("[data-easter-line]");
  if (cyclesEl) cyclesEl.textContent = cycles;
  if (secondsEl) secondsEl.textContent = span.toFixed(1);
  if (lineEl) lineEl.textContent = EASTER_PUNCHLINES[Math.floor(Math.random() * EASTER_PUNCHLINES.length)];

  delete easterEl.dataset.state;
  easterEl.hidden = false;
  easterOpen = true;
  document.body.style.overflow = "hidden";

  clearTimeout(easterDismissTimer);
  clearTimeout(easterFadeTimer);
  easterDismissTimer = setTimeout(hideEasterEgg, EASTER_VISIBLE_MS);
}

function hideEasterEgg() {
  if (!easterEl || !easterOpen) return;
  clearTimeout(easterDismissTimer);
  clearTimeout(easterFadeTimer);
  easterEl.dataset.state = "closing";
  easterFadeTimer = setTimeout(() => {
    easterEl.hidden = true;
    delete easterEl.dataset.state;
    easterOpen = false;
    document.body.style.overflow = "";
  }, EASTER_FADE_MS);
}

/* — Keyboard shortcuts ————————————————————————————————— */
// T cycles forward, Shift+T cycles back, R picks random.
document.addEventListener("keydown", (e) => {
  // While the easter egg is up, swallow every key — including T —
  // so the user can't trigger anything until it auto-dismisses.
  if (easterOpen) {
    e.preventDefault();
    e.stopPropagation();
    return;
  }

  const tag = (e.target.tagName || "").toLowerCase();
  if (tag === "input" || tag === "textarea" || e.target.isContentEditable) return;
  if (e.metaKey || e.ctrlKey || e.altKey) return;

  if (e.key === "t" || e.key === "T") {
    e.preventDefault();
    // Dismiss the onboarding tooltip on first T press.
    clearTimeout(tTooltipTimer);
    if (tTooltipShown) hideTTooltip();
    else markTTooltipSeen();
    // Easter-egg counter — track press cadence in a rolling window.
    // Push BEFORE applying the theme so the trigger fires on this same
    // keystroke if we've crossed the threshold.
    const now = performance.now();
    while (tStamps.length && now - tStamps[0] > EASTER_WINDOW_MS) tStamps.shift();
    tStamps.push(now);
    if (tStamps.length >= EASTER_THRESHOLD && now - easterLastFired > EASTER_COOLDOWN_MS) {
      easterLastFired = now;
      tStamps.length = 0;
      showEasterEgg();
      return; // skip the theme swap on the trigger keystroke
    }

    const order = Object.keys(THEMES);
    const i = order.indexOf(root.dataset.theme);
    const dir = e.shiftKey ? -1 : 1;
    const next = order[(i + dir + order.length) % order.length];
    applyTheme(next);
  } else if (e.key === "r" || e.key === "R") {
    e.preventDefault();
    applyTheme(pickRandomTheme());
  }
});

/* — Hover preview on dots — reads theme name in the centre ————— */
let previewTimer = null;
let lastConfirmed = root.dataset.theme;
dots.forEach((btn) => {
  btn.addEventListener("mouseenter", () => {
    lastConfirmed = root.dataset.theme;
    clearTimeout(previewTimer);
    previewTimer = setTimeout(() => {
      if (currentLabel) currentLabel.textContent = THEMES[btn.dataset.themeBtn];
    }, 80);
  });
  btn.addEventListener("mouseleave", () => {
    clearTimeout(previewTimer);
    if (currentLabel && root.dataset.theme === lastConfirmed) {
      currentLabel.textContent = THEMES[lastConfirmed];
    }
  });
});

/* — Foundations · F/04 Motion demo —————————————————————
   Click "Play" to run the entrance once. The keyframe is in
   components.css; we just toggle the class so it can replay. */
const motionBtn = document.querySelector("[data-motion-demo]");
const motionBlock = document.querySelector("[data-motion-block]");
if (motionBtn && motionBlock) {
  motionBtn.addEventListener("click", () => {
    motionBlock.classList.remove("is-running");
    // force reflow so the class re-add triggers the animation again
    void motionBlock.offsetWidth;
    motionBlock.classList.add("is-running");
  });
}

/* — Foundations · F/05 States demo ———————————————————————
   Real button. The readout reflects whatever state the button is in:
   default, hover, focus, active, loading (for ~1s after click). */
const statesBtn = document.querySelector("[data-states-demo]");
const statesReadout = document.querySelector("[data-states-readout]");
if (statesBtn && statesReadout) {
  let loadingTimer = null;

  function setState(state) {
    statesReadout.textContent = state;
    if (state === "loading") {
      statesBtn.dataset.state = "loading";
    } else {
      delete statesBtn.dataset.state;
    }
  }

  statesBtn.addEventListener("mouseenter", () => {
    if (statesBtn.dataset.state !== "loading") setState("hover");
  });
  statesBtn.addEventListener("mouseleave", () => {
    if (statesBtn.dataset.state !== "loading" && document.activeElement !== statesBtn) {
      setState("default");
    }
  });
  statesBtn.addEventListener("focus", () => {
    if (statesBtn.dataset.state !== "loading") setState("focus");
  });
  statesBtn.addEventListener("blur", () => {
    if (statesBtn.dataset.state !== "loading") setState("default");
  });
  statesBtn.addEventListener("mousedown", () => {
    if (statesBtn.dataset.state !== "loading") setState("active");
  });
  statesBtn.addEventListener("click", () => {
    setState("loading");
    clearTimeout(loadingTimer);
    loadingTimer = setTimeout(() => {
      setState("success");
      setTimeout(() => setState("default"), 900);
    }, 900);
  });
}
