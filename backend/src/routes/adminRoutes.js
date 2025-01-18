const express = require("express");
const router = express.Router();
const {
  loginAdmin,
  markComplaint,
  markAnonyComplaint,
} = require("../controllers/adminControllers");
const {
  updateAnonyComplaint,
  deleteAnonyComplaint,
  getAllAnonyComplaints,
} = require("../controllers/anonyComplaintControllers");
const { getAllComplaints } = require("../controllers/complaintControllers");
const verifyToken = require("../../src/middlewares/authMiddelware");

//Login de administrador
router.post("/login", loginAdmin);

//Obtener todas las denuncias
router.get("/complaints", verifyToken, getAllComplaints);

//Obtener todas las denuncias anónimas
router.get("/anony-complaints", verifyToken, getAllAnonyComplaints);


// Ruta para marcar una denuncia anónima, como resuelta y con comentarios
router.put(
  "/anony-complaints/:id",
  verifyToken,

  updateAnonyComplaint
);



// Ruta para eliminar una denuncia anónima
router.delete("/:id", verifyToken, deleteAnonyComplaint);

module.exports = router;
