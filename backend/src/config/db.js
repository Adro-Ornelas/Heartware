require('dotenv').config();
// CORREGIDO: Importar la versión de promesas de mysql2
const mysql = require('mysql2/promise'); 

// RECOMENDADO: Usar createPool en lugar de createConnection para entornos async/await
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// CORREGIDO: Verificar la conexión usando Promesas (.then / .catch)
pool.getConnection()
    .then((connection) => {
        console.log('Conexión exitosa a MySQL mediante Promesas (Pool)');
        connection.release(); // Libera la conexión de prueba de vuelta al pool
    })
    .catch((error) => {
        console.error('Error en la conexión a MySQL:', error);
    });

// 4. Exportar el pool configurado
module.exports = pool;