# T17 · Save/load module (pure, injected storage)

**Phase:** 4 (controls and features) · **Depends on:** T01 · **Size:** S

## Goal

A small, safe module for saving and loading the game in the browser. It never crashes, even with corrupt data or when storage is blocked (some private-browsing modes throw on access).

## Read first

- `docs/ARCHITECTURE.md`: "Data shapes" (`SavedGame`)
- `docs/DECISIONS.md`: D15

## Contract

`js/state/storage.js`. Every function takes the storage object as a parameter (anything with `getItem`, `setItem`, `removeItem`) so tests can pass a fake. **No function throws.**

- `STORAGE_KEY = 'chess.savedGame'`
- `getBrowserStorage() → Storage | null`: returns `window.localStorage`, or `null` if it's missing or accessing it throws. It's only called at runtime, never at import time.
- `saveGame(storage, { moves, orientation }) → boolean`: writes `JSON.stringify({ version: 1, moves, orientation })`. Returns `false` if `storage` is `null` or `setItem` throws (e.g. quota exceeded).
- `loadGame(storage) → { moves, orientation } | null`. Returns `null` if:
  - `storage` is `null`, or nothing is saved, or the JSON is invalid
  - `version !== 1`
  - `moves` isn't an array of strings
  - `orientation` isn't `'w'` or `'b'`
- `clearGame(storage) → void`

This module does **not** check whether the moves are legal. The caller does that with `replayGame` (T18).

## Acceptance criteria (tests in `tests/state/storage.test.js`, with a `Map`-based fake storage)

- [ ] Save then load returns the same data
- [ ] Nothing saved gives `null`; invalid JSON gives `null`; wrong version gives `null`; bad `moves` gives `null`; bad `orientation` gives `null`
- [ ] A storage whose `setItem` throws makes `saveGame` return `false` without throwing; a `getItem` that throws makes `loadGame` return `null`
- [ ] `null` storage: save returns `false`, load returns `null`, clear does nothing
- [ ] Importing the module in Node doesn't touch `window`
- [ ] `npm run check` passes

## Out of scope

- Wiring it into the app (T18). Multiple save slots.
