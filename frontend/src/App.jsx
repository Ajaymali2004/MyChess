import "./css/scrollbar.css";
import Home from "./components/Home.jsx";
import Navbar from "./components/Navbar.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import UC from "./components/UC.jsx";
import { useEffect, useState } from "react";
import GameContainer from "./components/Game/GameContainer.jsx";
import Challenge from "./components/Game/Challenge.jsx";
import MyVerticallyCenteredModal from "./components/MyVerticallyCenteredModal.jsx";
import LearnChess from "./components/Learn/LearnChess.jsx";
import News from "./components/News.jsx";
import Footer from "./components/Footer.jsx";

function App() {
  const [login, setLogin] = useState(null);
  const [modalShow, setModalShow] = useState(0);

  return (
    <>
      <BrowserRouter>
        <div className="py-15  w-screen min-h-screen bg-slate-900 grid grid-rows-[auto,1fr]">
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
                path="/play/:tmpID?"
                element={
                  <GameContainer login={login} setModalShow={setModalShow} />
                }
              />
              <Route path="/Learn" element={<LearnChess />} />
              <Route path="/Top-Heading" element={<News />} />
              <Route path="/under_construction" element={<UC />} />
              <Route
                path="*"
                element={
                  <h1 className="text-center text-3xl m-3">
                    404 - Page Not Found
                  </h1>
                }
              />
            </Routes>
          </div>
          <Footer />
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
