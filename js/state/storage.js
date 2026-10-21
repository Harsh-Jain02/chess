export const STORAGE_KEY = 'chess.savedGame';

/**
 * Gets local storage without accessing the browser environment at import time.
 * @returns {Storage | null}
 */
export function getBrowserStorage() {
  try {
    return typeof window === 'undefined' ? null : window.localStorage ?? null;
  } catch {
    return null;
  }
}

/**
 * Saves a game to the supplied storage object.
 * @param {Storage | null} storage
 * @param {{ moves: string[], orientation: 'w' | 'b' }} game
 * @returns {boolean}
 */
export function saveGame(storage, game) {
  if (storage === null) return false;

  try {
    const { moves, orientation } = game;
    const savedGame = { version: 1, moves, orientation };
    storage.setItem(STORAGE_KEY, JSON.stringify(savedGame));
    return true;
  } catch {
    return false;
  }
}

/**
 * Loads and validates a game from the supplied storage object.
 * @param {Storage | null} storage
 * @returns {{ moves: string[], orientation: 'w' | 'b' } | null}
 */
export function loadGame(storage) {
  if (storage === null) return null;

  try {
    const value = storage.getItem(STORAGE_KEY);
    if (value === null) return null;

    const savedGame = JSON.parse(value);
    const hasValidMoves = Array.isArray(savedGame.moves)
      && savedGame.moves.every((move) => typeof move === 'string');
    const hasValidOrientation = savedGame.orientation === 'w'
      || savedGame.orientation === 'b';

    if (savedGame.version !== 1 || !hasValidMoves || !hasValidOrientation) {
      return null;
    }

    return {
      moves: savedGame.moves,
      orientation: savedGame.orientation,
    };
  } catch {
    return null;
  }
}

/**
 * Removes the saved game from the supplied storage object.
 * @param {Storage | null} storage
 * @returns {void}
 */
export function clearGame(storage) {
  if (storage === null) return;

  try {
    storage.removeItem(STORAGE_KEY);
  } catch {
    // Storage can be unavailable or blocked; clearing remains best-effort.
  }
}
