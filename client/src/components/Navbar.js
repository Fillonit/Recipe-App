import React, { useState } from "react";
// import Logo from "../images/logo.png"
import Icon from "../images/icon.png"
import NotificationBell from "./NotificationBell";
import { FaUser, FaRandom, FaUtensils, FaInfoCircle, FaEnvelope, FaBars, FaTimes, FaPlusCircle } from "react-icons/fa";

const Navbar = ({ title, image, description, userId }) => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };
  async function randomRecipe() {
    try {
      try {
        const response = await fetch(`http://localhost:5000/api/recipe/randomRecipe`, {
          method: "GET",
          headers: {
            'R-A-Token': localStorage.getItem('token')
          },
        });
        if (response.status !== 200) return;
        const json = await response.json();
        window.location.href = `http://localhost:3000/recipe/${json.response[0].RecipeId}`;
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  }
  const navItems = [
    // { label: "Home", icon: <FaHome className="inline-block mr-1 ml-4 text-lg"/>, link: "/" },
    { label: "Recipes", icon: <FaUtensils className="inline-block mr-1 ml-4 text-lg" />, link: "/recipes" },
    { label: "Random", icon: <FaRandom onClick={randomRecipe} className="inline-block mr-1 ml-4 text-lg" />, link: "/random" },
    { label: "About", icon: <FaInfoCircle className="inline-block mr-1 ml-4 text-lg" />, link: "/about" },
    { label: "Contact", icon: <FaEnvelope className="inline-block mr-1 ml-4 text-lg" />, link: "/contact" },
    { label: "Add Recipe", icon: <FaPlusCircle className="inline-block mr-1 ml-4 text-lg" />, link: "/publishRecipe" },
    { label: "Profile", icon: <FaUser className="inline-block mr-1 ml-4 text-lg" />, link: `/users/${userId ?? 1}` },
    { label: "", icon: <NotificationBell />, link: `/notifications` },
  ];

  return (

    <div className="fixed top-0 inset-x-0 justify-center items-center opacity-90 z-50">
      <nav className="flex items-center justify-between min-w-0 flex-wrap bg-white text-indigo-500 border border-gray-300 shadow-md p-4 rounded-xl mt-6 lg:ml-40 lg:mr-40
     xl:ml-70 xl:mr-70 md:ml-20 md:mr-20 sm:mr-20 sm:ml-20 ml-8 mr-8 text-center">
        <a className="flex items-center flex-shrink-0 text-indigo-500 mr-6" href="/">
          {isNavOpen ? (
            <>
              <img className="h-9" src={Icon} alt="Icon" />
              <span className="font-semibold text-2xl tracking-tight hover:text-indigo-400 ml-[5rem] lg:ml-2 md:ml-2">Magnolia</span>
            </>
          ) : (
            <>
              <img className="h-9" src={Icon} alt="Icon" />
              <span className="font-semibold text-2xl tracking-tight hover:text-indigo-400 ml-[5rem] lg:ml-2 md:ml-2">Magnolia</span>
            </>
          )}
        </a>

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
          className={`${isNavOpen ? "block" : "hidden"
            } w-full block flex-grow lg:flex lg:items-center lg:w-auto`}
        >
          <div className="text-sm lg:flex-grow lg:text-center justify-between">
            {navItems.filter(item => {
              if (item.label === "Add Recipe") {
                const role = localStorage.getItem("role");
                return role === "chef";
              }
              return true;
            }).map((item, index) => (
              <a
                key={index}
                href={`${item.link}`}
                className="block mt-4 lg:inline-block lg:-mt-1 text-indigo-500 hover:text-indigo-900 mr-4"
              >
                <p className="text-lg">{item.icon} {item.label}</p>
              </a>
            ))}

          </div>
          <div>
            <a
              href="/login"
              className="inline-block text-base mr-2 px-4 py-2 leading-none border bg-indigo-500 text-white border-indigo-500 hover:border-transparent hover:text-white hover:bg-indigo-800 mt-4 lg:mt-0 font-bold rounded-full"
            >
              Login
            </a>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
