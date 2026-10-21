import test from 'node:test';
import assert from 'node:assert/strict';

import { replayGame } from '../../js/engine/game.js';
import { getStatus } from '../../js/engine/status.js';
import { sequences } from './sequences.js';

function pieceCode(piece) {
  return piece ? `${piece.color}${piece.type}` : null;
}

function sortTargets(targets) {
  return [...targets].sort((left, right) => left.to.localeCompare(right.to));
}

for (const sequence of sequences) {
  test(`QA sequence: ${sequence.name}`, () => {
    const game = replayGame(sequence.moves);
    assert.ok(game, `${sequence.name} must be a legal move sequence`);
    assert.deepEqual(game.moveList(), sequence.moves);
    assert.deepEqual(game.history().map((move) => move.san), sequence.san);

    const { status, pieces, targets, captures } = sequence.expect;
    if (status) {
      const actual = getStatus(game);
      for (const [key, value] of Object.entries(status)) {
        assert.deepEqual(actual[key], value, `${sequence.name} status.${key}`);
      }
    }
    if (pieces) {
      for (const [square, expected] of Object.entries(pieces)) {
        assert.equal(pieceCode(game.pieceAt(square)), expected, `${sequence.name} piece at ${square}`);
      }
    }
    if (targets) {
      for (const [square, expected] of Object.entries(targets)) {
        assert.deepEqual(sortTargets(game.legalTargets(square)), expected, `${sequence.name} targets from ${square}`);
      }
    }
    if (captures) {
      const actual = game.history()
        .filter((move) => move.captured)
        .map((move) => `${move.color}:${move.captured}`);
      assert.deepEqual(actual, captures);
    }
  });
}
