import "./css/scrollbar.css";
import Home from "./components/Home.jsx";
import Navbar from "./components/Navbar.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import UC from "./components/UC.jsx";
import { useEffect, useState } from "react";
import GameContainer from "./components/Game/GameContainer.jsx";
import Challenge from "./components/Game/Challenge.jsx";
import MyVerticallyCenteredModal from "./components/MyVerticallyCenteredModal.jsx";

function App() {
  const [login, setLogin] = useState(null);
  const [modalShow, setModalShow] = useState(0);
  return (
    <>
      <BrowserRouter>
        <div className="py-15  w-screen min-h-screen  bg-slate-900 grid grid-rows-[auto,1fr]">
          <Navbar
            login={login}
            setLogin={setLogin}
            modalShow={modalShow}
            setModalShow={setModalShow}
          />
          <MyVerticallyCenteredModal
            show={modalShow}
            onHide={() => setModalShow(0)}
            setLogin={setLogin}
          />
          <div className="container px-3 text-white">
            <Routes>
              <Route path="/" element={<Home />} className="home" />
              <Route
                path="/game/:tmpID?"
                element={
                  <GameContainer login={login} setModalShow={setModalShow} />
                }
              />
              <Route path="/under_construction" element={<UC />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
