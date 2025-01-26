import React, { useState } from "react";
import publicService from "../service/apiService.js";
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

  //AnonyComplaint hacemos validaciones generales, en ComplaintForm hacemos validaciones específicas
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

    // Añadir todos los campos del formulario
    Object.keys(formData).forEach((key) => {
      if (key !== "imagenes" && formData[key]) {
        formDataToSend.append(key, formData[key]);
      }
    });

    // Añadir imágenes
    formData.imagenes.forEach((image) => {
      formDataToSend.append("imagenes", image);
    });

    try {
      const response = await publicService.sendComplaint(formDataToSend);

      // Establecer ticket recibido
      setTicket(response.ticket);

      // Resetear formulario
      resetForm();
    } catch (error) {
      console.error("Error al enviar la denuncia:", error);

      // Mensaje de error más descriptivo
      alert(
        error.message ||
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
                  Guarda tu código de ticket y contraseña. Podrás consultar el
                  estado de tu denuncia en cualquier momento.
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
    <div className="h-screen bg-gray-100 flex items-center justify-center p-4 overflow-auto">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Denuncia con Identificación
        </h2>

        <div className="h-1 w-full bg-blue-500 mb-6"></div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Nombre</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tu nombre"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Apellido</label>
              <input
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tu apellido"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Celular</label>
            <input
              type="text"
              name="celular"
              value={formData.celular}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Número de contacto"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Título</label>
            <input
              type="text"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Título de la denuncia"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Descripción</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe los detalles de tu denuncia"
              rows="4"
              required
            ></textarea>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">
              Correo Electrónico
            </label>
            <input
              type="email"
              name="mail"
              value={formData.mail}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tu correo electrónico"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">
              Imágenes de Evidencia
            </label>
            <input
              type="file"
              name="imagenes"
              id="imagenes"
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
              value={formData.password}
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

export default ComplaintForm;
