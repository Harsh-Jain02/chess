# T18 · Survive a page refresh

**Phase:** 4 (controls and features) · **Depends on:** T05, T15, T17 · **Size:** S

## Goal

An accidental refresh or closed tab doesn't lose the game.

## Read first

- `js/state/storage.js`, `js/engine/game.js` (`replayGame`, `moveList`), `js/main.js`, `js/controller.js`
- `docs/DECISIONS.md`: D15
- `TODO.md` → Open questions **Q4** (must be answered first)

## Do

1. **Boot (`main.js`):**
   - `storage = getBrowserStorage()`, `saved = loadGame(storage)`.
   - If there's a saved game, `game = replayGame(saved.moves)`. If that returns `null` (corrupt data), call `clearGame(storage)` and start a new game.
   - Orientation: the saved value if Q4 = yes, otherwise `'w'`.
   - Pass `storage` to the controller.
2. **Controller:** after every state change (move, undo, new game, flip), call `saveGame(storage, { moves: game.moveList(), orientation })`.
3. If saving fails, `console.warn` once and keep playing. Don't show an error to the players.

## Acceptance criteria

- [ ] Browser: play several moves, refresh, and you get the same position and the same side to move. Undo still works after the refresh
- [ ] Browser: threefold repetition across a refresh is still detected (the knight shuffle from T05, refreshing midway)
- [ ] Browser: in devtools (Application → Local Storage), change the value to `garbage` and refresh. A new game loads with no console errors
- [ ] Browser: a private/incognito window works (it may not persist; it must not crash)
- [ ] New game, then refresh, gives the start position
- [ ] `npm run check` passes

## Out of scope

- Saving to files or URLs, multiple games.

## Owner decisions needed

- **Q4:** remember orientation across refresh? (TODO.md)
