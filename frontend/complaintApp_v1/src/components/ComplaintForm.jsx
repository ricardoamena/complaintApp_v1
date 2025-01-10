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

  const [ticket, setTicket] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "imagenes" && files.length > 0) {
      const file = files[0];
      setImagePreview(URL.createObjectURL(file));
      setFormData({
        ...formData,
        [name]: name === "imagenes" ? files[0] : value,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
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
      setTicket(response.ticket);
      setFormData({
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
      setImagePreview(null);
      document.getElementById("imagenes").value = null;
      response.ticket &&
        alert(
          "Denuncia enviada exitosamente. Guarda por favor tu ticket de seguimiento."
        );
    } catch (error) {
      console.error("Error al enviar la denuncia:", error);
      alert("Error al enviar la denuncia, intenta nuevamente, por favor");
    }
  };

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
          placeholder="Titulo"
          value={formData.titulo}
          onChange={handleChange}
          className="w-full p-2 border rounded shadow-md"
        />
        <textarea
          name="descripcion"
          id="descripcion"
          placeholder="Descripción"
          value={formData.descripcion}
          onChange={handleChange}
          className="w-full p-2 border rounded shadow-md"
        ></textarea>
        <input
          type="email"
          name="mail"
          placeholder="Correo Electrónico"
          value={formData.mail}
          onChange={handleChange}
          className="w-full p-2 border rounded shadow-md"
        />
        <input
          type="file"
          name="imagenes"
          id="imagenes"
          onChange={handleChange}
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

        <input
          type="password"
          name="password"
          placeholder="Contraseña - 6 dígitos numéricos"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-2 border rounded shadow-md"
        />
        <p className="text-gray-600 text-sm">
          Usa una contraseña a elección, junto al codigo del ticket para poder
          consultar sobre el estado de tu denuncia ingresando a la sección de
          Consulta de Denuncias.
        </p>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Enviar Denuncia
        </button>
      </form>
      {ticket && (
        <div className="mt-4 p-4 bg-blue-100 border rounded">
          <h3 className="text-xl font-medium mb-2">
            Código de seguimiento para tu denuncia:
          </h3>
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

export default ComplaintForm;
