import React, { useState } from "react";
import { MOVE } from "./Game";
import { useWindowSize } from "@uidotdev/usehooks";
import { useMemo } from "react";

export default function BlakeBoard({ board, setBoard, chess, socket, isP1 }) {  
  const Abox=(square,i,j)=>{
    const squareRepresemtation =
            String.fromCharCode(97 + (j % 8)) + "" + (8 - i);
          return (
            <div
              key={`${i}-${j}`}
              onClick={() => {
                if (isP1 && chess.turn() === "b") return;
                if (chess.turn() === "w" && !isP1) return;
                if (!from) {
                  setFrom(squareRepresemtation);
                } else {
                  if (socket) {
                    socket.send(
                      JSON.stringify({
                        type: MOVE,
                        payload: {
                          move: {
                            from,
                            to: squareRepresemtation, // Send clicked square as 'to'
                          },
                        },
                      })
                    );
                    setFrom(null);
                    chess.move({
                      from: from,
                      to: squareRepresemtation,
                    });
                    setBoard(chess.board());
                  } else {
                    console.log("Socket not connected");
                  }
                }
              }}
              className={`${boxSizeClasses} flex items-center justify-center ${
                (i + j) % 2 === 1 ? "bg-purple-500" : "bg-white"
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
  }
  const [from, setFrom] = useState(null);
  const size = useWindowSize();

  const sizechecker=(val)=>{
    if(val >1.5)return 1;
    return 2;
  }
  const boxS = useMemo(() => sizechecker(size.height / size.width), [size]);
  const boxSizeClasses = boxS === 1 ? "w-8 h-8" : "w-16 h-16";
  const imageSizeClasses = boxS === 1 ? "w-4 h-4" : "w-8 h-8";
  return (
    <div className="grid grid-cols-8 text-white-200 ">
      
      {
        Array.from({ length: 64 }, (_, index) => {
          const i = Math.floor(index / 8); // Calculate row
          const j = index % 8; // Calculate column
          return <Abox  i={i} j={j} square={board} />;
        })
      }
    </div>
  );
}

