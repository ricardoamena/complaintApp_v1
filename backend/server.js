const express = require("express");
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

// Rutas
// Denuncias
app.use("/denuncias", complaintRoutes);
app.use("/denuncias-anonimas", anonyComplaintRoutes);
// Panel admin
app.use("/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("¡Hola, mundo!");
});

//Servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
