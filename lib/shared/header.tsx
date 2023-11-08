"use client";

import { User as FirebaseUser } from "firebase/auth";
import Image from "next/image";
import { useEffect, useState } from "react";
import { auth } from "../api/firestore";
import Logo from "../assets/logo.svg"
// TODO Is this needed?
// import { Libre_Barcode_EAN13_Text } from "next/font/google";

const Header = () => {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null)


  const setNavBar = () => {
    setNavbarOpen(!navbarOpen);
  };

  const logOut = () => {
    auth.signOut().then(() => {
      setUser(null)
    }).catch()
  }

  useEffect(() => {
    auth.onAuthStateChanged(function (user) {
      if (user) {
        // User is signed in.
        console.log('its meeeee', user)
        setUser(user);
      } else {
        // No user is signed in.
        console.log('no one home')
      }
    });
  }, [user, setUser])

  return (
    <header className="items-center w-screen">
      <nav>
        <ul className="flex px-5">
          <li className="flex-auto pt-2">
            <Image
              src={Logo}
              alt="Logo"
              className="h-12 w-32 mr-2 mt-1"
              width={400}
              height={200}
            />
          </li>

          {/* <!-- Primary Navbar items --> */}
          <li className="hidden md:flex align-middle">
            {user ?
              <a
                href="/"
                className="pt-3 px-2 text-white font-semibold hover:text-green-500 transition duration-300 align-middle"
              >
                Search
              </a> : null
            }
          </li>
          <li className="hidden md:flex align-middle">
            {user ?
              <a
                href="/movies"
                className="pt-3 px-2 text-white font-semibold hover:text-green-500 transition duration-300 align-middle"
              >
                Watchlist
              </a> :
              null}
          </li>
          <li>
            {!user ?
              <a
                href="/login"
                className="pt-3 px-2 text-white font-semibold hover:text-green-500 transition duration-300 align-middle"
                onClick={() => {

                }}
              >
                Login
              </a> :
              <button onClick={logOut} className="pt-3 px-2 text-white font-semibold hover:text-green-500 transition duration-300"> Logoout</button>
            }
          </li>

          {/* <!-- Secondary Navbar items --> */}
          {/* <div className="hidden md:flex items-center space-x-3 ">
              <a href="" class="py-2 px-2 font-medium text-gray-500 rounded hover:bg-green-500 hover:text-white transition duration-300">Log In</a>
						<a href="" class="py-2 px-2 font-medium text-white bg-green-500 rounded hover:bg-green-400 transition duration-300">Sign Up</a>
            </div> */}

          {/* <!-- Mobile menu button --> */}
          <li
            className={`${navbarOpen ? "block" : "md:hidden"
              } flex items-center`}
          >
            <button
              className="outline-none mobile-menu-button"
              onClick={setNavBar}
            >
              <svg
                className=" w-16 h-16 text-gray-500 hover:text-green-500 "
                x-show="!showMenu"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </li>
        </ul>

        {/* <!-- mobile menu --> */}
        <li className={`${navbarOpen ? "" : "hidden"} mobile-menu`}>
          <ul className="">
            <li className="nav-item">
              <a
                className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug hover:text-green-500 text-white hover:opacity-75"
                href="/movies"
              >
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
