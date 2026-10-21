// App state and event handlers: turns clicks on the board into moves (asking which
// piece a pawn promotes to), then redraws the board with its move highlights and the
// status line. Later tasks add the buttons (T14, T15), captured pieces (T16) and
// saving (T18).

import { getStatus } from './engine/status.js';
import { cancelPromotion, choosePromotion, clickSquare, emptySelection } from './state/selection.js';
import { renderBoard } from './ui/board-view.js';
import { askPromotion } from './ui/promotion-dialog.js';
import { renderStatus } from './ui/status-view.js';

/** @typedef {import('./state/selection.js').ClickResult} ClickResult */
/** @typedef {import('./types.js').Color} Color */
/** @typedef {import('./types.js').Game} Game */
/** @typedef {import('./types.js').Selection} Selection */
/** @typedef {import('./types.js').Square} Square */

/**
 * The page elements the app draws into (ARCHITECTURE → Page elements), found by main.js.
 * @typedef {object} Elements
 * @property {HTMLElement} status #status
 * @property {HTMLElement} board #board
 * @property {HTMLElement} capturedByW #captured-by-w
 * @property {HTMLElement} capturedByB #captured-by-b
 * @property {HTMLElement} controls #controls
 * @property {HTMLDialogElement} promotionDialog #promotion-dialog
 */

/**
 * @typedef {object} Controller
 * @property {() => void} render redraws the page from the current state
 */

/**
 * Listens for clicks on the board and plays the moves they make. Draws nothing
 * until `render` is called.
 * @param {object} options
 * @param {Elements} options.elements
 * @param {Game} options.game the game to play on; the controller moves it
 * @param {Color} options.orientation the color at the bottom of the board
 * @returns {Controller}
 */
export function createController({ elements, game, orientation }) {
  /** @type {{ game: Game, selection: Selection, orientation: Color }} */
  const state = { game, selection: emptySelection, orientation };

  function render() {
    const { selected, targets } = state.selection;
    const status = getStatus(state.game);
    renderBoard(elements.board, {
      game: state.game,
      orientation: state.orientation,
      selected,
      targets,
      checkSquare: status.checkSquare,
    });
    renderStatus(elements.status, status);
  }

  /** @param {Square} square */
  async function onSquareClick(square) {
    const status = getStatus(state.game);
    let result = clickSquare(state.selection, square, state.game, status.isOver);
    if (result.selection.pendingPromotion) result = await completePromotion(result.selection);
    state.selection = result.selection;
    const { move } = result;
    if (move && !state.game.move(move)) console.warn('Move refused by the engine:', move);
    render();
  }

  /**
   * Asks which piece the pawn becomes. Meanwhile the board still shows the pawn
   * selected, and the dialog is modal, so no other click can get in.
   * @param {Selection} selection with a pendingPromotion
   * @returns {Promise<ClickResult>} the promotion move, or no move if cancelled
   */
  async function completePromotion(selection) {
    const pieceType = await askPromotion(elements.promotionDialog, state.game.turn());
    if (pieceType) return choosePromotion(selection, pieceType);
    return { selection: cancelPromotion(selection), move: null };
  }

  // One listener for all 64 squares: they are redrawn on every render.
  elements.board.addEventListener('click', (event) => {
    const squareEl = event.target.closest('[data-square]');
    if (squareEl) onSquareClick(squareEl.dataset.square);
  });

  return { render };
}
