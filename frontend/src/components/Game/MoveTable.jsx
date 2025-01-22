import React from "react";

const MoveTableSmall = ({ moves }) => {
  return (
    <div className="w-full overflow-hidden">
      <div className="flex space-x-4 px-4 py-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-500">
        <div className="flex space-x-4 w-max">
          {moves.map((move, index) => (
            <div
              key={index}
              className={`text-white text-center px-3 py-1 rounded ${
                index % 2 === 0 ? "bg-slate-700" : "bg-slate-800"
              }`}
            >
              {move}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const MoveTableBigg = ({ moves }) => {
  const whiteMoves = moves.filter((_, index) => index % 2 === 0);
  const blackMoves = moves.filter((_, index) => index % 2 !== 0);

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 gap-x-4 overflow-y-auto h-96 px-4">
        <div className="flex flex-col space-y-2">
          {whiteMoves.map((move, index) => (
            <div
              key={index}
              className="text-white text-center  py-1 bg-slate-700 rounded"
            >
              {move}
            </div>
          ))}
        </div>
        <div className="flex flex-col space-y-2">
          {blackMoves.map((move, index) => (
            <div
              key={index}
              className="text-white text-center py-1 bg-slate-800  rounded"
            >
              {move}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const MoveTable = ({ moves, DeviceSmall }) => {
  return (
    <>
      {DeviceSmall ? (
        <MoveTableSmall moves={moves} />
      ) : (
        <MoveTableBigg moves={moves} />
      )}
    </>
  );
};
export default MoveTable;
