# T09 · Click-to-move logic (pure)

**Phase:** 3 (playable board) · **Depends on:** T05 · **Size:** S

## Goal

All the "what happens when I click a square" rules live in one pure, tested module, so the DOM code stays simple.

## Read first

- `docs/ARCHITECTURE.md`: "Data shapes" (`Selection`, `Target`, `MoveInput`) and "What happens on a click"
- `docs/DECISIONS.md`: D05
- `js/engine/game.js`: exports only

## Contract

`js/state/selection.js`. Never mutates its inputs and never calls `game.move`.

- `emptySelection`: a frozen `{ selected: null, targets: [], pendingPromotion: null }`
- `clickSquare(selection, square, game, isOver) → { selection, move }`, where `move` is a `MoveInput` or `null`. Apply the first rule that matches:
  1. `isOver`: return `emptySelection` and `move: null`.
  2. `selection.pendingPromotion` is set: ignore the click (return `selection` unchanged, `move: null`).
  3. A piece is selected and `square` is one of its targets:
     - promotion target: keep `selected` and `targets`, set `pendingPromotion: { from, to }`, `move: null`;
     - otherwise: return `emptySelection` and `move: { from, to }`.
  4. `square` holds a piece of the side to move:
     - it's the selected square: deselect (`emptySelection`);
     - otherwise select it, with `targets = game.legalTargets(square)`. A piece with no targets is still selected, so the player can see it has no moves.
  5. Anything else: `emptySelection`, `move: null`.
- `choosePromotion(selection, pieceType) → { selection: emptySelection, move: { from, to, promotion } }`. If there's no pending promotion, return `{ selection, move: null }`.
- `cancelPromotion(selection) → emptySelection`. The pawn doesn't move.

## Acceptance criteria (tests in `tests/state/selection.test.js`, using real games)

- [ ] Selecting your own piece gives its targets; clicking it again deselects; clicking another of your pieces switches the selection
- [ ] Clicking an opponent's piece that is not a target deselects; clicking an empty non-target square deselects
- [ ] Clicking a target returns the move and an empty selection
- [ ] Capturing: clicking an opponent's piece that *is* a target returns the move
- [ ] Promotion flow: select the pawn, click the last-rank square, get `pendingPromotion`; `choosePromotion(…, 'n')` returns a move with `promotion: 'n'`; `cancelPromotion` returns `emptySelection`
- [ ] While `pendingPromotion` is set, clicks are ignored
- [ ] When `isOver` is true, nothing can be selected
- [ ] Inputs are not mutated (deep-equal before and after)
- [ ] `npm run check` passes

## Out of scope

- DOM, the dialog (T12), applying moves (T10).
