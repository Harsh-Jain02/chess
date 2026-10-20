# Copilot instructions

All project instructions live in `AGENTS.md` at the repository root. Read it before making any change. If anything here disagrees with AGENTS.md, AGENTS.md wins.

Hard rules (copied from AGENTS.md; keep the two in sync):

1. Git is read-only for AI agents: status, diff, log, show, blame, ls-files, ls-remote only. Never add, commit, push, pull, fetch, checkout, switch, create branches, merge, rebase, reset, restore, stash, tag, rm, mv or clean. Suggest a commit message instead.
2. Never install dependencies (npm/npx/yarn/pnpm/pip, downloaded libraries or assets, CDN script tags). Ask the owner.
3. Max 200 lines per authored file (`.js .css .html .md .json .yml`); split before exceeding. `vendor/` and `assets/` are excluded.
4. Never edit `vendor/`. Don't read `vendor/chess.js/chess.js` in full; its API summary is in `docs/ARCHITECTURE.md`.
5. Don't assume: if something is unclear or undecided, ask the owner.
6. Stay within the task's scope.
7. Report honestly; never claim a check you didn't run.

Tasks live in `TODO.md` and `docs/tasks/`. Run `npm run check` before reporting a task done.
