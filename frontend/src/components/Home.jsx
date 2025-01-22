import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center h-full">
      <div className="pt-8 max-w-screen-lg px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 items-center">
          <div className="flex justify-center">
            <img
              src="/chessboard.jpg"
              alt="Chessboard"
              className="w-full max-w-md rounded-xl shadow-lg"
            />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold text-white mb-6">
              Welcome to Rock_Bishop!
            </h1>
            <p className="text-lg text-gray-300 mb-8">
              Ready to dive into the world of chess? Challenge yourself or a friend, and enjoy the game!
            </p>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all"
              onClick={() => navigate('./game')}
            >
              Play Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
