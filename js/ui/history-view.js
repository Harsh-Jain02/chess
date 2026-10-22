// Move history formatting and rendering. Nothing touches the DOM at import time.

/** @typedef {import('../types.js').MoveRecord} MoveRecord */
/** @typedef {import('../types.js').MoveRow} MoveRow */

/**
 * Groups chronological move records into numbered white/black rows.
 * @param {MoveRecord[]} history oldest move first
 * @returns {MoveRow[]}
 */
export function formatMoveRows(history) {
  const rows = [];
  for (let index = 0; index < history.length; index += 2) {
    rows.push({
      number: index / 2 + 1,
      white: history[index].san,
      black: history[index + 1]?.san ?? '',
    });
  }
  return rows;
}

/**
 * Draws the numbered, two-column move list and scrolls to its latest row.
 * @param {HTMLElement} el the #history region
 * @param {MoveRow[]} rows formatted move rows
 */
export function renderHistory(el, rows) {
  const doc = el.ownerDocument;
  const title = doc.createElement('h2');
  title.id = 'history-title';
  title.className = 'history-title';
  title.textContent = 'Move history';

  const list = doc.createElement('ol');
  list.className = 'history-list';
  for (const row of rows) {
    const item = doc.createElement('li');
    item.value = row.number;

    const moves = doc.createElement('div');
    moves.className = 'history-moves';
    const white = doc.createElement('span');
    white.textContent = row.white;
    const black = doc.createElement('span');
    black.textContent = row.black;
    moves.append(white, black);
    item.append(moves);
    list.append(item);
  }

  el.replaceChildren(title, list);
  el.scrollTop = el.scrollHeight;
}
