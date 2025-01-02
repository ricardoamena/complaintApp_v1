const conexion = require("../config/db");

const Admin = {
  getByUsername: (username, callback) => {
    const query = "SELECT * FROM admin WHERE username = ?";
    conexion.query(query, [username], callback);
  },
};

module.exports = Admin;
