import React, { useEffect, useState } from "react";
import { MOVE } from "../../../backendLinks";
const moveSound = new Audio("/audio/move-self.mp3");
const captureSound = new Audio("/audio/capture.mp3");
const castleSound = new Audio("/audio/castle.mp3");
const promoteSound = new Audio("/audio/promote.mp3");
const checkmateSound = new Audio("/audio/checkmate.mp3");

export default function BlakeBoard({
  board,
  setBoard,
  chess,
  socket,
  isP1,
  Me,
  Opponent,
  whiteTimer,
  blackTimer,
  setMoves,
}) {
  const [from, setFrom] = useState(null);
  const [availableSq, setAvailableSq] = useState([]);
  const [isInCheck, setIsInCheck] = useState(null);
  const setFromf = (square) => {
    setFrom(square);
    const moves = chess.moves({ square: square, verbose: true });
    setAvailableSq(moves.map((move) => move.to));
  };

  const handleSquareClick = (to) => {
    if (isP1 && chess.turn() === "b") return;
    if (!isP1 && chess.turn() === "w") return;

    if (!from) {
      setFromf(to);
    } else {
      const move = { from, to };
      if (!availableSq.includes(to)) {
        setFromf(to);
        return;
      }
      setFrom(null);
      setAvailableSq([]);

      if (socket) {
        let promo = false;
        if (
          (move.from[1] === "7" && move.to[1] === "8") ||
          (move.from[1] === "2" && move.to[1] === "1")
        ) {
          const promotion = chess.get(move.from);
          if (promotion?.type === "p") {
            promo = true;
          }
        }

        const result = promo
          ? chess.move({ ...move, promotion: "q" })
          : chess.move(move);

        if (result) {
          setBoard(chess.board());
          setMoves((prevMoves) => [...prevMoves, result.san]);
          socket.send(
            JSON.stringify({
              type: MOVE,
              payload: { move, promo },
            })
          );
        } else console.error("Invalid move attempt");
      } else console.log("Socket not connected");
    }
  };
  useEffect(() => {
    if (!board) return;
  
    // Check for checkmate
    if (chess.in_checkmate()) {
      checkmateSound.play();
      setIsInCheck(chess.turn());
      return;
    }
  
    // Check if the king is in check
    if (chess.in_check()) {
      setIsInCheck(chess.turn());
    } else {
      setIsInCheck(null);
    }
  
    // Get the last move
    const history = chess.history({ verbose: true });
    const result = history.length > 0 ? history[history.length - 1] : null;
  
    if (result) {
      if (result.flags.includes("c")) {
        captureSound.play(); // Capture move
      } else if (result.san && result.san.includes("O-O")) {
        castleSound.play(); // Castling move
      } else if (result.promotion) {
        promoteSound.play(); // Promotion move
      } else {
        moveSound.play(); // Normal move
      }
    }
  }, [board]);
  
  
  
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const displayBoard = isP1
    ? board
    : board
        .map((row) => row.slice())
        .reverse()
        .map((row) => row.reverse());

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-slate-800 border-black border-1 rounded-lg shadow-lg">
      {Opponent && (
        <div className="player-info flex items-center justify-between w-full mb-2  text-white">
          <div className="flex items-center">
            <img
              src={`/pieces/n${isP1 ? "" : "w"}.png`}
              alt="Opponent"
              className="w-12 h-12 rounded-lg bg-gray-300 border-2 border-gray-600"
            />
            <span className="ml-2 text-lg font-semibold">{Opponent}</span>
          </div>
          <span className="text-xl font-bold">
            {formatTime(isP1 ? blackTimer : whiteTimer)}
          </span>
        </div>
      )}

      <div
        className="grid grid-cols-8 gap-0 rounded-md overflow-hidden"
        style={{ aspectRatio: "1 / 1" }}
      >
        {displayBoard.map((row, i) =>
          row.map((square, j) => {
            const actualRow = isP1 ? i : 7 - i;
            const actualcol = isP1 ? j : 7 - j;
            const squareRepresentation =
              String.fromCharCode(97 + (actualcol % 8)) + (8 - actualRow);
            const squareColor =
              (i + j) % 2
                ? "bg-purple-700 hover:bg-purple-500"
                : "bg-gray-200 hover:bg-gray-300";
            const isHighlighted = availableSq.includes(squareRepresentation);
            const isKingInCheck =
              isInCheck && square?.type === "k" && square?.color === isInCheck;
            return (
              <div
                key={`${i}-${j}`}
                onClick={() => handleSquareClick(squareRepresentation)}
                className={`relative aspect-square flex items-center justify-center ${squareColor} ${
                  isKingInCheck ? "bg-red-500" : ""
                }`}
              >
                {isHighlighted && (
                  <div className="absolute w-2/5 h-2/5 bg-yellow-500 opacity-40 rounded-full animate-pulse"></div>
                )}
                {square && (
                  <img
                    src={`/pieces/${
                      square.color === "b" ? square.type : `${square.type}w`
                    }.png`}
                    alt={square.type}
                    className="w-3/4 h-3/4 object-contain hover:scale-110 transition-transform"
                  />
                )}
              </div>
            );
          })
        )}
      </div>

      {Me && (
        <div className="player-info flex items-center justify-between w-full mt-2 text-white">
          <span className="text-xl font-bold">
            {formatTime(isP1 ? whiteTimer : blackTimer)}
          </span>
          <div className="flex items-center">
            <span className="mr-2 text-lg font-semibold">{Me}</span>
            <img
              src={`/pieces/n${isP1 ? "w" : ""}.png`}
              alt="Me"
              className="w-12 h-12 rounded-lg bg-gray-300 border-2 border-gray-600"
            />
          </div>
        </div>
      )}
    </div>
  );
}
