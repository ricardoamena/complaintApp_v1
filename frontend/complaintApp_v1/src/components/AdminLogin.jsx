import { useState } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import adminService from "../service/adminService";

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await adminService.login(credentials.username, credentials.password);
      if (response.success === 1) {
        navigate("/admin/dashboard");
      } else {
        setError(response.message || "Error en el inicio de sesión");
      }
    } catch (error) {
      console.error('Error en login:', error);
      setError(error.message || "Error al intentar iniciar sesión");
    }
  };

  return (
    <div className="h-screen flex justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md space-y-8">
        <div className="p-6">
          <h2 className="mt-6 text-center text-3xl text-gray-900">
            Panel de administración:
          </h2>
          <div className="h-2 w-full bg-gray-300 border rounded-md "></div>
          {error && <div className="text-red-500 mb-4">{error}</div>}
        </div>
        <form onSubmit={handleLogin} className="mt-8 space-y-6">
          <div className="rounded-md shadow-md space-y-6 p-6 ">
            <div>
              <input
                name="username"
                type="text"
                required
                className="shadow-md appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Usuario"
                onChange={(e) =>
                  setCredentials({ ...credentials, username: e.target.value })
                }
                value={credentials.username}
              />
            </div>
            <div>
              <input
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border shadow-md border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Contraseña"
                onChange={(e) =>
                  setCredentials({ ...credentials, password: e.target.value })
                }
                value={credentials.password}
              />
            </div>
            <div className="flex flex-col items-center">
              <button
                type="submit"
                className="bg-blue-500 border rounded-md p-2 text-white hover:bg-blue-600"
              >
                Iniciar Sesión
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
