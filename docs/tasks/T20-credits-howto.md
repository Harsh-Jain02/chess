# T20 · On-page credits and README "How to play"

**Phase:** 5 (release) · **Depends on:** T19 · **Size:** S

## Goal

Meet the attribution requirement for the piece images (CC BY-SA 3.0 asks for credit where the images are shown), and tell players how the game works.

## Read first

- `CREDITS.md`, `README.md`, `index.html` (`#credits`)

## Do

1. In the `#credits` footer of `index.html` (static HTML, no JS needed), add:
   - "Chess pieces by Cburnett, CC BY-SA 3.0, via Wikimedia Commons", with links to the author's Commons page (https://commons.wikimedia.org/wiki/User:Cburnett), the license (https://creativecommons.org/licenses/by-sa/3.0/), and one of the source files.
   - "Rules engine: chess.js (BSD-2-Clause)", linking to https://github.com/jhlywa/chess.js.
   - Small, unobtrusive styling.
2. `README.md`: add a "How to play" section covering selecting a piece, the dots and rings, promotion, check and the end-of-game messages, Undo, New game, Flip board and auto-save. Remove the "development not started" status line and replace it with the live site URL placeholder `https://<user>.github.io/<repo>/` for the owner to fill in.
3. `CREDITS.md`: remove the sentence saying the folders don't exist yet.

## Acceptance criteria

- [ ] Footer is visible on desktop and phone and the links work
- [ ] README reads well for someone who has never seen the game
- [ ] `npm run check` passes

## Out of scope

- Choosing a project license (owner task O5).
