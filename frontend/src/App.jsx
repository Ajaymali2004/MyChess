import Home from "./components/Home.jsx";
import Navbar from "./components/Navbar.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Game from "./components/Game.jsx";
import UC from "./components/UC.jsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <div className="py-15 px-3 w-screen min-h-screen bg-slate-900">
            <Navbar />            
          <div>
            <Routes>
              <Route path="/" element={<Home />} className="home" />
              <Route path="/game" element={<Game />} />
              <Route path="/under_construction" element={<UC />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
