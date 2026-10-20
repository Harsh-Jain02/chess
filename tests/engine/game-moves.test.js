// Tests for move, undo, history, moveList and replayGame (T05).
// Position queries and flags (T04) are in game.test.js.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createGame, replayGame } from '../../js/engine/game.js';

// Standard start position
const START = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

// Kings e1/e8 with all four rooks at home and full castling rights; nothing in between
const CASTLING = 'r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1';

// White pawn b7 can push to b8 and promote; black king h8, white king e1
const PROMOTION = '7k/1P6/8/8/8/8/8/4K3 w - - 0 1';

const E2E4 = { color: 'w', piece: 'p', from: 'e2', to: 'e4', san: 'e4', lan: 'e2e4' };

// 1. a4 b5 2. axb5 a6 3. bxa6 Bb7 4. axb7 Nc6 5. bxa8=Q: four captures, the last one promotes
const PROMOTION_GAME = ['a2a4', 'b7b5', 'a4b5', 'a7a6', 'b5a6', 'c8b7', 'a6b7', 'b8c6', 'b7a8q'];

// Both knights go out and back twice, so the start position appears for the third time
const KNIGHT_SHUFFLE = ['g1f3', 'g8f6', 'f3g1', 'f6g8', 'g1f3', 'g8f6', 'f3g1', 'f6g8'];

test('a legal move returns its record and passes the turn', () => {
  const game = createGame();
  assert.deepEqual(game.move({ from: 'e2', to: 'e4' }), E2E4);
  assert.equal(game.turn(), 'b');
  assert.deepEqual(game.pieceAt('e4'), { color: 'w', type: 'p' });
});

test('an illegal move returns null and leaves the game unchanged', () => {
  const game = createGame();
  assert.equal(game.move({ from: 'e2', to: 'e5' }), null);
  assert.equal(game.move({ from: 'e7', to: 'e5' }), null); // black piece on white's turn
  assert.equal(game.move({ from: 'e4', to: 'e5' }), null); // empty square
  assert.equal(game.fen(), START);
});

test('move never throws on input that is not a MoveInput, and never passes the turn', () => {
  const game = createGame();
  // chess.js plays a null move for null, and reads strings as SAN
  for (const input of [null, undefined, 'e4', '--', 42, {}, { from: 'e2' }, { from: 'z9', to: 'e4' }]) {
    assert.equal(game.move(input), null);
  }
  assert.equal(game.fen(), START);
});

test('castling kingside moves the rook from h1 to f1', () => {
  const game = createGame({ fen: CASTLING });
  assert.equal(game.move({ from: 'e1', to: 'g1' }).san, 'O-O');
  assert.deepEqual(game.pieceAt('g1'), { color: 'w', type: 'k' });
  assert.deepEqual(game.pieceAt('f1'), { color: 'w', type: 'r' });
  assert.equal(game.pieceAt('h1'), null);
  assert.equal(game.pieceAt('e1'), null);
});

test('castling queenside moves the rook from a1 to d1', () => {
  const game = createGame({ fen: CASTLING });
  assert.equal(game.move({ from: 'e1', to: 'c1' }).san, 'O-O-O');
  assert.deepEqual(game.pieceAt('c1'), { color: 'w', type: 'k' });
  assert.deepEqual(game.pieceAt('d1'), { color: 'w', type: 'r' });
  assert.equal(game.pieceAt('a1'), null);
  assert.equal(game.pieceAt('e1'), null);
});

test('en passant removes the captured pawn and records captured: "p"', () => {
  // Black has just played d7-d5 beside the white pawn on e5, so exd6 en passant is legal
  const game = createGame({ fen: '4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 1' });
  assert.deepEqual(game.move({ from: 'e5', to: 'd6' }), {
    color: 'w', piece: 'p', from: 'e5', to: 'd6', captured: 'p', san: 'exd6', lan: 'e5d6',
  });
  assert.equal(game.pieceAt('d5'), null);
  assert.deepEqual(game.pieceAt('d6'), { color: 'w', type: 'p' });
});

test('promotion works for each of q, r, b and n', () => {
  for (const promotion of ['q', 'r', 'b', 'n']) {
    const game = createGame({ fen: PROMOTION });
    const record = game.move({ from: 'b7', to: 'b8', promotion });
    assert.equal(record.promotion, promotion);
    assert.equal(record.lan, `b7b8${promotion}`);
    assert.deepEqual(game.pieceAt('b8'), { color: 'w', type: promotion });
  }
});

test('a promotion move without a valid promotion piece returns null', () => {
  const game = createGame({ fen: PROMOTION });
  assert.equal(game.move({ from: 'b7', to: 'b8' }), null);
  assert.equal(game.move({ from: 'b7', to: 'b8', promotion: 'k' }), null);
  assert.equal(game.move({ from: 'b7', to: 'b8', promotion: 'Q' }), null);
  assert.equal(game.fen(), PROMOTION);
});

test('a promotion piece on a move that is not a promotion returns null', () => {
  const game = createGame();
  assert.equal(game.move({ from: 'e2', to: 'e4', promotion: 'q' }), null);
  assert.equal(game.fen(), START);
});

test('records leave out captured and promotion when unused, and are plain objects', () => {
  const game = createGame();
  const record = game.move({ from: 'e2', to: 'e4' });
  assert.ok(!('captured' in record) && !('promotion' in record));
  assert.equal(Object.getPrototypeOf(record), Object.prototype);
});

test('undo restores the previous position and turn, and returns the move', () => {
  const game = createGame();
  game.move({ from: 'e2', to: 'e4' });
  const before = game.fen();
  game.move({ from: 'e7', to: 'e5' });
  assert.equal(game.undo().lan, 'e7e5');
  assert.equal(game.fen(), before);
  assert.equal(game.turn(), 'b');
  assert.deepEqual(game.undo(), E2E4);
  assert.equal(game.fen(), START);
});

test('undo on a new game returns null', () => {
  assert.equal(createGame().undo(), null);
});

test('undo of a promotion brings the pawn back', () => {
  const game = createGame({ fen: PROMOTION });
  game.move({ from: 'b7', to: 'b8', promotion: 'n' });
  game.undo();
  assert.equal(game.fen(), PROMOTION);
});

test('history and moveList are empty for a new game', () => {
  assert.deepEqual(createGame().history(), []);
  assert.deepEqual(createGame().moveList(), []);
});

test('history lists the records oldest first, including captures', () => {
  const game = createGame();
  for (const [from, to] of [['e2', 'e4'], ['d7', 'd5'], ['e4', 'd5']]) game.move({ from, to });
  const history = game.history();
  assert.deepEqual(history[0], E2E4);
  assert.deepEqual(history.map((record) => record.san), ['e4', 'd5', 'exd5']);
  assert.equal(history[2].captured, 'p');
});

test('history returns copies, so changing them leaves the game alone', () => {
  const game = createGame();
  game.move({ from: 'e2', to: 'e4' });
  game.history()[0].to = 'e5';
  assert.deepEqual(game.history(), [E2E4]);
});

test('replaying moveList() gives the same position, after captures and a promotion', () => {
  const game = replayGame(PROMOTION_GAME);
  assert.deepEqual(game.moveList(), PROMOTION_GAME);
  assert.deepEqual(game.pieceAt('a8'), { color: 'w', type: 'q' });
  assert.equal(game.history().filter((record) => record.captured).length, 4);
  assert.equal(replayGame(game.moveList()).fen(), game.fen());
});

test('replaying moveList() of a game played move by move gives the same position', () => {
  const game = createGame();
  for (const [from, to] of [['e2', 'e4'], ['d7', 'd5'], ['e4', 'd5'], ['d8', 'd5'], ['b1', 'c3']]) {
    game.move({ from, to });
  }
  assert.deepEqual(game.moveList(), ['e2e4', 'd7d5', 'e4d5', 'd8d5', 'b1c3']);
  assert.equal(replayGame(game.moveList()).fen(), game.fen());
});

test('replayGame([]) is a new game', () => {
  const game = replayGame([]);
  assert.equal(game.fen(), START);
  assert.deepEqual(game.history(), []);
});

test('replayGame returns null for an illegal or malformed move, or a non-array', () => {
  assert.equal(replayGame(['e2e5']), null); // illegal
  assert.equal(replayGame(['xyz']), null);
  assert.equal(replayGame('e2e4'), null);
  assert.equal(replayGame(null), null);
  assert.equal(replayGame(['e2e4', 42]), null);
  assert.equal(replayGame(['e2e4', 'E7E5']), null); // uppercase
  assert.equal(replayGame(['e4', 'e5']), null); // SAN, not LAN
  assert.equal(replayGame(['e2e4q']), null); // promotion piece on a normal move
  assert.equal(replayGame(PROMOTION_GAME.with(-1, 'b7a8')), null); // promotion without a piece
});

test('threefold repetition is detected after a replay', () => {
  assert.equal(replayGame(KNIGHT_SHUFFLE).flags().threefold, true);
  assert.equal(replayGame(KNIGHT_SHUFFLE.slice(0, -1)).flags().threefold, false);
});
