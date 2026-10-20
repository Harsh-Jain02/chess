# T16 · Captured pieces display

**Phase:** 4 (controls and features) · **Depends on:** T07, T10 · **Size:** S

## Goal

Each player can see which of the opponent's pieces they have captured.

## Read first

- `js/engine/captures.js` (contract), `js/ui/pieces.js`, `js/controller.js` (`render`)
- `index.html` (`#captured-by-w`, `#captured-by-b`), `css/controls.css`

## Contract

`js/ui/captured-view.js`: `renderCaptured(el, label, pieces)`

- `label`: text such as `"White captured"`.
- `pieces`: a `Piece[]` that is already in display order.
- Renders the label and one small `<img>` per piece (`pieceImageUrl`, `alt` = `pieceName`). When the list is empty it shows the label with "none" so the layout doesn't jump.

Controller `render()`:

- `const captured = getCaptured(game.history())`
- `#captured-by-w` shows label "White captured" and black pieces `captured.w.map(type => ({ color: 'b', type }))`
- `#captured-by-b` shows label "Black captured" and white pieces from `captured.b`

## Acceptance criteria

- [ ] Browser: capture a few pieces with each side and they appear under the correct label, in q, r, b, n, p order
- [ ] Undo removes the piece from the list (if T15 is done); New game clears both lists
- [ ] An en passant capture shows a pawn
- [ ] Fits on a 360px-wide screen with 15 captured pieces (wraps, no overflow)
- [ ] `npm run check` passes

## Out of scope

- A material score such as "+3" (TODO.md → Ideas).
