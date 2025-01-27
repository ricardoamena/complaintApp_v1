const { v4: uuidv4 } = require("uuid");
const AnonyComplaint = require("../models/anonyComplaintModels");

const createAnonyComplaint = (req, res) => {
  const data = req.body;
  data.ticket = uuidv4();
  if (req.files && req.files.length > 0) {
    data.imagenes = req.files.map((file) => file.filename).join(",");
  }
  AnonyComplaint.create(data, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: 0,
        message: "Error al guardar la denuncia",
        error: err.message,
      });
    }
    return res.status(200).json({
      message: "Denuncia creada exitosamente",
      id: results.insertId,
      ticket: data.ticket,
    });
  });
};

const getAnonyComplaintByTicket = (req, res) => {
  const { ticket, password } = req.body;
  AnonyComplaint.getByTicket(ticket, password, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: 0,
        message: "Error al obtener la denuncia anónima",
      });
    }

    // Si no se encuentra ninguna denuncia
    if (!results || results.length === 0) {
      return res.status(404).json({
        success: 0,
        message: "No se encontró la denuncia con ese ticket y contraseña",
      });
    }

    // Devolver en el formato esperado por el frontend
    return res.status(200).json({
      success: 1,
      complaint: results[0]  // Devolver el primer resultado
    });
  });
};

const getAllAnonyComplaints = (req, res) => {
  AnonyComplaint.getAll((err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: 0,
        message: "Error al obtener las denuncias",
      });
    }
    return res.status(200).json(results);
  });
};

const getOneAnonyComplaint = (req, res) => {
  const id = req.params.id;
  AnonyComplaint.getOne(id, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: 0,
        message: "Error al obtener la denuncia anónima",
      });
    }
    return res.status(200).json(results);
  });
};

const updateAnonyComplaint = (req, res) => {
  const id = req.params.id;
  const data = req.body;
  console.log("Datos recibidos para actualizar:", data);
  AnonyComplaint.update(id, data, (err, results) => {
    if (err) {
      console.log("Error al actualizar la denuncia:", err);
      console.log(err);
      return res.status(500).json({
        success: 0,
        message: "Error al actualizar la denuncia",
      });
    }
    console.log("Resultados de la actualización:", results);
    return res.status(200).json({
      message: "Denuncia actualizada exitosamente",
    });
  });
};

const updateClientAnonyComplaint = (req, res) => {
  const id = req.params.id;
  const { ticket, password, ...data } = req.body;
  AnonyComplaint.updateClient(id, data, ticket, password, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: 0,
        message: "Error al actualizar la denuncia anónima",
      });
    }
    return res.status(200).json({
      message: "Denuncia anónima actualizada exitosamente",
    });
  });
};

const deleteAnonyComplaint = (req, res) => {
  const id = req.params.id;
  AnonyComplaint.delete(id, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: 0,
        message: "Error al eliminar la denuncia",
      });
    }
    return res.status(200).json({
      message: "Denuncia eliminada exitosamente",
    });
  });
};

const deleteClientAnonyComplaint = (req, res) => {
  const id = req.params.id;
  const { ticket, password } = req.body;
  AnonyComplaint.deleteClient(id, ticket, password, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: 0,
        message: "Error al eliminar la denuncia anónima",
      });
    }
    return res.status(200).json({
      message: "Denuncia anónima eliminada exitosamente",
    });
  });
};

module.exports = {
  createAnonyComplaint,
  getAllAnonyComplaints,
  getOneAnonyComplaint,
  updateAnonyComplaint,
  updateClientAnonyComplaint,
  deleteAnonyComplaint,
  deleteClientAnonyComplaint,
  getAnonyComplaintByTicket,
};
