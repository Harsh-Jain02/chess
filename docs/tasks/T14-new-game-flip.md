# T14 · New game and Flip board buttons

**Phase:** 4 (controls and features) · **Depends on:** T13 · **Size:** S

## Goal

Players can start over, and either player can turn the board around.

## Read first

- `js/controller.js`, `index.html` (`#controls`), `css/controls.css`
- `docs/DECISIONS.md`: D06
- `TODO.md` → Open questions **Q1** (must be answered first)

## Contract

`js/ui/controls.js`:

- `renderControls(controlsEl, state)`: builds the buttons once, and on later calls only updates them. In this task `state` is `{}`; T15 adds `canUndo`.
  - Buttons: `<button type="button" data-action="new-game">New game</button>` and `<button type="button" data-action="flip">Flip board</button>`.
- `bindControls(controlsEl, handlers)`: **one** click listener (event delegation) that calls `handlers.onNewGame()` or `handlers.onFlip()` based on `data-action`.

Controller:

- **New game:** if Q1 = yes and at least one move has been played, ask `confirm('Start a new game? The current game will be lost.')` first. Then use a fresh game (`createGame()`), set selection to `emptySelection`, keep the orientation, and `render()`.
- **Flip board:** toggle orientation `'w'` ↔ `'b'`, keep the selection, `render()`.

## Acceptance criteria

- [ ] Browser: after a few moves, New game (with confirm, if Q1 = yes) resets to the start position with white to move; cancelling the confirm keeps the game
- [ ] Browser: Flip shows black at the bottom with the coordinates flipped; the game continues normally and the highlights still land on the right squares
- [ ] Buttons are at least 44px tall (easy to tap)
- [ ] `npm run check` passes

## Out of scope

- Undo (T15), saving (T18), styled confirm dialog.

## Owner decisions needed

- **Q1:** confirm before New game? (TODO.md)
