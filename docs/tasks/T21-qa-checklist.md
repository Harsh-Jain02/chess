# T21 · QA checklist with verified move sequences

**Phase:** 5 (release) · **Depends on:** T18 · **Size:** M

## Goal

A manual test script the owner can follow in a browser before every release, where **every move sequence has been proven correct by an automated test**, so the checklist never contains a made-up line.

## Read first

- `js/engine/game.js` (`replayGame`), `js/engine/status.js`
- `docs/ARCHITECTURE.md`: "Testing strategy"

## Do

1. Create `tests/qa/sequences.js`, which exports named sequences as LAN arrays with their expected end state. For example: `{ name: "Fool's mate", moves: ['f2f3','e7e5','g2g4','d8h4'], expect: { isOver: true, winner: 'b', reason: 'checkmate' } }`.
2. Create `tests/qa/sequences.test.js`, which replays each sequence with `replayGame` and asserts its `expect` with `getStatus` (or with targets or pieces for the non-final checks).
3. Create `docs/QA.md` from those sequences. For each scenario give: the start (New game), the moves to click in normal notation (e.g. `1. f3 e5 2. g4 Qh4#`), and the expected result on screen. Scenarios:
   - Knight at the start shows exactly two dots; a pinned piece shows no dots
   - Castling kingside and queenside; castling not offered when passing through an attacked square
   - En passant offered right after the double step, and not one move later
   - Promotion to each piece, plus Cancel
   - Check highlight and status text; checkmate (fool's mate) ends the game
   - Stalemate: find a short sequence, prove it in the test first
   - Threefold repetition (the knight shuffle)
   - Insufficient material: give a sequence only if you can prove a reasonably short one; otherwise write "covered by unit tests (T06)"
   - Undo (incl. after game over, per Q2), New game, Flip, captured pieces, refresh persistence, phone layout
4. Keep `docs/QA.md` under 200 lines (split into `docs/QA-*.md` if needed).

## Acceptance criteria

- [ ] Every sequence in `docs/QA.md` appears in `tests/qa/sequences.js` and passes its test
- [ ] `npm run check` passes

## Out of scope

- Automating the browser (needs a dependency; owner decision).
