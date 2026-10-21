// The promotion dialog: the player picks the piece a pawn becomes, or cancels the
// move. Nothing here touches the DOM until askPromotion is called, so the pure
// helper can be tested in Node.

import { pieceImageUrl } from './pieces.js';

/** @typedef {import('../types.js').Color} Color */

/**
 * One piece button of the dialog.
 * @typedef {object} PromotionChoice
 * @property {'q' | 'r' | 'b' | 'n'} type
 * @property {string} label the button's accessible name, e.g. 'Promote to queen'
 * @property {string} imageUrl
 */

/** The pieces a pawn can become, in the order the dialog shows them. */
const PROMOTION_NAMES = { q: 'queen', r: 'rook', b: 'bishop', n: 'knight' };

const TITLE_ID = 'promotion-title';

/**
 * The four piece buttons, queen first.
 * @param {Color} color the side that promotes
 * @returns {PromotionChoice[]}
 */
export function promotionChoices(color) {
  return Object.entries(PROMOTION_NAMES).map(([type, name]) => ({
    type,
    label: `Promote to ${name}`,
    imageUrl: pieceImageUrl({ color, type }),
  }));
}

/**
 * Fills `dialogEl` with the four pieces of `color` and a Cancel button, and opens it
 * as a modal. Browser only: it creates DOM elements.
 * @param {HTMLDialogElement} dialogEl the #promotion-dialog element
 * @param {Color} color the side that promotes
 * @returns {Promise<'q' | 'r' | 'b' | 'n' | null>} the chosen piece type, or `null`
 *   on Cancel or Escape. The dialog is closed by then.
 */
export function askPromotion(dialogEl, color) {
  dialogEl.replaceChildren(dialogForm(dialogEl.ownerDocument, color));
  dialogEl.setAttribute('aria-labelledby', TITLE_ID);
  dialogEl.returnValue = '';
  return new Promise((resolve) => {
    // Every way out closes the dialog: a piece or Cancel submits the form (method
    // 'dialog'), which sets returnValue to the button's value; Escape leaves it ''.
    dialogEl.addEventListener('close', () => {
      const type = dialogEl.returnValue;
      resolve(Object.hasOwn(PROMOTION_NAMES, type) ? type : null);
    }, { once: true });
    dialogEl.showModal();
  });
}

/**
 * @param {Document} doc
 * @param {Color} color
 * @returns {HTMLFormElement}
 */
function dialogForm(doc, color) {
  const form = doc.createElement('form');
  form.method = 'dialog';
  const title = doc.createElement('h2');
  title.id = TITLE_ID;
  title.className = 'promotion-title';
  title.textContent = 'Promote pawn to';
  const choices = doc.createElement('div');
  choices.className = 'promotion-choices';
  choices.append(...promotionChoices(color).map((choice) => choiceButton(doc, choice)));
  const cancel = submitButton(doc, 'promotion-cancel', 'cancel');
  cancel.textContent = 'Cancel';
  form.append(title, choices, cancel);
  return form;
}

/**
 * @param {Document} doc
 * @param {PromotionChoice} choice
 * @returns {HTMLButtonElement}
 */
function choiceButton(doc, { type, label, imageUrl }) {
  const button = submitButton(doc, 'promotion-choice', type);
  button.setAttribute('aria-label', label);
  const img = doc.createElement('img');
  img.src = imageUrl;
  img.alt = '';
  img.draggable = false;
  button.append(img);
  return button;
}

/**
 * A button that closes the dialog with `value` as its returnValue.
 * @param {Document} doc
 * @param {string} className
 * @param {string} value
 * @returns {HTMLButtonElement}
 */
function submitButton(doc, className, value) {
  const button = doc.createElement('button');
  button.type = 'submit';
  button.className = className;
  button.value = value;
  return button;
}
