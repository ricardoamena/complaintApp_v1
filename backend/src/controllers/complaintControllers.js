const { v4: uuidv4 } = require("uuid");
const Complaint = require("../models/complaintModels");

const createComplaint = (req, res) => {
  const data = req.body;
  data.ticket = uuidv4();
  if (req.file) {
    data.imagenes = req.file.path; // Guardar la ruta de la imagen
  }
  Complaint.create(data, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: 0,
        message: "Error al guardar la denuncia",
      });
    }
    return res.status(200).json({
      message: "Denuncia creada exitosamente",
      id: results.insertId,
      ticket: data.ticket,
    });
  });
};

const getComplaintByTicket = (req, res) => {
  const { ticket, password } = req.body;
  Complaint.getByTicket(ticket, password, (err, results) => {
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

const getAllComplaints = (req, res) => {
  Complaint.getAll((err, results) => {
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

const getOneComplaint = (req, res) => {
  const id = req.params.id;
  Complaint.getOne(id, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: 0,
        message: "Error al obtener la denuncia",
      });
    }
    return res.status(200).json(results);
  });
};

const updateComplaint = (req, res) => {
  const id = req.params.id;
  const data = req.body;
  Complaint.update(id, data, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: 0,
        message: "Error al actualizar la denuncia",
      });
    }
    return res.status(200).json({
      message: "Denuncia actualizada exitosamente",
    });
  });
};

const updateClientComplaint = (req, res) => {
  const id = req.params.id;
  const { ticket, password, ...data } = req.body;
  Complaint.updateClient(id, data, ticket, password, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: 0,
        message: "Error al actualizar la denuncia",
      });
    }
    return res.status(200).json({
      message: "Denuncia actualizada exitosamente",
    });
  });
};

const deleteComplaint = (req, res) => {
  const id = req.params.id;
  Complaint.delete(id, (err, results) => {
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

const deleteClientComplaint = (req, res) => {
  const id = req.params.id;
  const { ticket, password } = req.body;
  Complaint.deleteClient(id, ticket, password, (err, results) => {
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

module.exports = {
  createComplaint,
  getAllComplaints,
  getOneComplaint,
  updateComplaint,
  updateClientComplaint,
  deleteClientComplaint,
  deleteComplaint,
  getComplaintByTicket,
};
