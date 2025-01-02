const express = require("express");
const router = express.Router();
const {
  createAnonyComplaint,
  getAllAnonyComplaints,
  getOneAnonyComplaint,
  updateAnonyComplaint,
  updateClientAnonyComplaint,
  deleteAnonyComplaint,
  deleteClientAnonyComplaint,
  getAnonyComplaintByTicket,
} = require("../controllers/anonyComplaintControllers");

// Denuncias anónimas

// Ruta para crear una nueva denuncia anónima
router.post("/", createAnonyComplaint);

// Ruta para obtener todas las denuncias anónimas
router.get("/", getAllAnonyComplaints);

// Ruta para obtener una denuncia anónima por ID
router.get("/:id", getOneAnonyComplaint);

// Ruta para actualizar una denuncia anónima
router.put("/:id", updateAnonyComplaint);

// Ruta para actualizar una denuncia anónima por parte del cliente
router.put("/client/:id", updateClientAnonyComplaint);

// Ruta para eliminar una denuncia anónima
router.delete("/:id", deleteAnonyComplaint);

// Ruta para eliminar una denuncia anónima por parte del cliente
router.delete("/client/:id", deleteClientAnonyComplaint);

// Ruta para obtener una denuncia anónima por ticket y contraseña
router.post("/ticket", getAnonyComplaintByTicket);

module.exports = router;
