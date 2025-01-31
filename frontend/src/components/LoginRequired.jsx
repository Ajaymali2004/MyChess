import React from "react";
import { useNavigate } from "react-router-dom";

const LoginRequired = ({setModalShow}) => {
  const handleLoginRedirect = () => {
    setModalShow(1);
  };
  
  const handleSignUpRedirect = () => {
    setModalShow(2);
  };

  return (
    <div className="flex items-center justify-center h-full ">
      <div className="text-center  bg-slate-800 p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-white mb-4">Login Required</h1>
        <p className="text-white mb-6">
          For this service, you need to login or sign up first.
        </p>
        <div className="flex justify-between">
          <button
            onClick={handleLoginRedirect}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Login
          </button>
          <button
            onClick={handleSignUpRedirect}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginRequired;
