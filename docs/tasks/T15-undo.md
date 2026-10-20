# T15 · Undo button

**Phase:** 4 (controls and features) · **Depends on:** T14 · **Size:** S

## Goal

Players can take back a move, which is useful in casual play on one screen.

## Read first

- `js/ui/controls.js`, `js/controller.js`
- `TODO.md` → Open questions **Q2** and **Q3** (must be answered first)

## Contract

- `renderControls(controlsEl, { canUndo })` adds `<button type="button" data-action="undo">Undo</button>`, which is `disabled` when `canUndo` is false.
- `bindControls` gets `handlers.onUndo()`.
- Controller:
  - `canUndo = game.history().length > 0`. If Q2 = no, it is also false while the game is over.
  - On Undo: call `game.undo()` once per click (if Q3 = "one move"), set selection to `emptySelection` (this also cancels any selection in progress), then `render()`.

## Acceptance criteria

- [ ] Browser: play 3 moves, press Undo 3 times, and you're back at the start position with Undo disabled
- [ ] Browser: after fool's mate (`1. f3 e5 2. g4 Qh4#`), Undo behaves as decided in Q2. If allowed: the game re-opens with "Black to move"
- [ ] Undoing a capture brings the piece back; undoing castling puts the rook back too
- [ ] `npm run check` passes

## Out of scope

- Redo, multi-step undo, undo history UI.

## Owner decisions needed

- **Q2:** allow Undo after the game is over? **Q3:** one click = one player's move? (TODO.md)
