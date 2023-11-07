"use client";

import { getAuth, User as FirebaseUser  } from "firebase/auth";
import Image from "next/image";
import { useEffect, useState } from "react";
import { auth } from "../api/firestore";

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
    auth.onAuthStateChanged(function(user) {
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
        <div className="flex px-5">
          <div className="flex-auto pt-2">
            <Image
              src="/code-monkey-logo-02.svg"
              alt="Logo"
              className="h-12 w-32 mr-2 mt-1"
              width={400}
              height={200}
            />
          </div>

          {/* <!-- Primary Navbar items --> */}
          <div className="hidden md:flex">
            <a
              href="/movies"
              className="pt-3 px-2 text-green-500 border-b-4 border-green-500 font-semibold "
            >
              Movies abc
            </a>

            { !user ?
            <a
              href="/login"
              className="pt-3 px-2 text-gray-500 font-semibold hover:text-green-500 transition duration-300"
              onClick={() => {

              }}
            >
             Login
            </a> :
            <button onClick={logOut}> Logoout</button>
            }
          </div>

          {/* <!-- Secondary Navbar items --> */}
          {/* <div className="hidden md:flex items-center space-x-3 ">
              <a href="" class="py-2 px-2 font-medium text-gray-500 rounded hover:bg-green-500 hover:text-white transition duration-300">Log In</a>
						<a href="" class="py-2 px-2 font-medium text-white bg-green-500 rounded hover:bg-green-400 transition duration-300">Sign Up</a>
            </div> */}

          {/* <!-- Mobile menu button --> */}
          <div
            className={`${
              navbarOpen ? "block" : "md:hidden"
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
          </div>
        </div>
        
        {/* <!-- mobile menu --> */}
        <div className={`${navbarOpen ? "" : "hidden"} mobile-menu`}>
          <ul className="">
            <li className="nav-item">
              <a
                className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug hover:text-green-500 text-white hover:opacity-75"
                href="/movies"
              >
                Movies
                <i className="fab fa-facebook-square text-lg leading-lg text-white opacity-75" />
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
