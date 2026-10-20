# T08 · Draw the board and pieces

**Phase:** 3 (playable board) · **Depends on:** O3, T02, T04 · **Size:** M

## Goal

The real board appears on the page with the starting position, in either orientation. No clicking yet.

## Read first

- `index.html`, `css/base.css`, `js/main.js`
- `docs/ARCHITECTURE.md`: "Page elements", "Module map" (ui rows), "What happens on a click" (last paragraph)
- `docs/DECISIONS.md`: D06, D17

## Contract

`js/ui/pieces.js`:

- `pieceImageUrl(piece) → string`, e.g. `{ color: 'w', type: 'n' }` → `'assets/pieces/wN.svg'` (relative URL)
- `pieceName(piece) → string`, e.g. `'white knight'`

`js/ui/board-view.js` (it must not touch `document` at import time):

- `squareOrder(orientation) → Square[]`: the 64 squares in DOM order, top-left first. `'w'`: a8, b8 … h8, a7 … h1. `'b'`: h1, g1 … a1, h2 … a8.
- `isLightSquare(square) → boolean`: a1 is dark, h1 is light.
- `renderBoard(boardEl, view)` where `view = { game, orientation, selected, targets, checkSquare }`.
  - `selected`, `targets` and `checkSquare` are used from T11 onward. Accept them now and ignore them.
  - Replaces the contents of `boardEl` with 64 `<button type="button">` elements, each with:
    - `class="square is-light"` or `class="square is-dark"`
    - `data-square="e4"`
    - an `aria-label` such as `"e4, white knight"`, or `"e4, empty"` for an empty square
  - A piece is an `<img>` inside the button with `src` from `pieceImageUrl`, `alt=""` (the button's label already names it) and `draggable="false"`.
  - Coordinates: small file letters on the bottom row and rank numbers on the left column, correct for both orientations.

`css/board.css`: an 8×8 CSS grid filling `#board`; square colors come from tokens in `base.css`; the piece image fills about 90% of the square.

`js/main.js`: temporary wiring. Create a game and call `renderBoard` with orientation `'w'`. T10 replaces this.

## Acceptance criteria

- [ ] Unit tests (`tests/ui/pieces.test.js`, `tests/ui/board-view.test.js`):
  - `squareOrder` for both orientations: length 64, no duplicates, correct first and last square
  - `isLightSquare` for a1, h1, a8, h8
  - `pieceImageUrl` and `pieceName`
- [ ] Browser: start position correct: white at the bottom, white queen on d1, h1 is a light square, coordinates a–h along the bottom and 1–8 up the left
- [ ] Browser: temporarily passing `'b'` shows black at the bottom with coordinates flipped (revert afterwards)
- [ ] Looks right at 360px and 1280px widths; no console errors
- [ ] `npm run check` passes

## Out of scope

- Click handling (T10), highlights (T11), flip button (T14).
