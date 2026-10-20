# B01 · Move history list (backlog)

**Phase:** backlog. **Not scheduled:** the owner moves it into TODO.md when wanted. · **Depends on:** v1 done (T21) · **Size:** M

## Goal

Show the moves played so far in standard notation, numbered: `1. e4 e5 2. Nf3 Nc6 …`.

## Read first

- `js/engine/game.js` (`history()` gives `san`), `js/controller.js`, `css/controls.css`, `index.html`

## Contract (proposal; confirm with the owner when scheduling)

- `js/ui/history-view.js`:
  - `formatMoveRows(history) → { number, white, black }[]`, a pure function. If black hasn't moved yet in the last row, `black` is `''`.
  - `renderHistory(el, rows)`: a two-column list that scrolls to the latest move.
- New element `#history` in the side panel. On narrow screens it goes below the controls and is limited in height (scrolls).
- Updates after every move, undo, new game and restore.

## Acceptance criteria

- [ ] Tests for `formatMoveRows` (empty, odd and even number of moves, castling `O-O`, promotion `e8=Q`, check `+`, mate `#`)
- [ ] Browser: list matches the game; Undo removes the last move; works on a phone
- [ ] `npm run check` passes

## Owner decisions needed (when scheduling)

- Clicking a past move to view that position: no (not requested). Confirm.
- Placement on desktop and mobile.
