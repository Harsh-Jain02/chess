# AGENTS.md

Instructions for every coding agent on this repo, AI or human. Read this whole file before starting any task. It is the single source of truth: `CLAUDE.md` and `.github/copilot-instructions.md` only point here.

## The project in one paragraph

Two-player chess on one screen in the browser (pass-and-play). Only legal moves are allowed, and clicking a piece highlights the squares it can move to. It is a static site — plain HTML, CSS and JavaScript ES modules, **no build step** — hosted on GitHub Pages. The chess rules come from the vendored library chess.js 1.4.0; this repo writes everything else (board UI, move guidance, controls, saving).

## Hard rules

1. **Git is read-only for AI agents.** Allowed: `git status`, `diff`, `log`, `show`, `blame`, `ls-files`, `ls-remote`. Never run `init`, `add`, `commit`, `push`, `pull`, `fetch`, `checkout`, `switch`, `branch <name>`, `merge`, `rebase`, `reset`, `restore`, `stash`, `tag`, `rm`, `mv`, `clean`. The owner does every git write; you suggest a commit message in your report.
2. **Never install dependencies.** No `npm install`/`ci`/`add`, `npx`, `yarn`, `pnpm`, `pip`; no downloading libraries or assets into the repo; no new `<script src="https://…">`. If a task seems to need one, stop and ask the owner.
3. **Max 200 lines per file** that we write (`.js .css .html .md .json .yml`). Split a file before it would go over. `npm run check:size` enforces this. `vendor/` and `assets/` are excluded.
4. **Never edit `vendor/`.** Never read `vendor/chess.js/chess.js` in full (3,368 lines). The parts of its API we use are summarised in `docs/ARCHITECTURE.md`; `grep` the file if you must confirm a detail.
5. **Don't assume.** If a requirement is unclear, two docs disagree, or a task needs a decision that isn't written down, stop and ask the owner. Don't silently pick an answer.
6. **Stay in scope.** Do only the task you were given. Mention other problems you notice in your report; don't fix them.
7. **Report honestly.** Never claim a check passed that you didn't run. If you can't open a browser, write "manual browser check: not done".

Rules 1–2 are the owner's rules for AI agents. Human contributors follow the owner's normal git workflow.

## Commands (they exist once task T01 is done)

| Command | What it does |
|---|---|
| `npm test` | Run all unit tests (Node's built-in `node:test`, no dependencies) |
| `npm run check:size` | Fail if any authored file has more than 200 lines |
| `npm run check` | Both of the above. Must pass before you report a task done |
| `python3 -m http.server 8000` | Serve the site locally, then open http://localhost:8000 |

Browsers refuse to load ES modules from `file://`, so always use a local server to try the page. Node.js 24+ is required for the tests.

## Where things are

Most of these don't exist yet; the tasks create them.

```
index.html            page shell, element ids are a contract (see ARCHITECTURE)
css/                  base.css (tokens, layout) · board.css · controls.css
js/main.js            entry point: boot only
js/controller.js      app state + event handlers
js/engine/            chess rules adapter over chess.js (pure, no DOM)
js/state/             click-to-move logic, save/load (pure, no DOM)
js/ui/                DOM rendering and dialogs
js/types.js           JSDoc type definitions shared by all modules
vendor/chess.js/      third-party; never edit (added by the owner, task O2)
assets/pieces/        12 piece SVGs; third-party (added by the owner, task O3)
tests/                unit tests; mirrors js/
scripts/              dev scripts (file-size check)
docs/ARCHITECTURE.md  modules, contracts, data shapes, chess.js API summary
docs/DECISIONS.md     decision log; read before proposing a different approach
docs/tasks/           one file per task, owner-tasks.md, _TEMPLATE.md
TODO.md               task board and open questions
CREDITS.md            third-party licenses and attribution
```

## How to do a task

1. Open `TODO.md`, find your task, open its file in `docs/tasks/`. Check that its dependencies are ticked and that it has no unanswered ⚠ question.
2. Read only what the task's **Read first** section lists, plus this file. Don't explore the whole repo; it wastes tokens.
3. Implement it. Write or update unit tests for every pure function.
4. Run `npm run check`. Everything must pass.
5. Do the task's manual browser check if it has one, or say you couldn't.
6. In `TODO.md`, tick your task (`[ ]` → `[x]`). Don't change any other line.
7. Finish with a report in the format below.

### Report format

- **Done:** one or two sentences.
- **Files:** created / changed / deleted.
- **Checks:** `npm run check` result; manual check result or "not done".
- **Notes / questions:** anything out of scope you noticed; any open question.
- **Suggested commit message:** e.g. `T04: engine adapter queries and legal targets`

## Code conventions

- ES modules with relative imports that include the `.js` extension: `import { createGame } from './game.js'`. Named exports only.
- Relative URLs only (no leading `/`). On GitHub Pages the site lives under `/<repo-name>/`.
- No frameworks, no globals, no `var`. Prefer small pure functions.
- Layering (details in `docs/ARCHITECTURE.md`):
  - Only `js/engine/game.js` imports chess.js.
  - `js/engine/` and `js/state/` never touch the DOM.
  - Only `js/state/storage.js` touches `localStorage`.
  - `js/ui/` modules get data as arguments and don't import from `engine/` or `state/`.
- UI modules must not touch `document` or `window` at import time, so their pure helpers can be unit-tested in Node.
- Use chess.js vocabulary everywhere: squares `'a1'`…`'h8'`, colors `'w' | 'b'`, piece types `'p' 'n' 'b' 'r' 'q' 'k'`.
- JSDoc on every exported function; shared shapes live in `js/types.js`.
- Tests: `tests/` mirrors `js/` (`js/engine/game.js` → `tests/engine/game.test.js`), using `node:test` and `node:assert/strict`. Write a comment next to every FEN in a test that says what the position is.
- CSS: kebab-case class names; colors and sizes are custom properties in `css/base.css`; state classes start with `is-` (e.g. `is-selected`).
- Formatting: 2-space indent, LF line endings, UTF-8 (see `.editorconfig`).

## Keeping docs in sync

- If you change a module's exported functions, update its row in `docs/ARCHITECTURE.md` in the same task.
- Only the owner changes `docs/DECISIONS.md`. To propose a change, explain it in your report.
- When the owner changes a hard rule here, they also update `.github/copilot-instructions.md` (it repeats the hard rules) and `.claude/settings.json` (it enforces rules 1–2 for Claude Code).
- New task needed? Copy `docs/tasks/_TEMPLATE.md`, and add a line to `TODO.md`. Keep tasks small (Size S or M).
