import axios from "axios";

const API_URL = "http://localhost:7070/api/public";

// Creamos una instancia de axios con configuración base
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para manejar errores de manera consistente
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Transformamos los errores para proporcionar información más útil
    return Promise.reject({
      success: 0,
      message: error.response?.data?.message || "Error en el servidor",
      status: error.response?.status,
    });
  }
);

const publicService = {
  // Función para enviar una denuncia con identificación
  sendComplaint: async (formData) => {
    try {
      const response = await apiClient.post("/complaints", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      // Registro detallado de la respuesta para diagnóstico
      console.log('Respuesta completa del servidor:', {
        status: response.status,
        data: response.data,
        keys: Object.keys(response.data)
      });
  
      // Manejo flexible de la respuesta
      if (
        response.status !== 200 || 
        !response.data.message.includes('exitosamente') ||
        !response.data.ticket
      ) {
        throw new Error("Respuesta inesperada del servidor");
      }
  
      // Devolver información relevante
      return {
        ticket: response.data.ticket,
        message: response.data.message,
        id: response.data.id
      };
    } catch (error) {
      console.error("Detalles completos del error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
  
      throw error;
    }
  },

  // Función para enviar una denuncia anónima
  sendAnonyComplaint: async (anonyData) => {
    try {
      const response = await apiClient.post("/anony-complaints", anonyData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      // Registro detallado de la respuesta para diagnóstico
      console.log('Respuesta del servidor:', response.data);
  
      // Manejo flexible de la respuesta
      if (
        response.data.success !== 1 && 
        !response.data.ticket && 
        !response.data.message.includes('creada exitosamente')
      ) {
        throw new Error(response.data.message || "Error al enviar la denuncia anónima");
      }
  
      // Si el mensaje indica creación exitosa, devolver la información relevante
      return {
        ticket: response.data.ticket || response.data.message.match(/([a-f0-9-]{36})/)[1],
        message: response.data.message
      };
    } catch (error) {
      console.error("Error al enviar la denuncia anónima:", error);
      
      // Log de error más detallado
      if (error.response) {
        console.error('Detalles del error del servidor:', error.response.data);
        console.error('Código de estado:', error.response.status);
      }
  
      throw error;
    }
  },

  getComplaintByTicket: async (ticket, password, type = "identified") => {
    try {
      console.log(`Intentando obtener denuncia:
        - Tipo: ${type}
        - Ticket: ${ticket}
        - Tipo de password: ${typeof password}
      `);

      // Validamos los datos de entrada
      if (!ticket || !password) {
        throw new Error("El ticket y la contraseña son obligatorios");
      }

      // Seleccionamos el endpoint correcto según el tipo de denuncia
      const endpoint =
        type === "anonymous"
          ? "/anony-complaints/ticket"
          : "/complaints/ticket";

      console.log(`Endpoint seleccionado: ${endpoint}`);

      const response = await apiClient.post(endpoint, {
        ticket,
        password,
      });

      console.log("Respuesta del servidor:", response.data);

      // MODIFICACIÓN CLAVE: Adaptamos la lógica para manejar el array
      const complaint = Array.isArray(response.data)
        ? response.data[0] // Tomamos el primer elemento si es un array
        : response.data.complaint || response.data; // O usamos complaint o todo el objeto

      if (!complaint) {
        throw new Error(`No se encontró la denuncia ${type}`);
      }

      return complaint;
    } catch (error) {
      console.error(`Error detallado al obtener denuncia ${type}:`, error);

      // Si es un error de axios, mostramos más detalles
      if (error.response) {
        console.error("Detalles del error del servidor:", error.response.data);
        console.error("Código de estado:", error.response.status);
      }

      throw error;
    }
  },
  // Función para actualizar una denuncia
  updateComplaint: async (id, data, type = "identified") => {
    try {
      const endpoint =
        type === "anonymous" ? `/anony-complaints/${id}` : `/complaints/${id}`;

      const response = await apiClient.put(endpoint, data);

      // Validamos la respuesta
      if (response.data.success !== 1) {
        throw new Error(
          response.data.message || "Error al actualizar la denuncia"
        );
      }

      return response.data;
    } catch (error) {
      console.error(`Error al actualizar denuncia ${type}:`, error);
      throw error;
    }
  },

  // Función para eliminar una denuncia
  deleteComplaint: async (id, type = "identified") => {
    try {
      const endpoint =
        type === "anonymous" ? `/anony-complaints/${id}` : `/complaints/${id}`;

      const response = await apiClient.delete(endpoint);

      // Validamos la respuesta
      if (response.data.success !== 1) {
        throw new Error(
          response.data.message || "Error al eliminar la denuncia"
        );
      }

      return response.data;
    } catch (error) {
      console.error(`Error al eliminar denuncia ${type}:`, error);
      throw error;
    }
  },
};

export default publicService;
