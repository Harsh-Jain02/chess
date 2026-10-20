# T13 · Status line and game over

**Phase:** 3 (playable board) · **Depends on:** T10 · **Size:** S

## Goal

Players always know whose turn it is, when they are in check, and how the game ended.

## Read first

- `docs/ARCHITECTURE.md`: "Data shapes" (`Status`, `Reason`)
- `js/controller.js` (`render`), `index.html` (`#status`)

## Contract

`js/ui/status-view.js`:

- `statusText(status) → string`, a pure function. Exact texts:

| Situation | Text |
|---|---|
| Normal | `White to move` / `Black to move` |
| In check | `White to move — check!` / `Black to move — check!` |
| Checkmate | `Checkmate — White wins` / `Checkmate — Black wins` |
| Stalemate | `Draw — stalemate` |
| Insufficient material | `Draw — insufficient material` |
| Threefold repetition | `Draw — threefold repetition` |
| 50-move rule | `Draw — 50-move rule` |

- `renderStatus(el, status)` sets the text, and adds the class `is-over` while `status.isOver` is true (remove it otherwise). `#status` already has `aria-live="polite"`.

Controller: call `renderStatus` in `render()`. When the game is over the board already ignores clicks (selection rule 1).

## Acceptance criteria

- [ ] Tests for every row of the table above
- [ ] Browser: the text updates after every move; fool's mate (`1. f3 e5 2. g4 Qh4#`) shows "Checkmate — Black wins" and no further moves are possible
- [ ] `npm run check` passes

## Out of scope

- Buttons (T14+), sounds, animations.
