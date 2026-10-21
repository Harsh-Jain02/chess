# Chess: two players, one screen

A chess game in the browser for two people sharing one device. Players take turns on the same screen. Only legal moves are allowed, and when you pick up a piece the board shows every square it can move to.

It's a static website (plain HTML, CSS and JavaScript, no build step) hosted on GitHub Pages. The chess rules come from [chess.js](https://github.com/jhlywa/chess.js).

**Live site:** `https://<user>.github.io/<repo>/`

## How to play

White moves first, then the players take turns using the same screen. Select one of
your pieces to show its legal destinations: a dot marks an empty square and a ring
marks a piece you can capture. Select a highlighted square to make the move, or
select another of your pieces to change your choice.

When a pawn reaches the other end of the board, choose whether to promote it to a
queen, rook, bishop or knight. The status above the board shows whose turn it is,
warns when a king is in check, and announces checkmate, stalemate or another draw
when the game ends.

Use **Undo** to take back the latest move during an active game. **New game** starts
again from the initial position, and **Flip board** rotates the board so either
player's pieces can appear closest to them. Captured pieces are shown beside the
board.

Your moves and board orientation are saved automatically in this browser, so a page
refresh continues the same game.

## Run it locally

Requirements: a modern browser, Python 3 (or any static file server) and Node.js 24+ for the tests.

```bash
python3 -m http.server 8000     # then open http://localhost:8000
npm test                        # unit tests (no npm install needed: zero dependencies)
npm run check                   # tests + "no file over 200 lines" check
```

Opening `index.html` directly from disk (`file://`) won't work, because browsers block ES modules there.

## Deployment

Every push to `main` triggers GitHub Actions. It runs the tests and the file-size check, and deploys to GitHub Pages only if both pass. Pull requests run the checks but don't deploy. One-time setup is owner task O4 in [docs/tasks/owner-tasks.md](docs/tasks/owner-tasks.md).

## Working on this project with AI coding agents

The repo is set up so that an AI agent (Claude Code, OpenAI Codex, GitHub Copilot) or a human can pick up one small, well-defined task at a time.

| File | Purpose |
|---|---|
| [AGENTS.md](AGENTS.md) | Rules, commands, conventions. The single source of truth |
| [CLAUDE.md](CLAUDE.md) | Imports AGENTS.md for Claude Code |
| [.github/copilot-instructions.md](.github/copilot-instructions.md) | Points Copilot to AGENTS.md and repeats the hard rules |
| [.claude/settings.json](.claude/settings.json) | Blocks git writes and installs for Claude Code |
| [TODO.md](TODO.md) | Task board and open questions |
| [docs/tasks/](docs/tasks/) | One file per task: goal, files to read, contract, acceptance criteria |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Modules, data shapes, the chess.js API we use |
| [docs/DECISIONS.md](docs/DECISIONS.md) | What was decided and why |

**Prompt to hand a task to an agent** (start a fresh session for each task):

> Read AGENTS.md. Then do task T04 from docs/tasks/T04-engine-queries.md. Ask me before assuming anything.

**Keeping AI usage cheap:**

- **One task per session.** Old conversation history costs tokens and can confuse the agent.
- **Name the task file in the prompt,** so the agent doesn't spend tokens searching the repo.
- **Review before committing.** Agents never commit. Review `git diff`, run `npm run check`, then commit using the agent's suggested message.
- **Split tasks that grow.** If a task turns out bigger than expected, stop and split it into smaller tasks with [docs/tasks/_TEMPLATE.md](docs/tasks/_TEMPLATE.md).

## License

Not decided yet. Until a `LICENSE` file is added, all rights are reserved. Third-party code and images keep their own licenses; see [CREDITS.md](CREDITS.md).
