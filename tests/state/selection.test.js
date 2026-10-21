// Tests for the click-to-move rules (T09).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createGame, replayGame } from '../../js/engine/game.js';
import {
  emptySelection, clickSquare, choosePromotion, cancelPromotion,
} from '../../js/state/selection.js';

// Black king a8; the white pawn e7 can only move by promoting on e8; white king e1
const PROMOTION_FEN = 'k7/4P3/8/8/8/8/8/4K3 w - - 0 1';

// Fool's mate, 1. f3 e5 2. g4 Qh4#: white to move and checkmated
const FOOLS_MATE = ['f2f3', 'e7e5', 'g2g4', 'd8h4'];

/** A deselecting click's result: nothing selected, no move. */
const NOTHING = { selection: emptySelection, move: null };

/**
 * Clicks `squares` in order, starting with nothing selected, in a game that isn't over.
 * @returns the last click's result
 */
function clickAll(game, squares) {
  let result = NOTHING;
  for (const square of squares) result = clickSquare(result.selection, square, game, false);
  return result;
}

/** The target squares of `selection`, sorted. */
const targetSquares = (selection) => selection.targets.map(({ to }) => to).sort();

/** A selection waiting for the promotion choice: the e7 pawn, then e8, in PROMOTION_FEN. */
const promotionGame = () => createGame({ fen: PROMOTION_FEN });
const pendingIn = (game) => clickAll(game, ['e7', 'e8']).selection;

test('emptySelection: nothing selected, and frozen', () => {
  assert.deepEqual(emptySelection, { selected: null, targets: [], pendingPromotion: null });
  assert.ok(Object.isFrozen(emptySelection));
  assert.ok(Object.isFrozen(emptySelection.targets));
});

test('clicking your own piece selects it with its legal targets', () => {
  const game = createGame();
  const { selection, move } = clickAll(game, ['e2']);
  assert.equal(move, null);
  assert.deepEqual(selection, {
    selected: 'e2', targets: game.legalTargets('e2'), pendingPromotion: null,
  });
  assert.deepEqual(targetSquares(selection), ['e3', 'e4']);
});

test('a piece with no moves is still selected, with no targets', () => {
  // start position: the a1 rook is boxed in
  assert.deepEqual(clickAll(createGame(), ['a1']), {
    selection: { selected: 'a1', targets: [], pendingPromotion: null }, move: null,
  });
});

test('clicking the selected piece again deselects it', () => {
  assert.deepEqual(clickAll(createGame(), ['e2', 'e2']), NOTHING);
});

test('clicking another of your pieces switches the selection', () => {
  const { selection, move } = clickAll(createGame(), ['e2', 'g1']);
  assert.equal(move, null);
  assert.equal(selection.selected, 'g1');
  assert.deepEqual(targetSquares(selection), ['f3', 'h3']);
});

test("clicking an opponent's piece that is not a target deselects", () => {
  // start position: the e2 pawn can't reach e7
  assert.deepEqual(clickAll(createGame(), ['e2', 'e7']), NOTHING);
});

test('clicking an empty square that is not a target deselects', () => {
  assert.deepEqual(clickAll(createGame(), ['e2', 'e5']), NOTHING);
});

test("with nothing selected, an empty square or an opponent's piece selects nothing", () => {
  const game = createGame();
  assert.deepEqual(clickAll(game, ['e4']), NOTHING);
  assert.deepEqual(clickAll(game, ['e7']), NOTHING);
});

test("only the side to move can select: after 1. e4, white's pieces can't", () => {
  const game = replayGame(['e2e4']);
  assert.deepEqual(clickAll(game, ['e4']), NOTHING);
  assert.equal(clickAll(game, ['e7']).selection.selected, 'e7');
});

test('clicking a target returns the move and an empty selection', () => {
  assert.deepEqual(clickAll(createGame(), ['e2', 'e4']), {
    selection: emptySelection, move: { from: 'e2', to: 'e4' },
  });
});

test("capturing: clicking an opponent's piece that is a target returns the move", () => {
  // 1. e4 d5: the e4 pawn can take on d5
  assert.deepEqual(clickAll(replayGame(['e2e4', 'd7d5']), ['e4', 'd5']), {
    selection: emptySelection, move: { from: 'e4', to: 'd5' },
  });
});

test('promotion: clicking the last-rank target waits for the piece choice', () => {
  assert.deepEqual(clickAll(promotionGame(), ['e7', 'e8']), {
    selection: {
      selected: 'e7',
      targets: [{ to: 'e8', isCapture: false, isPromotion: true }],
      pendingPromotion: { from: 'e7', to: 'e8' },
    },
    move: null,
  });
});

test('promotion: choosePromotion returns the move with the chosen piece', () => {
  const game = promotionGame();
  const result = choosePromotion(pendingIn(game), 'n');
  assert.deepEqual(result, {
    selection: emptySelection, move: { from: 'e7', to: 'e8', promotion: 'n' },
  });
  assert.equal(game.move(result.move)?.promotion, 'n', 'the engine accepts the move');
});

test('promotion: cancelPromotion returns emptySelection', () => {
  assert.equal(cancelPromotion(pendingIn(promotionGame())), emptySelection);
});

test('choosePromotion without a pending promotion returns no move', () => {
  const selection = clickAll(createGame(), ['e2']).selection;
  assert.deepEqual(choosePromotion(selection, 'q'), { selection, move: null });
  assert.deepEqual(choosePromotion(emptySelection, 'q'), NOTHING);
});

test('while a promotion is pending, clicks are ignored', () => {
  const game = promotionGame();
  const pending = pendingIn(game);
  // the target again, the pawn, the white king, an empty square
  for (const square of ['e8', 'e7', 'e1', 'd4']) {
    assert.deepEqual(clickSquare(pending, square, game, false), { selection: pending, move: null });
  }
});

test('when the game is over, nothing can be selected', () => {
  const game = replayGame(FOOLS_MATE);
  assert.deepEqual(clickSquare(emptySelection, 'e1', game, true), NOTHING);
  assert.deepEqual(clickSquare(emptySelection, 'a2', game, true), NOTHING);
});

test('when the game is over, a selection or a pending promotion is dropped without a move', () => {
  const game = createGame();
  assert.deepEqual(clickSquare(clickAll(game, ['e2']).selection, 'e4', game, true), NOTHING);
  const promotion = promotionGame();
  assert.deepEqual(clickSquare(pendingIn(promotion), 'e8', promotion, true), NOTHING);
});

test('inputs are not mutated', () => {
  const start = createGame();
  const promotion = promotionGame();
  const selectedE2 = clickAll(start, ['e2']).selection;
  const pending = pendingIn(promotion);
  const clicks = [
    [emptySelection, 'e2', start, false], // select
    [selectedE2, 'g1', start, false], // switch
    [selectedE2, 'e2', start, false], // deselect
    [selectedE2, 'e4', start, false], // move
    [clickAll(promotion, ['e7']).selection, 'e8', promotion, false], // promotion target
    [pending, 'e1', promotion, false], // ignored
    [selectedE2, 'e4', start, true], // game over
  ];
  for (const [selection, square, game, isOver] of clicks) {
    const before = structuredClone(selection);
    const fen = game.fen();
    clickSquare(selection, square, game, isOver);
    assert.deepEqual(selection, before, `selection changed by a click on ${square}`);
    assert.equal(game.fen(), fen, `game changed by a click on ${square}`);
  }
  const before = structuredClone(pending);
  choosePromotion(pending, 'q');
  cancelPromotion(pending);
  assert.deepEqual(pending, before);
});
