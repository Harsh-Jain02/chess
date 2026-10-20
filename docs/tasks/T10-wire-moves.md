# T10 · Wire clicks to moves

**Phase:** 3 (playable board) · **Depends on:** T06, T08, T09 · **Size:** M

## Goal

Two people can play legal moves by clicking. Highlights (T11), promotion (T12) and the status line (T13) come next.

## Read first

- `js/main.js`, `js/ui/board-view.js`, `js/state/selection.js`, `js/engine/status.js` (exports only)
- `docs/ARCHITECTURE.md`: "Layers", "What happens on a click"

## Contract

`js/controller.js`: `createController({ elements, game, orientation }) → { render }`

- Holds app state `{ game, selection, orientation }`. `selection` starts as `emptySelection`.
- Adds **one** `click` listener on `elements.board` (event delegation): `event.target.closest('[data-square]')`, then reads `dataset.square`.
- On a square click:
  1. `status = getStatus(game)`
  2. `{ selection, move } = clickSquare(selection, square, game, status.isOver)`
  3. If there's a `move`, call `game.move(move)`. It should never return `null` here; if it does, `console.warn` and continue.
  4. Call `render()`.
- `render()` calls `renderBoard(elements.board, { game, orientation, selected, targets, checkSquare })` using the current state.
- For now, `pendingPromotion` just waits (nothing happens until T12 adds the dialog).

`js/main.js` becomes boot only: look up the elements by id (see ARCHITECTURE → Page elements), `createGame()`, `createController(...)`, call `render()` once.

## Acceptance criteria

- [ ] Browser: play `1. e4 e5 2. Nf3 Nc6` by clicking; turns alternate; clicking black pieces on white's turn does nothing
- [ ] Clicking a square the selected piece can't reach just deselects it
- [ ] Castling works (click the king, then the square two to the side); en passant works
- [ ] No console errors
- [ ] `controller.js` and `main.js` are each under 200 lines; `npm run check` passes

## Out of scope

- Visual highlights (T11), promotion (T12), status text (T13), buttons (T14+), saving (T18).
