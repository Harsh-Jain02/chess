// The CSS classes of one board square: its color plus the move guidance highlights
// (selected piece, where it can go, king in check). Pure, so it is tested in Node.

/** @typedef {import('../types.js').Square} Square */
/** @typedef {import('../types.js').Target} Target */

/**
 * @param {Square} square
 * @returns {boolean} true for a light square; a1 is dark, h1 is light
 */
export function isLightSquare(square) {
  const file = 'abcdefgh'.indexOf(square[0]);
  const rank = '12345678'.indexOf(square[1]);
  return (file + rank) % 2 === 1;
}

/**
 * @param {Square} square
 * @param {{ selected: Square | null, targets: Target[], checkSquare: Square | null }} view
 *   the highlight fields of a BoardView
 * @returns {string[]} always 'square' and 'is-light' or 'is-dark'; then 'is-selected',
 *   'is-target' or 'is-capture-target', and 'is-check' when they apply
 */
export function squareClasses(square, view) {
  const classes = ['square', isLightSquare(square) ? 'is-light' : 'is-dark'];
  if (square === view.selected) classes.push('is-selected');
  const target = view.targets.find((t) => t.to === square);
  if (target) classes.push(target.isCapture ? 'is-capture-target' : 'is-target');
  if (square === view.checkSquare) classes.push('is-check');
  return classes;
}
