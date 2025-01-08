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

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setAnonyData({
      ...anonyData,
      [name]: name === "imagenes" ? files[0] : value,
    });
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
      document.getElementById("imagenes").value = null;
    } catch (error) {
      console.error("Error al enviar la denuncia:", error);
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
          id="imagenes"
          onChange={handleChange}
          className="w-full p-2 border rounded shadow-md"
        />
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
        <div className="mt-4">
          <h3 className="text-xl">
            Código de seguimiento para tu denuncia, copialo para poder consultar{" "}
            <br />
            posteriormente el estado de tu denuncia, junto con la contraseña
            elegida.
          </h3>
          <p className="mt-2 p-4 bg-green-300 border rounded inline-block">
            {ticket}
          </p>
        </div>
      )}
    </div>
  );
};
export default AnonyComplaintForm;
