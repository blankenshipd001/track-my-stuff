"use client";

import { User as FirebaseUser } from "firebase/auth";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { auth } from "../api/firestore";
import { signIn } from "@/lib/api/firestore";
import Logo from "../assets/logo.svg";
import { Button } from "@mui/material";
// TODO Is this needed?
// import { Libre_Barcode_EAN13_Text } from "next/font/google";

const Header = () => {
  const router = useRouter();

  const [navbarOpen, setNavbarOpen] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);

  const loginButton = {
    color: "white",
    background: "#782FEF",
    top: "16px",
    borderRadius: "100px",
    gap: "8px",
  };

  const setNavBar = () => {
    setNavbarOpen(!navbarOpen);
  };

  const logOut = () => {
    auth
      .signOut()
      .then(() => {
        setUser(null);
      })
      .catch();
  };

  useEffect(() => {
    auth.onAuthStateChanged(function (user) {
      if (user) {
        // User is signed in.
        setUser(user);
      } else {
        // No user is signed in.
        console.log("no one home");
      }
    });
  }, [user, setUser]);

  /**
   * Send the user back to the homepage
   */
  const handleClickEvent = () => {
    router.push(`/`, { scroll: false });
  };

  return (
    <header className="items-center w-screen">
      <nav>
        <ul className="flex px-5">
          <li className="flex-auto pt-2">
            <Image onClick={handleClickEvent} style={{ cursor: "pointer" }} src={Logo} alt="Logo" className="h-12 w-32 mr-2 mt-1" width={400} height={200} />
          </li>

          {/* <!-- Primary Navbar items --> */}
          <li className="hidden md:flex align-middle">
            {user ? (
              <a href="/" className="pt-3 px-2 text-white font-semibold hover:text-reelPurple-500 transition duration-300 align-middle">
                Search
              </a>
            ) : null}
          </li>
          <li className="hidden md:flex align-middle">
            {user ? (
              <a href="/movies" className="pt-3 px-2 text-white font-semibold hover:text-reelPurple-500 transition duration-300 align-middle">
                Watchlist
              </a>
            ) : null}
          </li>
          <li>
            {!user ? (
              <Button
                variant="contained"
                style={loginButton}
                onClick={() => signIn()}
              >
                Login
              </Button>
            ) : (
              <button onClick={logOut} className="pt-3 px-2 text-white font-semibold hover:text-reelPurple-500 transition duration-300">
                {" "}
                Log Out
              </button>
            )}
          </li>

          {/* <!-- Secondary Navbar items --> */}
          {/* <div className="hidden md:flex items-center space-x-3 ">
              <a href="" class="py-2 px-2 font-medium text-gray-500 rounded hover:bg-green-500 hover:text-white transition duration-300">Log In</a>
						<a href="" class="py-2 px-2 font-medium text-white bg-green-500 rounded hover:bg-green-400 transition duration-300">Sign Up</a>
            </div> */}

          {/* <!-- Mobile menu button --> */}
          <li className={`${navbarOpen ? "block" : "md:hidden"} flex items-center`}>
            <button className="outline-none mobile-menu-button" onClick={setNavBar}>
              <svg className=" w-16 h-16 text-gray-500 hover:text-green-500 " x-show="!showMenu" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </li>
        </ul>

        {/* <!-- mobile menu --> */}
        <li className={`${navbarOpen ? "" : "hidden"} mobile-menu`}>
          <ul className="">
            <li className="nav-item">
              <a className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug hover:text-green-500 text-white hover:opacity-75" href="/movies">
                Movies
              </a>
            </li>
          </ul>
        </li>
      </nav>
    </header>
  );
};

export default Header;
