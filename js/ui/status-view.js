// The status line above the board: whose turn it is, check, and how the game ended.
// Nothing here touches the DOM until renderStatus is called, so statusText can be
// tested in Node.

/** @typedef {import('../types.js').Color} Color */
/** @typedef {import('../types.js').Reason} Reason */
/** @typedef {import('../types.js').Status} Status */

/** @type {Record<Color, string>} */
const COLOR_NAMES = { w: 'White', b: 'Black' };

/** How each draw is named after "Draw — ". */
const DRAW_NAMES = {
  stalemate: 'stalemate',
  'insufficient-material': 'insufficient material',
  'threefold-repetition': 'threefold repetition',
  'fifty-move-rule': '50-move rule',
};

/**
 * The sentence the status line shows, e.g. 'White to move — check!' or
 * 'Checkmate — Black wins'.
 * @param {Status} status
 * @returns {string}
 */
export function statusText(status) {
  if (status.reason === 'checkmate') return `Checkmate — ${COLOR_NAMES[status.winner]} wins`;
  if (status.reason) return `Draw — ${DRAW_NAMES[status.reason]}`;
  const toMove = `${COLOR_NAMES[status.turn]} to move`;
  return status.inCheck ? `${toMove} — check!` : toMove;
}

/**
 * Writes the status text into `el`, which has the class `is-over` exactly while the
 * game is over. Browser only.
 * @param {HTMLElement} el the #status element (it has aria-live="polite")
 * @param {Status} status
 */
export function renderStatus(el, status) {
  el.textContent = statusText(status);
  el.classList.toggle('is-over', status.isOver);
}
