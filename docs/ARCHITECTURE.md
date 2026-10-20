# Architecture

How the code is organised and the contracts between modules. Most modules don't exist yet; the **Task** column says which task creates each one. If you change an exported function, update its row here in the same task.

## Layers

```
index.html
  └─ js/main.js ............ boot: find elements, restore saved game, start controller
       └─ js/controller.js . app state { game, selection, orientation }; handles events; calls render
            ├─ js/engine/* . chess rules (wraps vendor/chess.js) ── pure, no DOM
            ├─ js/state/* .. click-to-move logic, save/load ─────── pure, no DOM
            └─ js/ui/* ..... draws the DOM, dialogs ─────────────── gets data as arguments
```

| Code in… | May import |
|---|---|
| `js/engine/game.js` | `vendor/chess.js/chess.js` (the **only** importer), `js/types.js` |
| other `js/engine/*` | `js/engine/*`, `js/types.js` |
| `js/state/*` | `js/engine/*`, `js/types.js` |
| `js/ui/*` | other `js/ui/*`, `js/types.js` |
| `js/controller.js` | engine, state, ui |
| `js/main.js` | controller, engine, state |

## Page elements (contract between `index.html` and JS)

`#status` · `#board` · `#captured-by-w` · `#captured-by-b` · `#controls` · `#promotion-dialog` (a `<dialog>`) · `#credits` (footer)

Layout: wide screens put the board on the left and the status, controls and captured pieces on the right. Narrow screens (< 700px) stack them: status, board, captured pieces, controls.

## Module map

| File | Exports | Task |
|---|---|---|
| `js/types.js` | JSDoc `@typedef`s only (see Data shapes) | T04 |
| `js/engine/game.js` | `createGame`, `replayGame` | T04, T05 |
| `js/engine/status.js` | `getStatus` | T06 |
| `js/engine/captures.js` | `getCaptured` | T07 |
| `js/state/selection.js` | `emptySelection`, `clickSquare`, `choosePromotion`, `cancelPromotion` | T09 |
| `js/state/storage.js` | `STORAGE_KEY`, `getBrowserStorage`, `saveGame`, `loadGame`, `clearGame` | T17 |
| `js/ui/pieces.js` | `pieceImageUrl`, `pieceName` | T08 |
| `js/ui/board-view.js` | `squareOrder`, `isLightSquare`, `renderBoard` | T08 |
| `js/ui/square-classes.js` | `squareClasses` | T11 |
| `js/ui/promotion-dialog.js` | `askPromotion` | T12 |
| `js/ui/status-view.js` | `statusText`, `renderStatus` | T13 |
| `js/ui/controls.js` | `renderControls`, `bindControls` | T14, T15 |
| `js/ui/captured-view.js` | `renderCaptured` | T16 |
| `js/controller.js` | `createController` | T10 (extended by T11–T18) |
| `js/main.js` | nothing (entry point) | T02, T10, T18 |
| `css/base.css` · `css/board.css` · `css/controls.css` | tokens + layout · board · panel, buttons, dialog | T02, T08, T11, T12 |
| `scripts/check-file-size.js` | `countLines`, `isChecked` + CLI | T01 |

## Data shapes

```
Color       'w' | 'b'
PieceType   'p' | 'n' | 'b' | 'r' | 'q' | 'k'
Square      'a1' … 'h8'
Piece       { color: Color, type: PieceType }
Target      { to: Square, isCapture: boolean, isPromotion: boolean }
MoveInput   { from: Square, to: Square, promotion?: 'q' | 'r' | 'b' | 'n' }
MoveRecord  { color, piece: PieceType, from, to, captured?: PieceType,
              promotion?: PieceType, san: string, lan: string }      // plain object
Flags       { inCheck, checkmate, stalemate, threefold, fiftyMoves,
              insufficientMaterial }                                  // booleans
Status      { turn: Color, inCheck: boolean, checkSquare: Square | null,
              isOver: boolean, winner: Color | null, reason: Reason | null }
Reason      'checkmate' | 'stalemate' | 'insufficient-material'
            | 'threefold-repetition' | 'fifty-move-rule'
Selection   { selected: Square | null, targets: Target[],
              pendingPromotion: { from: Square, to: Square } | null }
SavedGame   { version: 1, moves: string[], orientation: Color }      // moves in LAN, e.g. 'e7e8q'
```

`Game` (returned by `createGame` / `replayGame`) has these methods: `turn()`, `fen()`, `pieceAt(sq)`, `legalTargets(from)`, `kingSquare(color)`, `flags()` (T04), and `move(input)`, `undo()`, `history()`, `moveList()` (T05).

## What happens on a click

1. The controller has one `click` listener on `#board` and finds `event.target.closest('[data-square]')`.
2. It calls `clickSquare(selection, square, game, status.isOver)` and gets back `{ selection, move }`.
3. If the new selection has `pendingPromotion`, it calls `await askPromotion(...)`, then `choosePromotion` or `cancelPromotion`.
4. If there's a `move`, it calls `game.move(move)`.
5. It saves the game (T18), then calls `render()`, which computes `getStatus(game)` and `getCaptured(game.history())` and redraws the board, status, captured pieces and controls.

Rendering always redraws the whole board (64 `<button>`s, decision D17). Each square has `data-square="e4"` and an `aria-label` such as `"e4, white knight"`.

## Testing strategy

- **Pure code** (`engine/`, `state/`, pure helpers in `ui/`) gets unit tests via `npm test`, in Node, with no DOM.
- **DOM code** gets the manual browser check listed in each task, plus `docs/QA.md` (T21) before each release.
- **Automated browser tests** would need a dependency (e.g. Playwright). That's not planned and needs owner approval.

## chess.js API we use (checked against v1.4.0 source, 2026-10-20)

Import (only in `js/engine/game.js`): `import { Chess } from '../../vendor/chess.js/chess.js';`

| Call | Returns / behaviour |
|---|---|
| `new Chess(fen?)` | New game; start position if no FEN. Throws on an invalid FEN |
| `.turn()` | `'w'` or `'b'` |
| `.fen()` | FEN string of the current position |
| `.get(square)` | `{ type, color }`, or **`undefined`** if empty (the adapter returns `null`) |
| `.moves({ square, verbose: true })` | Array of `Move` objects with `from, to, piece, color, captured?, promotion?, san, lan` |
| `.move({ from, to, promotion })` | `Move` if legal. **Throws** if illegal (the adapter checks the move against its legal targets first and returns `null` instead) |
| `.undo()` | `Move` that was taken back, or `null` |
| `.history({ verbose: true })` | Array of `Move`, oldest first |
| `.findPiece({ type: 'k', color })` | Array of squares, e.g. `['e1']` |
| `.inCheck()` `.isCheckmate()` `.isStalemate()` | booleans |
| `.isThreefoldRepetition()` `.isDrawByFiftyMoves()` `.isInsufficientMaterial()` | booleans; the 50-move rule triggers at a half-move clock ≥ 100 |
| `.isDraw()` / `.isGameOver()` | In 1.4.0 **source**: `isDraw` = fifty-move ∨ stalemate ∨ insufficient material ∨ threefold. `isGameOver` = checkmate ∨ `isDraw`. (The README's description of `isDraw` is out of date.) |

Gotchas:

- **Promotions:** `moves()` returns **four** moves for one promotion (`q`, `r`, `b`, `n`), all with the same `to`. The adapter merges them into one target.
- **En passant:** `Move.isCapture()` is **false** for an en passant capture, but `move.captured` is `'p'`. Detect captures with `captured !== undefined`.
- **LAN:** `lan` includes the promotion piece, e.g. `'e7e8q'`. This is the format used for saved games.
- **`move()` is lenient:** it ignores a `promotion` piece on a move that isn't a promotion, plays a "null move" (passes the turn) for `move(null)`, and reads strings as SAN. The adapter refuses all three and only passes an object it built.
- **`Move` fields:** `captured` and `promotion` are always own properties, `undefined` when unused. A `MoveRecord` leaves them out instead.
- Don't hand chess.js `Move` instances to the rest of the app. Copy the fields into plain `MoveRecord` objects.
