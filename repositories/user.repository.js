// const db = require('../config/db.config');

// const findUserByEmail = async (email) => {
//     const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
//     return rows[0];
// };

// const findUserById = async (id) => {
//     const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
//     return rows[0];
// };

// const createUser = async (name, email, hashedPassword) => {
//     const [result] = await db.execute(
//         'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
//         [name, email, hashedPassword]
//     );
//     return result.insertId;
// };

// const updateUserPassword = async (userId, hashedPassword) => {
//     const [result] = await db.execute(
//         'UPDATE users SET password = ? WHERE id = ?',
//         [hashedPassword, userId]
//     );
//     return result.affectedRows > 0;
// };

// module.exports = { findUserByEmail, findUserById, createUser, updateUserPassword };



// const db = require('../config/db.config');
// const findUserByEmail = async (email) => {
//     try {
//         const [rows] = await db.execute(
//             'SELECT * FROM users WHERE email = ?',
//             [email]
//         );
//         return rows.length > 0 ? rows[0] : null;
//     } catch (err) {
//         console.error("DB Error in findUserByEmail:", err.message);
//         return null; // return null instead of crashing
//     }
// };
// const findUserById = async (id) => {
//     try {
//         const [rows] = await db.execute(
//             'SELECT * FROM users WHERE id = ?',
//             [id]
//         );
//         return rows.length > 0 ? rows[0] : null;
//     } catch (err) {
//         console.error("DB Error in findUserById:", err.message);
//         return null;
//     }
// };
// const createUser = async (name, email, hashedPassword) => {
//     try {
//         const [result] = await db.execute(
//             'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
//             [name, email, hashedPassword]
//         );
//         return result.insertId;
//     } catch (err) {
//         console.error("DB Error in createUser:", err.message);
//         return null;
//     }
// };
// const updateUserPassword = async (userId, hashedPassword) => {
//     try {
//         const [result] = await db.execute(
//             'UPDATE users SET password = ? WHERE id = ?',
//             [hashedPassword, userId]
//         );
//         return result.affectedRows > 0;
//     } catch (err) {
//         console.error("DB Error in updateUserPassword:", err.message);
//         return false;
//     }
// };
// module.exports = { findUserByEmail, findUserById, createUser, updateUserPassword };


const db = require('../config/db.config');
const findUserByEmail = async (email) => {
    const [rows] = await db.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
    );
    return rows.length > 0 ? rows[0] : null;
};
const findUserById = async (id) => {
    const [rows] = await db.execute(
        'SELECT * FROM users WHERE id = ?',
        [id]
    );
    return rows.length > 0 ? rows[0] : null;
};
const createUser = async (name, email, hashedPassword) => {
    const [result] = await db.execute(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name, email, hashedPassword]
    );
    return result.insertId;
};
const updateUserPassword = async (userId, hashedPassword) => {
    const [result] = await db.execute(
        'UPDATE users SET password = ? WHERE id = ?',
        [hashedPassword, userId]
    );
    return result.affectedRows > 0;
};
module.exports = { findUserByEmail, findUserById, createUser, updateUserPassword };
























