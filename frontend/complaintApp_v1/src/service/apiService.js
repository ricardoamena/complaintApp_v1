import axios from 'axios';

const API_URL = "http://localhost:7070";


// Función para enviar una denuncia con identificación
export const sendComplaint = async (formData) => {
    try {
        const response = await axios.post(`${API_URL}/denuncias`, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            },
        });
        return response.data;
    }   catch (error) {
        console.error("Error al enviar la denuncia", error);
        throw error;
    }
};



// Función para enviar una denuncia anónima

export const sendAnonyComplaint = async (anonyData) => {
    try {
        const response = await axios.post(`${API_URL}/denuncias-anonimas`, anonyData, {
            headers: {
                "Content-Type": "multipart/form-data"
            },
        });
        return response.data;
    }   catch (error) {
        console.error("Error al enviar la denuncia anónima", error);
        throw error;
    }
};