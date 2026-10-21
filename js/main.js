// Entry point, loaded by index.html as an ES module. Boot only: find the page
// elements, create the game and start the controller.

import { createController } from './controller.js';
import { createGame, replayGame } from './engine/game.js';
import { clearGame, getBrowserStorage, loadGame } from './state/storage.js';

/**
 * @param {string} id
 * @returns {HTMLElement}
 */
function byId(id) {
  const element = document.getElementById(id);
  if (!element) throw new Error(`index.html has no #${id} element`);
  return element;
}

const storage = getBrowserStorage();
const saved = loadGame(storage);
const restoredGame = saved ? replayGame(saved.moves) : null;
if (!restoredGame) clearGame(storage);

const controller = createController({
  elements: {
    status: byId('status'),
    board: byId('board'),
    capturedByW: byId('captured-by-w'),
    capturedByB: byId('captured-by-b'),
    controls: byId('controls'),
    promotionDialog: byId('promotion-dialog'),
  },
  game: restoredGame ?? createGame(),
  orientation: restoredGame && saved ? saved.orientation : 'w',
  storage,
});
controller.render();
