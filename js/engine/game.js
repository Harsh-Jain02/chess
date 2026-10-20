// The engine adapter, and the only module that imports chess.js (DECISIONS D02).
// It answers in the plain shapes from js/types.js and never hands out chess.js objects.

import { Chess } from '../../vendor/chess.js/chess.js';

/** @typedef {import('../types.js').Piece} Piece */
/** @typedef {import('../types.js').Target} Target */
/** @typedef {import('../types.js').Game} Game */

/**
 * Starts a game from the standard start position, or from `fen` if given.
 * @param {{ fen?: string }} [options]
 * @returns {Game}
 * @throws {Error} `Error('Invalid FEN')` if `fen` isn't a valid position (only tests pass one)
 */
export function createGame({ fen } = {}) {
  const chess = newChess(fen);
  return {
    turn: () => chess.turn(),
    fen: () => chess.fen(),
    pieceAt: (square) => toPiece(chess.get(square)),
    legalTargets: (from) => legalTargets(chess, from),
    kingSquare: (color) => chess.findPiece({ type: 'k', color })[0],
    flags: () => ({
      inCheck: chess.inCheck(),
      checkmate: chess.isCheckmate(),
      stalemate: chess.isStalemate(),
      threefold: chess.isThreefoldRepetition(),
      fiftyMoves: chess.isDrawByFiftyMoves(),
      insufficientMaterial: chess.isInsufficientMaterial(),
    }),
  };
}

/**
 * @param {string | undefined} fen
 * @returns {Chess}
 */
function newChess(fen) {
  if (fen === undefined) return new Chess();
  try {
    return new Chess(fen);
  } catch (error) {
    throw new Error('Invalid FEN', { cause: error });
  }
}

/**
 * Copies a chess.js board entry, because `Chess.get` returns the internal object.
 * @param {{ color: string, type: string } | undefined} entry
 * @returns {Piece | null}
 */
function toPiece(entry) {
  return entry ? { color: entry.color, type: entry.type } : null;
}

/**
 * Checks the square first: chess.js lists the moves of *every* piece when the
 * square is falsy (e.g. `''`).
 * @param {Chess} chess
 * @param {string} from
 * @returns {Target[]}
 */
function legalTargets(chess, from) {
  const piece = chess.get(from);
  if (!piece || piece.color !== chess.turn()) return [];
  return toTargets(chess.moves({ square: from, verbose: true }));
}

/**
 * One target per destination square, so the four promotion moves become one.
 * Captures are read from `captured`: `Move.isCapture()` is false for en passant.
 * @param {{ to: string, captured?: string, promotion?: string }[]} moves chess.js verbose moves
 * @returns {Target[]}
 */
function toTargets(moves) {
  const byDestination = new Map();
  for (const move of moves) {
    if (byDestination.has(move.to)) continue;
    byDestination.set(move.to, {
      to: move.to,
      isCapture: move.captured !== undefined,
      isPromotion: move.promotion !== undefined,
    });
  }
  return [...byDestination.values()];
}
