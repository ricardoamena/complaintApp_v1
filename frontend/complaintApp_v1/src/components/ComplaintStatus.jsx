import React, { useState } from "react";
import publicService from "../service/apiService.js";

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await publicService.getComplaintByTicket(
        formData.ticket,
        formData.password,
        complaintType
      );

      setComplaint(response);

      //Previsualización de imágenes
      if (response.imagenes) {
        // Log exhaustivo para diagnóstico
        console.log("Objeto de imágenes recibido:", response.imagenes);
        console.log("Tipo de imagenes:", typeof response.imagenes);

        // Manejo flexible de diferentes formatos
        let imagePaths = [];
        if (typeof response.imagenes === "string") {
          imagePaths = response.imagenes
            .split(",")
            .map((img) => img.trim())
            .filter(Boolean); // Eliminar strings vacíos
        } else if (Array.isArray(response.imagenes)) {
          imagePaths = response.imagenes
            .filter(Boolean)
            .map((img) => img.trim());
        }

        console.log("Rutas de imágenes procesadas:", imagePaths);

        if (imagePaths.length > 0) {
          // Limpieza adicional del nombre de archivo
          const cleanImagePath = imagePaths[0]
            .replace("src/uploads/", "") // Eliminar prefijos si existen
            .replace(/\s+/g, "-"); // Reemplazar espacios

          const imageUrl = `http://localhost:7070/uploads/${encodeURIComponent(
            cleanImagePath
          )}`;

          console.log("URL de imagen generada:", imageUrl);
          setImagePreview(imageUrl);
          
        }
      }

      // Limpiar inputs
      setFormData({
        ticket: "",
        password: "",
      });
    } catch (error) {
      setError(error.message);
      setComplaint(null);
      setImagePreview(null);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Resuelto":
        return "bg-green-500";
      case "Pendiente":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Consulta de Denuncia
        </h2>

        {/* Tipo de Denuncia */}
        <div className="flex justify-center space-x-4 mb-6">
          {["identified", "anonymous"].map((type) => (
            <button
              key={type}
              onClick={() => setComplaintType(type)}
              className={`px-4 py-2 rounded-full transition-all duration-300 ${
                complaintType === type
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {type === "identified" ? "Con Identificación" : "Anónima"}
            </button>
          ))}
        </div>

        {/* Formulario de Consulta */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Código de Ticket</label>
            <input
              type="text"
              name="ticket"
              value={formData.ticket}
              onChange={(e) =>
                setFormData({ ...formData, ticket: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ingresa tu código de ticket"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Contraseña</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ingresa tu contraseña"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {isLoading ? "Consultando..." : "Consultar Estado"}
          </button>
        </form>

        {/* Mensajes de Error */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
            {error}
          </div>
        )}

        {/* Detalle de Denuncia */}
        {complaint && (
          <div className="mt-6 bg-gray-50 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Detalles de la Denuncia</h3>
              <span
                className={`px-3 py-1 rounded-full text-white ${getStatusColor(
                  complaint.status
                )}`}
              >
                {complaint.status}
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <strong>Título:</strong>
                <p>{complaint.titulo || "Sin título"}</p>
              </div>
              <div>
                <strong>Descripción:</strong>
                <p>{complaint.descripcion}</p>
              </div>

              {imagePreview && (
                <div className="mt-4">
                  <strong>Imagen Adjunta:</strong>
                  <img
                    src={imagePreview}
                    alt="Evidencia"
                    className="mt-2 rounded-lg max-h-64 w-full object-cover"
                    onError={(e) => {
                      console.error("Error al cargar imagen:", {
                        src: e.target.src,
                        error: e.type,
                      });
                      setImagePreview(null);
                    }}
                  />
                </div>
              )}
              <div>
                <strong>Comentarios:</strong>
                <p>{complaint.comentarios}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplaintStatus;
