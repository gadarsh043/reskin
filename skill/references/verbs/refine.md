# `hallmark refine`

The user has code they are happy with structurally but wants polished. Your job is to apply the ruleset with the smallest possible diff.

- Do not move or rename elements unless necessary.
- Do not restructure the DOM.
- Do swap fonts, rewrite colour tokens to OKLCH, tighten the type scale, correct easings, add missing states, fix any flagged anti-patterns.
- At the end, list what you changed and which reference file prompted each change.

**If the page has a Hallmark stamp** with a genre, refine within that genre's rule overlay (loaded from [`genres/<name>.md`](../genres/)). A modern-minimal page being refined keeps its pill CTAs and large display; an atmospheric page keeps its radial blooms; an editorial page keeps its hairlines and asymmetry.

**If the page has no stamp**, the genre is unknown. Refine to the universal ruleset only — do not impose editorial defaults on what may have been a deliberate atmospheric or modern-minimal choice. The smallest-possible-diff principle means *not* repainting the page in your default voice.
