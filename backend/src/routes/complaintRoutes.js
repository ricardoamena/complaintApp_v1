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

// Configurar multer para manejar la carga de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/uploads/");
  },
  filename: (req, file, cb) => {
    //Validad tipo de archivo
    const fileTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"];
    if (!fileTypes.includes(file.mimetype)) {
      cb(new Error("Formato de archivo no permitido"));
      return;
    }
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 2, // 2MB
    files: 2, // Maximo de archivos
  },
});

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
