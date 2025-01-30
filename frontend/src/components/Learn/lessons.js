const lessons = {
  pawnMovement: {
    fen: "8/8/8/8/8/8/4P3/8 w - - 0 1",
    answer: { from: "e2", to: "e4" },
    text: "Pawns can move one step forward, but two steps from their starting position. Move this pawn two steps ahead.",
  },
  queenMovement: {
    fen: "8/8/8/3Q4/8/8/8/8 w - - 0 1",
    answer: { from: "d5", to: "h5" }, 
    text: "The queen is the most powerful piece, able to move in any direction. Position it aggressively on the last column.",
  },
  rookMovement: {
    fen: "8/8/8/3R4/8/8/8/8 w - - 0 1",
    answer: { from: "d5", to: "d8" },
    text: "Rooks dominate open files by moving straight. Move this rook to control the 8th rank.",
  },

  bishopMovement: {
    fen: "8/8/8/8/8/8/3B4/8 w - - 0 1",
    answer: { from: "d2", to: "h6" },
    text: "Bishops move diagonally. Find an active diagonal to influence the board.",
  },

  knightMovement: {
    fen: "8/8/8/3N4/8/8/8/8 w - - 0 1",
    answer: { from: "d5", to: "f6" },
    text: "Knights move in an 'L' shape. Jump to a square that pressures the opponent’s pieces.",
  },

  kingMovement: {
    fen: "8/8/8/3K4/8/8/8/8 w - - 0 1",
    answer: { from: "d5", to: "d6" },
    text: "The king moves one step in any direction. Take a step forward to improve its position.",
  },
  castlingKingside: {
    fen: "8/8/8/8/8/8/8/R3K2R w K - 0 1", 
    answer: { from: "e1", to: "g1" }, 
    text: "Castling helps protect your king and activates your rook. Try castling kingside.",
  },
  castlingQueenside: {
    fen: "8/8/8/8/8/8/8/R3K2R w Q - 0 1",
    answer: { from: "e1", to: "c1" }, 
    text: "Queenside castling helps develop your position. Can you do it?",
  },
  
  pawnPromotion: {
    fen: "8/4P3/8/8/8/8/8/8 w - - 0 1",
    answer: { from: "e7", to: "e8" },
    text: "When a pawn reaches the last rank, it can be promoted. Promote your pawn to a queen!",
  },

  enPassant: {
    fen: "8/8/8/3Pp3/8/8/8/8 w - e6 0 1",
    answer: { from: "d5", to: "e6" },
    text: "En passant is a special pawn capture. Capture the black pawn on e5 by moving your pawn diagonally.",
  },
};

export default lessons;
