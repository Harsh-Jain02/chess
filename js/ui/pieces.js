// Piece images and spoken piece names. Pure: no DOM.

/** @typedef {import('../types.js').Color} Color */
/** @typedef {import('../types.js').Piece} Piece */
/** @typedef {import('../types.js').PieceType} PieceType */

/** @type {Record<Color, string>} */
const COLOR_NAMES = { w: 'white', b: 'black' };

/** @type {Record<PieceType, string>} */
const TYPE_NAMES = { p: 'pawn', n: 'knight', b: 'bishop', r: 'rook', q: 'queen', k: 'king' };

/**
 * The image file of a piece (owner task O3, DECISIONS D09). The URL is relative,
 * so it works under the GitHub Pages sub-path.
 * @param {Piece} piece
 * @returns {string} e.g. 'assets/pieces/wN.svg' for a white knight
 */
export function pieceImageUrl({ color, type }) {
  return `assets/pieces/${color}${type.toUpperCase()}.svg`;
}

/**
 * @param {Piece} piece
 * @returns {string} e.g. 'white knight'
 */
export function pieceName({ color, type }) {
  return `${COLOR_NAMES[color]} ${TYPE_NAMES[type]}`;
}
