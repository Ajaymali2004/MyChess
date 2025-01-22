import React, { useEffect, useMemo, useState } from "react";
import ChessBoard from "./ChessBoard";
import useSocket from "../../hooks/useSocket";
import { Chess } from "chess.js";
import GameOver from "./GameOver";
import useReload from "../../hooks/useReload";
import { useWindowSize } from "@uidotdev/usehooks";
import PlayButton from "./PlayButton";
import {
  ACCEPT_CHALLENGE,
  GAME_OVER,
  INIT_GAME,
  MOVE,
  PLAY_AGAIN_REQ,
  PLAY_AGAIN_RES,
  TIMER_UPDATE,
} from "../../../backendLinks";
import PlayAgainPromt from "./PlayAgainPromt";
import EndButtonsAndMoveTable from "./EndButtons";
import { useNavigate, useParams } from "react-router-dom";
export default function Game() {
  const socket = useSocket();
  const { tmpID } = useParams();
  const [chess, setChess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());
  const [startedOrEnded, setStartedOrEnded] = useState(false);
  const [start, setStart] = useState(false);
  const [isP1, setIsP1] = useState(false);
  const [winner, setWinner] = useState(null);
  const [gameOverReason, setGameOverReason] = useState(""); // New state for reason
  const [searchingForOpponent, setSearchingForOpponent] = useState(false);
  const size = useWindowSize();
  const [moves, setMoves] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const sizechecker = (val) => (val > 1.5 ? 1 : 0);
  const DeviceSmall = useMemo(
    () => sizechecker(size.height / size.width),
    [size]
  );
  const boardClass = DeviceSmall ? "col-span-6 mb-5" : "col-span-3";
  const [me, setMe] = useState("");
  const [opponent, setOpponent] = useState("");
  const [playAgainRequest, setPlayAgainRequest] = useState(false);
  const [waitingForOpponent, setWaitingForOpponent] = useState(false);
  const [notification, setNotification] = useState("");
  const [whiteTimer, setWhiteTimer] = useState(600);
  const [blackTimer, setBlackTimer] = useState(600);

  useReload(start);
  const nav = useNavigate();
  useEffect(() => {
    if (tmpID && socket) {
      socket.send(
        JSON.stringify({
          type: ACCEPT_CHALLENGE,
          payload: { tmpID },
        })
      );
      nav("/game", { replace: true });
    }
  }, [socket]);
  useEffect(() => {
    if (!socket) return;
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case INIT_GAME:
          chess.reset();
          setBoard(new Chess().board());
          setStartedOrEnded(true);
          setMe(message.payload.Me);
          setOpponent(message.payload.Opponent);
          setIsP1(message.payload.color === "white");
          setStart(true);
          setWhiteTimer(600);
          setBlackTimer(600);
          setMoves([]);
          setWaitingForOpponent(false);
          setWinner(null);
          setGameOverReason(""); // Reset reason on new game
          break;
        case MOVE:
          const { move, promo } = message.payload;
          let moveResult;
          if (promo) {
            moveResult = chess.move({ ...move, promotion: "q" });
          } else {
            moveResult = chess.move(move);
          }
          setBoard(chess.board());
          if (moveResult.san)
            setMoves((prevMoves) => [...prevMoves, moveResult.san]);
          break;
        case GAME_OVER:
          if (winner !== null) {
            console.log("GAME is already over");
            break;
          }
          setWinner(message.payload.winner);
          setGameOverReason(message.payload.reason); // Set reason for game over
          setIsModalOpen(true);
          setStart(false);
          break;
        case PLAY_AGAIN_REQ:
          setPlayAgainRequest(true);
          break;
        case PLAY_AGAIN_RES:
          setWaitingForOpponent(false);
          setNotification("Opponent rejected the request to play again.");
          setTimeout(() => setNotification(""), 5000);
          break;
        case TIMER_UPDATE:
          setBlackTimer(message.payload.blackTimer);
          setWhiteTimer(message.payload.whiteTimer);
      }
    };
  }, [socket]);

  const init = () => {
    setSearchingForOpponent(true);
    socket.send(
      JSON.stringify({
        type: INIT_GAME,
      })
    );
  };

  const handlePlayAgainRequest = () => {
    socket.send(
      JSON.stringify({
        type: PLAY_AGAIN_REQ,
      })
    );
    setWaitingForOpponent(true);
    setIsModalOpen(false);
  };

  const handlePlayAgainResponse = (accepted) => {
    socket.send(
      JSON.stringify({
        type: PLAY_AGAIN_RES,
        payload: { accepted },
      })
    );
    setPlayAgainRequest(false);
    setWaitingForOpponent(false);
    setIsModalOpen(false);
  };

  if (!socket) {
    return <div>Connecting...</div>;
  }
  return (
    <div className="justify-center flex">
      <div className="pt-2 max-w-screen-lg w-full">
        {notification && (
          <div className="notification bg-red-500 text-center text-white p-2 rounded mb-4">
            {notification}
          </div>
        )}
        {playAgainRequest && (
          <PlayAgainPromt
            onAccept={() => handlePlayAgainResponse(true)}
            onReject={() => handlePlayAgainResponse(false)}
          />
        )}
        {waitingForOpponent && (
          <div className="bg-gray-700 p-2  flex rounded shadow-lg text-white mb-2">
            <p className="w-full h-full sm:text-sm md:text-lg lg:text-xl  items-center justify-center px-3">
              <span className="text-green-400">Request Sent !</span>
              &ensp; Waiting for opponent’s response...
            </p>
          </div>
        )}
        <div className="grid grid-cols-6 gap-5 w-full ">
          <div className={`${boardClass} m-2`}>
            <ChessBoard
              board={board}
              setBoard={setBoard}
              chess={chess}
              socket={socket}
              isP1={isP1}
              Me={me}
              Opponent={opponent}
              whiteTimer={whiteTimer}
              blackTimer={blackTimer}
              setMoves={setMoves}
            />
          </div>
          <div className={`${boardClass} flex-row justify-center `}>
            <div className="pt-4 px-2 flex justify-center items-center">
              {!startedOrEnded ? (
                <PlayButton
                  waiting={searchingForOpponent}
                  init={init}
                  socket={socket}
                />
              ) : (
                <>
                  <GameOver
                    isP1={isP1}
                    winner={winner}
                    reason={gameOverReason} // Pass reason to GameOver component
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                    onPlayAgain={handlePlayAgainRequest}
                  />
                  <EndButtonsAndMoveTable
                    winner={winner}
                    moves={moves}
                    onPlayAgain={handlePlayAgainRequest}
                    onNewGame={() => window.location.reload()}
                    waitingForOpponent={waitingForOpponent}
                    DeviceSmall={DeviceSmall}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
