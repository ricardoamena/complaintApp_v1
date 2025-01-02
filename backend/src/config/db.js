const mysql = require("mysql2");

const conexion = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "complaintapp",
});

conexion.connect((err) => {
  err
    ? console.error("Error conectando a la base de datos: ", err.stack)
    : console.log("Conexión exitosa a la base de datos");
});


module.exports = conexion;
