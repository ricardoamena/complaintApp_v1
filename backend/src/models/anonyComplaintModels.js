const conexion = require("../config/db");

const AnonyComplaint = {
  create: (data, callback) => {
    const imagenes = Array.isArray(data.imagenes)
      ? data.imagenes.join(",")
      : data.imagenes;
    const query =
      "INSERT INTO denuncia_anonima (titulo, descripcion, imagenes, ticket, password, date, status, comentarios) VALUES (?,?,?,?,?,?,?,?)";
    conexion.query(
      query,
      [
        data.titulo || null,
        data.descripcion || null,
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
    const query =
      "SELECT * FROM denuncia_anonima WHERE ticket = ? AND password = ?";
    conexion.query(query, [ticket, password], callback);
  },

  getAll: (callback) => {
    const query = "SELECT * FROM denuncia_anonima";
    conexion.query(query, callback);
  },

  getOne: (id, callback) => {
    const query = "SELECT * FROM denuncia WHERE id = ?";
    conexion.query(query, [id], callback);
  },

  updateClient: (id, data, ticket, password, callback) => {
    const verifyQuery =
      "SELECT * FROM denuncia_anonima WHERE id = ? AND ticket = ? AND password = ?";
    conexion.query(verifyQuery, [id, ticket, password], (err, results) => {
      if (err) return callback(err);
      if (results.length === 0)
        return callback(new Error("Ticket o contraseña incorrectos"));

      const updateQuery = "UPDATE denuncia_anonima SET titulo = ?,";
      conexion.query(updateQuery, [
        data.titulo || null,
        data.descripcion || null,
        data.imagenes || null,
        id,
      ]);
    });
  },

  update: (id, data, callback) => {
    const query =
      "UPDATE denuncia_anonima SET titulo = ?, descripcion = ?, imagenes = ?, status = ?, comentarios = ? WHERE id = ?";
    conexion.query(
      query,
      [
        data.titulo || null,
        data.descripcion || null,
        data.imagenes || null,
        data.status || "Pendiente",
        data.comentario || "",
        id,
      ],
      callback
    );
  },

  deleteClient: (id, ticket, password, callback) => {
    const verifyQuery =
      "SELECT * FROM denuncia_anonima WHERE id = ? AND ticket = ? AND password = ?";
    conexion.query(verifyQuery, [id, ticket, password], (err, results) => {
      if (err) return callback(err);
      if (results.length === 0)
        return callback(new Error("Ticket o contraseña incorrectos"));

      const deleteQuery = "DELETE FROM denuncia_anonima WHERE id = ?";
      conexion.query(deleteQuery, [id], callback);
    });
  },

  delete: (id, callback) => {
    const query = "DELETE FROM denuncia_anonima WHERE id = ?";
    conexion.query(query, [id], callback);
  },
};

module.exports = AnonyComplaint;
