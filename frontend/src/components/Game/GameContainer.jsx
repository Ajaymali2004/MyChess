import React from "react";
import Game from "./Game";
import LoginRequired from "../LoginRequired";

export default function GameContainer({ login, setModalShow }) {
  if (login) {
    return <Game />;
  } else {
    return <LoginRequired setModalShow={setModalShow} />;
  }
}
