// App state and event handlers: turns clicks on the board into moves, then redraws
// the board with its move highlights. Later tasks add the promotion dialog (T12), the
// status line (T13), the buttons (T14, T15), captured pieces (T16) and saving (T18).

import { getStatus } from './engine/status.js';
import { clickSquare, emptySelection } from './state/selection.js';
import { renderBoard } from './ui/board-view.js';

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
    renderBoard(elements.board, {
      game: state.game,
      orientation: state.orientation,
      selected,
      targets,
      checkSquare: getStatus(state.game).checkSquare,
    });
  }

  /** @param {Square} square */
  function onSquareClick(square) {
    const status = getStatus(state.game);
    const { selection, move } = clickSquare(state.selection, square, state.game, status.isOver);
    state.selection = selection;
    // A pending promotion just waits here until T12 adds the dialog.
    if (move && !state.game.move(move)) console.warn('Move refused by the engine:', move);
    render();
  }

  // One listener for all 64 squares: they are redrawn on every render.
  elements.board.addEventListener('click', (event) => {
    const squareEl = event.target.closest('[data-square]');
    if (squareEl) onSquareClick(squareEl.dataset.square);
  });

  return { render };
}
