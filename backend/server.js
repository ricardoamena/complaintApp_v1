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
app.use(
  cors({
    origin: [
      "https://admirable-axolotl-13cbef.netlify.app/",
      "http://localhost:5173",
      "http://localhost:4173",
    ],
  })
);

app.use(express.json());

// Manejo de errores globales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("¡Algo salió mal!");
});

// Middleware para logging que te ayude a debuggear
app.use("/uploads", (req, res, next) => {
  console.log("Requested file:", req.url);
  console.log("Full path:", path.join(__dirname, "src/uploads", req.url));
  // Verificar si el archivo existe
  const filePath = path.join(__dirname, "src/uploads", req.url);
  const exists = require("fs").existsSync(filePath);
  console.log("File exists:", exists);
  next();
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
