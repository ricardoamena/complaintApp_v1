import axios from "axios";

const API_URL = "http://localhost:7070";

// Función para enviar una denuncia con identificación
export const sendComplaint = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/denuncias`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al enviar la denuncia", error);
    throw error;
  }
};

// Función para enviar una denuncia anónima

export const sendAnonyComplaint = async (anonyData) => {
  try {
    const response = await axios.post(
      `${API_URL}/denuncias-anonimas`,
      anonyData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al enviar la denuncia anónima", error);
    throw error;
  }
};

// Función para obtener una denuncia con identificación por ticket y contraseña
export const getComplaintByTicket = async (ticket, password) => {
  try {
    const response = await axios.post(`${API_URL}/denuncias/ticket`, {
      ticket,
      password,
    });

    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error("No se encontró la denuncia con ese ticket y contraseña");
    }
    throw new Error(
      error.response?.data?.message || "Error al obtener la denuncia"
    );
  }
};
