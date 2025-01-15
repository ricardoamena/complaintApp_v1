const Admin = require("../models/adminModels");
const Complaint = require("../models/complaintModels");
const AnonyComplaint = require("../models/anonyComplaintModels");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const conexion = require("../config/db");
require("dotenv").config();

const loginAdmin = (req, res) => {
  // Login del administrador
  const { username, password } = req.body;
  // Validar que se proporcionen las credenciales
  if (!username || !password) {
    return res.status(400).json({
      success: 0,
      message: "Usuario y contraseña son requeridos"
    });
  }

  if (username.length < 3 || password.length < 6) {
    return res.status(400).json({
      success: 0,
      message: "Credenciales inválidas"
    });
  }
  // Buscar el admin en la base de datos
  Admin.getByUsername(username, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: 0,
        message: "Error al obtener el usuario",
      });
    }
    if (results.length === 0) {
      return res.status(401).json({
        success: 0,
        message: "Usuario o contraseña incorrectos",
      });
    }
    const admin = results[0];
    const passwordIsValid = bcrypt.compareSync(password, admin.password);
    if (!passwordIsValid) {
      return res.status(401).json({
        success: 0,
        message: "Usuario o contraseña incorrectos",
      });
    }
    const token = jwt.sign({ id: admin.id }, process.env.SECRET, {
      expiresIn: 86400, // 24 horas
    });
    return res.status(200).json({
      success: 1,
      message: "Login exitoso",
      token: token,
    });
  });
};

const markComplaint = (req, res) => {
  const id = req.params.id;
  const { status, comentarios } = req.body;
  const query = "UPDATE denuncia SET status = ?, comments = ? WHERE id = ?";
  conexion.query(query, [status, comentarios, id], (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: 0,
        message: "Error al actualizar la denuncia",
      });
    }
    return res.status(200).json({
      success: 1,
      message: "Denuncia actualizada exitosamente",
    });
  });
};

const markAnonyComplaint = (req, res) => {
  const id = req.params.id;
  const { status, comentarios } = req.body;
  const query =
    "UPDATE denuncia_anonima SET status = ?, comments = ? WHERE id = ?";
  conexion.query(query, [status, comentarios, id], (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: 0,
        message: "Error al actualizar la denuncia",
      });
    }
    return res.status(200).json({
      success: 1,
      message: "Denuncia actualizada exitosamente",
    });
  });
};

module.exports = {
  loginAdmin,
  markComplaint,
  markAnonyComplaint,
};
