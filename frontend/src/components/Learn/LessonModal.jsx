import React, { useEffect, useState } from "react";
import { Chess } from "chess.js";
import BlakeBoard from "../Game/ChessBoard";
import lessons from "./lessons";

export default function LessonModal({ lessonKey, closeModal, nextLesson }) {
  const [chessInstance, setChessInstance] = useState(new Chess());
  const [lessonBoard, setLessonBoard] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false); // Track retry status

  useEffect(() => {
    const { fen } = lessons[lessonKey];
    const chess = new Chess(fen);
    setChessInstance(chess);
    setLessonBoard(chess.board());
    setIsCompleted(false);
    setIsRetrying(false); // Reset retry state when a new lesson is loaded
  }, [lessonKey]);

  const handleMoveCompletion = (move) => {
    const correctMove = lessons[lessonKey].answer;
    if (move.from === correctMove.from && move.to === correctMove.to) {
      setIsCompleted(true);
      setIsRetrying(false); // Reset retry state if the move is correct
    } else {
      setIsRetrying(true); // Show retry button if the move is incorrect
    }
  };

  const handleRetry = () => {
    // Reset the board and give the user another chance to make the correct move
    const { fen } = lessons[lessonKey];
    const chess = new Chess(fen);
    setChessInstance(chess);
    setLessonBoard(chess.board());
    setIsRetrying(false); // Hide retry button
    setIsCompleted(false); // Reset completion state
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50">
      <div className="bg-slate-700 p-4 rounded-lg w-5/6 md:w-1/2 lg:w-1/3 shadow-lg">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold ">
            {lessonKey
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (str) => str.toUpperCase())}
          </h2>

          <button
            className="text-red-500 font-bold text-lg"
            onClick={closeModal}
          >
            ✕
          </button>
        </div>

        <p className="text-sm mb-3">{lessons[lessonKey].text}</p>

        {lessonBoard.length > 0 && (
          <div className="flex justify-center">
            <BlakeBoard
              board={lessonBoard}
              setBoard={(updatedBoard) => setLessonBoard(updatedBoard)}
              chess={chessInstance}
              socket={null}
              isP1={true}
              Me="Student"
              Opponent="Instructor"
              whiteTimer={null}
              blackTimer={null}
              setMoves={() => {}}
              handleMoveCompletion={handleMoveCompletion}
            />
          </div>
        )}

        {isCompleted && (
          <div className="flex justify-center mt-3">
            <button
              className="bg-green-500 text-white px-4 py-2 rounded text-sm"
              onClick={nextLesson}
            >
              Next Lesson
            </button>
          </div>
        )}

        {isRetrying && (
          <div className="flex justify-center mt-3">
            <button
              className="bg-yellow-500 text-white px-4 py-2 rounded text-sm"
              onClick={handleRetry}
            >
              Retry <span className="ml-2 text-xl">⟳</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
