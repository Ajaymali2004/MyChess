import React from "react";
import { FaCheck, FaTimes } from "react-icons/fa"; // Importing check and cross icons

export default function PlayAgainPrompt({ onAccept, onReject }) {
  return (
    <div className="play-again-prompt bg-gray-700 p-2  flex rounded shadow-lg text-white mb-2">
      <div className="w-full h-full sm:text-sm md:text-lg lg:text-xl  items-center justify-center px-3">
        <p>Opponent wants to play again. Accept?</p>
      </div>
      <div className=" flex justify-end space-x-6 w-full ">
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold w-12 h-12 rounded-md border-slate-950 border-2 border-spacing-6 flex items-center justify-center"
          onClick={onAccept}
        >
          <FaCheck size={20} />{" "}
        </button>
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold w-12 h-12 rounded-md flex items-center justify-center border-slate-950 border-2"
          onClick={onReject}
        >
          <FaTimes size={20} />
        </button>
      </div>
    </div>
  );
}
