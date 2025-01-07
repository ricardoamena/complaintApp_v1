import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-lg">Complaint App</div>
        <div className="bg-cyan-600 p-2 rounded-lg hover:bg-cyan-700">
          <Link
            to="/admin-login"
            className="text-white transition-colors duration-300 ease-in-out"
          >
            Administrador
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
