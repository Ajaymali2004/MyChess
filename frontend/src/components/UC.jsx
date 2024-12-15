import React from "react";

export default function UC() {
  return (
    <div className="flex items-center justify-center h-full  text-white">
      <div className="flex flex-col items-center text-center p-8 border border-gray-700 rounded-lg bg-gray-800 shadow-lg">
        <h1 className="text-4xl font-bold mb-4">Work in Progress</h1>
        <p className="text-lg mb-6">
          We're working hard to bring you an amazing experience. Stay tuned!
        </p>
        <div className="w-12 h-12 border-4 border-t-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );
}
