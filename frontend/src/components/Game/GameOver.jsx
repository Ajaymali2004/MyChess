import React from "react";
import Loser from "./Loser";
import Draw from "./Draw";
import Winner from "./Winner";

export default function GameOver({
  winner,
  isP1,
  setIsModalOpen,
  isModalOpen,
  reason,
  onPlayAgain,
}) {
  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-slate-800 p-8 rounded-lg w-96 relative shadow-lg">
        <button
          onClick={closeModal}
          className="absolute mx-2 top-2 left-2 text-gray-400 font-bold text-xl hover:text-gray-200"
        >
          X
        </button>

        <h1 className="text-white text-center text-4xl font-bold mb-4">
          Game Over!
        </h1>

        <div className="text-white text-center mb-4">
          {/* Determine what to display: Winner, Loser, or Draw */}
          {reason === "Draw" ? (
            <Draw />
          ) : isP1 ? (
            winner === "w" ? (
              <Winner />
            ) : (
              <Loser />
            )
          ) : winner === "b" ? (
            <Winner />
          ) : (
            <Loser />
          )}
        </div>

        {/* Display the reason */}
        {reason && (
          <p className="text-gray-300 text-md text-center mb-6">
            <strong>{reason}</strong>
          </p>
        )}

        <div className="mt-6 flex justify-center gap-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={onPlayAgain}
          >
            Play Again
          </button>
          <button
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            onClick={closeModal}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
