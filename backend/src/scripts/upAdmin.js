const bcrypt = require('bcrypt');
const conexion = require('../config/db');

async function crearAdmin() {
  const username = "ricardomena2"; // Nombre de usuario del administrador de prueba
  const password = "admin123"; // Contraseña del administrador de prueba
  const saltRounds = 10; // Número de rondas de sal para bcrypt

  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const query = "INSERT INTO admin (username, password) VALUES (?, ?)";
    conexion.query(query, [username, hashedPassword], (err, results) => {
      if (err) {
        console.error('Error al crear admin:', err);
        return;
      }
      console.log('Admin creado exitosamente');
    });
  } catch (err) {
    console.error('Error al crear admin:', err);
  }
}

crearAdmin();