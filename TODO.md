# TODO

The task board, one line per task. Full details for each task are in [docs/tasks/](docs/tasks/).

**To run a task:** pick the first unticked task whose dependencies are all ticked and that has no unanswered ⚠ question. Start a fresh agent session and paste:

> Read AGENTS.md. Then do task T04 from docs/tasks/T04-engine-queries.md. Ask me before assuming anything.

The agent ticks `[x]` when the acceptance criteria pass. The owner reviews the diff and commits.

**O** = owner only (git, installs, GitHub settings) · **T** = agent or human · **⚠** = open question below

## Open questions for the owner

Answer these before starting the linked task: write the answer after the question and remove the ⚠ from the task line.

- Q1 (T14): Ask for confirmation before "New game" when at least one move has been played? *Recommended: yes.* **Answer: yes, but don't ask once the game is over (checkmate or a draw).**
- Q2 (T15): Allow Undo after checkmate or a draw? (It would re-open the game.) *Recommended: yes.* **Answer: no.**
- Q3 (T15): Does one Undo click take back one move (one player's move)? *Recommended: yes.* **Answer: yes.**
- Q4 (T18): Remember board orientation (flipped or not) across a page refresh? *Recommended: yes.* **Answer: yes.**

## Phase 0: owner setup ([owner-tasks.md](docs/tasks/owner-tasks.md))

- [x] O1 git init, first commit, create public GitHub repo, push · *do first*
- [x] O2 Add chess.js 1.4.0 to `vendor/` · *before T04*
- [x] O3 Add piece SVGs to `assets/pieces/` · *before T08*
- [ ] O4 Turn on GitHub Pages (source: GitHub Actions) · *after T03*
- [ ] O5 Decide the project license · *not blocking*

## Phase 1: tooling and page shell

- [x] [T01](docs/tasks/T01-tooling.md) package.json + file-size check · deps: none
- [x] [T02](docs/tasks/T02-page-shell.md) Page shell: index.html, base CSS, entry module · deps: none
- [x] [T03](docs/tasks/T03-ci-deploy.md) GitHub Actions: test, then deploy · deps: T01, T02

## Phase 2: rules engine (pure JS, unit-tested)

- [x] [T04](docs/tasks/T04-engine-queries.md) Engine adapter: position queries and legal targets · deps: O2, T01
- [x] [T05](docs/tasks/T05-engine-moves.md) Engine adapter: move, undo, replay · deps: T04
- [x] [T06](docs/tasks/T06-game-status.md) Game status: check, checkmate, draws · deps: T05
- [x] [T07](docs/tasks/T07-captures-logic.md) Captured pieces logic · deps: T05

## Phase 3: playable board

- [x] [T08](docs/tasks/T08-board-render.md) Draw the board and pieces · deps: O3, T02, T04
- [x] [T09](docs/tasks/T09-selection-logic.md) Click-to-move logic (pure) · deps: T05
- [x] [T10](docs/tasks/T10-wire-moves.md) Wire clicks to moves · deps: T06, T08, T09
- [x] [T11](docs/tasks/T11-highlights.md) Move guidance highlights · deps: T10
- [x] [T12](docs/tasks/T12-promotion-dialog.md) Promotion dialog · deps: T11
- [x] [T13](docs/tasks/T13-status-view.md) Status line and game over · deps: T10

## Phase 4: controls and features

- [x] [T14](docs/tasks/T14-new-game-flip.md) New game + flip board buttons · deps: T13
- [x] [T15](docs/tasks/T15-undo.md) Undo button · deps: T14
- [x] [T16](docs/tasks/T16-captured-view.md) Captured pieces display · deps: T07, T10
- [x] [T17](docs/tasks/T17-storage.md) Save/load module (pure) · deps: T01
- [x] [T18](docs/tasks/T18-persistence.md) Survive page refresh · deps: T05, T15, T17

## Phase 5: release

- [x] [T19](docs/tasks/T19-responsive.md) Mobile and responsive pass · deps: T12–T18
- [x] [T20](docs/tasks/T20-credits-howto.md) On-page credits + README "How to play" · deps: T19
- [x] [T21](docs/tasks/T21-qa-checklist.md) QA checklist with verified move sequences · deps: T18
- [ ] O6 Owner runs `docs/QA.md` in a desktop and a phone browser, then ships · deps: T19–T21

## Backlog (agreed, not scheduled)

- [ ] [B01](docs/tasks/B01-move-history.md) Move history list (1. e4 e5 2. Nf3 …)

## Ideas (not planned; owner decides; no task files)

- Drag-and-drop moves (owner: "maybe in future, no plan as of now")
- Last-move highlight · chess clock · resign / offer draw · FIDE-style "claim draw" mode
- PGN export/import · sounds · material advantage (+3) · hints on/off toggle
- Automated browser tests (needs a dependency such as Playwright, so owner approval is required)
