// Tests for the pure helper of promotion-dialog.js (T12). askPromotion needs a DOM, so
// it is checked in the browser instead. Importing the module here also shows that it
// doesn't touch `document` at import time (Node has none).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { promotionChoices } from '../../js/ui/promotion-dialog.js';

test('promotionChoices: queen, rook, bishop, knight, in that order', () => {
  assert.deepEqual(promotionChoices('w').map((choice) => choice.type), ['q', 'r', 'b', 'n']);
});

test('promotionChoices: accessible names say which piece', () => {
  assert.deepEqual(promotionChoices('w').map((choice) => choice.label), [
    'Promote to queen',
    'Promote to rook',
    'Promote to bishop',
    'Promote to knight',
  ]);
});

test("promotionChoices 'w': white piece images", () => {
  assert.deepEqual(promotionChoices('w').map((choice) => choice.imageUrl), [
    'assets/pieces/wQ.svg',
    'assets/pieces/wR.svg',
    'assets/pieces/wB.svg',
    'assets/pieces/wN.svg',
  ]);
});

test("promotionChoices 'b': black piece images, same names", () => {
  const choices = promotionChoices('b');
  assert.deepEqual(choices.map((choice) => choice.imageUrl), [
    'assets/pieces/bQ.svg',
    'assets/pieces/bR.svg',
    'assets/pieces/bB.svg',
    'assets/pieces/bN.svg',
  ]);
  assert.deepEqual(choices.map((choice) => choice.label),
    promotionChoices('w').map((choice) => choice.label));
});
