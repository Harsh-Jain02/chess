// Turns the engine's flags into one Status that the UI can show without knowing chess rules.
// Every draw ends the game at once; there is no "claim draw" step (DECISIONS D08).

/** @typedef {import('../types.js').Color} Color */
/** @typedef {import('../types.js').Flags} Flags */
/** @typedef {import('../types.js').Game} Game */
/** @typedef {import('../types.js').Reason} Reason */
/** @typedef {import('../types.js').Status} Status */

/** Each game-ending flag and its reason, in the order they are checked. */
const ENDINGS = [
  ['checkmate', 'checkmate'],
  ['stalemate', 'stalemate'],
  ['insufficientMaterial', 'insufficient-material'],
  ['threefold', 'threefold-repetition'],
  ['fiftyMoves', 'fifty-move-rule'],
];

/**
 * Whose turn it is, whether that side is in check, and whether the game is
 * over and why. Checkmate is won by the side that just moved; every other
 * ending is a draw.
 * @param {Game} game
 * @returns {Status}
 */
export function getStatus(game) {
  const turn = game.turn();
  const flags = game.flags();
  const reason = endReason(flags);
  return {
    turn,
    inCheck: flags.inCheck,
    checkSquare: flags.inCheck ? game.kingSquare(turn) : null,
    isOver: reason !== null,
    winner: reason === 'checkmate' ? opponent(turn) : null,
    reason,
  };
}

/**
 * @param {Flags} flags
 * @returns {Reason | null} the first ending in ENDINGS whose flag is set
 */
function endReason(flags) {
  const ending = ENDINGS.find(([flag]) => flags[flag]);
  return ending ? ending[1] : null;
}

/**
 * @param {Color} color
 * @returns {Color}
 */
function opponent(color) {
  return color === 'w' ? 'b' : 'w';
}
