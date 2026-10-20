# T05 · Engine adapter, part 2: move, undo, history, replay

**Phase:** 2 (rules engine) · **Depends on:** T04 · **Size:** M

## Goal

The game can be played, taken back, and rebuilt from a saved list of moves (needed for Undo and for surviving a page refresh).

## Read first

- `js/engine/game.js`, `tests/engine/game.test.js`
- `docs/ARCHITECTURE.md`: "Data shapes" (`MoveInput`, `MoveRecord`) and "chess.js API we use"
- `docs/DECISIONS.md`: D15, D16

## Contract (add to `js/engine/game.js`; if it would pass 200 lines, move helpers into a new `js/engine/` file)

- `game.move({ from, to, promotion }) → MoveRecord | null`
  - **Never throws.** An illegal move returns `null` and leaves the game unchanged.
  - Promotion moves need `promotion` (`'q' | 'r' | 'b' | 'n'`); without it they return `null`.
- `game.undo() → MoveRecord | null` (`null` when there is nothing to undo)
- `game.history() → MoveRecord[]`, oldest first
- `game.moveList() → string[]` in long algebraic notation: `['e2e4', 'e7e5', …, 'b7a8q']`
- `replayGame(moveList) → Game | null` (exported): plays the moves from the start position. Returns `null` if the argument isn't an array of strings, or if any move is malformed or illegal.
- `MoveRecord` is a **plain object** with fields copied from chess.js's `Move`: `color, piece, from, to, captured?, promotion?, san, lan`.

## Acceptance criteria (tests)

- [ ] A legal move changes `turn()`; an illegal move returns `null` and `fen()` is unchanged
- [ ] Castling kingside and queenside both move the rook as well
- [ ] En passant removes the captured pawn; the record has `captured: 'p'`
- [ ] Promotion to each of q, r, b, n works; a promotion move without `promotion` returns `null`
- [ ] `undo()` restores the previous `fen()` and turn; `undo()` on a new game returns `null`
- [ ] `replayGame(game.moveList()).fen() === game.fen()` after a few moves including a capture
- [ ] `replayGame(['e2e5'])`, `replayGame(['xyz'])`, `replayGame('e2e4')` all return `null`; `replayGame([])` is a new game
- [ ] Threefold repetition is still detected after a replay: `['g1f3','g8f6','f3g1','f6g8','g1f3','g8f6','f3g1','f6g8']` gives `flags().threefold === true`
- [ ] `npm run check` passes

## Out of scope

- The status/result object (T06), captured lists (T07), saving (T17).
