// Entry point, loaded by index.html as an ES module.
// Temporary wiring (T08): draws the start position, white at the bottom. T10 replaces
// this with the controller.

import { createGame } from './engine/game.js';
import { renderBoard } from './ui/board-view.js';

renderBoard(document.getElementById('board'), {
  game: createGame(),
  orientation: 'w',
  selected: null,
  targets: [],
  checkSquare: null,
});
