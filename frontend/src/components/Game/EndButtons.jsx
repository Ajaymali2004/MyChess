import React from "react";
import MoveTable from "./MoveTable";

export default function EndButtonsAndMoveTable({
  winner,
  moves,
  onPlayAgain,
  onNewGame,
  waitingForOpponent,
  DeviceSmall,
}) {
  return (
    <div className="mapping w-full  text-white flex flex-col items-center justify-evenly h-full">
      <h1 className="text-center text-lg sm:text-xl md:text-2xl lg:text-3xl text-white font-bold">
        Chess is one of the best games ever created
      </h1>
      <div className="w-full overflow-x-auto px-4 py-2">
        <MoveTable moves={moves} DeviceSmall={DeviceSmall} />
      </div>

      {winner && (
        <>
          <div className="flex space-x-4 mt-6">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={onNewGame}
            >
              New Game!
            </button>

            <button
              className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
              onClick={onPlayAgain}
              disabled={waitingForOpponent}
            >
              Play Again!
            </button>
          </div>
        </>
      )}
    </div>
  );
}
