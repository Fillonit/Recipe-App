import React from 'react';

const Navbar = ({ title, image, description }) => {
  return (
    // Navbar
    <nav className="flex items-center justify-between flex-wrap bg-white p-6 text-indigo-500 border-b-2 border-indigo-500">
        <div className="flex items-center flex-shrink-0 text-indigo-500 mr-6">
            <span className="font-semibold text-xl tracking-tight">Recipe App</span>
        </div>
        <div className="block lg:hidden">
            <button className="flex items-center px-3 py-2 border rounded text-indigo-200 border-indigo-400 hover:text-white hover:border-white">
                <svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/></svg>
            </button>
        </div>
        <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
            <div className="text-sm lg:flex-grow">
                <a href="/profile" className="block mt-4 lg:inline-block lg:mt-0 text-indigo-400 hover:text-indigo-600 mr-4">
                    Profile
                </a>
                <a href="/" className="block mt-4 lg:inline-block lg:mt-0 text-indigo-400 hover:text-indigo-600 mr-4">
                    Examples
                </a>
                <a href="/" className="block mt-4 lg:inline-block lg:mt-0 text-indigo-400 hover:text-indigo-600">
                    Blog
                </a>
            </div>
            <div>
                <a href="/" className="inline-block text-sm px-4 py-2 leading-none border rounded text-indigo-500 border-indigo-500 hover:border-transparent hover:text-white hover:bg-indigo-500 mt-4 lg:mt-0">Login</a>
            </div>
        </div>
    </nav>
  );
};

export default Navbar;
