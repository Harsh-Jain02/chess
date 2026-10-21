// Tests for the pure helper of status-view.js (T13). renderStatus needs a DOM, so it is
// checked in the browser. The statuses are written by hand, except the fool's mate one.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { replayGame } from '../../js/engine/game.js';
import { getStatus } from '../../js/engine/status.js';
import { statusText } from '../../js/ui/status-view.js';

/** A game still in progress. @param {'w' | 'b'} turn @param {boolean} [inCheck] */
const playing = (turn, inCheck = false) => ({
  turn, inCheck, checkSquare: inCheck ? 'e1' : null, isOver: false, winner: null, reason: null,
});

/** A finished game, as getStatus returns it. @param {'w' | 'b'} turn @param {string} reason */
const over = (turn, reason) => ({
  turn,
  inCheck: reason === 'checkmate',
  checkSquare: reason === 'checkmate' ? 'e1' : null,
  isOver: true,
  winner: reason === 'checkmate' ? (turn === 'w' ? 'b' : 'w') : null,
  reason,
});

test('statusText: whose turn it is', () => {
  assert.equal(statusText(playing('w')), 'White to move');
  assert.equal(statusText(playing('b')), 'Black to move');
});

test('statusText: the side to move is in check', () => {
  assert.equal(statusText(playing('w', true)), 'White to move — check!');
  assert.equal(statusText(playing('b', true)), 'Black to move — check!');
});

test('statusText: checkmate names the winner, not the side to move', () => {
  assert.equal(statusText(over('w', 'checkmate')), 'Checkmate — Black wins');
  assert.equal(statusText(over('b', 'checkmate')), 'Checkmate — White wins');
});

test('statusText: each draw names its reason, whoever is to move', () => {
  for (const turn of ['w', 'b']) {
    assert.equal(statusText(over(turn, 'stalemate')), 'Draw — stalemate');
    assert.equal(statusText(over(turn, 'insufficient-material')), 'Draw — insufficient material');
    assert.equal(statusText(over(turn, 'threefold-repetition')), 'Draw — threefold repetition');
    assert.equal(statusText(over(turn, 'fifty-move-rule')), 'Draw — 50-move rule');
  }
});

test("statusText: fool's mate (1. f3 e5 2. g4 Qh4#) from the real engine", () => {
  const status = getStatus(replayGame(['f2f3', 'e7e5', 'g2g4', 'd8h4']));
  assert.equal(statusText(status), 'Checkmate — Black wins');
});
