import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-8 w-8 mr-3 text-blue-400" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
          <Link
            to="/"
            className="text-white text-xl font-semibold transition-transform duration-300 ease-in-out transform hover:scale-105 hover:text-blue-300"
          >
            Sistema de Denuncias
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <Link 
            to="/" 
            className="text-white hover:text-blue-300 transition-colors duration-300"
          >
            Inicio
          </Link>
          
          <div className="bg-blue-600 p-2 rounded-lg transition-colors ease-in-out duration-300 hover:bg-blue-700">
            <Link 
              to="/admin/login" 
              className="text-white flex items-center"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 mr-2" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path 
                  fillRule="evenodd" 
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" 
                  clipRule="evenodd" 
                />
              </svg>
              Administrador
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
