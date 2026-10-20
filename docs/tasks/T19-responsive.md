# T19 · Mobile and responsive pass

**Phase:** 5 (release) · **Depends on:** T12–T18 · **Size:** S

## Goal

The game is comfortable to play on phones, tablets and desktops (decision D10).

## Read first

- `css/base.css`, `css/board.css`, `css/controls.css`, `index.html`

## Do

Check these widths in devtools device mode: **320, 360, 414** (phones, portrait), **phone landscape**, **768** (tablet), **1280** (desktop). At each width, fix CSS problems:

- No horizontal scrolling. On portrait phones the whole board is visible without scrolling (the controls may sit below it).
- Buttons are at least 44px tall. Board squares are as large as the width allows (≈ 37–40px on a 320px screen, which is acceptable).
- `touch-action: manipulation` on the board and buttons, so a quick double tap doesn't zoom.
- The promotion dialog and captured lists fit and wrap.
- Text stays readable (at least 14px).

Keep each CSS file under 200 lines. If needed, split media queries into `css/responsive.css` and link it from `index.html`.

## Acceptance criteria

- [ ] Your report has a short note per width: OK, or what was fixed
- [ ] Owner can play a full game on a real phone (owner checks during O6; mention it in your report)
- [ ] `npm run check` passes

## Out of scope

- New features, dark mode, installable app (PWA).
