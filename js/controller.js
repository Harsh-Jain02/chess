// App state and event handlers: turns clicks on the board into moves (asking which
// piece a pawn promotes to), handles the New game, Undo and Flip board buttons, then
// redraws the board with its move highlights, the status line, captured pieces and
// buttons. A later task adds saving (T18).

import { getCaptured } from './engine/captures.js';
import { createGame } from './engine/game.js';
import { getStatus } from './engine/status.js';
import { cancelPromotion, choosePromotion, clickSquare, emptySelection } from './state/selection.js';
import { renderBoard } from './ui/board-view.js';
import { renderCaptured } from './ui/captured-view.js';
import { bindControls, renderControls } from './ui/controls.js';
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
 * Listens for clicks on the board and the buttons, and plays the moves they make.
 * Draws nothing until `render` is called.
 * @param {object} options
 * @param {Elements} options.elements
 * @param {Game} options.game the game to start with; the controller moves it, and New
 *   game replaces it
 * @param {Color} options.orientation the color at the bottom of the board
 * @returns {Controller}
 */
export function createController({ elements, game, orientation }) {
  /** @type {{ game: Game, selection: Selection, orientation: Color }} */
  const state = { game, selection: emptySelection, orientation };

  function render() {
    const { selected, targets } = state.selection;
    const status = getStatus(state.game);
    const history = state.game.history();
    const captured = getCaptured(history);
    renderBoard(elements.board, {
      game: state.game,
      orientation: state.orientation,
      selected,
      targets,
      checkSquare: status.checkSquare,
    });
    renderStatus(elements.status, status);
    renderCaptured(
      elements.capturedByW,
      'White captured',
      captured.w.map((type) => ({ color: 'b', type })),
    );
    renderCaptured(
      elements.capturedByB,
      'Black captured',
      captured.b.map((type) => ({ color: 'w', type })),
    );
    renderControls(elements.controls, {
      canUndo: history.length > 0 && !status.isOver,
    });
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

  /**
   * Starts over from the start position, keeping the orientation. Asks first if that
   * would throw away a game in progress; a finished game goes without asking (TODO Q1).
   */
  function onNewGame() {
    const inProgress = state.game.moveList().length > 0 && !getStatus(state.game).isOver;
    if (inProgress && !window.confirm('Start a new game? The current game will be lost.')) return;
    state.game = createGame();
    state.selection = emptySelection;
    render();
  }

  /** Takes back one player's move, unless the game is over. */
  function onUndo() {
    if (state.game.history().length === 0 || getStatus(state.game).isOver) return;
    state.game.undo();
    state.selection = emptySelection;
    render();
  }

  /** Turns the board around. The selection stays: it names squares, not screen spots. */
  function onFlip() {
    state.orientation = state.orientation === 'w' ? 'b' : 'w';
    render();
  }

  // One listener for all 64 squares: they are redrawn on every render.
  elements.board.addEventListener('click', (event) => {
    const squareEl = event.target.closest('[data-square]');
    if (squareEl) onSquareClick(squareEl.dataset.square);
  });
  bindControls(elements.controls, { onNewGame, onUndo, onFlip });

  return { render };
}
