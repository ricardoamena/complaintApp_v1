import React, { useState } from "react";
import { sendComplaint } from "../service/apiService.js";

const ComplaintForm = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    celular: "",
    titulo: "",
    descripcion: "",
    mail: "",
    imagenes: null,
    ticket: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: name === "imagenes" ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    try {
      const response = await sendComplaint(formDataToSend);
      console.log("Denuncia enviada exitosamente:", response);
      // Aquí puedes manejar la respuesta, como mostrar un mensaje de éxito
    } catch (error) {
      console.error("Error al enviar la denuncia:", error);
      // Aquí puedes manejar el error, como mostrar un mensaje de error
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl mb-4 mt-4">Denuncia con identificación</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={formData.nombre}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="apellido"
          placeholder="Apellido"
          value={formData.apellido}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="celular"
          placeholder="Celular"
          value={formData.celular}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="titulo"
          placeholder="Titulo"
          value={formData.titulo}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <textarea
          name="descripcion"
          id="descripcion"
          placeholder="Descripción"
          onChange={handleChange}
          className="w-full p-2 border rounded"
        ></textarea>
        <input
          type="email"
          name="mail"
          placeholder="Correo Electrónico"
          value={formData.mail}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="file"
          name="imagenes"
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="ticket"
          placeholder="Ticket"
          value={formData.ticket}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña - 6 dígitos numéricos"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <p>
          Usa una contraseña a elección, junto al codigo del ticket para poder
          luego consultar sobre el estado de tu denuncia ingresando a la sección
          de Consulta de Denuncias.
        </p>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Enviar Denuncia
        </button>
      </form>
    </div>
  );
};

export default ComplaintForm;
