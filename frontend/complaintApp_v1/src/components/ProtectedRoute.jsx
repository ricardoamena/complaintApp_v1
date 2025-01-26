import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import adminService from '../service/adminService';

const ProtectedRoute = ({ children }) => {
  const [isVerifying, setIsVerifying] = useState(true); // Cambiamos a true
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        // Verificamos la autenticación usando el servicio
        const isValid = adminService.checkAuth();
        setIsAuthenticated(isValid);
        
        if (!isValid) {
          console.log('No autenticado - redirigiendo a login');
        }
      } catch (error) {
        console.error('Error verificando autenticación:', error);
        setIsAuthenticated(false);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyAuth();
  }, []);

  // Mientras verifica, mostramos un indicador de carga
  if (isVerifying) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-lg text-gray-600 flex items-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Verificando autenticación...
        </div>
      </div>
    );
  }

  // Si no está autenticado, redirigimos al login
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Si está autenticado, mostramos el contenido protegido
  return children;
};

export default ProtectedRoute;