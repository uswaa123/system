const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware to protect routes. It verifies the JWT token.
const protect = (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // For this example, we'll just verify the token and move on.
            // In a real application, you might query the user from the database
            // using the decoded user ID.
            req.user = decoded.id;

            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protect };