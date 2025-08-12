const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/user.repository');
require('dotenv').config();

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// @desc    Register a new user
// @route   POST /api/auth/signUp
// @access  Public
const signUp = async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
        return res.status(400).json({ 
            success: false, 
            message: 'All fields are required.', 
            data: null 
        });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
        return res.status(400).json({ 
            success: false, 
            message: 'Passwords do not match.', 
            data: null 
        });
    }

    

    try {
        // Check if user already exists
        const existingUser = await userRepository.findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ 
                success: false, 
                message: 'User already exists', 
                data: null 
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Save user to database
        const newUserId = await userRepository.createUser(name, email, hashedPassword);

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: {
                id: newUserId,
                name,
                email,
                token: generateToken(newUserId)
            }
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Server error', 
            data: { error: error.message } 
        });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ 
            success: false, 
            message: 'All fields are required.', 
            data: null 
        });
    }

    try {
        // Check if user exists
        const user = await userRepository.findUserByEmail(email);

        if (user && (await bcrypt.compare(password, user.password))) {
            res.status(200).json({
                success: true,
                message: 'Login successful',
                data: {
                    id: user.id,
                    email: user.email,
                    token: generateToken(user.id)
                }
            });
        } else {
            res.status(400).json({ 
                success: false, 
                message: 'Invalid credentials', 
                data: null 
            });
        }
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Server error', 
            data: { error: error.message } 
        });
    }
};

// @desc    Simulated Logout (client-side action)
// @route   POST /api/auth/logout
// @access  Private
const logout = (req, res) => {
    res.status(200).json({ 
        success: true, 
        message: 'Logout successful, please clear your token on the client side.', 
        data: null 
    });
};

// @desc    Simulated Forgot Password (placeholder)
// @route   POST /api/auth/forgotPassword
// @access  Public
const forgotPassword = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ 
            success: false, 
            message: 'Email address is required', 
            data: null 
        });
    }

    try {
        const user = await userRepository.findUserByEmail(email);
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found', 
                data: null 
            });
        }

        console.log(`Password reset link requested for: ${email}`);
        res.status(200).json({ 
            success: true, 
            message: 'If a user with that email exists, a password reset link has been sent.', 
            data: null 
        });

    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Server error', 
            data: { error: error.message } 
        });
    }
};

module.exports = { signUp, login, logout, forgotPassword };