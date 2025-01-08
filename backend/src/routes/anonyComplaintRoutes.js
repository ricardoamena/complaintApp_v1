const express = require("express");
const router = express.Router();
const multer = require("multer");
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

// Configurar multer para manejar la carga de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// Denuncias anónimas

// Ruta para crear una nueva denuncia anónima
router.post("/", upload.single("imagenes"), createAnonyComplaint);

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
