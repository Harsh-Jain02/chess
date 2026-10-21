// Tests for square-classes.js (T11; isLightSquare moved here from board-view.js).
// The views are written by hand: squareClasses only reads selected, targets and checkSquare.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isLightSquare, squareClasses } from '../../js/ui/square-classes.js';
import { squareOrder } from '../../js/ui/board-view.js';

const NOTHING = { selected: null, targets: [], checkSquare: null };

/** @param {string} to @param {boolean} isCapture @param {boolean} [isPromotion] */
const target = (to, isCapture, isPromotion = false) => ({ to, isCapture, isPromotion });

test('isLightSquare: a1 and h8 are dark, h1 and a8 are light', () => {
  assert.equal(isLightSquare('a1'), false);
  assert.equal(isLightSquare('h8'), false);
  assert.equal(isLightSquare('h1'), true);
  assert.equal(isLightSquare('a8'), true);
});

test('isLightSquare: the queens start on their own color (d1 light, d8 dark)', () => {
  assert.equal(isLightSquare('d1'), true);
  assert.equal(isLightSquare('d8'), false);
});

test('isLightSquare: neighbours differ and half the board is light', () => {
  const order = squareOrder('w');
  for (let index = 0; index < 63; index += 1) {
    if (index % 8 !== 7) assert.notEqual(isLightSquare(order[index]), isLightSquare(order[index + 1]));
    if (index < 56) assert.notEqual(isLightSquare(order[index]), isLightSquare(order[index + 8]));
  }
  assert.equal(order.filter(isLightSquare).length, 32);
});

test('squareClasses: with nothing highlighted, only square and its color', () => {
  assert.deepEqual(squareClasses('a1', NOTHING), ['square', 'is-dark']);
  assert.deepEqual(squareClasses('h1', NOTHING), ['square', 'is-light']);
});

test('squareClasses: every square is light or dark, whatever the view', () => {
  for (const square of squareOrder('w')) {
    const color = isLightSquare(square) ? 'is-light' : 'is-dark';
    assert.deepEqual(squareClasses(square, NOTHING), ['square', color], square);
  }
});

// The b1 knight picked up at the start: dots on a3 and c3.
test('squareClasses: selected square and plain move targets', () => {
  const view = { selected: 'b1', targets: [target('a3', false), target('c3', false)], checkSquare: null };
  assert.deepEqual(squareClasses('b1', view), ['square', 'is-light', 'is-selected']);
  assert.deepEqual(squareClasses('a3', view), ['square', 'is-dark', 'is-target']);
  assert.deepEqual(squareClasses('c3', view), ['square', 'is-dark', 'is-target']);
  assert.deepEqual(squareClasses('b3', view), ['square', 'is-light']);
});

// The e4 pawn after 1. e4 d5: it can push to e5 or capture on d5.
test('squareClasses: a capture target gets a ring class, not a dot', () => {
  const view = { selected: 'e4', targets: [target('e5', false), target('d5', true)], checkSquare: null };
  assert.deepEqual(squareClasses('e5', view), ['square', 'is-dark', 'is-target']);
  assert.deepEqual(squareClasses('d5', view), ['square', 'is-light', 'is-capture-target']);
});

// A white pawn on b7 that can promote on b8 or by capturing on a8.
test('squareClasses: promotion targets follow isCapture too', () => {
  const view = { selected: 'b7', targets: [target('b8', false, true), target('a8', true, true)], checkSquare: null };
  assert.deepEqual(squareClasses('b8', view), ['square', 'is-dark', 'is-target']);
  assert.deepEqual(squareClasses('a8', view), ['square', 'is-light', 'is-capture-target']);
});

test('squareClasses: the king in check, selected or not', () => {
  const inCheck = { ...NOTHING, checkSquare: 'e1' };
  assert.deepEqual(squareClasses('e1', inCheck), ['square', 'is-dark', 'is-check']);
  assert.deepEqual(squareClasses('e2', inCheck), ['square', 'is-light']);
  const kingPickedUp = { selected: 'e1', targets: [target('f1', false)], checkSquare: 'e1' };
  assert.deepEqual(squareClasses('e1', kingPickedUp), ['square', 'is-dark', 'is-selected', 'is-check']);
});
