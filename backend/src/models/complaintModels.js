const conexion = require("../config/db");

const Complaint = {
  create: (data, callback) => {
    const imagenes = Array.isArray(data.imagenes)
      ? data.imagenes.join(",")
      : data.imagenes;
    const query =
      "INSERT INTO denuncia (nombre, apellido, celular, titulo, descripcion, mail, imagenes, ticket, password, date, status, comentarios) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)";
    conexion.query(
      query,
      [
        data.nombre,
        data.apellido || null,
        data.celular || null,
        data.titulo || null,
        data.descripcion || null,
        data.mail,
        imagenes || null,
        data.ticket,
        data.password,
        new Date(),
        data.status || "Pendiente",
        data.comentarios || "",
      ],
      callback
    );
  },

  getByTicket: (ticket, password, callback) => {
    const query = "SELECT * FROM denuncia WHERE ticket = ? AND password = ?";
    console.log("Ejecutando consulta:", {
      consulta: query,
      parametros: [ticket, "***oculta***"],
    });
    conexion.query(query, [ticket, password], (err, results) => {
      if (err) {
        console.error("Error en la consulta:", err);
        return callback(err);
      }
      console.log("Resultados de la consulta:", results);
      callback(null, results);
    });
  },

  getAll: (callback) => {
    const query = "SELECT * FROM denuncia";
    conexion.query(query, callback);
  },

  getOne: (id, callback) => {
    const query = "SELECT * FROM denuncia WHERE id = ?";
    conexion.query(query, [id], callback);
  },

  updateClient: (id, data, ticket, password, callback) => {
    // Verificar ticket y password antes de actualizar
    const verifyQuery =
      "SELECT * FROM denuncia WHERE id = ? AND ticket = ? AND password = ?";
    conexion.query(verifyQuery, [id, ticket, password], (err, results) => {
      if (err) return callback(err);
      if (results.length === 0)
        return callback(new Error("Ticket o contraseña incorrectos"));

      // Si la verificación es exitosa, proceder con la actualización
      const updateQuery =
        "UPDATE denuncia SET nombre = ?, apellido = ?, celular = ?, titulo = ?, descripcion = ?, mail = ?, imagenes = ? WHERE id = ?";
      conexion.query(
        updateQuery,
        [
          data.nombre,
          data.apellido || null,
          data.celular || null,
          data.titulo || null,
          data.descripcion || null,
          data.mail,
          data.imagenes || null,
          id,
        ],
        callback
      );
    });
  },

  update: (id, data, callback) => {
    const query =
      "UPDATE denuncia SET nombre = ?, apellido = ?, celular = ?, titulo = ?, descripcion = ?, mail = ?, imagenes = ?, status = ?, comentarios = ? WHERE id = ?";
    conexion.query(
      query,
      [
        data.nombre,
        data.apellido || null,
        data.celular || null,
        data.titulo || null,
        data.descripcion || null,
        data.mail,
        data.imagenes || null,
        data.status || "Pendiente",
        data.comentario || "",
        id,
      ],
      callback
    );
  },

  deleteClient: (id, ticket, password, callback) => {
    // Verificar ticket y password antes de eliminar
    const verifyQuery =
      "SELECT * FROM denuncia WHERE id = ? AND ticket = ? AND password = ?";
    conexion.query(verifyQuery, [id, ticket, password], (err, results) => {
      if (err) return callback(err);
      if (results.length === 0)
        return callback(new Error("Ticket o contraseña incorrectos"));

      // Si la verificación es exitosa, proceder con la eliminación
      const deleteQuery = "DELETE FROM denuncia WHERE id = ?";
      conexion.query(deleteQuery, [id], callback);
    });
  },

  delete: (id, callback) => {
    const query = "DELETE FROM denuncia WHERE id = ?";
    conexion.query(query, [id], callback);
  },
};

module.exports = Complaint;
