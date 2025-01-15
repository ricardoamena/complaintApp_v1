const express = require("express");
const router = express.Router();
const {
  loginAdmin,
  markComplaint,
  markAnonyComplaint,
} = require("../controllers/adminControllers");
const verifyToken = require("../../src/middlewares/authMiddelware");

//Ruta para login de administrador
router.post("/login", loginAdmin);

//Ruta para marcar una denuncia con identificacion, como resuelta
router.put("/complaints/:id", verifyToken, markComplaint);

// Ruta para marcar una denuncia anónima, como resuelta
router.put("/anony-complaints/:id", verifyToken, markAnonyComplaint);

module.exports = router;
