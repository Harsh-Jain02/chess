// Tests for the pure move-row formatter. renderHistory needs a DOM, so it is
// checked in the browser.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatMoveRows } from '../../js/ui/history-view.js';

/**
 * Minimal move records: formatMoveRows reads only their SAN.
 * @param {...string} san
 * @returns {import('../../js/types.js').MoveRecord[]}
 */
function moves(...san) {
  return san.map((notation, index) => ({
    color: index % 2 === 0 ? 'w' : 'b',
    piece: 'p',
    from: 'a2',
    to: 'a3',
    san: notation,
    lan: 'a2a3',
  }));
}

test('formatMoveRows: empty history', () => {
  assert.deepEqual(formatMoveRows([]), []);
});

test('formatMoveRows: odd history leaves the last black move empty', () => {
  assert.deepEqual(formatMoveRows(moves('e4', 'e5', 'Nf3')), [
    { number: 1, white: 'e4', black: 'e5' },
    { number: 2, white: 'Nf3', black: '' },
  ]);
});

test('formatMoveRows: even history fills both columns', () => {
  assert.deepEqual(formatMoveRows(moves('e4', 'e5', 'Nf3', 'Nc6')), [
    { number: 1, white: 'e4', black: 'e5' },
    { number: 2, white: 'Nf3', black: 'Nc6' },
  ]);
});

test('formatMoveRows: preserves special SAN exactly', () => {
  assert.deepEqual(formatMoveRows(moves('O-O', 'e8=Q', 'Re8+', 'Qh4#')), [
    { number: 1, white: 'O-O', black: 'e8=Q' },
    { number: 2, white: 'Re8+', black: 'Qh4#' },
  ]);
});
