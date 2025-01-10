import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getComplaintByTicket } from "../service/apiService.js";

const ComplaintStatus = () => {
  const [complaintType, setComplaintType] = useState("identified");
  const [formData, setFormData] = useState({
    ticket: "",
    password: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [complaint, setComplaint] = useState(null);

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleTypeChange = (type) => {
    setComplaintType(type);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleComplaintChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "imagenes" && files.length > 0) {
      const file = files[0];
      setImagePreview(URL.createObjectURL(file));
      setComplaint({ ...complaint, [name]: file });
    } else {
      setComplaint({ ...complaint, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      if (!formData.ticket || !formData.password) {
        throw new Error("Por favor complete todos los campos");
      }
      console.log("Enviando datos:", formData);

      let response;
      if (complaintType === "identified") {
        response = await getComplaintByTicket(
          formData.ticket,
          formData.password
        );
        console.log("Respuesta de la API:", response);
      } else {
        response = await getAnonyComplaintByTicket(formData);
      }
      if (!response) {
        throw new Error("No se encontró la denuncia");
      }
      setComplaint(response);
      if (response.imagenes) {
        const imageUrl = `http://localhost:7070/uploads/${response.imagenes}`;
        console.log("URL de la imagen:", imageUrl);
        setImagePreview(imageUrl);
      }
    } catch (error) {
      setError(error.message || "Error al consultar la denuncia");
      setComplaint(null);
      setImagePreview(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    for (const key in complaint) {
      formDataToSend.append(key, complaint[key]);
    }
    try {
      if (complaintType === "identified") {
        await updateComplaint(formDataToSend);
      } else {
        await updateAnonyComplaint(formDataToSend);
      }
      alert("Denuncia actualizada exitosamente");
    } catch (error) {
      console.error("Error al actualizar la denuncia:", error);
    }
  };

  const handleDelete = async (e) => {
    try {
      if (complaintType === "identified") {
        await deleteComplaint(complaint.id);
      } else {
        await deleteAnonyComplaint(complaint.id);
      }
      alert("Denuncia eliminada exitosamente");
      navigate("/");
      setComplaint(null);
      setImagePreview(null);
    } catch (error) {
      console.error("Error al eliminar la denuncia:", error);
    }
  };

  return (
    <div className="container mx-auto p-4 shadow-md">
      <h2 className="text-2xl mb-4 mt-4">Consultar Estado de la Denuncia</h2>

      <p className="w-full text-xl">Selecciona la que corresponda:</p>
      <div className="mb-4 mt-4 space-x-4">
        <button
          className={`px-4 py-2 rounded ${
            complaintType === "identified"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-black"
          }`}
          onClick={() => handleTypeChange("identified")}
        >
          Denuncia con Identificación
        </button>
        <button
          className={`px-4 py-2 rounded ${
            complaintType === "anonymous"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-black"
          }`}
          onClick={() => handleTypeChange("anonymous")}
        >
          Denuncia Anónima
        </button>
      </div>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="ticket"
          placeholder="Código de Ticket"
          value={formData.ticket}
          onChange={handleChange}
          className="w-full p-2 border rounded shadow-md"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-2 border rounded shadow-md"
          required
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 shadow-md"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Consultando..." : "Consultar Estado"}
        </button>
      </form>
      {complaint && (
        <div className="mt-4">
          <h3 className="text-2xl">Detalle de la Denuncia:</h3>
          <form onSubmit={handleUpdate} className=" mt-4 space-y-4">
            <input
              type="text"
              name="titulo"
              placeholder="Título"
              value={complaint.titulo}
              onChange={handleComplaintChange}
              className="w-full p-2 border rounded shadow-md"
            />
            <textarea
              name="descripcion"
              placeholder="Descripción"
              value={complaint.descripcion}
              onChange={handleComplaintChange}
              className="w-full p-2 border rounded shadow-md"
            ></textarea>
            <input
              type="file"
              name="imagenes"
              onChange={handleComplaintChange}
              className="w-full p-2 border rounded shadow-md"
            />
            {imagePreview && (
              <div className="mt-2">
                <img
                  src={imagePreview}
                  alt="Previsualización de la imagen"
                  className="h-32 w-32 object-cover border rounded"
                />
              </div>
            )}
            <div className="w-full p-2 border rounded shadow-md">
              <h3 className="text-lg">
                Estado:
                <p className="inline-block p-2 border rounded bg-green-500">
                  {complaint.status}
                </p>
              </h3>
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                onClick={handleUpdate}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 shadow-md"
              >
                Actualizar Denuncia
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 shadow-md"
              >
                Eliminar Denuncia
              </button>
              <button
                type="button"
                onClick={() => navigate("/")}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 shadow-md"
              >
                Volver al Menú Principal
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ComplaintStatus;
