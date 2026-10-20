import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createGame } from '../../js/engine/game.js';

// Standard start position
const START = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

const NO_FLAGS = {
  inCheck: false,
  checkmate: false,
  stalemate: false,
  threefold: false,
  fiftyMoves: false,
  insufficientMaterial: false,
};

/** Targets sorted by destination, so tests don't depend on chess.js move order. */
const byTo = (targets) => [...targets].sort((a, b) => a.to.localeCompare(b.to));
const destinations = (targets) => targets.map((target) => target.to);

test('start position: white to move, white king on e1, e4 empty', () => {
  const game = createGame();
  assert.equal(game.turn(), 'w');
  assert.deepEqual(game.pieceAt('e1'), { color: 'w', type: 'k' });
  assert.equal(game.pieceAt('e4'), null);
});

test('fen() gives the start position by default, or the FEN the game started from', () => {
  assert.equal(createGame().fen(), START);
  // White king e1 and rook h1 against the black king e8, black to move
  const fen = '4k3/8/8/8/8/8/8/4K2R b K - 0 1';
  const game = createGame({ fen });
  assert.equal(game.fen(), fen);
  assert.equal(game.turn(), 'b');
});

test('an invalid FEN throws Error("Invalid FEN")', () => {
  assert.throws(() => createGame({ fen: 'not a fen' }), { message: 'Invalid FEN' });
  // A white king alone: the black king is missing
  assert.throws(() => createGame({ fen: '8/8/8/8/8/8/8/4K3 w - - 0 1' }), { message: 'Invalid FEN' });
});

test('pieceAt returns a copy, so changing it leaves the board alone', () => {
  const game = createGame();
  const king = game.pieceAt('e1');
  king.type = 'q';
  assert.deepEqual(game.pieceAt('e1'), { color: 'w', type: 'k' });
});

test('pieceAt returns null for a square that does not exist', () => {
  assert.equal(createGame().pieceAt('z9'), null);
});

test('knight on b1 at the start has exactly the targets a3 and c3', () => {
  assert.deepEqual(byTo(createGame().legalTargets('b1')), [
    { to: 'a3', isCapture: false, isPromotion: false },
    { to: 'c3', isCapture: false, isPromotion: false },
  ]);
});

test("a black piece has no targets on white's turn", () => {
  const game = createGame();
  assert.deepEqual(game.legalTargets('g8'), []);
  assert.deepEqual(game.legalTargets('e7'), []);
});

test('an empty square, a piece that cannot move, or a bad square name has no targets', () => {
  const game = createGame();
  assert.deepEqual(game.legalTargets('e4'), []);
  assert.deepEqual(game.legalTargets('a1'), []);
  assert.deepEqual(game.legalTargets('z9'), []);
  assert.deepEqual(game.legalTargets(''), []);
});

test('a pinned piece has no targets', () => {
  // The black rook on e8 pins the white knight on e2 to the white king on e1; black king h8
  const game = createGame({ fen: '4r2k/8/8/8/8/8/4N3/4K3 w - - 0 1' });
  assert.deepEqual(game.legalTargets('e2'), []);
  assert.deepEqual(destinations(byTo(game.legalTargets('e1'))), ['d1', 'd2', 'f1', 'f2']);
});

test('a pawn on the 7th rank gets one promotion target per destination, not four', () => {
  // White pawn b7 can push to b8 or take the black knights on a8 and c8; kings h8 and e1
  const game = createGame({ fen: 'n1n4k/1P6/8/8/8/8/8/4K3 w - - 0 1' });
  assert.deepEqual(byTo(game.legalTargets('b7')), [
    { to: 'a8', isCapture: true, isPromotion: true },
    { to: 'b8', isCapture: false, isPromotion: true },
    { to: 'c8', isCapture: true, isPromotion: true },
  ]);
});

test('an en passant target is reported as a capture', () => {
  // Black has just played d7-d5 beside the white pawn on e5, so exd6 en passant is legal
  const game = createGame({ fen: '4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 1' });
  assert.deepEqual(byTo(game.legalTargets('e5')), [
    { to: 'd6', isCapture: true, isPromotion: false },
    { to: 'e6', isCapture: false, isPromotion: false },
  ]);
});

test('castling: g1 is a king target when kingside castling is legal', () => {
  // White king e1 and rook h1 with kingside castling rights; nothing attacks f1 or g1
  const game = createGame({ fen: '4k3/8/8/8/8/8/8/4K2R w K - 0 1' });
  assert.ok(destinations(game.legalTargets('e1')).includes('g1'));
});

test('castling: g1 is not a king target when f1 is attacked', () => {
  // As above, but the black rook on f8 attacks f1, so the king can't castle through it
  const game = createGame({ fen: '4kr2/8/8/8/8/8/8/4K2R w K - 0 1' });
  assert.ok(!destinations(game.legalTargets('e1')).includes('g1'));
});

test('kingSquare finds each king', () => {
  const game = createGame();
  assert.equal(game.kingSquare('b'), 'e8');
  assert.equal(game.kingSquare('w'), 'e1');
  // The pinned-knight position: black king h8
  assert.equal(createGame({ fen: '4r2k/8/8/8/8/8/4N3/4K3 w - - 0 1' }).kingSquare('b'), 'h8');
});

test('flags are all false at the start', () => {
  assert.deepEqual(createGame().flags(), NO_FLAGS);
});

test("flags after fool's mate show checkmate and check", () => {
  // Fool's mate: 1. f3 e5 2. g4 Qh4#, white is checkmated
  const fen = 'rnb1kbnr/pppp1ppp/8/4p3/5PPq/8/PPPPP2P/RNBQKBNR w KQkq - 1 3';
  assert.deepEqual(createGame({ fen }).flags(), { ...NO_FLAGS, inCheck: true, checkmate: true });
});

test('flags report stalemate', () => {
  // Black king h8, white queen f7 and king g6: black to move has no legal move and isn't in check
  const game = createGame({ fen: '7k/5Q2/6K1/8/8/8/8/8 b - - 0 1' });
  assert.deepEqual(game.flags(), { ...NO_FLAGS, stalemate: true });
});

test('flags report insufficient material', () => {
  // Only the two kings are left
  const game = createGame({ fen: '4k3/8/8/8/8/8/8/4K3 w - - 0 1' });
  assert.deepEqual(game.flags(), { ...NO_FLAGS, insufficientMaterial: true });
});

test('flags report the fifty-move rule at a half-move clock of 100', () => {
  // White king e1 and rook h1 against the black king e8; 100 half-moves without a capture or pawn move
  const game = createGame({ fen: '4k3/8/8/8/8/8/8/4K2R w - - 100 80' });
  assert.deepEqual(game.flags(), { ...NO_FLAGS, fiftyMoves: true });
});
