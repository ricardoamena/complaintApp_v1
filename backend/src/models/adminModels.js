const conexion = require("../config/db");

const Admin = {
  getByUsername: (username, callback) => {
    const query = "SELECT * FROM admin WHERE username = ?";

    console.log("Ejecutando consulta de admin:", {
      query,
      username,
    });

    conexion.query(query, [username], (error, results) => {
      if (error) {
        console.error("Error en consulta de admin:", error);
        return callback(error);
      }

      console.log("Resultados de consulta:", {
        found: results.length > 0,
        count: results.length,
      });

      callback(null, results);
    });
  },
};

module.exports = Admin;
