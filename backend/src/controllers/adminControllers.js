const Admin = require("../models/adminModels");
const Complaint = require("../models/complaintModels");
const AnonyComplaint = require("../models/anonyComplaintModels");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const conexion = require("../config/db");
require("dotenv").config();

const loginAdmin = (req, res) => {
  console.log("Intento de login recibido:", { 
    username: req.body.username,
    passwordLength: req.body.password?.length 
  });

  const { username, password } = req.body;

  // Validación de campos
  if (!username || !password) {
    console.log("Faltan campos requeridos");
    return res.status(400).json({
      success: 0,
      message: "Usuario y contraseña son requeridos"
    });
  }

  if (username.length < 3 || password.length < 6) {
    console.log("Credenciales no cumplen con longitud mínima");
    return res.status(400).json({
      success: 0,
      message: "Las credenciales deben tener al menos 3 y 6 caracteres respectivamente"
    });
  }

  // Buscar el admin en la base de datos
  Admin.getByUsername(username, (err, results) => {
    if (err) {
      console.error("Error en consulta a base de datos:", err);
      return res.status(500).json({
        success: 0,
        message: "Error al verificar las credenciales",
      });
    }

    if (results.length === 0) {
      console.log("Usuario no encontrado:", username);
      return res.status(401).json({
        success: 0,
        message: "Usuario o contraseña incorrectos",
      });
    }

    const admin = results[0];
    console.log("Usuario encontrado, verificando contraseña");

    try {
      const passwordIsValid = bcrypt.compareSync(password, admin.password);
      
      if (!passwordIsValid) {
        console.log("Contraseña inválida para usuario:", username);
        return res.status(401).json({
          success: 0,
          message: "Usuario o contraseña incorrectos",
        });
      }

      // Generar token
      const token = jwt.sign(
        { 
          id: admin.id,
          username: admin.username // Agregamos más información al token
        }, 
        process.env.SECRET, 
        { expiresIn: 86400 }
      );

      console.log("Login exitoso para usuario:", username);
      
      return res.status(200).json({
        success: 1,
        message: "Login exitoso",
        token: token,
      });
    } catch (error) {
      console.error("Error en la verificación de contraseña:", error);
      return res.status(500).json({
        success: 0,
        message: "Error al verificar las credenciales",
      });
    }
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
