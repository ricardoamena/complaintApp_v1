const bcrypt = require("bcrypt");
const conexion = require("../config/db");

const username = "ricardom";
const password = "admin123";
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error(err);
    return;
  }

  const query = "INSERT INTO admin (username, password) VALUES (?, ?)";
  conexion.query(query, [username, hash], (err, results) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log("Administrador creado exitosamente");
  });
});
