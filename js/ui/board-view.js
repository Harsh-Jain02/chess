// Draws the board: 64 square buttons with their pieces and coordinates. The whole
// board is redrawn on every render (DECISIONS D17). Nothing here touches the DOM
// until renderBoard is called, so the pure helpers can be tested in Node.

import { pieceImageUrl, pieceName } from './pieces.js';
import { squareClasses } from './square-classes.js';

/** @typedef {import('../types.js').Color} Color */
/** @typedef {import('../types.js').Game} Game */
/** @typedef {import('../types.js').Piece} Piece */
/** @typedef {import('../types.js').Square} Square */
/** @typedef {import('../types.js').Target} Target */

/**
 * Everything renderBoard draws.
 * @typedef {object} BoardView
 * @property {Game} game
 * @property {Color} orientation the color at the bottom of the board
 * @property {Square | null} selected the square of the piece picked up
 * @property {Target[]} targets where the selected piece can move
 * @property {Square | null} checkSquare the king in check
 */

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = ['1', '2', '3', '4', '5', '6', '7', '8'];

/**
 * The 64 squares in DOM order: row by row, top-left first.
 * @param {Color} orientation the color at the bottom
 * @returns {Square[]} 'w': a8, b8 … h8, a7 … h1; 'b': h1, g1 … a1, h2 … a8
 */
export function squareOrder(orientation) {
  const ranks = orientation === 'w' ? [...RANKS].reverse() : RANKS;
  const files = orientation === 'w' ? FILES : [...FILES].reverse();
  return ranks.flatMap((rank) => files.map((file) => file + rank));
}

/**
 * Replaces the contents of `boardEl` with the 64 squares of `view`. Browser only:
 * it creates DOM elements.
 * @param {HTMLElement} boardEl the #board element
 * @param {BoardView} view
 */
export function renderBoard(boardEl, view) {
  const doc = boardEl.ownerDocument;
  const squares = squareOrder(view.orientation).map((square, index) =>
    squareButton(doc, square, view, index));
  boardEl.replaceChildren(...squares);
}

/**
 * One square. Its position in DOM order decides the coordinates: the left column
 * shows its rank and the bottom row its file, whatever the orientation.
 * @param {Document} doc
 * @param {Square} square
 * @param {BoardView} view
 * @param {number} index 0 is the top-left square, 63 the bottom-right
 * @returns {HTMLButtonElement}
 */
function squareButton(doc, square, view, index) {
  const piece = view.game.pieceAt(square);
  const target = view.targets.find((t) => t.to === square);
  const targetText = target ? (target.isCapture ? ', can capture' : ', can move here') : '';
  const button = doc.createElement('button');
  button.type = 'button';
  button.className = squareClasses(square, view).join(' ');
  button.dataset.square = square;
  button.setAttribute('aria-label', `${square}, ${piece ? pieceName(piece) : 'empty'}${targetText}`);
  if (index % 8 === 0) button.append(coordinate(doc, 'coord-rank', square[1]));
  if (index >= 56) button.append(coordinate(doc, 'coord-file', square[0]));
  if (piece) button.append(pieceImage(doc, piece));
  return button;
}

/**
 * A coordinate label. Hidden from screen readers: the square's aria-label already names it.
 * @param {Document} doc
 * @param {string} className 'coord-rank' or 'coord-file'
 * @param {string} text
 * @returns {HTMLSpanElement}
 */
function coordinate(doc, className, text) {
  const span = doc.createElement('span');
  span.className = `coord ${className}`;
  span.setAttribute('aria-hidden', 'true');
  span.textContent = text;
  return span;
}

/**
 * @param {Document} doc
 * @param {Piece} piece
 * @returns {HTMLImageElement}
 */
function pieceImage(doc, piece) {
  const img = doc.createElement('img');
  img.className = 'piece';
  img.src = pieceImageUrl(piece);
  img.alt = '';
  img.draggable = false;
  return img;
}
