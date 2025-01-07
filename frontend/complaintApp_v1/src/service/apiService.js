import axios from 'axios';

const API_URL = "http://localhost:7070";

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