// The engine adapter, and the only module that imports chess.js (DECISIONS D02).
// It answers in the plain shapes from js/types.js and never hands out chess.js objects.

import { Chess } from '../../vendor/chess.js/chess.js';

/** @typedef {import('../types.js').Piece} Piece */
/** @typedef {import('../types.js').Target} Target */
/** @typedef {import('../types.js').MoveInput} MoveInput */
/** @typedef {import('../types.js').MoveRecord} MoveRecord */
/** @typedef {import('../types.js').Game} Game */

const PROMOTIONS = ['q', 'r', 'b', 'n'];

/** Long algebraic notation, e.g. 'e2e4' or 'b7a8q'. */
const LAN = /^([a-h][1-8])([a-h][1-8])([qrbn])?$/;

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
    move: (input) => makeMove(chess, input),
    undo: () => toMoveRecord(chess.undo()),
    history: () => chess.history({ verbose: true }).map(toMoveRecord),
    moveList: () => chess.history({ verbose: true }).map((move) => move.lan),
  };
}

/**
 * Plays `moveList` from the start position, e.g. to restore a saved game (DECISIONS D15).
 * Each move must be exactly what `moveList()` produces: lowercase LAN, with a
 * promotion piece on promotion moves only.
 * @param {unknown} moveList moves in LAN, e.g. `['e2e4', 'e7e5']`
 * @returns {Game | null} `null` if `moveList` isn't an array of strings, or any move is malformed or illegal
 */
export function replayGame(moveList) {
  if (!Array.isArray(moveList)) return null;
  const game = createGame();
  for (const lan of moveList) {
    const input = parseLan(lan);
    if (!input || !game.move(input)) return null;
  }
  return game;
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

/**
 * Plays `input` only if it is exactly a legal move, so chess.js can't throw.
 * chess.js ignores a promotion piece on a move that isn't a promotion; we
 * refuse it. It also plays a null move for `null` and reads strings as SAN, so
 * it only ever gets an object built here.
 * @param {Chess} chess
 * @param {unknown} input
 * @returns {MoveRecord | null}
 */
function makeMove(chess, input) {
  if (!isMoveInput(input)) return null;
  const { from, to, promotion } = input;
  const target = legalTargets(chess, from).find((candidate) => candidate.to === to);
  if (!target || target.isPromotion !== (promotion !== undefined)) return null;
  return toMoveRecord(chess.move({ from, to, promotion }));
}

/**
 * @param {unknown} input
 * @returns {boolean} true if `input` has the shape of a MoveInput
 */
function isMoveInput(input) {
  if (typeof input !== 'object' || input === null) return false;
  const { from, to, promotion } = input;
  return typeof from === 'string' && typeof to === 'string'
    && (promotion === undefined || PROMOTIONS.includes(promotion));
}

/**
 * @param {unknown} lan
 * @returns {MoveInput | null}
 */
function parseLan(lan) {
  const match = typeof lan === 'string' ? LAN.exec(lan) : null;
  if (!match) return null;
  const [, from, to, promotion] = match;
  return { from, to, promotion };
}

/**
 * Copies a chess.js `Move` into a plain object. chess.js keeps `captured` and
 * `promotion` as `undefined` fields; a MoveRecord leaves them out instead.
 * @param {{ color: string, piece: string, from: string, to: string,
 *   captured?: string, promotion?: string, san: string, lan: string } | null} move
 * @returns {MoveRecord | null}
 */
function toMoveRecord(move) {
  if (!move) return null;
  const { color, piece, from, to, captured, promotion, san, lan } = move;
  const record = { color, piece, from, to, san, lan };
  if (captured) record.captured = captured;
  if (promotion) record.promotion = promotion;
  return record;
}
