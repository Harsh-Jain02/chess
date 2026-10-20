// Shared JSDoc type definitions (docs/ARCHITECTURE.md → Data shapes). No runtime code.
// Import them in JSDoc with `@typedef {import('../types.js').Piece} Piece`.

/** @typedef {'w' | 'b'} Color */

/** @typedef {'p' | 'n' | 'b' | 'r' | 'q' | 'k'} PieceType */

/** @typedef {string} Square A square name, 'a1' … 'h8' */

/**
 * @typedef {object} Piece
 * @property {Color} color
 * @property {PieceType} type
 */

/**
 * A square the selected piece can move to. The four promotion moves to one
 * square are a single target.
 * @typedef {object} Target
 * @property {Square} to
 * @property {boolean} isCapture also true for en passant
 * @property {boolean} isPromotion
 */

/**
 * @typedef {object} MoveInput
 * @property {Square} from
 * @property {Square} to
 * @property {'q' | 'r' | 'b' | 'n'} [promotion]
 */

/**
 * A move that was played, as a plain object (never a chess.js `Move`).
 * @typedef {object} MoveRecord
 * @property {Color} color
 * @property {PieceType} piece
 * @property {Square} from
 * @property {Square} to
 * @property {PieceType} [captured]
 * @property {PieceType} [promotion]
 * @property {string} san e.g. 'Nf3'
 * @property {string} lan e.g. 'g1f3', 'e7e8q'
 */

/**
 * Check and game-over flags, straight from chess.js.
 * @typedef {object} Flags
 * @property {boolean} inCheck
 * @property {boolean} checkmate
 * @property {boolean} stalemate
 * @property {boolean} threefold
 * @property {boolean} fiftyMoves
 * @property {boolean} insufficientMaterial
 */

/**
 * @typedef {'checkmate' | 'stalemate' | 'insufficient-material'
 *   | 'threefold-repetition' | 'fifty-move-rule'} Reason
 */

/**
 * @typedef {object} Status
 * @property {Color} turn
 * @property {boolean} inCheck
 * @property {Square | null} checkSquare
 * @property {boolean} isOver
 * @property {Color | null} winner
 * @property {Reason | null} reason
 */

/**
 * @typedef {object} Selection
 * @property {Square | null} selected
 * @property {Target[]} targets
 * @property {{ from: Square, to: Square } | null} pendingPromotion
 */

/**
 * @typedef {object} SavedGame
 * @property {1} version
 * @property {string[]} moves in LAN, e.g. 'e7e8q'
 * @property {Color} orientation
 */

/**
 * Returned by `createGame` and `replayGame`.
 * @typedef {object} Game
 * @property {() => Color} turn
 * @property {() => string} fen
 * @property {(square: Square) => Piece | null} pieceAt
 * @property {(from: Square) => Target[]} legalTargets
 * @property {(color: Color) => Square} kingSquare
 * @property {() => Flags} flags
 * @property {(input: MoveInput) => MoveRecord | null} move `null` if illegal; never throws
 * @property {() => MoveRecord | null} undo takes back the last move; `null` if there is none
 * @property {() => MoveRecord[]} history oldest first
 * @property {() => string[]} moveList in LAN, oldest first, e.g. `['e2e4', 'e7e5']`
 */

export {};
