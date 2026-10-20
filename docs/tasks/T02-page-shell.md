# T02 · Page shell: index.html, base CSS, entry module

**Phase:** 1 (tooling and page shell) · **Depends on:** none · **Size:** S

## Goal

A page that loads from a local server and shows the title plus empty, outlined regions where the board, status, captured pieces and controls will go, laid out responsively. Later tasks fill these regions.

## Read first

- `docs/ARCHITECTURE.md`: "Page elements" and "Module map"
- `docs/DECISIONS.md`: D01, D10

## Do

1. `index.html`:
   - `<!doctype html>`, `<html lang="en">`, UTF-8 charset, viewport meta, `<title>Chess</title>`.
   - Link `css/base.css`, `css/board.css`, `css/controls.css`. Create the last two with a one-line comment only.
   - A `<main>` containing the regions with exactly these ids: `status`, `board`, `captured-by-w`, `captured-by-b`, `controls`. Add `<dialog id="promotion-dialog"></dialog>` and `<footer id="credits"></footer>`.
   - `#status` gets `aria-live="polite"`.
   - `<script type="module" src="js/main.js"></script>`.
2. `css/base.css`:
   - Custom properties for colors, spacing and board size. Board size is one variable, starting at `min(92vw, 70vh, 640px)`.
   - `box-sizing` reset, system font stack, and an explicit page background and text color.
   - Layout: board beside a side panel (status, captured, controls) when wide; stacked when narrower than 700px (status, board, captured, controls).
   - `#board` is square (`aspect-ratio: 1`, width = the board-size variable) and gets a visible outline for now.
3. `js/main.js`: only a comment saying it's the entry point and will be wired up in T10. It must load without errors.

## Acceptance criteria

- [ ] `python3 -m http.server 8000`, then http://localhost:8000 shows the page with no 404s and no errors in the browser console
- [ ] At 360px wide (devtools device mode): no horizontal scrollbar, regions stacked. At 1280px: side panel beside the board
- [ ] All URLs are relative (no leading `/`)
- [ ] `npm run check` passes (if T01 is done; otherwise say so)

## Out of scope

- Drawing squares or pieces (T08), any game logic, dark mode.
