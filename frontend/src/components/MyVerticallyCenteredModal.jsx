import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { FaChessBishop, FaUser,FaEye, FaEyeSlash } from "react-icons/fa";
import { GiChessKing } from "react-icons/gi";
import { useNavigate } from "react-router-dom";

function MyVerticallyCenteredModal({ show, onHide, setLogin }) {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  const navigate=useNavigate();
  const [error,setError]= useState(false);
  const login = async (email, password) => {
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const json = await response.json();
    if (json.success===true) {
      localStorage.setItem("token",json.auth_token);
      setLogin(json.name);
      onHide();
      navigate("./");
    }
    else {
      setError(true);
    }
  };
  const handleLogin = (e) => {
    console.log("LOGIN");
    e.preventDefault();
    login(data.email, data.password);    
  };
  const [data, setData] = useState({
    name:"",
    email: "",
    password: "",
  });
  onchange = (e) => {
    e.preventDefault();
    setData({ ...data, [e.target.name]: e.target.value });
  };
  return (
    <Modal
      show={show}
      onHide={onHide}
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
          {show===1?(<h5 className="d-flex justify-content-center fs-3">
            Welcome back <GiChessKing className="fs-1 pb-1 fc-b" />
          </h5>):(<><h5 className="d-flex justify-content-center fs-3">
            Welcome to the Rock_bishop  <GiChessKing className="fs-1 pb-1 fc-b" />
          </h5>
          <div className="mb-3 d-flex">
          <input
            type="username"
            name="username"
            required
            className="form-control"
            aria-describedby="emailHelp"
            placeholder="Username"
            onChange={onchange}
          />
          <FaUser className="fs-5 m-2" />
        </div>
        </>
        )}
          <div className="mb-3 d-flex">
            <input
              type="email"
              name="email"
              required
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              placeholder="Email address"
              onChange={onchange}
            />
            <FaUser className="fs-5 m-2" />
          </div>
          <div className="mb-3 d-flex">
            <input
              type={passwordVisible ? "text" : "password"}
              name="password"
              required
              className="form-control"
              id="exampleInputPassword1"
              placeholder="Password"
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
          {error && <p className="danger">Invalid Credential. Email / Password!</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleLogin}>
            Login
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}

export default MyVerticallyCenteredModal;
