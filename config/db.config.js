const mysql = require ('mysql2');
require('dotenv').config();
const fs = require('fs');
// Create a connection pool to handle multiple connections efficiently.
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    
    ssl:{
        ca: fs.readFileSync('C:\\Users\\HP\\Downloads\\ca.pem'),
        rejectUnauthorized: false
    }



});

pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        return;
    }
    console.log('Successfully connected to the database.');
    connection.release();
});

module.exports = pool.promise();
