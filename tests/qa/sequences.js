// Browser-QA move lines live here first, so tests prove that every line is legal
// and reaches the position described in docs/QA.md.

const PROMOTION_SETUP = [
  'a2a4', 'h7h5', 'a4a5', 'h5h4', 'a5a6', 'h4h3', 'a6b7', 'h3g2',
];

const PROMOTION_SAN = [
  'a4', 'h5', 'a5', 'h4', 'a6', 'h3', 'axb7', 'hxg2',
];

export const sequences = [
  {
    name: 'knightStart',
    moves: [],
    san: [],
    expect: {
      status: { turn: 'w' },
      targets: {
        b1: [
          { to: 'a3', isCapture: false, isPromotion: false },
          { to: 'c3', isCapture: false, isPromotion: false },
        ],
      },
    },
  },
  {
    name: 'pinnedKnight',
    moves: ['e2e4', 'd7d5', 'f1b5', 'b8c6', 'a2a3'],
    san: ['e4', 'd5', 'Bb5+', 'Nc6', 'a3'],
    expect: { status: { turn: 'b' }, targets: { c6: [] } },
  },
  {
    name: 'castleKingside',
    moves: ['g1f3', 'g8f6', 'g2g3', 'g7g6', 'f1g2', 'f8g7', 'e1g1'],
    san: ['Nf3', 'Nf6', 'g3', 'g6', 'Bg2', 'Bg7', 'O-O'],
    expect: { pieces: { e1: null, f1: 'wr', g1: 'wk', h1: null } },
  },
  {
    name: 'castleQueenside',
    moves: [
      'd2d4', 'd7d5', 'b1c3', 'b8c6', 'c1f4',
      'c8f5', 'd1d2', 'd8d7', 'e1c1',
    ],
    san: ['d4', 'd5', 'Nc3', 'Nc6', 'Bf4', 'Bf5', 'Qd2', 'Qd7', 'O-O-O'],
    expect: { pieces: { a1: null, c1: 'wk', d1: 'wr', e1: null } },
  },
  {
    name: 'castleThroughAttack',
    moves: [
      'e2e4', 'e7e5', 'g1h3', 'f8c5', 'g2g3',
      'b8c6', 'f1g2', 'd7d6', 'f2f3', 'a7a6',
    ],
    san: ['e4', 'e5', 'Nh3', 'Bc5', 'g3', 'Nc6', 'Bg2', 'd6', 'f3', 'a6'],
    expect: {
      targets: {
        e1: [
          { to: 'e2', isCapture: false, isPromotion: false },
          { to: 'f1', isCapture: false, isPromotion: false },
        ],
      },
    },
  },
  {
    name: 'enPassantNow',
    moves: ['e2e4', 'a7a6', 'e4e5', 'd7d5'],
    san: ['e4', 'a6', 'e5', 'd5'],
    expect: {
      targets: {
        e5: [
          { to: 'd6', isCapture: true, isPromotion: false },
          { to: 'e6', isCapture: false, isPromotion: false },
        ],
      },
    },
  },
  {
    name: 'enPassantExpired',
    moves: ['e2e4', 'a7a6', 'e4e5', 'd7d5', 'g1f3', 'a6a5'],
    san: ['e4', 'a6', 'e5', 'd5', 'Nf3', 'a5'],
    expect: {
      targets: {
        e5: [{ to: 'e6', isCapture: false, isPromotion: false }],
      },
    },
  },
  ...[
    ['promoteQueen', 'q', 'Q'],
    ['promoteRook', 'r', 'R'],
    ['promoteBishop', 'b', 'B'],
    ['promoteKnight', 'n', 'N'],
  ].map(([name, type, sanPiece]) => ({
    name,
    moves: [...PROMOTION_SETUP, `b7a8${type}`],
    san: [...PROMOTION_SAN, `bxa8=${sanPiece}`],
    expect: { pieces: { a8: `w${type}`, b7: null } },
  })),
  {
    name: 'promotionCancel',
    moves: PROMOTION_SETUP,
    san: PROMOTION_SAN,
    expect: {
      status: { turn: 'w' },
      pieces: { a8: 'br', b7: 'wp' },
      targets: {
        b7: [
          { to: 'a8', isCapture: true, isPromotion: true },
          { to: 'c8', isCapture: true, isPromotion: true },
        ],
      },
    },
  },
  {
    name: 'check',
    moves: ['e2e4', 'f7f6', 'd1h5'],
    san: ['e4', 'f6', 'Qh5+'],
    expect: {
      status: {
        turn: 'b', inCheck: true, checkSquare: 'e8',
        isOver: false, winner: null, reason: null,
      },
    },
  },
  {
    name: 'foolsMate',
    moves: ['f2f3', 'e7e5', 'g2g4', 'd8h4'],
    san: ['f3', 'e5', 'g4', 'Qh4#'],
    expect: {
      status: {
        turn: 'w', inCheck: true, checkSquare: 'e1',
        isOver: true, winner: 'b', reason: 'checkmate',
      },
    },
  },
  {
    name: 'stalemate',
    moves: [
      'e2e3', 'a7a5', 'd1h5', 'a8a6', 'h5a5', 'h7h5', 'a5c7',
      'a6h6', 'h2h4', 'f7f6', 'c7d7', 'e8f7', 'd7b7', 'd8d3',
      'b7b8', 'd3h7', 'b8c8', 'f7g6', 'c8e6',
    ],
    san: [
      'e3', 'a5', 'Qh5', 'Ra6', 'Qxa5', 'h5', 'Qxc7', 'Rah6', 'h4',
      'f6', 'Qxd7+', 'Kf7', 'Qxb7', 'Qd3', 'Qxb8', 'Qh7', 'Qxc8', 'Kg6', 'Qe6',
    ],
    expect: {
      status: {
        turn: 'b', inCheck: false, checkSquare: null,
        isOver: true, winner: null, reason: 'stalemate',
      },
    },
  },
  {
    name: 'threefold',
    moves: ['g1f3', 'g8f6', 'f3g1', 'f6g8', 'g1f3', 'g8f6', 'f3g1', 'f6g8'],
    san: ['Nf3', 'Nf6', 'Ng1', 'Ng8', 'Nf3', 'Nf6', 'Ng1', 'Ng8'],
    expect: { status: { isOver: true, winner: null, reason: 'threefold-repetition' } },
  },
  {
    name: 'resetSetup',
    moves: ['e2e4', 'e7e5'],
    san: ['e4', 'e5'],
    expect: { status: { turn: 'w' }, pieces: { e4: 'wp', e5: 'bp' } },
  },
  {
    name: 'captureExchange',
    moves: ['e2e4', 'd7d5', 'e4d5', 'd8d5'],
    san: ['e4', 'd5', 'exd5', 'Qxd5'],
    expect: { captures: ['w:p', 'b:p'] },
  },
  {
    name: 'persistence',
    moves: ['e2e4', 'c7c5', 'g1f3'],
    san: ['e4', 'c5', 'Nf3'],
    expect: { status: { turn: 'b' }, pieces: { e4: 'wp', c5: 'bp', f3: 'wn' } },
  },
];
