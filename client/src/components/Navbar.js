import React, { useState } from "react";
import { FaHome, FaUser, FaCode, FaBlog, FaInfoCircle, FaEnvelope, FaBars, FaTimes } from "react-icons/fa";

const Navbar = ({ title, image, description }) => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const navItems = [
    { label: "Home", icon: <FaHome className="inline-block mr-2"/> },
    { label: "Profile", icon: <FaUser className="inline-block mr-2"/> },
    { label: "Examples", icon: <FaCode className="inline-block mr-2"/> },
    { label: "Recipes", icon: <FaBlog className="inline-block mr-2"/> },
    { label: "About", icon: <FaInfoCircle className="inline-block mr-2"/> },
    { label: "Contact", icon: <FaEnvelope className="inline-block mr-2"/> },
  ];

  return (
    <nav className="flex items-center justify-between min-w-0 flex-wrap bg-white p-5 text-indigo-500 border border-gray-300 shadow-md p-4 rounded-xl mt-1">
      <div className="flex items-center flex-shrink-0 text-indigo-500 mr-6">
        <span className="font-semibold text-xl tracking-tight">Recipe App</span>
      </div>
      <div className="block lg:hidden">
        <button
          className="flex items-center px-3 py-2 border rounded text-indigo-200 border-indigo-400 hover:border-indigo-700"
          onClick={toggleNav}
        >
          {isNavOpen ? (
            <FaTimes className="fill-current h-3 w-3 " />
          ) : (
            <FaBars className="fill-current h-3 w-3" />
          )}
        </button>
      </div>
      <div
        className={`${
          isNavOpen ? "block" : "hidden"
        } w-full block flex-grow lg:flex lg:items-center lg:w-auto`}
      >
        <div className="text-sm lg:flex-grow lg:text-center justify-between">
          {navItems.map((item, index) => (
            <a
              key={index}
              href={`/${item.label.toLowerCase()}`}
              className="block mt-4 lg:inline-block lg:mt-0 text-indigo-400 hover:text-indigo-600 mr-4"
            >
              {item.icon} {item.label}
            </a>
          ))}
        </div>
        <div>
          <a
            href="/"
            className="inline-block text-sm px-4 py-2 leading-none border rounded text-indigo-500 border-indigo-500 hover:border-transparent hover:text-white hover:bg-indigo-500 mt-4 lg:mt-0"
          >
            Login
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
