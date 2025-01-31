import React, { useState } from "react";
import MoveTable from "./MoveTable";
import { RESIGN } from "../../../messages";

export default function EndButtonsAndMoveTable({
  winner,
  moves,
  onPlayAgain,
  onNewGame,
  waitingForOpponent,
  DeviceSmall,
  socket
}) {
  const [showResignModal, setShowResignModal] = useState(false); // State for showing the resignation confirmation modal
  
  const onResign = () => {
    if (socket) {
      socket.send(
        JSON.stringify({
          type: RESIGN,
        })
      );
    }
    setShowResignModal(false); // Close modal after resignation is sent
  };

  const openResignModal = () => setShowResignModal(true); // Function to open resignation confirmation modal
  const closeResignModal = () => setShowResignModal(false); // Function to close modal

  return (
    <div className="mapping w-full text-white flex flex-col items-center justify-evenly h-full">
      <h1 className="text-center text-lg sm:text-xl md:text-2xl lg:text-3xl text-white font-bold">
        Chess is one of the best games ever created
      </h1>
      <div className="w-full overflow-x-auto px-4 py-2">
        <MoveTable moves={moves} DeviceSmall={DeviceSmall} />
      </div>

      {winner ? (
        <div className="flex space-x-4 mt-6">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
            onClick={onNewGame}
          >
            New Game!
          </button>

          <button
            className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
            onClick={onPlayAgain}
            disabled={waitingForOpponent}
          >
            Play Again!
          </button>
        </div>
      ) : (
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out mt-6"
          onClick={openResignModal} // Trigger modal on click
        >
          Resign
        </button>
      )}

      {/* Resignation Confirmation Modal */}
      {showResignModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-slate-800 p-6 rounded-lg text-white shadow-lg w-80 text-center">
            <h2 className="text-lg font-semibold  mb-4">Are you sure you want to resign?</h2>
            <div className="flex justify-evenly">
              <button
                className="bg-gray-500 hover:bg-gray-700  font-bold py-2 px-4 rounded"
                onClick={closeResignModal} // Close modal
              >
                Cancel
              </button>
              <button
                className="bg-red-500 hover:bg-red-700  font-bold py-2 px-4 rounded"
                onClick={onResign} 
              >
                Yes, Resign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
