// Tests for getStatus (T06).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createGame, replayGame } from '../../js/engine/game.js';
import { getStatus } from '../../js/engine/status.js';

// Both knights go out and back twice, so the start position appears for the third time
// (the same replay as in game-moves.test.js)
const KNIGHT_SHUFFLE = ['g1f3', 'g8f6', 'f3g1', 'f6g8', 'g1f3', 'g8f6', 'f3g1', 'f6g8'];

const statusOf = (fen) => getStatus(createGame({ fen }));

/** The status of a drawn game with `turn` to move and not in check. */
const draw = (turn, reason) => ({
  turn, inCheck: false, checkSquare: null, isOver: true, winner: null, reason,
});

test('start position: white to move, not in check, not over', () => {
  assert.deepEqual(getStatus(createGame()), {
    turn: 'w', inCheck: false, checkSquare: null, isOver: false, winner: null, reason: null,
  });
});

test('a check that is not mate: 1. e4 d5 2. Bb5+ (black can block on c6 or d7)', () => {
  assert.deepEqual(getStatus(replayGame(['e2e4', 'd7d5', 'f1b5'])), {
    turn: 'b', inCheck: true, checkSquare: 'e8', isOver: false, winner: null, reason: null,
  });
});

test('checkmate is won by the side that just moved; checkSquare is the mated king', () => {
  // Fool's mate, 1. f4 e5 2. g4 Qh4#: white is checkmated
  assert.deepEqual(statusOf('rnb1kbnr/pppp1ppp/8/4p3/5PPq/8/PPPPP2P/RNBQKBNR w KQkq - 1 3'), {
    turn: 'w', inCheck: true, checkSquare: 'e1', isOver: true, winner: 'b', reason: 'checkmate',
  });
});

test('stalemate is a draw', () => {
  // Black king e8 is not in check but has no move: white pawn e7, protected by the white king e6
  assert.deepEqual(statusOf('4k3/4P3/4K3/8/8/8/8/8 b - - 0 78'), draw('b', 'stalemate'));
});

test('king and knight against king is a draw by insufficient material', () => {
  // Black king a8 and knight a6 against the lone white king h1
  assert.deepEqual(statusOf('k7/8/n7/8/8/8/8/7K b - - 0 1'), draw('b', 'insufficient-material'));
});

test('the third repetition of a position is a draw, the second is not', () => {
  assert.deepEqual(getStatus(replayGame(KNIGHT_SHUFFLE)), draw('w', 'threefold-repetition'));
  assert.equal(getStatus(replayGame(KNIGHT_SHUFFLE.slice(0, -1))).isOver, false);
});

test('a half-move clock of 100 is a draw by the fifty-move rule, 99 is not', () => {
  // White king e1 and rook a1 against the black king e8 (enough material to mate);
  // 100 half-moves without a capture or a pawn move
  assert.deepEqual(statusOf('4k3/8/8/8/8/8/8/R3K3 w - - 100 80'), draw('w', 'fifty-move-rule'));
  // The same position one half-move earlier
  assert.equal(statusOf('4k3/8/8/8/8/8/8/R3K3 w - - 99 80').isOver, false);
});

test('checkmate wins over the fifty-move rule', () => {
  // Back-rank mate: white rook a8 checks the black king g8, boxed in by its pawns f7 g7 h7;
  // half-move clock 100
  const game = createGame({ fen: 'R5k1/5ppp/8/8/8/8/8/6K1 b - - 100 80' });
  assert.equal(game.flags().fiftyMoves, true);
  assert.deepEqual(getStatus(game), {
    turn: 'b', inCheck: true, checkSquare: 'g8', isOver: true, winner: 'w', reason: 'checkmate',
  });
});

test('stalemate wins over insufficient material', () => {
  // King and bishop against king: black king a8 has no move (white king c7 covers b7 and b8,
  // white bishop e3 covers a7) and is not in check
  const game = createGame({ fen: 'k7/2K5/8/8/8/4B3/8/8 b - - 0 1' });
  assert.equal(game.flags().insufficientMaterial, true);
  assert.deepEqual(getStatus(game), draw('b', 'stalemate'));
});
