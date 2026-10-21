// Tests for pieceImageUrl and pieceName (T08).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pieceImageUrl, pieceName } from '../../js/ui/pieces.js';

const TYPES = ['p', 'n', 'b', 'r', 'q', 'k'];

/** All 12 pieces, white first. */
const ALL_PIECES = ['w', 'b'].flatMap((color) => TYPES.map((type) => ({ color, type })));

test('pieceImageUrl: relative URL, color letter then uppercase type letter', () => {
  assert.equal(pieceImageUrl({ color: 'w', type: 'n' }), 'assets/pieces/wN.svg');
  assert.equal(pieceImageUrl({ color: 'b', type: 'p' }), 'assets/pieces/bP.svg');
});

test('pieceImageUrl: the 12 pieces use exactly the 12 files from owner task O3', () => {
  const files = ALL_PIECES.map(pieceImageUrl).map((url) => url.replace('assets/pieces/', ''));
  assert.deepEqual(files.sort(), [
    'bB.svg', 'bK.svg', 'bN.svg', 'bP.svg', 'bQ.svg', 'bR.svg',
    'wB.svg', 'wK.svg', 'wN.svg', 'wP.svg', 'wQ.svg', 'wR.svg',
  ]);
});

test('pieceName: color then piece, lowercase', () => {
  assert.equal(pieceName({ color: 'w', type: 'n' }), 'white knight');
  assert.equal(pieceName({ color: 'b', type: 'q' }), 'black queen');
});

test('pieceName: every piece type has its own name', () => {
  assert.deepEqual(TYPES.map((type) => pieceName({ color: 'b', type })), [
    'black pawn', 'black knight', 'black bishop', 'black rook', 'black queen', 'black king',
  ]);
  assert.equal(new Set(ALL_PIECES.map(pieceName)).size, 12);
});
