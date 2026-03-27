require('dotenv').config();
const mysql = require('mysql2');

const conecction = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

conecction.connect((error) => {
    if (error) {
        console.error('Error on coneection MySQL:', error);
    } else {
        console.log('Successful conection: ',
            process.env.DB_HOST,
            '\n', process.env.DB_USER,
            '\n', process.env.DB_PASSWORD,
            '\n', process.env.DB_NAME,
        );
    }
});

module.exports = conecction;