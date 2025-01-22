import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  CANCEL_CHALLENGE,
  CREAT_CHALLENGE
} from "../../../backendLinks";

export default function Challenge({ waiting, init, socket }) {
  const [tmpID, setTmpID] = useState(null);
  const [waitingForFriend, setWaitingForFriend] = useState(false);

  const generateLink = () => {
    const id = uuidv4();
    setTmpID(id);
    setWaitingForFriend(true);

    socket.send(
      JSON.stringify({
        type: CREAT_CHALLENGE,
        payload: { tmpID: id },
      })
    );
  };

  const cancelLink = () => {
    socket.send(
      JSON.stringify({
        type: CANCEL_CHALLENGE,
        payload: { tmpID },
      })
    );
    setWaitingForFriend(false);
    setTmpID(null);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {!waiting ? (
        <>
          <button
            className="relative bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-blue-500 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
            onClick={init}
          >
            <span className="absolute inset-0 opacity-20 bg-white rounded-lg blur-xl"></span>
            <span className="relative">🎮 Play Online</span>
          </button>

          {!tmpID ? (
            <button
              className="relative bg-gradient-to-r from-green-500 to-teal-600 hover:from-teal-600 hover:to-green-500 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300"
              onClick={generateLink}
            >
              <span className="absolute inset-0 opacity-20 bg-white rounded-lg blur-xl"></span>
              <span className="relative">🔗 Generate Game Link</span>
            </button>
          ) : (
            <div className="text-center mt-4">
              <p className="text-lg font-medium text-gray-200 mb-2">
                Share this link with your friend:
              </p>
              <a
                href={`${window.location.origin}/game/${tmpID}`}
                className="text-blue-400 underline break-all"
              >
                {window.location.origin}/game/{tmpID}
              </a>
              <div className="mt-3">
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-red-300"
                  onClick={cancelLink}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-lg font-semibold text-gray-300 animate-pulse">
          Waiting for opponent...
        </div>
      )}
    </div>
  );
}
