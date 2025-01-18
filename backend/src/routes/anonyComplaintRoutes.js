const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  createAnonyComplaint,
  getAllAnonyComplaints,
  getOneAnonyComplaint,
  updateClientAnonyComplaint,
  deleteClientAnonyComplaint,
  getAnonyComplaintByTicket,
  updateAnonyComplaint,
  deleteAnonyComplaint,
} = require("../controllers/anonyComplaintControllers");

// Configurar multer para manejar la carga de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/uploads/");
  },
  filename: (req, file, cb) => {
    // Validar tipo de archivo
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
    files: 2, // Máximo de archivos
  },
});

// Denuncias anónimas

// Ruta para crear una nueva denuncia anónima
router.post("/", upload.array("imagenes", 2), createAnonyComplaint);

// Ruta para obtener todas las denuncias anónimas
router.get("/", getAllAnonyComplaints);

// Ruta para obtener una denuncia anónima por ID
router.get("/:id", getOneAnonyComplaint);

// Ruta para actualizar una denuncia anónima por parte del cliente
router.put("/client/:id", updateClientAnonyComplaint);

// Ruta para eliminar una denuncia anónima por parte del cliente
router.delete("/client/:id", deleteClientAnonyComplaint);

// Ruta para obtener una denuncia anónima por ticket y contraseña
router.post("/ticket", getAnonyComplaintByTicket);



module.exports = router;
