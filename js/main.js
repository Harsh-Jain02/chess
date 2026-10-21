// Entry point, loaded by index.html as an ES module. Boot only: find the page
// elements, create the game and start the controller.

import { createController } from './controller.js';
import { createGame } from './engine/game.js';

/**
 * @param {string} id
 * @returns {HTMLElement}
 */
function byId(id) {
  const element = document.getElementById(id);
  if (!element) throw new Error(`index.html has no #${id} element`);
  return element;
}

const controller = createController({
  elements: {
    status: byId('status'),
    board: byId('board'),
    capturedByW: byId('captured-by-w'),
    capturedByB: byId('captured-by-b'),
    controls: byId('controls'),
    promotionDialog: byId('promotion-dialog'),
  },
  game: createGame(),
  orientation: 'w',
});
controller.render();
