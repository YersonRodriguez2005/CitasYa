//conexion base de datos mariadb
const mysql = require('mysql2');

// Crear la conexión
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'citas_medicas'
});

module.exports = connection;
