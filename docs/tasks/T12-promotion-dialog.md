# T12 · Promotion dialog

**Phase:** 3 (playable board) · **Depends on:** T11 · **Size:** S

## Goal

When a pawn reaches the last rank, the player chooses a queen, rook, bishop or knight, or cancels the move.

## Read first

- `js/controller.js`, `js/state/selection.js` (`choosePromotion`, `cancelPromotion`), `js/ui/pieces.js`
- `index.html` (`#promotion-dialog`), `css/controls.css`

## Contract

`js/ui/promotion-dialog.js`: `askPromotion(dialogEl, color) → Promise<'q' | 'r' | 'b' | 'n' | null>`

- Fills the `<dialog>` with four buttons showing pieces of `color` (accessible names such as "Promote to queen") and a "Cancel" button, then calls `showModal()`.
- Resolves with the chosen piece type, or `null` on Cancel or Escape (the dialog's `cancel` event).
- Always closes the dialog. Removes its listeners after resolving, so repeated promotions don't stack handlers.

Controller: after a click returns a selection with `pendingPromotion`, `await askPromotion(...)`, then call `choosePromotion` or `cancelPromotion`, then make the move (if any) and `render()`.

Styles go in `css/controls.css`. The dialog must fit a 320px-wide screen.

## Acceptance criteria

- [ ] Browser: get a white pawn to the 8th rank. For example `1. a4 b5 2. axb5 a6 3. bxa6 Bb7 4. axb7 Nc6` and then click b7, then a8. (Check this line with a quick `replayGame` in Node first; if it's wrong, use any line that works.)
- [ ] Each of the four choices produces that piece
- [ ] Cancel and Escape leave the pawn on the 7th rank, and it's still white's turn
- [ ] A black promotion shows black pieces
- [ ] Keyboard: Tab moves between choices, Enter or Space selects
- [ ] `npm run check` passes

## Out of scope

- Auto-queen option, animations.
