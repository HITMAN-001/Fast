import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from '../MKTA tennis acedemy logo.jpg';

const Navbar = ({ onLogout, onDelete }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleNavigate = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  return (
    <nav className="w-full bg-gradient-to-r from-gray-800 to-gray-900 p-4 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo and Title */}
        <div 
          className="flex items-center space-x-4 cursor-pointer" 
          onClick={() => handleNavigate('/home')}
        >
          <img 
            src={logo} 
            alt="MKTA Tennis Academy Logo" 
            className="h-12 w-12 rounded-full border-2 border-indigo-400 transition-transform hover:scale-110" 
          />
          <span className="text-white font-semibold text-lg hidden md:block">
            Manoj Kusalkar Tennis Academy
          </span>
        </div>



        {/* Mobile Menu Button */}
        <div className="relative">
          <button
            className="p-2 rounded-lg hover:bg-gray-700 transition-colors focus:outline-none"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Open menu"
          >
            <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {menuOpen && (
            <div className="absolute right-0 mt-3 w-48 bg-white rounded-lg shadow-xl py-2 z-50 transform transition-all duration-200 ease-out">
              <button
                onClick={() => handleNavigate('/users')}
                className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
              >
                Users List
              </button>
              <div className="border-t border-gray-100 my-2"></div>
              <button
                onClick={() => { setMenuOpen(false); onLogout(); }}
                className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
              >
                Logout
              </button>
              <button
                onClick={() => { setMenuOpen(false); onDelete(); }}
                className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 hover:text-red-800 transition-colors"
              >
                Delete Account
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
