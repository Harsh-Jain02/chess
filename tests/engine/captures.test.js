// Tests for getCaptured (T07).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createGame } from '../../js/engine/game.js';
import { getCaptured } from '../../js/engine/captures.js';

// 1. e4 d5 2. exd5 Qxd5 3. Nc3 Qxd2+ 4. Bxd2: white takes a pawn, then the queen;
// black takes two pawns
const QUEEN_LOST = ['e2e4', 'd7d5', 'e4d5', 'd8d5', 'b1c3', 'd5d2', 'c1d2'];

// Black king a8 and rook d8; the white pawn e7 can promote on e8 or by capturing on d8;
// white king e1
const PROMOTION_FEN = 'k2r4/4P3/8/8/8/8/8/4K3 w - - 0 1';

/** A hand-written capture by `color`; getCaptured only reads `color` and `captured`. */
const captureBy = (color, captured) => ({
  color, piece: 'q', from: 'd4', to: 'd5', captured, san: 'Qxd5', lan: 'd4d5',
});

/** Captures in no particular order of value; a new array each call, so tests can't share it. */
const mixedCaptures = () => [
  captureBy('w', 'p'), captureBy('b', 'n'), captureBy('w', 'n'), captureBy('b', 'p'),
  captureBy('w', 'q'), captureBy('w', 'b'), captureBy('b', 'r'), captureBy('w', 'r'),
  captureBy('w', 'p'),
];

/**
 * Plays `moves` (LAN) from the start position, or from `fen`, and returns the history.
 * Fails the test on an illegal move.
 * @param {string[]} moves
 * @param {string} [fen]
 */
function historyOf(moves, fen) {
  const game = createGame({ fen });
  for (const lan of moves) {
    const move = { from: lan.slice(0, 2), to: lan.slice(2, 4), promotion: lan[4] };
    assert.ok(game.move(move), `illegal move ${lan}`);
  }
  return game.history();
}

test('no moves, or moves without a capture: nothing captured', () => {
  assert.deepEqual(getCaptured([]), { w: [], b: [] });
  // 1. e4 e5 2. Nf3 Nc6
  assert.deepEqual(getCaptured(historyOf(['e2e4', 'e7e5', 'g1f3', 'b8c6'])), { w: [], b: [] });
});

test('a capture lands in the list of the side that made it', () => {
  // 1. e4 d5 2. exd5
  assert.deepEqual(getCaptured(historyOf(QUEEN_LOST.slice(0, 3))), { w: ['p'], b: [] });
  // 2... Qxd5
  assert.deepEqual(getCaptured(historyOf(QUEEN_LOST.slice(0, 4))), { w: ['p'], b: ['p'] });
});

test('en passant counts as a pawn capture', () => {
  // 1. e4 a6 2. e5 d5 3. exd6 e.p. (d6 was empty, so this can only be en passant)
  const history = historyOf(['e2e4', 'a7a6', 'e4e5', 'd7d5', 'e5d6']);
  assert.deepEqual(getCaptured(history), { w: ['p'], b: [] });
});

test('a pawn that captures while promoting adds the captured piece, not the pawn', () => {
  // exd8=Q+
  assert.deepEqual(getCaptured(historyOf(['e7d8q'], PROMOTION_FEN)), { w: ['r'], b: [] });
});

test('a captured promoted piece counts as its promoted type', () => {
  // e8=Q Rxe8+
  const history = historyOf(['e7e8q', 'd8e8'], PROMOTION_FEN);
  assert.deepEqual(getCaptured(history), { w: [], b: ['q'] });
});

test('each list is sorted by value: q, r, b, n, p', () => {
  // White took the pawn before the queen
  assert.deepEqual(getCaptured(historyOf(QUEEN_LOST)), { w: ['q', 'p'], b: ['p', 'p'] });
  assert.deepEqual(getCaptured(mixedCaptures()), {
    w: ['q', 'r', 'b', 'n', 'p', 'p'],
    b: ['r', 'n', 'p'],
  });
});

test('the history is not mutated', () => {
  const history = mixedCaptures();
  const before = structuredClone(history);
  getCaptured(history);
  assert.deepEqual(history, before);
});
