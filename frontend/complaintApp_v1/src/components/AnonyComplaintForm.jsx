import React, { useState } from "react";
import { sendAnonyComplaint } from "../service/apiService.js";
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
      const response = await sendAnonyComplaint(formDataToSend);
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
      <div className="container mx-auto p-4 shadow-md">
        <div className="bg-blue-100 border rounded p-6 shadow-lg max-w-2xl mx-auto">
          <h3 className="text-xl font-medium mb-4">
            ¡Denuncia enviada exitosamente!
          </h3>
          <p className="mb-2">Código de seguimiento para tu denuncia:</p>
          <div className="flex items-center gap-2 mb-4">
            <span className="p-4 bg-green-300 border rounded font-mono text-lg">
              {ticket}
            </span>
            <button
              onClick={copyTicket}
              className={`p-3 rounded-full transition-colors ${
                isCopied ? "bg-green-500" : "bg-gray-200 hover:bg-gray-300"
              }`}
              title="Copiar código"
            >
              {isCopied ? (
                <Check className="w-5 h-5 text-white" />
              ) : (
                <Copy className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
          <p className="text-gray-600 mb-4">
            Guarda este código y tu contraseña para consultar posteriormente el
            estado de tu denuncia.
          </p>
          <button
            onClick={handleStartNewComplaint}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Realizar nueva denuncia
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 shadow-md">
      <h2 className="text-2xl mb-4 mt-4">Ingresa tu Denuncia Anónima</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="titulo"
          placeholder="Título"
          value={anonyData.titulo}
          onChange={handleChange}
          className="w-full p-2 rounded border shadow-md"
        />
        <textarea
          name="descripcion"
          id="descripcion"
          placeholder="Descripcion"
          value={anonyData.descripcion}
          onChange={handleChange}
          className="w-full p-2 border rounded shadow-md"
        ></textarea>
        <input
          type="file"
          name="imagenes"
          id="imagenes-anony"
          onChange={handleChange}
          className="w-full p-2 border rounded shadow-md"
          multiple
          accept="image/*"
        />
        <p className="text-sm text-gray-600">
          Puedes seleccionar hasta 2 imágenes
        </p>
        <div className="flex gap-4 flex-wrap">
          {imagePreviews.map((image, index) => (
            <div className="relative" key={index}>
              <img
                src={image}
                alt={`Preview ${index + 1}`}
                className="h-32 w-32 rounded border font-mono object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <input
          type="password"
          name="password"
          placeholder="Contraseña - 6 dígitos numéricos"
          value={anonyData.password}
          onChange={handleChange}
          className="w-full p-2 border rounded shadow-md"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className={`py-2 px-4 rounded transition-colors ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          } text-white`}
        >
          {isSubmitting ? "Enviando..." : "Enviar Denuncia"}
        </button>
      </form>
    </div>
  );
};
export default AnonyComplaintForm;
