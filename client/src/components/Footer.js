import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full bg-indigo-800 text-white p-4 relative bottom-0">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex flex-col items-center md:items-start mb-4 md:mb-0">
          <h2 className="text-lg font-bold mb-2">Recipe App</h2>
          <p className="text-sm">Delicious recipes at your fingertips</p>
        </div>
        <nav className="flex flex-col items-center md:items-start mb-4 md:mb-0">
          <h3 className="text-lg font-bold mb-2">Links</h3>
          <ul className="flex flex-col space-y-2">
            <li>
              <a href="/" className="text-sm hover:text-gray-300">
                Home
              </a>
            </li>
            <li>
              <a href="/about" className="text-sm hover:text-gray-300">
                About
              </a>
            </li>
            <li>
              <a href="/contact" className="text-sm hover:text-gray-300">
                Contact
              </a>
            </li>
          </ul>
        </nav>
        <div className="flex flex-col items-center md:items-start">
          <h3 className="text-lg font-bold mb-2">Follow Us</h3>
          <ul className="flex space-x-4">
            {/* Replace these links with the links to your social media accounts */}
            <li>
              <a href="/" className="text-sm hover:text-gray-300">
                Facebook
              </a>
            </li>
            <li>
              <a href="/" className="text-sm hover:text-gray-300">
                Twitter
              </a>
            </li>
            <li>
              <a href="/" className="text-sm hover:text-gray-300">
                Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
