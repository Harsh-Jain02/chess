// Captured-piece labels and images. Nothing touches the DOM at import time.

import { pieceImageUrl, pieceName } from './pieces.js';

/** @typedef {import('../types.js').Piece} Piece */

/**
 * Draws one side's captured pieces. Browser only: it creates DOM elements.
 * @param {HTMLElement} el the captured-pieces region to draw into
 * @param {string} label e.g. "White captured"
 * @param {Piece[]} pieces already sorted into display order
 */
export function renderCaptured(el, label, pieces) {
  const doc = el.ownerDocument;
  const labelEl = doc.createElement('span');
  labelEl.className = 'captured-label';
  labelEl.textContent = `${label}:`;

  if (pieces.length === 0) {
    const noneEl = doc.createElement('span');
    noneEl.textContent = 'none';
    el.replaceChildren(labelEl, noneEl);
    return;
  }

  const images = pieces.map((piece) => {
    const image = doc.createElement('img');
    image.className = 'captured-piece';
    image.src = pieceImageUrl(piece);
    image.alt = pieceName(piece);
    return image;
  });
  el.replaceChildren(labelEl, ...images);
}
