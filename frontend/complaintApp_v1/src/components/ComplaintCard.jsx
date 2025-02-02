import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import ImageModal from "./ImageModal";

const BASE_URL = "http://localhost:7070/uploads/";

// Componente para mostrar una tarjeta de denuncia individual
const ComplaintCard = ({ complaint, onStatusUpdate }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [comentarios, setComentarios] = useState(complaint.comentarios || "");
  const [selectedImage, setSelectedImage] = useState(null);
  const [status, setStatus] = useState(complaint.status);
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    if (complaint.imagenes) {
      console.log("Imágenes recibidas:", complaint.imagenes);
  
      let imagePaths = [];
      if (typeof complaint.imagenes === "string") {
        imagePaths = complaint.imagenes
          .split(",")
          .map((img) => img.trim())
          .filter(Boolean)
          .map((img) => {
            // Limpiamos la ruta y el nombre del archivo
            const cleanPath = img.replace("src/uploads/", "").replace(/\s+/g, '-');
            return cleanPath;
          });
      } else if (Array.isArray(complaint.imagenes)) {
        imagePaths = complaint.imagenes
          .filter(Boolean)
          .map((img) => img.replace("src/uploads/", "").replace(/\s+/g, '-'));
      }
  
      const imageUrls = imagePaths.map((path) => {
        // Aseguramos que la ruta esté correctamente codificada
        const encodedPath = encodeURIComponent(path.replace(/\\/g, '/'));
        return `${BASE_URL}${encodedPath}`;
      });
  
      console.log("URLs de imágenes generadas:", imageUrls);
      setImagePreviews(imageUrls);
    }
  }, [complaint.imagenes]);


  const handleUpdate = async (e) => {
    e.preventDefault();
    await onStatusUpdate(complaint, status, comentarios);
    setIsEditing(false);
  };

  const handleImageClick = (imageUrl) => {
    console.log("Imagen clickeada:", imageUrl); 
    setSelectedImage(imageUrl);
  };
  console.log("Estado de selectedImage:", selectedImage);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">
            {complaint.titulo || "Sin título"}
          </h2>
          <p className="text-sm text-gray-500 font-bold">
            Tipo: {complaint.type === "identified" ? "Identificada" : "Anónima"}
          </p>
          <p className="text-sm text-gray-500">Ticket: {complaint.ticket}</p>
        </div>
        <div className="flex items-center">
          <span
            className={`px-2 py-1 rounded text-sm ${
              complaint.status === "Resuelto"
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {complaint.status}
          </span>
        </div>
      </div>

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-blue-500 hover:bg-blue-600 mb-4 p-2 rounded-md"
      >
        {isExpanded ? "Ver menos" : "Ver más"}
      </button>

      {isExpanded && (
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Descripción:</h3>
            <p className="text-gray-700">{complaint.descripcion}</p>
          </div>

          {complaint.type === "identified" && (
            <div>
              <h3 className="font-semibold mb-2">Datos de contacto:</h3>
              <p>
                Nombre: {complaint.nombre} {complaint.apellido}
              </p>
              <p>Email: {complaint.email}</p>
              <p>Teléfono: {complaint.telefono}</p>
            </div>
          )}

          {imagePreviews.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Imágenes adjuntas:</h3>
              <div className="grid grid-cols-2 gap-4">
                {imagePreviews.map((imageUrl, index) => (
                  <div key={index} className="cursor-pointer relative group">
                    <img
                      src={imageUrl}
                      alt={`Evidencia ${index + 1}`}
                      className="w-full h-48 object-cover rounded transition-all duration-300 group-hover:opacity-90"
                      onClick={() => handleImageClick(imageUrl)}
                      onError={(e) => {
                        console.error("Error cargando imagen:", imageUrl);
                        console.log("Ruta completa:", e.target.src);
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="bg-black bg-opacity-50 text-white px-3 py-1 rounded">
                        Click para ampliar
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              {selectedImage && (
                <ImageModal
                  imageUrl={selectedImage}
                  onClose={() => setSelectedImage(null)}
                />
              )}
            </div>
          )}
          {complaint.comentarios && (
            <div>
              <h3 className="font-semibold mb-2">Comentarios:</h3>
              <p className="text-gray-700">{complaint.comentarios}</p>
            </div>
          )}

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Actualizar Estado
            </button>
          ) : (
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Estado:
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="Resuelto">Resuelto</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Comentarios:
                </label>
                <textarea
                  value={comentarios}
                  onChange={(e) => setComentarios(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  rows="3"
                ></textarea>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Guardar
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

// Validación de props
ComplaintCard.propTypes = {
  complaint: PropTypes.shape({
    id: PropTypes.number.isRequired,
    ticket: PropTypes.string.isRequired,
    titulo: PropTypes.string,
    descripcion: PropTypes.string.isRequired,
    nombre: PropTypes.string,
    apellido: PropTypes.string,
    email: PropTypes.string,
    telefono: PropTypes.string,
    imagenes: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    status: PropTypes.string,
    comentarios: PropTypes.string,
    type: PropTypes.oneOf(["identified", "anonymous"]).isRequired,
  }).isRequired,
  onStatusUpdate: PropTypes.func.isRequired,
};

export default ComplaintCard;
