const express = require("express");
const path = require("path");
const conexion = require("./src/config/db");
const cors = require("cors");
require("dotenv").config();
const complaintRoutes = require("./src/routes/complaintRoutes");
const anonyComplaintRoutes = require("./src/routes/anonyComplaintRoutes");
const adminRoutes = require("./src/routes/adminRoutes");

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Manejo de errores globales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("¡Algo salió mal!");
});

// Configura el directorio de archivos estáticos
app.use("/uploads", express.static(path.join(__dirname, "src/uploads")));

// Rutas

// Panel admin
app.use("/api/admin", adminRoutes);

// Denuncias
app.use("/api/public/complaints", complaintRoutes);
app.use("/api/public/anony-complaints", anonyComplaintRoutes);

app.get("/", (req, res) => {
  res.send("¡Hola, mundo!");
});

//Servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
