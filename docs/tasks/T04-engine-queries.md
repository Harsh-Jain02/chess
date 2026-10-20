# T04 · Engine adapter, part 1: position queries and legal targets

**Phase:** 2 (rules engine) · **Depends on:** O2, T01 · **Size:** M

## Goal

Create `js/engine/game.js`, the **only** file that imports chess.js. Everything else talks to our small API. This part covers reading the position and listing legal target squares, the data behind the move highlights.

## Read first

- `docs/ARCHITECTURE.md`: "Data shapes" and "chess.js API we use" (incl. Gotchas)
- `docs/DECISIONS.md`: D02, D16
- Do **not** read `vendor/chess.js/chess.js` in full; `grep` it if you need to confirm a detail.

## Do

1. Create `js/types.js` containing only JSDoc `@typedef`s for every shape in ARCHITECTURE → Data shapes, plus `export {};` so it is a module.
2. Create `js/engine/game.js`, exporting `createGame` (a factory that closes over one `Chess` instance).
3. Create `tests/engine/game.test.js`.

## Contract

- `createGame({ fen } = {}) → Game`. With no `fen` it uses the standard start position. An invalid FEN throws `Error('Invalid FEN')`; that's only used by tests.
- `game.turn() → 'w' | 'b'`
- `game.fen() → string`
- `game.pieceAt(square) → Piece | null` (`null` for an empty square, never `undefined`)
- `game.legalTargets(from) → Target[]`:
  - One entry per destination square: `{ to, isCapture, isPromotion }`. The four promotion moves to one square become one target.
  - `isCapture` is `true` for en passant. Use `captured`, not `isCapture()` (see Gotchas).
  - Returns `[]` if `from` is empty, holds a piece of the side *not* to move, or the piece can't move.
- `game.kingSquare(color) → Square`
- `game.flags() → { inCheck, checkmate, stalemate, threefold, fiftyMoves, insufficientMaterial }`, booleans straight from chess.js.

## Acceptance criteria (tests in `tests/engine/game.test.js`)

- [ ] Start position: `turn()` is `'w'`; `pieceAt('e1')` is `{ color: 'w', type: 'k' }`; `pieceAt('e4')` is `null`
- [ ] Knight on b1 at the start has exactly the targets a3 and c3
- [ ] Asking for a black piece's targets on white's turn returns `[]`
- [ ] A pinned piece has no targets (build the FEN yourself; comment what it shows)
- [ ] A pawn on the 7th rank gets one target per destination with `isPromotion: true`, not four
- [ ] An en passant target is reported with `isCapture: true`
- [ ] Castling: the king's targets include g1 when castling is legal, and exclude it when f1 is attacked
- [ ] `kingSquare('b')` at the start is `'e8'`
- [ ] `flags()` after fool's mate (`rnb1kbnr/pppp1ppp/8/4p3/5PPq/8/PPPPP2P/RNBQKBNR w KQkq - 1 3`) has `checkmate: true` and `inCheck: true`
- [ ] `npm run check` passes

## Out of scope

- Making moves, undo, replay (T05).
- Turning flags into a winner or a reason (T06).
