import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { FaChessKing, FaEye, FaEyeSlash } from "react-icons/fa";
import { MdAlternateEmail } from "react-icons/md";

const Login = ({ data, setData, otpSent, setOtpSent, otpVerified, setOtpVerified, otp, setOtp, error, setError, handleOtpChange, handleLogin, validateEmail, sendOtp, verifyOtp, getButton, firstOtpFails, otpFailsMoreThanOne }) => {
  return (
    <>
      <h5 className="d-flex justify-content-center fs-3 pb-3">
        Welcome back <FaChessKing className="fs-1 pb-1 fc-b" />
      </h5>
      <div className="mb-3 d-flex">
        <input
          type="email"
          name="email"
          required
          className="form-control"
          placeholder="Email address"
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
        />
        {getButton ? (
          <Button
            variant="outline-secondary"
            className="ms-2"
            onClick={sendOtp}
            disabled={!validateEmail(data.email) || otpSent}
          >
            {otpSent ? "Sent" : "Get"}
          </Button>
        ) : (
          <MdAlternateEmail className="fs-5 m-2" />
        )}
      </div>
      {otpSent && (
        <div className="mb-3 d-flex">
          <input
            type="text"
            name="otp"
            className="form-control"
            placeholder="Enter OTP"
            value={otp}
            onChange={handleOtpChange}
          />
          {firstOtpFails && (
            <Button
              variant="outline-secondary"
              className="ms-2"
              onClick={sendOtp}
              disabled={otpFailsMoreThanOne}
            >
              Resend
            </Button>
          )}
          <Button variant="outline-secondary" className="ms-2" onClick={verifyOtp}>
            Check
          </Button>
        </div>
      )}
      <div className="mb-3 d-flex">
        <input
          type="password"
          name="password"
          required
          className="form-control"
          placeholder="Password"
          onChange={(e) => setData({ ...data, password: e.target.value })}
        />
        <FaEyeSlash onClick={() => setPasswordVisible(!passwordVisible)} className="fs-5 m-2" />
      </div>
      <Button onClick={handleLogin} disabled={!otpVerified}>Login</Button>
    </>
  );
};

export default Login;
