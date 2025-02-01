import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { FaChessBishop, FaUser, FaEye, FaEyeSlash } from "react-icons/fa";
import { GiChessKing } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import { MdAlternateEmail } from "react-icons/md";
import { generateOTP, otpChecker } from "./Otp";

function MyVerticallyCenteredModal({ show, onHide, setLogin }) {
  const Auth_URL = import.meta.env.VITE_Auth_URL;
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loginError, setLoginError] = useState("");
  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loginButtonDisabled,setLoginButtonDisabled]=useState(true);
  const [getButton, setGetButton] = useState(false);
  const [firstOtpFails, setFirstOtpFails] = useState(false);
  const [otpFailsMoreThanOne, setOtpFailsMoreThanOne] = useState(true);
  const resetModalState = () => {
    setPasswordVisible(false);
    setOtpSent(false);
    setOtpVerified(false);
    setGetButton(false);
    setOtp("");
    setError("");
    setLoginError("");
    setLoginButtonDisabled(true);
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
    const response = await generateOTP(data.email);
    if (response.success) {
      setOtpSent(true);
    } else {
      setOtpSent(false);
      setError(response.message);
    }
  };

  const verifyOtp = () => {
    if (otpChecker(data.email, otp)) {
      setOtpVerified(true);
      setOtpSent(true);
      setError("");
    } else {
      setError("Invalid OTP");
      setOtpFailsMoreThanOne(false);
      setFirstOtpFails(true);
    }
  };
  const login = async (email, password) => {
    const response = await fetch(Auth_URL + "api/auth/login", {
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
      setLoginError(json.message);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    login(data.email, data.password);
  };

  const signIn = async (username, email, password) => {
    const response = await fetch(Auth_URL + "api/auth/signin", {
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
      setGetButton(true);
      setLoginButtonDisabled(false);
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
            <h5 className="d-flex justify-content-center fs-3 pb-3">
              Welcome back <GiChessKing className="fs-1 pb-1 fc-b" />
            </h5>
          ) : (
            <>
              <h5 className="d-flex justify-content-center fs-3 pb-3">
                Welcome to the Rock_bishop{" "}
                <GiChessKing className="fs-1 pb-1 fc-b" />
              </h5>
              <div className="mb-3 d-flex">
                <input
                  type="text"
                  name="username"
                  required
                  className="form-control"
                  autoComplete="off"
                  placeholder="Username"
                  onChange={onchange}
                />
                <FaUser className="fs-5 m-2" />
              </div>
            </>
          )}
          {show !== 1 && !otpSent && (
            <div className="d-flex justify-content-between mt-2">
              {error && <span className="text-danger">{error}</span>}
            </div>
          )}
          <div className="mb-3 d-flex">
            <input
              type="email"
              name="email"
              required
              className="form-control"
              placeholder="Email address"
              value={data.email}
              onChange={onchange}
            />
            {getButton && show !== 1 ? (
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
              <Button
                variant="outline-secondary"
                className="ms-2"
                onClick={verifyOtp}
              >
                Check
              </Button>
            </div>
          )}
          {show === 1 && (
            <div className="d-flex justify-content-between mx-1">
              {loginError && <span className="text-danger">{loginError}</span>}
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
            <Button onClick={handleLogin} disabled={loginButtonDisabled}>Login</Button>
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
