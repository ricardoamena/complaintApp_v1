const express = require("express");
const router = express.Router();
const multer = require("multer");
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
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads"); // Cambiamos la ruta
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Limpiamos el nombre del archivo reemplazando espacios con guiones
    const cleanFileName = file.originalname.replace(/\s+/g, "-");
    cb(null, Date.now() + "-" + cleanFileName);
  },
});

const upload = multer({ storage });

//Denuncias con datos de usuario

// Ruta para crear una nueva denuncia
router.post("/", upload.array("imagenes", 2), createComplaint);

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
