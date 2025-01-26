// src/components/Welcome.jsx
import React from "react";
import { Link } from "react-router-dom";

const Welcome = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-20 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-8">
          Sistema de Denuncias
        </h1>
        
        <p className="text-xl text-gray-600 mb-12 leading-relaxed">
          Bienvenido a nuestra plataforma de denuncias. 
          Elija el método que mejor se adapte a sus necesidades.
        </p>

        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 max-w-2xl mx-auto">
            <Link
              to="/complaint"
              className="group p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
            >
              <h2 className="text-xl font-semibold text-blue-600 mb-2">
                Denuncia Identificada
              </h2>
              <p className="text-gray-600 text-sm">
                Realice su denuncia proporcionando sus datos de contacto
              </p>
            </Link>

            <Link
              to="/anony-complaint"
              className="group p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
            >
              <h2 className="text-xl font-semibold text-green-600 mb-2">
                Denuncia Anónima
              </h2>
              <p className="text-gray-600 text-sm">
                Presente su denuncia de manera anónima y segura
              </p>
            </Link>
          </div>

          <Link
            to="/status-complaint"
            className="inline-block mt-8 px-8 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors duration-300"
          >
            Consultar Estado de Denuncia
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Welcome;