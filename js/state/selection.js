// What a click on a square means: select a piece, switch or drop the selection, or
// make a move (DECISIONS D05: click a piece, then click a highlighted square).
// Pure: it never mutates its inputs and never calls game.move; the controller does that.

/** @typedef {import('../types.js').Game} Game */
/** @typedef {import('../types.js').MoveInput} MoveInput */
/** @typedef {import('../types.js').Selection} Selection */
/** @typedef {import('../types.js').Square} Square */

/**
 * @typedef {object} ClickResult
 * @property {Selection} selection the selection after the click
 * @property {MoveInput | null} move the move to play, if the click completed one
 */

/** Nothing selected. Frozen, `targets` included, so every caller can share it. */
export const emptySelection = Object.freeze({
  selected: null,
  targets: Object.freeze([]),
  pendingPromotion: null,
});

/**
 * Applies the first rule that matches: the game is over; a promotion choice is
 * pending (the click is ignored); the square is a target of the selected piece;
 * the square holds a piece of the side to move; anything else deselects.
 * @param {Selection} selection
 * @param {Square} square the clicked square
 * @param {Game} game only read, never moved
 * @param {boolean} isOver whether the game has ended
 * @returns {ClickResult}
 */
export function clickSquare(selection, square, game, isOver) {
  if (isOver) return noMove(emptySelection);
  if (selection.pendingPromotion) return noMove(selection);

  const { selected, targets } = selection;
  const target = selected && targets.find((candidate) => candidate.to === square);
  if (target) {
    if (target.isPromotion) {
      return noMove({ selected, targets, pendingPromotion: { from: selected, to: square } });
    }
    return { selection: emptySelection, move: { from: selected, to: square } };
  }

  if (game.pieceAt(square)?.color === game.turn()) {
    if (square === selected) return noMove(emptySelection);
    // Selected even with no targets, so the player can see that it has no moves.
    return noMove({ selected: square, targets: game.legalTargets(square), pendingPromotion: null });
  }
  return noMove(emptySelection);
}

/**
 * Completes the pending promotion with the piece the player chose.
 * @param {Selection} selection
 * @param {'q' | 'r' | 'b' | 'n'} pieceType
 * @returns {ClickResult} the promotion move and `emptySelection`, or `selection`
 *   unchanged and `move: null` if no promotion is pending
 */
export function choosePromotion(selection, pieceType) {
  const pending = selection.pendingPromotion;
  if (!pending) return noMove(selection);
  return {
    selection: emptySelection,
    move: { from: pending.from, to: pending.to, promotion: pieceType },
  };
}

/**
 * Drops the pending promotion: the pawn doesn't move and nothing stays selected.
 * @param {Selection} selection
 * @returns {Selection} always `emptySelection`
 */
export function cancelPromotion(selection) {
  return emptySelection;
}

/**
 * @param {Selection} selection
 * @returns {ClickResult}
 */
function noMove(selection) {
  return { selection, move: null };
}
