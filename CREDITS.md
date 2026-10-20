# Credits and third-party licenses

Our own code has no license yet (all rights reserved); see the README.

Third-party files keep their own licenses. Their folders are added by the owner (tasks O2 and O3 in `docs/tasks/owner-tasks.md`). Until then they don't exist in the repo.

## chess.js 1.4.0

- **What:** chess rules engine (move generation and validation, check/mate/draw detection)
- **Where:** `vendor/chess.js/chess.js` (the package's ES-module build `dist/esm/chess.js`, unmodified)
- **Author:** Jeff Hlywa
- **License:** BSD-2-Clause. The full text must stay in `vendor/chess.js/LICENSE`
- **Source:** https://github.com/jhlywa/chess.js (npm package `chess.js`)

## Chess piece images ("Cburnett" set)

- **What:** 12 SVG piece images
- **Where:** `assets/pieces/` (renamed to `wK.svg`, `bP.svg`, …; otherwise unmodified)
- **Author:** Cburnett (Wikimedia Commons user)
- **License:** Creative Commons Attribution-ShareAlike 3.0 (CC BY-SA 3.0), https://creativecommons.org/licenses/by-sa/3.0/
- **Source:** Wikimedia Commons, files `Chess_{k,q,r,b,n,p}{l,d}t45.svg`, e.g. https://commons.wikimedia.org/wiki/File:Chess_klt45.svg
- **License checked:** 2026-10-20, all 12 files listed as CC BY-SA 3.0 on Commons
- **Obligations:** credit the author with a license link wherever the images are shown (page footer, task T20). If the images are ever *modified* (e.g. recolored), say so and share the modified images under CC BY-SA 3.0 too. This applies to the images only, not to our code.
