import axios from "axios";

const API_URL = "http://localhost:7070";

// Configuracion de jwt
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

// Funcion para iniciar sesion y las llamadas a la api
const adminService = {
  login: async (username, password) => {
    try {
      const response = await axios.post(`${API_URL}/admin/login`, {
        username,
        password,
      });
      // Verificar success antes de proceder
      if (response.data.success === 1 && response.data.token) {
        localStorage.setItem("adminToken", response.data.token);
        setAuthToken(response.data.token);
        return response.data;
      } else {
        throw new Error(
          response.data.message || "Error en el inicio de sesión"
        );
      }
    } catch (error) {
      console.error("Error al iniciar sesion", error);
      throw error.response?.data || { message: "Error en el servidor" };
    }
  },

  //Obtener todas las denuncias
  getAllComplaints: async () => {
    try {
      const [complaints, anonyComplaints] = await Promise.all([
        axios.get(`${API_URL}/complaints`),
        axios.get(`${API_URL}/anony-complaints`),
      ]);
      //Combinar las denuncias con identificacion y anonimas
      const complaintsData = complaints.data.map((c) => ({
        ...c,
        type: "identified",
      }));
      const anonyComplaintsData = anonyComplaints.data.map((c) => ({
        ...c,
        type: "anonymous",
      }));
      return [...complaintsData, ...anonyComplaintsData];
    } catch (error) {
      throw (
        error.response?.data || { message: "Error al cargar las denuncias" }
      );
    }
  },

  //Actualizar el estado y comentarios de una denuncia

  updateComplaintStatus: async (id, type, data) => {
    try {
      const endPoint =
        type === "identified"
          ? `/admin/complaints/${id}`
          : `/admin/anony-complaints/${id}`;

      const response = await axios.put(`${API_URL}${endPoint}`, {
        status: data.status,
        comments: data.comments,
      });
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || { message: "Error al actualizar la denuncia" }
      );
    }
  },

  //Verificar si el token del administrador esta presente
  checkAuth: () => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      setAuthToken(token);
      return true;
    }
    return false;
  },

  //Cerrar sesion del administrador
  logout: () => {
    localStorage.removeItem("adminToken");
    setAuthToken(null);
  },
};

export default adminService;
