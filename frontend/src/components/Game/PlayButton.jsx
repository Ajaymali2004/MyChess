import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { CANCEL_CHALLENGE, CREAT_CHALLENGE } from "../../../backendLinks";

export default function PlayButton({ waiting, init, socket }) {
  const [tmpID, setTmpID] = useState(null);
  const [waitingForFriend, setWaitingForFriend] = useState(false);
  const [copyAlert, setCopyAlert] = useState(false); // State to control alert visibility

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

  const copyToClipboard = () => {
    const link = `${window.location.origin}/play/${tmpID}`;
    navigator.clipboard.writeText(link).then(
      () => {
        // Show the alert
        setCopyAlert(true);
        // Hide the alert after 3 seconds
        setTimeout(() => {
          setCopyAlert(false);
        }, 3000);
      },
      (err) => {
        console.error("Error copying link to clipboard: ", err);
      }
    );
  };
  const handlePlayOnline = ()=>{
    if(tmpID){
      cancelLink();
    }
    init();
  }
  return (
    <div className="flex flex-col items-center space-y-4">
      {!waiting ? (
        <>
          <button
            className="relative bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-blue-500 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
            onClick={handlePlayOnline}
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
              <div
                className="flex items-center justify-center bg-gray-800 cursor-pointer p-4 rounded-lg group"
                onClick={copyToClipboard}
              >
                <p className="text-blue-400 underline break-all mr-4 relative">
                  {window.location.origin}/play/{tmpID}
                  <span className="absolute bottom-full right-0 transform -translate-x-1/2 text-xs text-white bg-black p-1 rounded hidden group-hover:block transition-all duration-2000 ease-in-out">
                    Copy the link
                  </span>
                </p>
              </div>

              {/* Conditional Alert */}
              {copyAlert && (
                <div className="mt-2 p-2 text-white bg-green-500 rounded-lg">
                  Link copied to clipboard!
                </div>
              )}
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
