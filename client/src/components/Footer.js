import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer  className="bg-slate-800 text-white py-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <a href="/" className="text-xl font-semibold text-white font-mono">
            M
          </a>
          <div className="flex space-x-2">
            <a href="/" className="text-gray-400 hover:text-white transition-colors duration-300">
              <FaFacebookF className="text-lg" />
            </a>
            <a href="/" className="text-gray-400 hover:text-white transition-colors duration-300">
              <FaTwitter className="text-lg" />
            </a>
            <a href="/" className="text-gray-400 hover:text-white transition-colors duration-300">
              <FaInstagram className="text-lg" />
            </a>
          </div>
        </div>
        <div className="text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} Magnolia. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
