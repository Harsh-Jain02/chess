@AGENTS.md

<!--
Claude Code loads this file automatically. The line above imports AGENTS.md,
which holds all project instructions. Keep this file tiny so there is exactly
one source of truth.
-->

## Claude Code notes

- `.claude/settings.json` blocks git write commands and dependency installs, and pre-approves `npm test`, `npm run check` and `npm run check:size`. It's a safety net only: the rules in AGENTS.md also apply to everything it doesn't catch.
- Personal overrides go in `.claude/settings.local.json` (git-ignored).
