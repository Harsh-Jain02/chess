# T01 · Tooling: package.json and file-size check

**Phase:** 1 (tooling and page shell) · **Depends on:** none · **Size:** S

## Goal

Give every later task the same commands (`npm test`, `npm run check`) and make the "max 200 lines per file" rule enforced by a script instead of memory.

## Read first

- `AGENTS.md`: hard rule 3 and the Commands table
- `docs/DECISIONS.md`: D03, D04

## Do

1. Create `package.json`:
   - `"name": "chess"`, `"private": true`, `"type": "module"`, `"engines": { "node": ">=24" }`
   - **No** `dependencies` and **no** `devDependencies`.
   - Scripts: `test` runs Node's built-in test runner over `tests/**/*.test.js`; `check:size` runs `node scripts/check-file-size.js`; `check` runs `test`, then `check:size`.
   - Confirm `npm test` actually discovers the test file. Node's glob support for test paths differs between versions, so check the output count rather than trusting the syntax.
2. Create `scripts/check-file-size.js`:
   - Constants at the top: `MAX_LINES = 200`, excluded directories `.git node_modules _site vendor assets`, checked extensions `.js .css .html .md .json .yml .yaml`.
   - Walk the repo from its root (the parent of `scripts/`), skipping excluded directories at any depth.
   - For each failing file print `path: N lines (max 200)` and exit with code 1. If none fail, print `All files ≤ 200 lines` and exit 0.
   - Export the pure parts so they can be tested: `countLines(text)` and `isChecked(relativePath)`. Only do the walk when the file is run directly, not when it's imported.
   - `countLines` matches `wc -l` for text ending in a newline. Text without a trailing newline counts its last line too. Empty text = 0.
3. Create `tests/scripts/check-file-size.test.js` for `countLines` and `isChecked`.

## Contract

- `npm test`, `npm run check:size`, `npm run check` behave as described above.
- `countLines(text) → number`, `isChecked(relativePath) → boolean`.

## Acceptance criteria

- [ ] `npm test` runs and passes, and reports this task's tests
- [ ] `npm run check` passes on the current repo
- [ ] A temporary 201-line `.md` file makes `npm run check:size` fail and name that file (delete the file afterwards)
- [ ] Files inside `vendor/` or `assets/` are never reported
- [ ] No dependencies added; no `node_modules/`; no lock file

## Out of scope

- Linters or formatters (ESLint, Prettier): they would be dependencies.
- The CI workflow (T03).
