# Release QA

Run this checklist in a desktop browser and a phone browser before every release. Start each scenario with **New game** unless it says otherwise. Click the source square and then the destination square for every move.

The fixture name beside each line points to its automated proof in `tests/qa/sequences.js`. Chess notation uses `O-O` for kingside castling, `O-O-O` for queenside castling, and `x` for a capture.

## Move guidance

- [ ] **Starting knight** (`knightStart`): In a new game, click b1. Exactly two move dots appear, on a3 and c3.
- [ ] **Pinned knight** (`pinnedKnight`): Play `1. e4 d5 2. Bb5+ Nc6 3. a3`. Click the black knight on c6. No move dots appear because moving it would expose the king.

## Castling

- [ ] **Kingside** (`castleKingside`): Play `1. Nf3 Nf6 2. g3 g6 3. Bg2 Bg7 4. O-O`. The white king finishes on g1 and the h1 rook on f1.
- [ ] **Queenside** (`castleQueenside`): Play `1. d4 d5 2. Nc3 Nc6 3. Bf4 Bf5 4. Qd2 Qd7 5. O-O-O`. The white king finishes on c1 and the a1 rook on d1.
- [ ] **Through check forbidden** (`castleThroughAttack`): Play `1. e4 e5 2. Nh3 Bc5 3. g3 Nc6 4. Bg2 d6 5. f3 a6`. Click the white king on e1. There is no move dot on g1 because the black bishop attacks that square.

## En passant

- [ ] **Immediately available** (`enPassantNow`): Play `1. e4 a6 2. e5 d5`. Click the white pawn on e5. A capture marker appears on d6; play it and confirm the black pawn on d5 disappears.
- [ ] **Expires after one move** (`enPassantExpired`): Play `1. e4 a6 2. e5 d5 3. Nf3 a5`. Click the white pawn on e5. It can move to e6, but d6 is no longer offered.

## Promotion

For each choice below, begin a new game and play the listed line. On the last move, click b7 and then a8; choose the named piece in the promotion dialog.

- [ ] **Queen** (`promoteQueen`): `1. a4 h5 2. a5 h4 3. a6 h3 4. axb7 hxg2 5. bxa8=Q`. A white queen is on a8.
- [ ] **Rook** (`promoteRook`): `1. a4 h5 2. a5 h4 3. a6 h3 4. axb7 hxg2 5. bxa8=R`. A white rook is on a8.
- [ ] **Bishop** (`promoteBishop`): `1. a4 h5 2. a5 h4 3. a6 h3 4. axb7 hxg2 5. bxa8=B`. A white bishop is on a8.
- [ ] **Knight** (`promoteKnight`): `1. a4 h5 2. a5 h4 3. a6 h3 4. axb7 hxg2 5. bxa8=N`. A white knight is on a8.
- [ ] **Cancel** (`promotionCancel`): Play `1. a4 h5 2. a5 h4 3. a6 h3 4. axb7 hxg2`, then click b7 and a8. Select **Cancel**. The pawn remains on b7, it is still White's turn, and another move can be selected.

## Check and game endings

- [ ] **Check** (`check`): Play `1. e4 f6 2. Qh5+`. The e8 king has the check highlight, the status says **Black to move — check!**, and play remains enabled.
- [ ] **Checkmate** (`foolsMate`): Play `1. f3 e5 2. g4 Qh4#`. The e1 king has the check highlight, the status says **Checkmate — Black wins**, and no further board move is accepted.
- [ ] **Stalemate** (`stalemate`): Play `1. e3 a5 2. Qh5 Ra6 3. Qxa5 h5 4. Qxc7 Rah6 5. h4 f6 6. Qxd7+ Kf7 7. Qxb7 Qd3 8. Qxb8 Qh7 9. Qxc8 Kg6 10. Qe6`. The status says **Draw — stalemate** and no further board move is accepted.
- [ ] **Threefold repetition** (`threefold`): Play `1. Nf3 Nf6 2. Ng1 Ng8 3. Nf3 Nf6 4. Ng1 Ng8`. The status says **Draw — threefold repetition** and the game ends.
- [ ] **Insufficient material**: Covered by unit tests (T06).

## Controls and captured pieces

- [ ] **Undo** (`resetSetup`): Play `1. e4 e5`. Select **Undo** once: the black pawn returns to e7 and it is Black's turn. Select it again: the white pawn returns to e2 and the starting position is restored.
- [ ] **Undo after game over** (`foolsMate`): Recreate Fool's mate above, then select **Undo**. The black queen returns to d8, the game reopens with Black to move, and another legal move can be played.
- [ ] **New game** (`resetSetup`): Play `1. e4 e5`, then select **New game** and confirm. The starting position returns, the captured areas are empty, and it is White's turn.
- [ ] **Cancel new game** (`resetSetup`): Play `1. e4 e5`, select **New game**, then cancel. The two pawns remain on e4 and e5.
- [ ] **Flip**: Select **Flip board** twice. Black is at the near side after the first selection; White is back at the near side after the second. The position and turn do not change.
- [ ] **Captured pieces** (`captureExchange`): Play `1. e4 d5 2. exd5 Qxd5`. The captured displays show one black pawn captured by White and one white pawn captured by Black.

## Persistence and layout

- [ ] **Refresh** (`persistence`): Play `1. e4 c5 2. Nf3`, then reload the page. The pawns remain on e4 and c5, the knight remains on f3, and it is Black's turn.
- [ ] **Phone layout**: On a phone-sized viewport, confirm the whole board fits the screen width, the page has no horizontal scrolling, controls are easy to tap, and the captured displays and status remain readable.
- [ ] **Desktop layout**: Confirm the board, status, captured displays, controls, instructions, and credits are visible and do not overlap.
