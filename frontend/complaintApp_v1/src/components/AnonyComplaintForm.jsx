import React, { useState } from "react";
import { sendAnonyComplaint } from "../service/apiService.js";

const AnonyComplaintForm = () => {
  const [anonyData, setAnonyData] = useState({
    titulo: "",
    descripcion: "",
    imagenes: null,
    password: "",
  });

  const [ticket, setTicket] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "imagenes" && files.length > 0) {
      const file = files[0];
      setImagePreview(URL.createObjectURL(file));
      setAnonyData({
        ...anonyData,
        imagenes: file,
      });
    } else {
      setAnonyData({
        ...anonyData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const anonyDataToSend = new FormData();
    for (const key in anonyData) {
      anonyDataToSend.append(key, anonyData[key]);
    }
    try {
      const response = await sendAnonyComplaint(anonyDataToSend);
      console.log("Denuncia enviada exitosamente:", response);
      setTicket(response.ticket);
      setAnonyData({
        titulo: "",
        descripcion: "",
        imagenes: null,
        password: "",
      });
      setImagePreview(null);
      document.getElementById("imagenes-anony").value = null;
      response.ticket &&
        alert(
          "Denuncia enviada exitosamente. Guarda por favor tu ticket de seguimiento."
        );
    } catch (error) {
      console.error("Error al enviar la denuncia:", error);
      alert("Error al enviar la denuncia, por favor intenta nuevamente.");
    }
  };

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
        />
        {imagePreview && (
          <div className="mt-2">
            <img
              src={imagePreview}
              alt="Previsualización de la imagen"
              className="h-32 w-32 rounded border font-mono object-cover"
            />
          </div>
        )}
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
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 shadow-md"
        >
          Enviar Denuncia
        </button>
      </form>
      {ticket && (
        <div className="mt-4 p-4 bg-blue-100 border rounded">
          <h3 className="text-xl font-medium mb-2"></h3>
          Código de seguimiento para tu denuncia:
          <p className="text-gray-600 mb-2">
            Copialo para poder consultar posteriormente el estado de tu
            denuncia, junto con la contraseña elegida.
          </p>
          <p className="p-4 bg-green-300 border rounded inline-block font-mono text-lg">
            {ticket}
          </p>
        </div>
      )}
    </div>
  );
};
export default AnonyComplaintForm;
