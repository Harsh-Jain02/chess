// Tests for the pure helpers of board-view.js (T08). renderBoard needs a DOM, so it is
// checked in the browser instead. Importing the module here also shows that it doesn't
// touch `document` at import time (Node has none).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isLightSquare, squareOrder } from '../../js/ui/board-view.js';

const SQUARE = /^[a-h][1-8]$/;

test('squareOrder: 64 different squares for each orientation', () => {
  for (const orientation of ['w', 'b']) {
    const order = squareOrder(orientation);
    assert.equal(order.length, 64, orientation);
    assert.equal(new Set(order).size, 64, orientation);
    assert.ok(order.every((square) => SQUARE.test(square)), orientation);
  }
});

test("squareOrder 'w': a8 first, h1 last, row by row from the top", () => {
  const order = squareOrder('w');
  assert.equal(order[0], 'a8');
  assert.equal(order[63], 'h1');
  assert.deepEqual(order.slice(0, 9), ['a8', 'b8', 'c8', 'd8', 'e8', 'f8', 'g8', 'h8', 'a7']);
});

test("squareOrder 'b': h1 first, a8 last, row by row from the top", () => {
  const order = squareOrder('b');
  assert.equal(order[0], 'h1');
  assert.equal(order[63], 'a8');
  assert.deepEqual(order.slice(0, 9), ['h1', 'g1', 'f1', 'e1', 'd1', 'c1', 'b1', 'a1', 'h2']);
  assert.deepEqual(order, squareOrder('w').reverse());
});

// renderBoard puts rank numbers on the left column (index % 8 === 0) and file letters
// on the bottom row (index >= 56), so those must be the right squares in both orientations.
test('squareOrder: left column and bottom row, where the coordinates go', () => {
  const left = (order) => order.filter((_, index) => index % 8 === 0);
  const bottom = (order) => order.slice(56);
  assert.deepEqual(left(squareOrder('w')), ['a8', 'a7', 'a6', 'a5', 'a4', 'a3', 'a2', 'a1']);
  assert.deepEqual(bottom(squareOrder('w')), ['a1', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1']);
  assert.deepEqual(left(squareOrder('b')), ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7', 'h8']);
  assert.deepEqual(bottom(squareOrder('b')), ['h8', 'g8', 'f8', 'e8', 'd8', 'c8', 'b8', 'a8']);
});

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
