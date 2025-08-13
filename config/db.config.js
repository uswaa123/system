// const mysql = require ('mysql2');
// require('dotenv').config();
// // Create a connection pool to handle multiple connections efficiently.
// const pool = mysql.createPool({
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0,
    
//     ssl:{
//         rejectUnauthorized: false
//     }



// });

// pool.getConnection((err, connection) => {
//     if (err) {
//         console.error('Error connecting to the database:', err.stack);
//         return;
//     }
//     console.log('Successfully connected to the database.');
//     connection.release();
// });

// module.exports = pool.promise();



const mysql = require('mysql2');
require('dotenv').config();
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: {
        rejectUnauthorized: false
    }
});
// Test connection on startup
pool.getConnection((err, connection) => {
    if (err) {
        console.error(':x: Error connecting to the database:', err.message);
        process.exit(1); // Stop the app if DB is not connected
    }
    console.log(':white_check_mark: Successfully connected to the database.');
    connection.release();
});
module.exports = pool.promise();
