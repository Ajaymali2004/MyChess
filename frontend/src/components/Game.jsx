import React, { useEffect, useState } from "react";
import ChessBoard from "./ChessBoard";
import Button from "./Button";
import useSocket from "../hooks/useSocket";
import { Chess } from "chess.js";
import GameOver from "./GameOver";
import useReload from "../hooks/useReload";

export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";

export default function Game() {
  // const nav = useNavigate();
  const socket = useSocket();
  const [chess, setChess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());
  const [started, setStarted] = useState(false);
  const [start, setStart] = useState(false);
  const [isP1, setIsP1] = useState(false);
  const [winner, setWinner] = useState(null);
  const [waiting, sendWaiting] = useState(false);
  useReload(start);
  useEffect(() => {
    if (!socket) return;
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case INIT_GAME:
          setBoard(chess.board());
          setStarted(true);
          setIsP1(message.payload.color === "white");
          setStart(true);

          break;
        case MOVE:
          console.log(message);
          const { move, promo } = message.payload;
          if (promo) {
            chess.move({ ...move, promotion: "q" });
          } else {
            chess.move(move);
          }
          setBoard(chess.board());
          console.log("Move made");
          break;
        case GAME_OVER:
          setWinner(message.payload.winner);
          setStart(false);
          break;
      }
    };
  }, [socket]);
  if (!socket) {
    return <div>Connecting...</div>;
  }
  return (
    <div className="justify-center flex">
      <div className="pt-8 max-w-screen-lg w-full">
        <div className="grid grid-cols-6 gap-5 w-full ">
          <div className="col-span-4  w-full flex justify-center">
            <ChessBoard
              board={board}
              setBoard={setBoard}
              chess={chess}
              socket={socket}
              isP1={isP1}
            />
          </div>
          <div className="col-span-2 bg-slate-900 w-full flex justify-center rounded border p-2">
            <div className="pt-8">
              {!started ? (
                !waiting ? (
                  <Button
                    onClick={() => {
                      sendWaiting(true);
                      socket.send(
                        JSON.stringify({
                          type: INIT_GAME,
                        })
                      );
                    }}
                  >
                    Play online
                  </Button>
                ) : (
                  <div className="text-white">Waiting for opponent...</div>
                )
              ) : !winner ? (
                <div className="mapping text-white flex flex-col items-center justify-evenly h-full">
                  <h1>Chess is the one of the best game ever created</h1>
                </div>
              ) : (
                <GameOver isP1={isP1} winner={winner} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
