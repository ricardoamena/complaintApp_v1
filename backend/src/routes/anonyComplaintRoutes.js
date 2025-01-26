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
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads"); 
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Limpiamos el nombre del archivo reemplazando espacios con guiones
    const cleanFileName = file.originalname.replace(/\s+/g, '-');
    cb(null, Date.now() + "-" + cleanFileName);
  },
});

const upload = multer({ storage });

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
