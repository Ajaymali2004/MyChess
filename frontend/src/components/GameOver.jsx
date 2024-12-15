import React from "react";
import Winner from "./Winner";
import Loser from "./Loser";
import { useNavigate } from "react-router-dom";

export default function GameOver({winner, isP1}) {
  const nav = useNavigate();
  return (
    <><div className="text-white">
      <h1 className="text-center text-4xl font-bold mb-5">Game Over!</h1>
      {isP1 ? (
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

      <div className="mt-8 flex justify-center">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={()=>{
          window.location.reload();
        }}>
          Play Again
        </button>
        </div>
      </div>
    </>
  );
}
