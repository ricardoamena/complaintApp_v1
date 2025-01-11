import React, { useState } from "react";
import { sendComplaint } from "../service/apiService.js";
import { Check, Copy } from "lucide-react";

const ComplaintForm = () => {
  const inicialState = {
    nombre: "",
    apellido: "",
    celular: "",
    titulo: "",
    descripcion: "",
    mail: "",
    imagenes: [],
    ticket: "",
    password: "",
  };

  const [formData, setFormData] = useState(inicialState);
  const [ticket, setTicket] = useState("");
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
      const newImages = [...formData.imagenes];
      Array.from(files).forEach((file) => {
        newPreviews.push(URL.createObjectURL(file));
        newImages.push(file);
      });
      setImagePreviews(newPreviews);
      setFormData({
        ...formData,
        imagenes: newImages,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const removeImage = (index) => {
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    const newImages = formData.imagenes.filter((_, i) => i !== index);
    setImagePreviews(newPreviews);
    setFormData({
      ...formData,
      imagenes: newImages,
    });
    if (newImages.length === 0) {
      document.getElementById("imagenes").value = null;
    }
  };

  const copyTicket = async () => {
    try {
      await navigator.clipboard.writeText(ticket);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Error al copiar el ticket:", err);
    }
  };

  const resetForm = () => {
    setFormData(inicialState);
    setImagePreviews([]);
    if (document.getElementById("imagenes")) {
      document.getElementById("imagenes").value = null;
    }
  };

  const handleStartNewComplaint = () => {
    resetForm();
    setTicket(null);
  };

  const validateForm = () => {
    if (!formData.nombre.trim()) {
      alert("Por favor, ingresa tu nombre");
      return false;
    }
    if (!formData.apellido.trim()) {
      alert("Por favor, ingresa tu apellido");
      return false;
    }
    if (!formData.celular.trim()) {
      alert("Por favor, ingresa tu número de celular");
      return false;
    }
    if (!formData.titulo.trim()) {
      alert("Por favor, ingresa un título");
      return false;
    }
    if (!formData.descripcion.trim()) {
      alert("Por favor, ingresa una descripción");
      return false;
    }
    if (!formData.mail.trim() || !/\S+@\S+\.\S+/.test(formData.mail)) {
      alert("Por favor, ingresa un correo electrónico válido");
      return false;
    }
    if (!formData.password.trim() || !/^\d{6}$/.test(formData.password)) {
      alert("Por favor, ingresa una contraseña de 6 dígitos numéricos");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setIsSubmitting(true);
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key !== "imagenes") {
        formDataToSend.append(key, formData[key]);
      }
    });

    formData.imagenes.forEach((image) => {
      formDataToSend.append("imagenes", image);
    });
    try {
      const response = await sendComplaint(formDataToSend);
      setTicket(response.ticket);
      resetForm();
    } catch (error) {
      console.error("Error al enviar la denuncia:", error);
      alert("Error al enviar la denuncia, intenta nuevamente, por favor");
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
      <h2 className="text-2xl mb-4 mt-4">Denuncia con identificación</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={formData.nombre}
          onChange={handleChange}
          className="w-full p-2 border rounded shadow-md"
        />
        <input
          type="text"
          name="apellido"
          placeholder="Apellido"
          value={formData.apellido}
          onChange={handleChange}
          className="w-full p-2 border rounded shadow-md"
        />
        <input
          type="text"
          name="celular"
          placeholder="Celular"
          value={formData.celular}
          onChange={handleChange}
          className="w-full p-2 border rounded shadow-md"
        />
        <input
          type="text"
          name="titulo"
          placeholder="Título"
          value={formData.titulo}
          onChange={handleChange}
          className="w-full p-2 border rounded shadow-md"
        />
        <textarea
          name="descripcion"
          placeholder="Descripción"
          value={formData.descripcion}
          onChange={handleChange}
          className="w-full p-2 border rounded shadow-md"
          rows="4"
        />
        <input
          type="email"
          name="mail"
          placeholder="Correo Electrónico"
          value={formData.mail}
          onChange={handleChange}
          className="w-full p-2 border rounded shadow-md"
        />
        <div>
          <input
            type="file"
            name="imagenes"
            id="imagenes"
            onChange={handleChange}
            className="w-full p-2 border rounded shadow-md"
            multiple
            accept="image/*"
          />
          <p className="text-sm text-gray-600 mt-1">
            Puedes seleccionar hasta 2 imágenes
          </p>
        </div>
        <div className="flex gap-4 flex-wrap">
          {imagePreviews.map((image, index) => (
            <div key={index} className="relative">
              <img
                src={image}
                alt={`Preview ${index + 1}`}
                className="h-32 w-32 rounded border object-cover"
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
          value={formData.password}
          onChange={handleChange}
          className="w-full p-2 border rounded shadow-md"
        />
        <p className="text-gray-600 text-sm">
          Usa una contraseña a elección, junto al código del ticket para poder
          consultar sobre el estado de tu denuncia ingresando a la sección de
          Consulta de Denuncias.
        </p>
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

export default ComplaintForm;
