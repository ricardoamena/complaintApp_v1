import { useState } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import adminService from "../service/adminService";
import { useLocation } from "react-router-dom";

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    if (!credentials.username.trim()) {
      setError("El nombre de usuario es requerido");
      return false;
    }
    if (!credentials.password.trim()) {
      setError("La contraseña es requerida");
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setError(null);
    setIsLoading(true);

    try {
      const response = await adminService.login(
        credentials.username.trim(),
        credentials.password.trim()
      );

      if (response.success === 1 && response.token) {
        const from = location.state?.from?.pathname || "/admin/dashboard";
        navigate(from, { replace: true });
      } else {
        setError("Credenciales incorrectas");
      }
    } catch (error) {
      console.error("Error en login:", error);
      setError(error.message || "Error al intentar iniciar sesión");
      setCredentials((prev) => ({
        ...prev,
        password: "",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="p-6">
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Panel de administración:
          </h2>

          {error && (
            <div className="mt-4 bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
        </div>
        <form onSubmit={handleLogin} className="mt-8 space-y-6">
          <div className="rounded-md shadow-md space-y-4 ">
            <div>
              <label htmlFor="username" className="sr-only">
                Usuario
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                autoComplete="username"
                className="appearance-none shadow-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Usuario"
                onChange={(e) =>
                  setCredentials({ ...credentials, username: e.target.value })
                }
                value={credentials.username}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="appearance-none shadow-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
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
                disabled={isLoading}
                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                  isLoading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Iniciando sesión...
                  </span>
                ) : (
                  "Iniciar Sesión"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
