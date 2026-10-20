# T06 · Game status: whose turn, check, result

**Phase:** 2 (rules engine) · **Depends on:** T05 · **Size:** S

## Goal

`js/engine/status.js` turns the engine's raw flags into one `Status` object that the UI can display without knowing any chess rules.

## Read first

- `js/engine/game.js` (exports only; skim)
- `docs/ARCHITECTURE.md`: "Data shapes" (`Status`, `Reason`, `Flags`)
- `docs/DECISIONS.md`: D08

## Contract

`getStatus(game) → Status`, a pure function:

```
{ turn, inCheck, checkSquare, isOver, winner, reason }
```

Rules, in this order:

1. **Checkmate:** `isOver: true`, `winner` = the side that just moved (the opposite of `turn`), `reason: 'checkmate'`.
2. Otherwise these draws end the game automatically (D08), with `winner: null`, checked in this order: `'stalemate'`, `'insufficient-material'`, `'threefold-repetition'`, `'fifty-move-rule'`.
3. Otherwise `isOver: false`, `winner: null`, `reason: null`.

`checkSquare` = the king square of the side to move when it is in check (including checkmate), else `null`.

## Acceptance criteria (tests in `tests/engine/status.test.js`)

- [ ] Start position: not over, not in check, `turn: 'w'`
- [ ] After `1. e4 d5 2. Bb5+` (replay `['e2e4','d7d5','f1b5']`; check, not mate since black can block on c6 or d7): `inCheck: true`, `checkSquare: 'e8'`, `turn: 'b'`, not over
- [ ] Fool's mate FEN `rnb1kbnr/pppp1ppp/8/4p3/5PPq/8/PPPPP2P/RNBQKBNR w KQkq - 1 3`: over, `winner: 'b'`, `reason: 'checkmate'`, `checkSquare: 'e1'`
- [ ] Stalemate FEN `4k3/4P3/4K3/8/8/8/8/8 b - - 0 78`: over, `winner: null`, `reason: 'stalemate'`
- [ ] King and knight vs king, FEN `k7/8/n7/8/8/8/8/7K b - - 0 1`: `reason: 'insufficient-material'`
- [ ] The knight-shuffle replay from T05: `reason: 'threefold-repetition'`
- [ ] A position with a half-move clock of 100 and enough material (build the FEN, comment it): `reason: 'fifty-move-rule'`
- [ ] `npm run check` passes

## Out of scope

- Display text (T13).
