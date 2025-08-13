// const express = require('express');
// const { signUp, login, logout, forgotPassword, resetPassword } = require('../controllers/auth.controller');
// const { protect } = require('../middleware/auth.middleware');

// const router = express.Router();

// router.post('/signUp', signUp);
// router.post('/login', login);
// router.post('/forgotPassword', forgotPassword);
// router.post('/resetPassword', resetPassword);
// router.post('/logout', protect, logout); // This route is protected

// module.exports = router;

const express = require('express');
const router = express.Router();
const {
    signUp,
    login,
    logout,
    forgotPassword,
    resetPassword,
    verifyEmail,
    resendOTP
} = require('../controllers/auth.controller');
// Routes
router.post('/signUp', signUp);
router.post('/login', login);
router.post('/logout', logout);
router.post('/forgotPassword', forgotPassword);
router.post('/resetPassword', resetPassword);
router.post('/verifyEmail', verifyEmail);
router.post('/resendOTP', resendOTP);
module.exports = router;