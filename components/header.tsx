"use client";

import Image from "next/image";
import { useState } from "react";

const Header = () => {
  const [navbarOpen, setNavbarOpen] = useState(false);

  const setNavBar = () => {
    setNavbarOpen(!navbarOpen);
  };

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
              Home
            </a>
            <a
              href="/movies/search"
              className="pt-3 px-2 text-gray-500 font-semibold hover:text-green-500 transition duration-300"
            >
              Search
            </a>
            <a
              href="/movies/watched"
              className="pt-3 px-2 text-gray-500 font-semibold hover:text-green-500 transition duration-300"
            >
              Watched
            </a>
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
                className=" w-10 h-10 text-gray-500 hover:text-green-500 "
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
            {/* <li className="active"><a href="/movies" className="block text-sm px-2 py-4 text-white bg-gray-500 font-semibold">Home</a></li>
                    <li><a href="/movies-search" className="block text-sm px-2 py-4 text-white bg-gray-500 font-semibold">Search</a></li> */}
            <li className="nav-item">
              <a
                className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug hover:text-green-500 text-white hover:opacity-75"
                href="/movies"
              >
                Movies
                <i className="fab fa-facebook-square text-lg leading-lg text-white opacity-75" />
              </a>
            </li>
            <li className="nav-item">
              <a
                className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:text-green-500 hover:opacity-75"
                href="/movies/search"
              >
                Search
                <i className="fab fa-facebook-square text-lg leading-lg text-white opacity-75" />
              </a>
            </li>
            <li className="nav-item">
              <a
                className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug hover:text-green-500 text-white hover:opacity-75"
                href="/movies/watched"
              >
                Watched
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
