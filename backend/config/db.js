//conexion base de datos mariadb
const mysql = require('mysql2');

// Crear la conexión
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectTimeout: 10000
});

module.exports = connection;
