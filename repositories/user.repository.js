const db = require('../config/db.config');

const findUserByEmail = async (email) => {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
};

const findUserById = async (id) => {
    const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
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