// The buttons in #controls: New game, Undo and Flip board. Nothing here touches the
// DOM until renderControls or bindControls is called, so the pure helper can be
// tested in Node.

/**
 * One button of #controls.
 * @typedef {object} ControlButton
 * @property {string} action the button's data-action, e.g. 'new-game'
 * @property {string} label the button's text
 * @property {'onNewGame' | 'onUndo' | 'onFlip'} handler the bindControls handler a click calls
 */

/**
 * What a click on each button calls (see bindControls).
 * @typedef {object} ControlHandlers
 * @property {() => void} onNewGame
 * @property {() => void} onUndo
 * @property {() => void} onFlip
 */

/**
 * The buttons, in the order the page shows them.
 * @returns {ControlButton[]}
 */
export function controlButtons() {
  return [
    { action: 'new-game', label: 'New game', handler: 'onNewGame' },
    { action: 'undo', label: 'Undo', handler: 'onUndo' },
    { action: 'flip', label: 'Flip board', handler: 'onFlip' },
  ];
}

/**
 * Builds the buttons into `controlsEl` on the first call; later calls keep them, so
 * focus stays on the button just clicked. Browser only: it creates DOM elements.
 * @param {HTMLElement} controlsEl the #controls element
 * @param {object} state
 * @param {boolean} state.canUndo whether at least one move can be undone
 */
export function renderControls(controlsEl, { canUndo }) {
  if (controlsEl.childElementCount === 0) {
    const doc = controlsEl.ownerDocument;
    controlsEl.append(...controlButtons().map(({ action, label }) => {
      const button = doc.createElement('button');
      button.type = 'button';
      button.className = 'control-button';
      button.dataset.action = action;
      button.textContent = label;
      return button;
    }));
  }
  controlsEl.querySelector('[data-action="undo"]').disabled = !canUndo;
}

/**
 * Adds one click listener to `controlsEl` that calls the handler of the button clicked.
 * Call it once: the buttons can be built later, since the listener is on their parent.
 * @param {HTMLElement} controlsEl the #controls element
 * @param {ControlHandlers} handlers
 */
export function bindControls(controlsEl, handlers) {
  controlsEl.addEventListener('click', (event) => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    const button = controlButtons().find((candidate) => candidate.action === action);
    if (button) handlers[button.handler]();
  });
}
