import axios from "axios";

const API_URL = "http://localhost:7070/api";

// Creamos una instancia de axios con configuración base
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

const setAuthToken = (token) => {
  if (token) {
    try {
      // Guardamos el token en localStorage
      localStorage.setItem("adminToken", token);
      // Configuramos el header para todas las peticiones futuras
      apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      console.log("Token configurado:", token.substring(0, 20) + "...");
      return true;
    } catch (error) {
      console.error("Error configurando token:", error);
      return false;
    }
  }
  // Si no hay token, limpiamos todo
  localStorage.removeItem("adminToken");
  delete apiClient.defaults.headers.common["Authorization"];
  console.log("Token eliminado");
  return false;
};

// Interceptor para añadir el token a todas las peticiones
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
      console.log("Enviando petición:", {
        url: config.url,
        method: config.method,
        headers: config.headers,
      });
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      console.log("Error 403 detectado - Limpiando token");
      setAuthToken(null);
    }
    return Promise.reject({
      success: 0,
      message: error.response?.data?.message || "Error en el servidor",
      status: error.response?.status,
    });
  }
);

const adminService = {
  login: async (username, password) => {
    try {
      const response = await apiClient.post("/admin/login", {
        username: username.trim(),
        password: password.trim(),
      });

      if (response.data.success === 1 && response.data.token) {
        setAuthToken(response.data.token);
        return response.data;
      }

      throw new Error(response.data.message || "Error en el inicio de sesión");
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      throw error;
    }
  },

  getAllComplaints: async () => {
    try {
      const response = await apiClient.get("/admin/complaints");
      return response.data || [];
    } catch (error) {
      console.error("Error al obtener denuncias:", error);
      throw error;
    }
  },

  getAllAnonyComplaints: async () => {
    try {
      const response = await apiClient.get("/admin/anony-complaints");
      return response.data || [];
    } catch (error) {
      console.error("Error al obtener denuncias anónimas:", error);
      throw error;
    }
  },

  updateComplaintStatus: async (id, type, data) => {
    try {
      const endPoint =
        type === "anonymous"
          ? `/admin/anony-complaints/${id}`
          : `/admin/complaints/${id}`;

      const response = await apiClient.put(endPoint, {
        status: data.status,
        comentarios: data.comentarios,
      });
      return response.data;
    } catch (error) {
      console.error("Error al actualizar denuncia:", error);
      throw error;
    }
  },

  checkAuth: () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) return false;

      // Verificamos si el token está expirado
      const tokenData = JSON.parse(atob(token.split(".")[1]));
      const expirationDate = new Date(tokenData.exp * 1000);

      if (expirationDate <= new Date()) {
        setAuthToken(null);
        return false;
      }

      setAuthToken(token);
      return true;
    } catch (error) {
      console.error("Error al verificar autenticación:", error);
      setAuthToken(null);
      return false;
    }
  },

  logout: () => {
    setAuthToken(null);
  },
};

const reinitializeAuth = () => {
  const token = localStorage.getItem("adminToken");
  if (token) {
    return setAuthToken(token);
  }
  return false;
};

// LLamada de inicialización
reinitializeAuth();

export default adminService;
