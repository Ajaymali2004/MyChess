import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MyVerticallyCenteredModal from "./MyVerticallyCenteredModal";

const DropdownItem = ({
  setLogin,
  logOut,
  login,
  links,
  toggleMenu,
  nav,
  setModalShow,
}) => (
  <div className="relative">
    {links.map((link, idx) => (
      <a
        key={idx}
        className="block py-2 px-4 text-slate-300 hover:bg-slate-700 rounded-md cursor-pointer"
        onClick={() => {
          nav(link.to);
          toggleMenu && toggleMenu();
        }}
      >
        {link.label}
      </a>
    ))}
    {login ? (
      <>
        <p className="py-2 px-4 text-slate-300">Welcome, {login}</p>
        <button
          onClick={() => logOut(setLogin)}
          className="block w-full py-2 px-4 text-left text-slate-300 hover:bg-red-700"
        >
          LogOut
        </button>
      </>
    ) : (
      <>
        <button
          onClick={() => setModalShow(1)}
          className="block w-full py-2 px-4 text-left text-slate-300 hover:bg-blue-600"
        >
          Login
        </button>
        <button
          onClick={() => setModalShow(2)}
          className="block w-full py-2 px-4 text-left text-slate-300 hover:bg-green-600"
        >
          Sign-up
        </button>
      </>
    )}
  </div>
);
const isValidToken = async (auth_token) => {
  try {
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": auth_token,
      },
    });
    if (!response.ok) {
      return { res: false, name: null };
    }
    const data = await response.json();
    if (data && data.success) {
      return { res: data.success, name: data.user.username };
    }
  } catch (error) {
    console.error("Error validating token:", error.message);
    return { res: false, name: null };
  }
};
const check=async(setLogin)=>{
  const auth_token = localStorage.getItem("token");
  if (auth_token) {
    const name=await isValidToken(auth_token);
    console.log(name);
    if(name.res){
      setLogin(name.name);
      }
    }
}
const Navbar = () => {
  const [modalShow, setModalShow] = useState(0);
  const nav = useNavigate();
  const [login, setLogin] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const logOut = () => {
    localStorage.removeItem("token");
    setLogin(null);
  };
  

  useEffect(() => {
    check(setLogin);
  }, []);

  return (
    <header className="bg-nav-color w-full sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          <a
            onClick={() => nav("/")}
            className="text-xl font-bold text-white cursor-pointer"
          >
            Rock_bishop
          </a>
        <div className="flex items-center space-x-4">
          <button
            className="block md:hidden left-0 text-white text-2xl"
            onClick={toggleMenu}
          >
            &#9776;
          </button>
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          <a
            onClick={() => nav("/game")}
            className="text-slate-300 hover:text-white cursor-pointer"
          >
            Play
          </a>
          <a
            onClick={() => nav("/under_construction")}
            className="text-slate-300 hover:text-white cursor-pointer"
          >
            Learn
          </a>
          <a
            onClick={() => nav("/under_construction")}
            className="text-slate-300 hover:text-white cursor-pointer"
          >
            Puzzles
          </a>
          <a
            onClick={() => nav("/under_construction")}
            className="text-slate-300 hover:text-white cursor-pointer"
          >
            About Me
          </a>
        </nav>
        <div className="hidden md:flex items-center space-x-4">
          {login ? (
            <>
              <span className="text-slate-300">Welcome, {login}</span>
              <button
                onClick={logOut}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                LogOut
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setModalShow(1)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Login
              </button>
              <button
                onClick={() => setModalShow(2)}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Sign-up
              </button>
            </>
          )}
        </div>
      </div>
      {menuOpen && (
        <div className="md:hidden bg-slate-800 w-full py-2">
          <DropdownItem
            links={[
              { label: "Play", to: "/game" },
              { label: "Learn", to: "/under_construction" },
              { label: "Puzzles", to: "/under_construction" },
              { label: "About Me", to: "/under_construction" },
            ]}
            toggleMenu={toggleMenu}
            nav={nav}
            setModalShow={setModalShow}
            login={login}
            logOut={logOut}
          />
        </div>
      )}

      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(0)}
        setLogin={setLogin}
      />
    </header>
  );
};

export default Navbar;
