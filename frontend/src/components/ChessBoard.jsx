import React, { useState, useMemo } from "react";
import { MOVE } from "./Game";
import { useWindowSize } from "@uidotdev/usehooks";

export default function BlakeBoard({ board, setBoard, chess, socket, isP1 }) {
  const [from, setFrom] = useState(null);
  const size = useWindowSize();

  const sizechecker = (val) => (val > 1.5 ? 1 : 2);

  const boxS = useMemo(() => sizechecker(size.height / size.width), [size]);
  const boxSizeClasses = boxS === 1 ? "w-8 h-8" : "w-16 h-16";
  const imageSizeClasses = boxS === 1 ? "w-4 h-4" : "w-8 h-8";
  const handleSquareClick = (to) => {
  if (isP1 && chess.turn() === "b") return; // White cannot play on Black's turn
  if (!isP1 && chess.turn() === "w") return;

  if (!from) {
    setFrom(to);
  } else {
    if (socket) {
      const move = { from, to };
      let promo = false;

      // Check if this is a pawn promotion
      if (
        (move.from[1] === "7" && move.to[1] === "8") || // White pawn promotion
        (move.from[1] === "2" && move.to[1] === "1")    // Black pawn promotion
      ) {
        const promotion = chess.get(move.from);
        if (promotion?.type === "p") {
          promo = true; // Indicate this is a promotion move
        }
      }

      // Update the board on client-side
      const result = promo
        ? chess.move({ ...move, promotion: "q" }) // Include promotion
        : chess.move(move);

      if (result) {
        setBoard(chess.board());
        socket.send(
          JSON.stringify({
            type: MOVE,
            payload: { move, promo },
          })
        );
      } else {
        console.error("Invalid move attempt");
      }
    } else {
      console.log("Socket not connected");
    }

    setFrom(null);
  }
};

  // Flip board for Black's perspective if isP1 is false
  const displayBoard = isP1 ? board : [...board].reverse();

  return (
    <div className="grid grid-cols-8">
      {displayBoard.map((row, i) =>
        row.map((square, j) => {
          const actualRow = isP1 ? i : 7 - i; // Adjust for square representation
          const squareRepresentation =
            String.fromCharCode(97 + (j % 8)) + (8 - actualRow);
          const squareColor = isP1 ? (i + j) % 2 : (7 - i + j) % 2;
          return (
            <div
              key={`${i}-${j}`}
              onClick={() => handleSquareClick(squareRepresentation)}
              className={`${boxSizeClasses} flex items-center justify-center ${
                squareColor === 1 ? "bg-purple-500" : "bg-white"
              }`}
            >
              {square && (
                <img
                  src={`/${
                    square.color === "b" ? square.type : `${square.type} w`
                  }.png`}
                  className={imageSizeClasses}
                  alt={square.type}
                />
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
