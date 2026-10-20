# T07 · Captured pieces (logic)

**Phase:** 2 (rules engine) · **Depends on:** T05 · **Size:** S

## Goal

A pure function that works out which pieces each side has captured, from the move history. It is derived data, so it's automatically correct after Undo or a page refresh.

## Read first

- `docs/ARCHITECTURE.md`: "Data shapes" (`MoveRecord`)

## Contract

`js/engine/captures.js`: `getCaptured(history) → { w: PieceType[], b: PieceType[] }`

- `w` = pieces **white has captured** (so, black pieces); `b` = pieces black has captured.
- Input: `game.history()`, an array of `MoveRecord`. Pure, with no chess.js import.
- Each list is sorted by value, highest first: `q, r, b, n, p`.
- En passant counts as a pawn capture.
- A captured promoted piece counts as its promoted type (that's what `captured` already reports).

## Acceptance criteria (tests in `tests/engine/captures.test.js`)

Build histories with real games (`createGame`/`replayGame` + `history()`) where practical, otherwise with hand-written `MoveRecord`s.

- [ ] Empty history gives `{ w: [], b: [] }`
- [ ] A simple capture lands in the capturing side's list
- [ ] An en passant capture adds `'p'`
- [ ] A pawn that captures while promoting adds the captured piece (not the pawn)
- [ ] Sort order: `q, r, b, n, p`
- [ ] Input array is not mutated
- [ ] `npm run check` passes

## Out of scope

- Displaying the pieces (T16). A material score like "+3" is not requested (see TODO.md → Ideas).
