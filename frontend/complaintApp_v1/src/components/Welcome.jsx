import React from "react";
import { Link } from "react-router-dom";

const Welcome = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-300">
      <h1 className="text-4xl mb-6">Bienvenido a tu aplicacion de denuncias</h1>
      <p className="flex space-x-4">
        Esta aplicacion te va a permitir cargar denuncias identificandote o
        bien, de forma anónima
      </p>
      <div className="flex space-x-4 p-6">
        <Link
          to="/complaint"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Denuncia con Identificación
        </Link>
        <Link
          to="/anony-complaint"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Denuncia Anónima
        </Link>
      </div>
      <Link
          to="/status-complaint"
          className="bg-slate-500 text-white px-4 py-2 rounded hover:bg-slate-600"
        >
          Consultar el estado de tu Denuncia
        </Link>
    </div>
  );
};

export default Welcome;
