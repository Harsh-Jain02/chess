# Decisions

Settled choices, recorded so nobody (human or AI) argues them again. **Only the owner adds or changes entries.** To propose a change, explain why in your task report.

*Owner* means the repo owner decided it during setup on 2026-10-20. *Setup default* means it was proposed during setup without being discussed separately. The owner may override those.

| ID | Decision | Why | By |
|---|---|---|---|
| D01 | Plain HTML + CSS + JavaScript ES modules. No build step, no framework. | GitHub Pages serves files as they are; nothing to compile or configure; easy for humans and agents to read. | Owner |
| D02 | All chess rules come from **chess.js 1.4.0**, vendored at `vendor/chess.js/` (not loaded from a CDN), used only through `js/engine/game.js`. | The rules (castling, en passant, pins, draws) are solved and tested upstream. Vendoring pins the version and avoids a runtime CDN dependency. The adapter keeps the rest of the code independent of chess.js. Rejected: writing our own move generator (many more tasks, high bug risk). | Owner |
| D03 | Unit tests use Node's built-in `node:test`. Zero npm dependencies. DOM code is checked manually in a browser. | No installs needed; `npm test` works on a fresh clone. | Owner |
| D04 | Max **200 lines** per authored file, enforced by `scripts/check-file-size.js` locally and in CI. `vendor/` and `assets/` are excluded. | Small files are easier for humans to review and safer for AI agents to edit. | Owner |
| D05 | Moves are made by **click-click only**: click a piece, then click a highlighted square. Drag-and-drop is not planned. | Simple and works on touch screens. Owner may revisit drag-and-drop later. | Owner |
| D06 | Board orientation is **fixed with white at the bottom**, plus a manual "Flip board" button. No auto-flip. | Least disorienting when two people sit side by side. | Owner |
| D07 | **v1 scope:** legal moves only, highlighting of legal targets, check/checkmate/stalemate/draws, promotion choice, new game, flip board, **undo**, **survive page refresh**, **captured pieces display**. The move history list goes to the backlog (B01). | Owner's feature selection. | Owner |
| D08 | Draws by threefold repetition and the 50-move rule **end the game automatically**; no "claim draw" button (unlike FIDE rules). Stalemate and insufficient material also end the game. | Simpler UI; matches most online chess sites. | Owner |
| D09 | Piece images: the **Cburnett SVG set** from Wikimedia Commons, **CC BY-SA 3.0**, used unmodified. Credited in `CREDITS.md` and in the page footer. | Owner chose an open-licensed SVG set; the license was verified during setup. | Owner |
| D10 | **Desktop and mobile** (responsive layout) supported in v1. | Cheap to do from the start, expensive to retrofit. | Owner |
| D11 | Deploy with **GitHub Actions**: on push to `main`, run `npm run check` and deploy to Pages only if it passes. Pull requests only run the checks. | Broken code never goes live. | Owner |
| D12 | AI agents may only use **read-only git** commands and may **never install dependencies**; they ask the owner. | Owner keeps control of history and supply chain. | Owner |
| D13 | `AGENTS.md` is the single source of agent instructions. `CLAUDE.md` imports it; `.github/copilot-instructions.md` points to it and repeats the hard rules. Tools in use: Claude Code, OpenAI Codex, GitHub Copilot. | One file to maintain; no drift. | Owner |
| D14 | **No license** for our own code yet (all rights reserved). To be decided in owner task O5. | Owner's choice after reviewing MIT / GPL-3.0 / Apache-2.0 / none. | Owner |
| D15 | A saved game is the **list of moves** (long algebraic notation, e.g. `e2e4`), replayed from the starting position. Not a FEN snapshot. | A FEN loses the move history, which would break Undo and threefold-repetition detection after a refresh. | Setup default |
| D16 | The engine adapter never throws on illegal input (it returns `null`). It reports **one target per destination square**, even for promotions. It uses chess.js vocabulary (`'e4'`, `'w'/'b'`, `'pnbrqk'`). | Callers stay simple; highlighting doesn't show four dots on one square. | Setup default |
| D17 | The whole board is re-rendered after every change. Squares are `<button>` elements with `aria-label`s. | Simplest correct approach (no stale-state bugs); keyboard and screen-reader friendly by default. | Setup default |
