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
  specimen:  "Specimen",
  midnight:  "Midnight",
  brutal:    "Brutal",
  garden:    "Garden",
  atelier:   "Atelier",
  newsprint: "Newsprint",
  terminal:  "Terminal",
  manifesto: "Manifesto",
  salon:     "Salon",
  linen:     "Linen",
  almanac:   "Almanac",
  sport:     "Sport",
  studio:    "Studio",
  pastel:    "Pastel",
  riso:      "Riso",
  quiet:     "Quiet",
};
const STORAGE_KEY = "hallmark-theme";

/* — Theme → archetype tuple map ——————————————————————————
   Each theme picks one cookbook entry per slot. The point is structural
   variety: switching themes literally rebuilds the page, not just
   recolours it. See skill/references/component-cookbook.md. */
const ARCHETYPES = {
  specimen:  { hero: "marquee",      footer: "masthead" },
  newsprint: { hero: "split",        footer: "index"    },
  atelier:   { hero: "quote-led",    footer: "inline"   },
  garden:    { hero: "letter",       footer: "masthead" },
  salon:     { hero: "quote-led",    footer: "masthead" },
  linen:     { hero: "letter",       footer: "inline"   },
  almanac:   { hero: "stat-led",     footer: "index"    },
  midnight:  { hero: "stat-led",     footer: "index"    },
  terminal:  { hero: "marquee",      footer: "dense"    },
  brutal:    { hero: "photographic", footer: "inline"   },
  manifesto: { hero: "marquee",      footer: "masthead" },
  sport:     { hero: "stat-led",     footer: "inline"   },
  studio:    { hero: "photographic", footer: "index"    },
  pastel:    { hero: "clipped",      footer: "masthead" },
  riso:      { hero: "quote-led",    footer: "dense"    },
  quiet:     { hero: "letter",       footer: "inline"   },
};

/* — Per-theme copy fixtures —————————————————————————————
   Distinct voice per theme so the page doesn't read like the same
   page in different fonts. */
const COPY = {
  specimen: {
    eyebrow:    "A design skill · Powered by Together AI",
    title:      "Type, set with care.",
    lede:       "Hallmark is a skill for Claude Code, Cursor, and Codex. It encodes the anti-slop consensus — typography, colour, layout, motion, interaction — into one holistic ruleset your AI assistant will actually follow.",
    ctaLabel:   "01 ⁄ Install",
    proofLabel: "Proof",
    proofA:     "21 macrostructures",
    proofB:     "32 component archetypes",
    proofC:     "29-question slop test",
    cta:        "Read the rules",
    stat:       "21",
    qualifier:  "macrostructures",
    quote:      "Two pages from two briefs feel like different sites — not colour-swaps of one template.",
    attrib:     "The rule Hallmark is built around",
    salutation: "Dear designer,",
    letterBody:"Every LLM has been trained on the same templates. Without a firm hand, they all emit the same page. Hallmark is the firm hand. It refuses the defaults, asks the questions that matter, and stamps the page so the next run produces something genuinely different.",
    signoff:    "With care,",
    captionA:   "Plate 01",
    captionB:   "From the working archive",
  },
  newsprint: {
    eyebrow:    "Volume I · Issue 02 · 28 April 2026",
    title:      "Print discipline, on screen.",
    lede:       "Twelve themes. Twenty-one named page shapes. Thirty-two component archetypes. A 29-question slop test that gates every output before it ships. Hallmark is the rulebook the LLM never read.",
    ctaLabel:   "Distribution",
    proofLabel: "From the rule sheet",
    proofA:     "Multi-column body, justified",
    proofB:     "Hairline rules, not boxes",
    proofC:     "Outlined CTAs, never pills",
    cta:        "Read in full",
    stat:       "29",
    qualifier:  "gates",
    quote:      "We compose the page like a broadsheet. Hairlines, columns, restraint.",
    attrib:     "From the Hallmark rule sheet",
    salutation: "Letter from the editor.",
    letterBody:"There was a time when a printed page implied that a hand had been on it. We have tried, in this skill, to put a hand on every screen.",
    signoff:    "Yours,",
    captionA:   "Issue 02",
    captionB:   "Press run",
  },
  atelier: {
    eyebrow:    "An atelier note",
    title:      "A studied hand.",
    lede:       "A small, opinionated craftsmanship engine that argues with your AI assistant on your behalf — and wins.",
    ctaLabel:   "By appointment",
    proofLabel: "Marks of the house",
    proofA:     "OKLCH-anchored palettes",
    proofB:     "Italic display, weighted rest",
    proofC:     "Negative space as divider",
    cta:        "Request the manual",
    stat:       "12",
    qualifier:  "themes",
    quote:      "Restraint, repeated, becomes a signature.",
    attrib:     "Studio note",
    salutation: "A note from the studio.",
    letterBody:"We do not believe in defaults. The default is the average; we are looking for the specific. Every page Hallmark touches is a small refusal of the average, in favour of a page that knows what it is.",
    signoff:    "— the studio",
    captionA:   "Workbench",
    captionB:   "12 April",
  },
  garden: {
    eyebrow:    "A small dispatch",
    title:      "Quietly considered.",
    lede:       "Twelve themes that disagree with each other on purpose. Pick one and the whole page changes — not the colours, the bones.",
    ctaLabel:   "Plant it",
    proofLabel: "What grows here",
    proofA:     "Hairline rules · negative space",
    proofB:     "Italic body · serif emphasis",
    proofC:     "One accent, used sparingly",
    cta:        "Begin",
    stat:       "12",
    qualifier:  "themes in the garden",
    quote:      "A garden is not the absence of weeds. It is the presence of a plan.",
    attrib:     "Hallmark, on design",
    salutation: "Hello,",
    letterBody:"This skill is small. It is opinionated about a few things and quiet about the rest. We have tended it like a garden: pulling out the loud, leaving the considered. We hope it produces, for you, pages that feel grown rather than generated.",
    signoff:    "Yours,",
    captionA:   "Plot 04",
    captionB:   "Late spring",
  },
  salon: {
    eyebrow:    "A salon",
    title:      "A salon for the senses.",
    lede:       "Hallmark is composed, not generated. Twelve themes, twenty-one page shapes, thirty-two archetypes, all chosen with intent.",
    ctaLabel:   "By invitation",
    proofLabel: "Of note",
    proofA:     "Centred display · ornamental",
    proofB:     "Fleuron dividers, tightly cropped",
    proofC:     "One typographic CTA per fold",
    cta:        "Be received",
    stat:       "21",
    qualifier:  "page shapes",
    quote:      "A page should arrive like a person — composed, deliberate, in good clothes.",
    attrib:     "From the salon",
    salutation: "With pleasure,",
    letterBody:"You are most welcome. We have arranged the room with care. Each theme is a different room, and you are invited to walk through all twelve. Take your time — they are all furnished with the same intention.",
    signoff:    "À bientôt,",
    captionA:   "Salon No. 7",
    captionB:   "April",
  },
  linen: {
    eyebrow:    "A note",
    title:      "Made plain.",
    lede:       "A skill that prefers the obvious thing done right. Hairline rules. Margin notes. Generous space. The page reads first, designs second.",
    ctaLabel:   "Begin reading",
    proofLabel: "Plain rules",
    proofA:     "Two-column asymmetric body",
    proofB:     "Margin-aligned imagery",
    proofC:     "Unstyled-link CTAs",
    cta:        "Read on",
    stat:       "32",
    qualifier:  "archetypes",
    quote:      "If you can leave it out and the page still works, leave it out.",
    attrib:     "Linen rule",
    salutation: "Dear reader,",
    letterBody:"This is a longer letter than the other themes. It is a deliberate choice. Hallmark believes that prose-led pages still have a place — that not every product needs a hero, a stat, and a CTA stack. Sometimes, a paragraph is the page.",
    signoff:    "With patience,",
    captionA:   "Folio II",
    captionB:   "Quiet hours",
  },
  almanac: {
    eyebrow:    "Almanac · 2026 edition",
    title:      "Twelve themes. Twenty-one shapes.",
    lede:       "A reference book of structural choices, indexed and cross-referenced. Hallmark looks up the right page-shape for the brief and refuses to use the same one twice.",
    ctaLabel:   "Open the index",
    proofLabel: "Catalogued",
    proofA:     "21 macrostructures",
    proofB:     "32 component archetypes",
    proofC:     "29 slop-test gates",
    cta:        "Open the index",
    stat:       "252",
    qualifier:  "theme × shape combinations",
    quote:      "An almanac is a book that knows where to look.",
    attrib:     "Almanac, frontispiece",
    salutation: "Reference note,",
    letterBody:"This page is a reference, not an argument. The numbers are the point: 21 macrostructures, 32 archetypes, 12 themes, 29 slop-test gates. Cross-referenced so the next page Hallmark builds is genuinely different from the last.",
    signoff:    "— editor",
    captionA:   "Vol. III",
    captionB:   "Plate 12",
  },
  midnight: {
    eyebrow:    "Built for the dark",
    title:      "Built for the dark.",
    lede:       "A dark theme that uses lightness for elevation, not shadow. Numbered display labels. Typewriter reveals. Indigo accent at low chroma.",
    ctaLabel:   "Run it",
    proofLabel: "Console",
    proofA:     "OKLCH dark palette · perceptual",
    proofB:     "Lightness elevation, no shadow",
    proofC:     "Numbered display headers",
    cta:        "$ open",
    stat:       "00",
    qualifier:  "shadow halos",
    quote:      "On dark surfaces, elevation is lightness — never glow.",
    attrib:     "Midnight rule",
    salutation: "01 — HELLO.",
    letterBody:"This is a dark page that tries not to be a tinted-light page. The neutrals are mixed at low chroma in OKLCH so the steps feel even at the eye, not just at the value. Elevation is brighter surface, not heavier shadow.",
    signoff:    "— Midnight",
    captionA:   "Frame 03",
    captionB:   "0240h",
  },
  terminal: {
    eyebrow:    "$ hallmark",
    title:      "$ design.refuse_slop()",
    lede:       "Honest about its medium. Monospace top to bottom. No animations. The page is what it is.",
    ctaLabel:   "Run",
    proofLabel: "Process",
    proofA:     "Monospace, single column",
    proofB:     "Underlined links · no hover scale",
    proofC:     "No reveal animation",
    cta:        "$ run",
    stat:       "0",
    qualifier:  "animations",
    quote:      "$ tput sgr0",
    attrib:     "End of file",
    salutation: "> hello",
    letterBody:"> a terminal page is not a page that pretends. it does not transition. it does not hover-scale. it is monospace because the work that made it was monospace. the rest of the page can read what it likes.",
    signoff:    "> bye",
    captionA:   "frame_07",
    captionB:   "0241",
  },
  brutal: {
    eyebrow:    "Brutal — uncompromised",
    title:      "NO COMPROMISE.",
    lede:       "Heavy display. Hard edges. One accent that means it. The grid does not flex; the grid is the point.",
    ctaLabel:   "Take it",
    proofLabel: "Stack",
    proofA:     "Photographic full-bleed",
    proofB:     "Bleed-colour dividers",
    proofC:     "Oversized solid CTAs",
    cta:        "GO",
    stat:       "100",
    qualifier:  "PERCENT.",
    quote:      "A page that hedges is a page that fails.",
    attrib:     "BRUTAL",
    salutation: "DEAR READER.",
    letterBody:"WE WILL NOT HEDGE. THE GRID DOES NOT FLEX. THE TYPE IS HEAVY. THE ACCENT IS RED. EVERY DECISION ON THIS PAGE IS A DECISION; NONE OF THEM ARE DEFAULTS. TAKE IT OR LEAVE IT.",
    signoff:    "— BRUTAL",
    captionA:   "BLOCK A",
    captionB:   "PRINT 01",
  },
  manifesto: {
    eyebrow:    "Manifesto",
    title:      "WE REJECT THE TEMPLATE.",
    lede:       "The page is a statement. We don't soften it. The accent is a colour with a position. The headline is a belief.",
    ctaLabel:   "Sign it",
    proofLabel: "Beliefs",
    proofA:     "Bleed-colour dividers",
    proofB:     "Oversized solid buttons",
    proofC:     "Declarative large type",
    cta:        "SIGN ON",
    stat:       "23",
    qualifier:  "tells, named.",
    quote:      "WE BELIEVE A LANDING PAGE IS NOT A TEMPLATE.",
    attrib:     "MANIFESTO",
    salutation: "TO WHOM IT CONCERNS.",
    letterBody:"WE BELIEVE THE PAGE IS A POSITION. WE BELIEVE THE TEMPLATE IS THE ENEMY. WE BELIEVE THAT EVERY DECISION SHOULD BE VISIBLE FROM ACROSS THE ROOM. WE BELIEVE THE ACCENT COLOUR IS A POLITICS. WE BELIEVE — AND THE PAGE BELIEVES WITH US.",
    signoff:    "— THE UNDERSIGNED",
    captionA:   "PLATE I",
    captionB:   "POSTER",
  },
  sport: {
    eyebrow:    "Sport · 2026",
    title:      "BUILT TO SHIP.",
    lede:       "Italic display. Tabular nums. Numbered display headers. The page moves like a scoreboard — fast, decisive, in motion.",
    ctaLabel:   "Kick off",
    proofLabel: "Stats",
    proofA:     "Italic display, oversized",
    proofB:     "Tabular numbers everywhere",
    proofC:     "Horizontal-sweep reveals",
    cta:        "GO",
    stat:       "+47%",
    qualifier:  "FASTER · DECIDE LATE.",
    quote:      "A FAST PAGE IS A FAST DECISION.",
    attrib:     "SPORT",
    salutation: "READY?",
    letterBody:"YOU ARE TWO MINUTES FROM SHIPPING. THE PAGE IS WAITING. EVERY DECISION ON IT IS NUMBERED, TABULATED, INDEXED. THE ACCENT IS A STARTING GUN. RUN IT.",
    signoff:    "— SPORT",
    captionA:   "RACE 03",
    captionB:   "LAP 12",
  },
  studio: {
    eyebrow:    "Studio · 2026 selected work",
    title:      "A studio for what's next.",
    lede:       "We design and build distinctive products for ambitious teams. Hallmark is our typography opinion, codified — fifteen themes, twenty-one shapes, no defaults.",
    ctaLabel:   "Engage",
    proofLabel: "Selected work",
    proofA:     "01 — A foundry rebrand",
    proofB:     "02 — A reading app",
    proofC:     "03 — A type specimen",
    cta:        "See the work",
    stat:       "21",
    qualifier:  "named page shapes.",
    quote:      "We don't believe in defaults. The default is the average; we are looking for the specific.",
    attrib:     "Studio note · 2026",
    salutation: "Hello, friend.",
    letterBody:"We started this studio because we kept being asked to build the same page, twelve different ways. Hallmark is our argument: one brief, one shape — chosen, not defaulted to. Take a look.",
    signoff:    "Yours,",
    captionA:   "Studio · 2026",
    captionB:   "Selected work",
  },
  pastel: {
    eyebrow:    "v0.4 · post-Linear soft",
    title:      "Soft, but exact.",
    lede:       "A design skill that prefers soft surfaces and exact rules. Buttery paper. Slate ink. One indigo accent at low chroma — never a gradient.",
    ctaLabel:   "Open it",
    proofLabel: "What it does",
    proofA:     "OKLCH-anchored palettes",
    proofB:     "Geist sans + Geist Mono",
    proofC:     "33-question slop test",
    cta:        "Open Hallmark",
    stat:       "33",
    qualifier:  "gates, soft-spoken.",
    mockStat:   "33",
    quote:      "Software can be soft and exact at once. That's the trick.",
    attrib:     "Pastel · field note",
    salutation: "Hey there.",
    letterBody:"This page is soft because the surface should be soft. The rules underneath are not — there are thirty-three of them, and the page passed every one. We hope it feels like the modern dev tools you already love, just with fewer gradients.",
    signoff:    "Take care,",
    captionA:   "Field note 04",
    captionB:   "Pastel",
  },
  riso: {
    eyebrow:    "ed. 12 · printed today",
    title:      "design like print.",
    lede:       "warm paper, off-register accents, one bold lowercase headline. a page that feels printed, not generated.",
    ctaLabel:   "press →",
    proofLabel: "colophon",
    proofA:     "bricolage display, 800 weight",
    proofB:     "newsreader italic body",
    proofC:     "riso cyan + yellow accent pair",
    cta:        "print one →",
    stat:       "12",
    qualifier:  "editions, hand-set.",
    quote:      "design like print: warm, off-register, intentional.",
    attrib:     "RISO · ed. 12",
    salutation: "from the press,",
    letterBody:"this is not a page that pretends to be paper. it is a page that remembers paper. the colors mis-register on purpose. the headline sits low. the body is a serif italic that wants to be read in a chair, not on a phone in a queue. take a seat.",
    signoff:    "— the press",
    captionA:   "ed. 12",
    captionB:   "press · 04",
  },
  quiet: {
    eyebrow:    "v0.4",
    title:      "A quiet skill.",
    lede:       "System fonts. Near-white paper. Average-sized headers. A theme that argues against itself.",
    ctaLabel:   "Install",
    proofLabel: "Notes",
    proofA:     "System-native typography",
    proofB:     "No chromatic accent",
    proofC:     "No reveal animation",
    cta:        "Read on",
    stat:       "16",
    qualifier:  "themes, one of them is this.",
    mockStat:   "16",
    quote:      "Restraint, when it's the brief, is the design.",
    attrib:     "Quiet",
    salutation: "Hello.",
    letterBody:"This is a page that doesn't try. The font is whatever your operating system gives. The accent colour is the same as the text. The headlines are average-sized. The whitespace is generous. There is nothing here to surprise you, and that's the design.",
    signoff:    "Yours,",
    captionA:   "Plain",
    captionB:   "Quiet",
  },
};

/* — Slot population ———————————————————————————————————— */
const root = document.documentElement;
const banner = document.querySelector(".banner");
const currentLabel = document.querySelector("[data-theme-current]");
const dots = document.querySelectorAll("[data-theme-btn]");
const slotEls = {
  hero:   document.querySelector('[data-slot="hero"]'),
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
    `# stats:  21 macrostructures · 32 archetypes · 16 themes · 38 gates`,
    `#         catalog (16 named) + custom (per-brand, opt-in)`,
    `#`,
    `# repo:   github.com/Luffixos/hallmark`,
  ].join("\n");
}

function swapArchetypes(theme) {
  const tuple = ARCHETYPES[theme] || ARCHETYPES.specimen;
  const copy  = { ...COPY[theme], denseColophon: buildDenseColophon(THEMES[theme] || theme) };

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
        try { document.execCommand("copy"); } catch (e) {}
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
function setPressed(theme) {
  dots.forEach((btn) => {
    const active = btn.dataset.themeBtn === theme;
    btn.setAttribute("aria-pressed", active ? "true" : "false");
  });
  if (currentLabel) currentLabel.textContent = THEMES[theme] || "Specimen";
}

function applyTheme(theme) {
  if (!THEMES[theme]) return;
  const apply = () => {
    root.dataset.theme = theme;
    setPressed(theme);
    swapArchetypes(theme);
    try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) {}
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
              : THEMES[stored]  ? stored
              : (root.dataset.theme || "specimen");

// First paint — populate slots without a transition (no flash).
root.dataset.theme = initial;
setPressed(initial);
swapArchetypes(initial);
try { localStorage.setItem(STORAGE_KEY, initial); } catch (e) {}

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

/* — Keyboard shortcuts ————————————————————————————————— */
// T cycles forward, Shift+T cycles back, R picks random.
document.addEventListener("keydown", (e) => {
  const tag = (e.target.tagName || "").toLowerCase();
  if (tag === "input" || tag === "textarea" || e.target.isContentEditable) return;
  if (e.metaKey || e.ctrlKey || e.altKey) return;

  if (e.key === "t" || e.key === "T") {
    e.preventDefault();
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
