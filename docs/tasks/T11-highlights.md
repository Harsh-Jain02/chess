# T11 · Move guidance highlights

**Phase:** 3 (playable board) · **Depends on:** T10 · **Size:** S

## Goal

This is the guidance feature: when a player picks up a piece they see where it can go, captures look different from plain moves, and a king in check is obvious.

## Read first

- `js/ui/board-view.js`, `css/board.css`, `css/base.css` (tokens), `js/controller.js` (`render` only)

## Contract

`js/ui/square-classes.js`: `squareClasses(square, view) → string[]`, a pure function.

- Always `'square'`, plus `'is-light'` or `'is-dark'`.
- `'is-selected'` when `square === view.selected`.
- `'is-target'` for a target that isn't a capture; `'is-capture-target'` for a capture target.
- `'is-check'` when `square === view.checkSquare`.

`board-view.js` uses it (move the light/dark logic into it if that's cleaner). Target squares also get extra text in the `aria-label`: `", can move here"` or `", can capture"`.

`css/board.css`, with new color tokens in `base.css`:

- `is-selected`: tinted square background.
- `is-target`: a centered dot about 30% of the square, drawn with `::after`.
- `is-capture-target`: a ring around the edge of the square, so the captured piece stays visible.
- `is-check`: a red radial glow behind the king.
- Highlights must differ in **shape**, not only color (accessibility).

`controller.js`: pass `selection.targets` and `getStatus(game).checkSquare` into the view.

## Acceptance criteria

- [ ] Tests for `squareClasses` cover every class
- [ ] Browser: click the b1 knight and dots appear on a3 and c3; a piece with a capture available shows a ring on that square; a king in check is highlighted; highlights disappear after the move or a deselect
- [ ] Browser: the highlights are visible on both light and dark squares
- [ ] `npm run check` passes

## Out of scope

- Last-move highlight (not requested; see TODO.md → Ideas).
