const express = require("express");
const router = express.Router();
const {
  createComplaint,
  getAllComplaints,
  getOneComplaint,
  updateComplaint,
  updateClientComplaint,
  deleteClientComplaint,
  deleteComplaint,
  getComplaintByTicket,
} = require("../controllers/complaintControllers");

//Denuncias con datos de usuario

// Ruta para crear una nueva denuncia
router.post("/", createComplaint);

// Ruta para obtener todas las denuncias
router.get("/", getAllComplaints);

// Ruta para obtener una denuncia por ID
router.get("/:id", getOneComplaint);

// Ruta para actualizar una denuncia
router.put("/:id", updateComplaint);

// Ruta para actualizar una denuncia por parte del cliente
router.put("/client/:id", updateClientComplaint);

// Ruta para eliminar una denuncia
router.delete("/:id", deleteComplaint);

// Ruta para eliminar una denuncia por parte del cliente
router.delete("/client/:id", deleteClientComplaint);

// Ruta para obtener una denuncia por ticket y contraseña
router.post("/ticket", getComplaintByTicket);

module.exports = router;
