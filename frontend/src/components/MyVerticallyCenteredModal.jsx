import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { FaChessBishop, FaUser, FaEye, FaEyeSlash } from "react-icons/fa";
import { GiChessKing } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import { MdAlternateEmail } from "react-icons/md";
import { generateOTP, otpChecker } from "./Otp";

function MyVerticallyCenteredModal({ show, onHide, setLogin }) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [verifyOption, setVerifyOption] = useState("");
  const resetModalState = () => {
    setPasswordVisible(false);
    setOtpSent(false);
    setOtpVerified(false);
    setVerifyOption("");
    setOtp("");
    setError("");
    setData({
      username: "",
      email: "",
      password: "",
    });
  };

  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const sendOtp = async () => {
    setOtpSent(true);
    const response = await generateOTP(data.email);
    if (response === "User already exists") setOtpSent(false);
    setError(response);
  };

  const verifyOtp = () => {
    if (otpChecker(data.email, otp)) {
      setOtpVerified(true);
      setError("");
    } else {
      setError("Invalid OTP");
    }
  };
  const login = async (email, password) => {
    const response = await fetch("https://rock-bishop-auth.onrender.com/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const json = await response.json();
    if (json.success === true) {
      localStorage.setItem("token", json.auth_token);
      setLogin(json.username);
      handleClose();
      navigate("./");
    } else {
      setError(json.message);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    login(data.email, data.password);
  };

  const signIn = async (username, email, password) => {
    const response = await fetch("https://rock-bishop-auth.onrender.com/api/auth/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });
    const json = await response.json();
    if (json.success === true) {
      localStorage.setItem("token", json.auth_token);
      setLogin(json.username);
      handleClose();
      navigate("./");
    } else {
      setError(json.message);
    }
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    signIn(data.username, data.email, data.password);
  };

  const onchange = (e) => {
    e.preventDefault();
    setData({ ...data, [e.target.name]: e.target.value });

    if (e.target.name === "email" && validateEmail(e.target.value)) {
      setVerifyOption("Verify your email");
    }
  };

  const handleClose = () => {
    resetModalState();
    onHide();
  };
  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="main2"
    >
      <form action="">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter" className="d-flex">
            Rock_bishop
            <FaChessBishop className="fs-4 m-2" />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {show === 1 ? (
            <h5 className="d-flex justify-content-center fs-3">
              Welcome back <GiChessKing className="fs-1 pb-1 fc-b" />
            </h5>
          ) : (
            <>
              <h5 className="d-flex justify-content-center fs-3">
                Welcome to the Rock_bishop{" "}
                <GiChessKing className="fs-1 pb-1 fc-b" />
              </h5>
              <div className="mb-3 d-flex">
                <input
                  type="text"
                  name="username"
                  required
                  className="form-control"
                  placeholder="Username"
                  onChange={onchange}
                />
                <FaUser className="fs-5 m-2" />
              </div>
            </>
          )}
          {show !== 1 && !otpSent && (
            <div className="d-flex justify-content-between mt-2">
            {error && error === "User already exists" && (
              <span className="text-danger">{error}</span>
            )}
            <span
              onClick={sendOtp}
              className="text-info"
              style={{ fontSize: "0.875rem", cursor: "pointer" }}
            >
              {verifyOption}
            </span>
          </div>
          
          )}
          <div className="mb-3 d-flex">
            <input
              type="email"
              name="email"
              required
              className="form-control"
              placeholder="Email address"
              onChange={onchange}
            />
            <MdAlternateEmail className="fs-5 m-2" />
          </div>
          {error && error !== "User already exists" && (
            <p className="text-danger">{error}</p>
          )}
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
              <Button variant="outline-secondary" onClick={verifyOtp}>
                Check
              </Button>
            </div>
          )}
          <div className="mb-3 d-flex">
            <input
              type={passwordVisible ? "text" : "password"}
              name="password"
              required
              className="form-control"
              placeholder="Password"
              onChange={onchange}
            />
            {passwordVisible ? (
              <FaEye onClick={togglePasswordVisibility} className="fs-5 m-2" />
            ) : (
              <FaEyeSlash
                onClick={togglePasswordVisibility}
                className="fs-5 m-2"
              />
            )}
          </div>
        </Modal.Body>

        <Modal.Footer>
          {show === 1 ? (
            <Button onClick={handleLogin}>Login</Button>
          ) : (
            <Button
              onClick={handleSignIn}
              disabled={!otpVerified} // Disable Sign Up until OTP is verified
            >
              Sign Up
            </Button>
          )}
        </Modal.Footer>
      </form>
    </Modal>
  );
}

export default MyVerticallyCenteredModal;
