import React, { useState } from "react";
import publicService from "../service/apiService.js";
import { Check, Copy } from "lucide-react";

const AnonyComplaintForm = () => {
  const initialState = {
    titulo: "",
    descripcion: "",
    imagenes: [],
    password: "",
  };

  const [anonyData, setAnonyData] = useState(initialState);
  const [ticket, setTicket] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isCopied, setIsCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "imagenes" && files.length > 0) {
      if (imagePreviews.length + files.length > 2) {
        alert("Solo puedes subir hasta 2 imágenes");
        return;
      }
      const newPreviews = [...imagePreviews];
      const newImages = [...anonyData.imagenes];
      Array.from(files).forEach((file) => {
        if (file.size > 2 * 1024 * 1024) {
          alert(`El archivo ${file.name} es demasiado grande. Máximo 5MB`);
          return;
        }
        if (!file.type.startsWith('image/')) {
          alert(`El archivo ${file.name} no es una imagen válida`);
          return;
        }
        newPreviews.push(URL.createObjectURL(file));
        newImages.push(file);
      });
      setImagePreviews(newPreviews);
      setAnonyData({
        ...anonyData,
        imagenes: newImages,
      });
    } else {
      setAnonyData({
        ...anonyData,
        [name]: value,
      });
    }
  };

  const removeImage = (index) => {
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    const newImages = anonyData.imagenes.filter((_, i) => i !== index);
    setImagePreviews(newPreviews);
    setAnonyData({
      ...anonyData,
      imagenes: newImages,
    });
    if (newImages.length === 0) {
      document.getElementById("imagenes-anony").value = null;
    }
  };

  const copyTicket = async () => {
    try {
      await navigator.clipboard.writeText(ticket);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Error al copiar:", err);
    }
  };

  const resetForm = () => {
    setAnonyData(initialState);
    setImagePreviews([]);
    if (document.getElementById("imagenes-anony")) {
      document.getElementById("imagenes-anony").value = null;
    }
  };

  const handleStartNewComplaint = () => {
    resetForm();
    setTicket(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!anonyData.titulo.trim()) {
      alert("Por favor, ingresa un título");
      return;
    }
    if (!anonyData.descripcion.trim()) {
      alert("Por favor, ingresa una descripción");
      return;
    }
    if (!anonyData.password.trim() || !/^\d{6}$/.test(anonyData.password)) {
      alert("Por favor, ingresa una contraseña de 6 dígitos numéricos");
      return;
    }

    setIsSubmitting(true);

    const formDataToSend = new FormData();
    Object.keys(anonyData).forEach((key) => {
      if (key !== "imagenes") {
        formDataToSend.append(key, anonyData[key]);
      }
    });

    anonyData.imagenes.forEach((image) => {
      formDataToSend.append("imagenes", image);
    });

    try {
      const response = await publicService.sendAnonyComplaint(formDataToSend);
      setTicket(response.ticket);
      resetForm();
    } catch (error) {
      console.error("Error al enviar la denuncia:", error);
      alert(
        "Hubo un error al enviar la denuncia. Por favor, intenta nuevamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (ticket) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
          <div className="text-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-16 w-16 mx-auto mb-6 text-green-500"
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
  
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              ¡Denuncia Enviada Exitosamente!
            </h2>
  
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
              <p className="text-blue-700">
                Código de seguimiento para tu denuncia:
              </p>
              <div className="flex items-center justify-center gap-4 mt-2">
                <span className="text-xl font-mono bg-blue-100 px-4 py-2 rounded-lg tracking-widest">
                  {ticket}
                </span>
                
                <button
                  onClick={copyTicket}
                  className={`p-2 rounded-full transition-colors ${
                    isCopied 
                      ? "bg-green-500 text-white" 
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                  title="Copiar código"
                >
                  {isCopied ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
  
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-2">
                  ¿Qué hacer a continuación?
                </h3>
                <p className="text-sm text-gray-600">
                  Guarda tu código de ticket y contraseña. 
                  Podrás consultar el estado de tu denuncia en cualquier momento.
                </p>
              </div>
  
              <button
                onClick={handleStartNewComplaint}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" 
                    clipRule="evenodd" 
                  />
                </svg>
                Realizar Nueva Denuncia
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Denuncia Anónima
        </h2>
  
        <div className="h-1 w-full bg-blue-500 mb-6"></div>
  
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Título</label>
            <input
              type="text"
              name="titulo"
              value={anonyData.titulo}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ingresa un título"
              required
            />
          </div>
  
          <div>
            <label className="block text-gray-700 mb-2">Descripción</label>
            <textarea
              name="descripcion"
              value={anonyData.descripcion}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe los detalles de tu denuncia"
              rows="4"
              required
            ></textarea>
          </div>
  
          <div>
            <label className="block text-gray-700 mb-2">Imágenes de Evidencia</label>
            <input
              type="file"
              name="imagenes"
              id="imagenes-anony"
              onChange={handleChange}
              multiple
              accept="image/*"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-sm text-gray-600 mt-2">
              Puedes subir hasta 2 imágenes (máximo 5MB cada una)
            </p>
          </div>
  
          {imagePreviews.length > 0 && (
            <div className="flex gap-4 flex-wrap">
              {imagePreviews.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`Vista previa ${index + 1}`}
                    className="h-32 w-32 rounded-lg border object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
  
          <div>
            <label className="block text-gray-700 mb-2">Contraseña</label>
            <input
              type="password"
              name="password"
              value={anonyData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="6 dígitos numéricos"
              required
            />
            <p className="text-sm text-gray-600 mt-2">
              Usa una contraseña de 6 dígitos para consultar tu denuncia
            </p>
          </div>
  
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 rounded-lg transition-colors ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {isSubmitting ? "Enviando..." : "Enviar Denuncia"}
          </button>
        </form>
      </div>
    </div>
  );

};

export default AnonyComplaintForm;
