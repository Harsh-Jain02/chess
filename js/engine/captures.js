// Works out the captured pieces from the move history. It is derived data, so it stays
// right after Undo or a page refresh without being stored anywhere.

/** @typedef {import('../types.js').Color} Color */
/** @typedef {import('../types.js').MoveRecord} MoveRecord */
/** @typedef {import('../types.js').PieceType} PieceType */

/** Piece types from most to least valuable. A king is never captured. */
const BY_VALUE = ['q', 'r', 'b', 'n', 'p'];

/**
 * The pieces each side has captured, most valuable first: `w` lists the black
 * pieces white has taken, `b` the white pieces black has taken. chess.js already
 * reports en passant as a pawn capture, and a captured promoted piece as its
 * promoted type.
 * @param {MoveRecord[]} history oldest first, as `game.history()` returns it; not mutated
 * @returns {{ w: PieceType[], b: PieceType[] }}
 */
export function getCaptured(history) {
  return { w: capturedBy('w', history), b: capturedBy('b', history) };
}

/**
 * @param {Color} color
 * @param {MoveRecord[]} history
 * @returns {PieceType[]} sorted by BY_VALUE, in a new array
 */
function capturedBy(color, history) {
  return history
    .filter((move) => move.color === color && move.captured !== undefined)
    .map((move) => move.captured)
    .sort((a, b) => BY_VALUE.indexOf(a) - BY_VALUE.indexOf(b));
}
