// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const userRepository = require('../repositories/user.repository');
// const { sendResetPasswordEmail } = require('../services/email.service');
// require('dotenv').config();

// const generateToken = (id) => {
//     return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
// };

// const generateResetToken = (email) => {
//     return jwt.sign({ email, type: 'reset' }, process.env.JWT_SECRET, { expiresIn: '1h' });
// };

// // @desc    Register a new user
// // @route   POST /api/auth/signUp
// // @access  Public
// const signUp = async (req, res) => {
//     const { name, email, password, confirmPassword } = req.body;

//     if (!name || !email || !password || !confirmPassword) {
//         return res.status(400).json({ 
//             success: false, 
//             message: 'All fields are required.', 
//             data: null 
//         });
//     }

//     // Check if passwords match
//     if (password !== confirmPassword) {
//         return res.status(400).json({ 
//             success: false, 
//             message: 'Passwords do not match.', 
//             data: null 
//         });
//     }

    

//     try {
//         // Check if user already exists
//         const existingUser = await userRepository.findUserByEmail(email);
//         if (existingUser) {
//             return res.status(400).json({ 
//                 success: false, 
//                 message: 'User already exists', 
//                 data: null 
//             });
//         }

//         // Hash password
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(password, salt);

//         // Save user to database
//         const newUserId = await userRepository.createUser(name, email, hashedPassword);

//         res.status(201).json({
//             success: true,
//             message: 'User created successfully',
//             data: {
//                 id: newUserId,
//                 name,
//                 email,
//                 token: generateToken(newUserId)
//             }
//         });
//     } catch (error) {
//         res.status(500).json({ 
//             success: false, 
//             message: 'Server error', 
//             data: { error: error.message } 
//         });
//     }
// };

// // @desc    Authenticate a user
// // @route   POST /api/auth/login
// // @access  Public
// const login = async (req, res) => {
//     const { email, password } = req.body;

//     if (!email || !password) {
//         return res.status(400).json({ 
//             success: false, 
//             message: 'All fields are required.', 
//             data: null 
//         });
//     }

//     try {
//         // Check if user exists
//         const user = await userRepository.findUserByEmail(email);

//         if (user && (await bcrypt.compare(password, user.password))) {
//             res.status(200).json({
//                 success: true,
//                 message: 'Login successful',
//                 data: {
//                     id: user.id,
//                     email: user.email,
//                     token: generateToken(user.id)
//                 }
//             });
//         } else {
//             res.status(400).json({ 
//                 success: false, 
//                 message: 'Invalid credentials', 
//                 data: null 
//             });
//         }
//     } catch (error) {
//         res.status(500).json({ 
//             success: false, 
//             message: 'Server error', 
//             data: { error: error.message } 
//         });
//     }
// };

// // @desc    Simulated Logout (client-side action)
// // @route   POST /api/auth/logout
// // @access  Private
// const logout = (req, res) => {
//     res.status(200).json({ 
//         success: true, 
//         message: 'Logout successful, please clear your token on the client side.', 
//         data: null 
//     });
// };

// // @desc    Send password reset email
// // @route   POST /api/auth/forgotPassword
// // @access  Public
// const forgotPassword = async (req, res) => {
//     const { email } = req.body;

//     if (!email) {
//         return res.status(400).json({ 
//             success: false, 
//             message: 'Email address is required', 
//             data: null 
//         });
//     }

//     try {
//         const user = await userRepository.findUserByEmail(email);
//         if (!user) {
//             return res.status(404).json({ 
//                 success: false, 
//                 message: 'User not found', 
//                 data: null 
//             });
//         }

//         // Generate reset token
//         const resetToken = generateResetToken(email);

//         // Send reset email
//         await sendResetPasswordEmail(email, resetToken);

//         res.status(200).json({ 
//             success: true, 
//             message: 'Password reset email sent successfully', 
//             data: null 
//         });

//     } catch (error) {
//         console.error('Forgot password error:', error);
        
//         // Check if it's an email service error
//         if (error.message.includes('Invalid login') || error.message.includes('authentication')) {
//             return res.status(500).json({ 
//                 success: false, 
//                 message: 'Email service configuration error. Please check email credentials.', 
//                 data: { error: 'Email authentication failed' } 
//             });
//         }
        
//         res.status(500).json({ 
//             success: false, 
//             message: 'Failed to send reset email', 
//             data: { error: error.message } 
//         });
//     }
// };

// // @desc    Reset password with token
// // @route   POST /api/auth/resetPassword
// // @access  Public
// const resetPassword = async (req, res) => {
//     const { token, newPassword, confirmPassword } = req.body;

//     if (!token || !newPassword || !confirmPassword) {
//         return res.status(400).json({
//             success: false,
//             message: 'Token, new password, and confirm password are required',
//             data: null
//         });
//     }

//     if (newPassword !== confirmPassword) {
//         return res.status(400).json({
//             success: false,
//             message: 'Passwords do not match',
//             data: null
//         });
//     }

//     try {
//         // Verify token
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
//         if (decoded.type !== 'reset') {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Invalid reset token',
//                 data: null
//             });
//         }

//         const email = decoded.email;

//         // Check if user exists
//         const user = await userRepository.findUserByEmail(email);
//         if (!user) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'User not found',
//                 data: null
//             });
//         }

//         // Hash new password
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(newPassword, salt);

//         // Update password in database
//         await userRepository.updateUserPassword(user.id, hashedPassword);

//         res.status(200).json({
//             success: true,
//             message: 'Password reset successfully',
//             data: null
//         });

//     } catch (error) {
//         if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Invalid or expired reset token',
//                 data: null
//             });
//         }

//         console.error('Reset password error:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Server error',
//             data: { error: error.message }
//         });
//     }
// };

// module.exports = { signUp, login, logout, forgotPassword, resetPassword };




const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/user.repository');
const { sendVerificationOTP, sendResetPasswordEmail } = require('../services/email.service');
const { 
    isValidEmail, 
    validatePassword, 
    validateName, 
    sanitizeInput,
    generateOTP,
    storeOTP,
    storeExpiredOTP,
    verifyOTP,
    checkLoginAttempts,
    recordLoginAttempt 
} = require('../utils/validation');
require('dotenv').config();
const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
const generateResetToken = (email) => jwt.sign({ email, type: 'reset' }, process.env.JWT_SECRET, { expiresIn: '1h' });
/* SIGN UP */
const signUp = async (req, res) => {
    console.log('SignUp endpoint called for email:', req.body.email);
    let { name, email, password, confirmPassword } = req.body;
    
    // Sanitize inputs
    name = sanitizeInput(name);
    email = sanitizeInput(email);
    
    // Check required fields
    if (!name || !email || !password || !confirmPassword) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
    }
    
    // Validate name (only alphabets)
    const nameValidation = validateName(name);
    if (!nameValidation.isValid) {
        return res.status(400).json({ 
            success: false, 
            message: 'Name validation failed', 
            errors: nameValidation.errors 
        });
    }
    
    // Validate email format
    if (!isValidEmail(email)) {
        return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
    }
    
    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
        return res.status(400).json({ 
            success: false, 
            message: 'Password validation failed', 
            errors: passwordValidation.errors 
        });
    }
    
    // Check password confirmation
    if (password !== confirmPassword) {
        return res.status(400).json({ success: false, message: 'Passwords do not match.' });
    }
    
    try {
        // Check if user already exists
        const existingUser = await userRepository.findUserByEmail(email.toLowerCase());
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists with this email address.' });
        }
        
        // Hash password and create unverified user
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUserId = await userRepository.createUser(name.trim(), email.toLowerCase(), hashedPassword, false);
        
        if (!newUserId) {
            return res.status(500).json({ success: false, message: 'Failed to create user account.' });
        }
        
        // Generate and send OTP for email verification
        const otp = generateOTP();
        storeOTP(email.toLowerCase(), otp);
        
        // DEBUG: Log OTP for testing (remove in production)
        console.log(`🔑 DEBUG: OTP for ${email.toLowerCase()}: ${otp}`);
        
        try {
            await sendVerificationOTP(email.toLowerCase(), otp);
        } catch (emailError) {
            console.error('Email sending failed:', emailError.message);
            // Continue without failing registration - user can request OTP resend
        }
        
        res.status(201).json({
            success: true,
            message: 'Account created successfully! Please check your email for verification code.',
            data: { 
                id: newUserId, 
                name: name.trim(), 
                email: email.toLowerCase(),
                emailVerified: false,
                message: 'Please verify your email before logging in'
            }
        });
    } catch (error) {
        console.error(':x: SignUp Error:', error.message);
        console.error('Stack:', error.stack);
        res.status(500).json({ success: false, message: 'Server error occurred during registration.', error: error.message });
    }
};
/* LOGIN */
const login = async (req, res) => {
    let { email, password } = req.body;
    
    // Sanitize inputs
    email = sanitizeInput(email);
    
    // Check required fields
    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }
    
    // Validate email format
    if (!isValidEmail(email)) {
        return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
    }
    
    // Check login attempts
    const loginCheck = checkLoginAttempts(email.toLowerCase());
    if (loginCheck.isBlocked) {
        return res.status(429).json({ 
            success: false, 
            message: `Too many login attempts. Please try again after ${loginCheck.resetTime.toLocaleTimeString()}.`,
            resetTime: loginCheck.resetTime
        });
    }
    
    try {
        const user = await userRepository.findUserByEmail(email.toLowerCase());
        
        if (user && await bcrypt.compare(password, user.password)) {
            // Check if email is verified
            if (!user.email_verified) {
                return res.status(403).json({
                    success: false,
                    message: 'Please verify your email address before logging in.',
                    requiresVerification: true,
                    email: user.email
                });
            }
            
            // Successful login
            recordLoginAttempt(email.toLowerCase(), true);
            
            res.status(200).json({
                success: true,
                message: 'Login successful',
                data: { 
                    id: user.id, 
                    name: user.name,
                    email: user.email, 
                    emailVerified: user.email_verified,
                    token: generateToken(user.id) 
                }
            });
        } else {
            // Failed login
            recordLoginAttempt(email.toLowerCase(), false);
            
            const updatedCheck = checkLoginAttempts(email.toLowerCase());
            const remainingAttempts = updatedCheck.remainingAttempts;
            
            let message = 'Invalid email or password.';
            if (remainingAttempts <= 2 && remainingAttempts > 0) {
                message += ` ${remainingAttempts} attempt(s) remaining.`;
            }
            
            res.status(401).json({ success: false, message });
        }
    } catch (error) {
        console.error(':x: Login Error:', error);
        res.status(500).json({ success: false, message: 'Server error occurred during login.' });
    }
};
/* LOGOUT */
const logout = (req, res) => {
    res.status(200).json({ success: true, message: 'Logout successful, clear your token client-side.' });
};
/* FORGOT PASSWORD */
const forgotPassword = async (req, res) => {
    let { email } = req.body;
    
    // Sanitize input
    email = sanitizeInput(email);
    
    if (!email) {
        return res.status(400).json({ success: false, message: 'Email address is required' });
    }
    
    // Validate email format
    if (!isValidEmail(email)) {
        return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
    }
    
    try {
        const user = await userRepository.findUserByEmail(email.toLowerCase());
        
        // Always return success to prevent email enumeration attacks
        if (!user) {
            return res.status(200).json({ 
                success: true, 
                message: 'If an account with that email exists, a password reset link has been sent.' 
            });
        }
        
        const resetToken = generateResetToken(email.toLowerCase());
        await sendResetPasswordEmail(email.toLowerCase(), resetToken);
        
        res.status(200).json({ 
            success: true, 
            message: 'Password reset email sent successfully' 
        });
    } catch (error) {
        console.error(':x: Forgot Password Error:', error);
        
        if (error.code?.startsWith('ER_')) {
            return res.status(500).json({ success: false, message: 'Database error occurred.' });
        }
        
        if (error.message.includes('authentication')) {
            return res.status(500).json({ success: false, message: 'Email service temporarily unavailable.' });
        }
        
        res.status(500).json({ success: false, message: 'Failed to process password reset request.' });
    }
};
/* RESET PASSWORD */
const resetPassword = async (req, res) => {
    const { token, newPassword, confirmPassword } = req.body;
    
    // Check required fields
    if (!token || !newPassword || !confirmPassword) {
        return res.status(400).json({ 
            success: false, 
            message: 'Token, new password, and confirm password are required' 
        });
    }
    
    // Validate password strength
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
        return res.status(400).json({ 
            success: false, 
            message: 'Password validation failed', 
            errors: passwordValidation.errors 
        });
    }
    
    // Check password confirmation
    if (newPassword !== confirmPassword) {
        return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }
    
    try {
        // Verify and decode token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if (decoded.type !== 'reset') {
            return res.status(400).json({ success: false, message: 'Invalid reset token type' });
        }
        
        // Find user
        const user = await userRepository.findUserByEmail(decoded.email);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User account not found' });
        }
        
        // Hash new password and update
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        const updateResult = await userRepository.updateUserPassword(user.id, hashedPassword);
        
        if (!updateResult) {
            return res.status(500).json({ success: false, message: 'Failed to update password' });
        }
        
        res.status(200).json({ success: true, message: 'Password reset successfully' });
        
    } catch (error) {
        console.error(':x: Reset Password Error:', error);
        
        if (error.name === 'TokenExpiredError') {
            return res.status(400).json({ 
                success: false, 
                message: 'Reset token has expired. Please request a new password reset.' 
            });
        }
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid reset token. Please request a new password reset.' 
            });
        }
        
        res.status(500).json({ success: false, message: 'Server error occurred during password reset.' });
    }
};

/* VERIFY EMAIL */
const verifyEmail = async (req, res) => {
    let { email, otp } = req.body;
    
    // Sanitize inputs
    email = sanitizeInput(email);
    otp = sanitizeInput(otp);
    
    if (!email || !otp) {
        return res.status(400).json({ 
            success: false, 
            message: 'Email and OTP are required' 
        });
    }
    
    // Validate email format
    if (!isValidEmail(email)) {
        return res.status(400).json({ 
            success: false, 
            message: 'Please provide a valid email address.' 
        });
    }
    
    try {
        // Verify OTP
        const otpResult = verifyOTP(email.toLowerCase(), otp);
        
        if (!otpResult.isValid) {
            return res.status(400).json({ 
                success: false, 
                message: otpResult.message 
            });
        }
        
        // Check if user exists
        const user = await userRepository.findUserByEmail(email.toLowerCase());
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }
        
        // Check if already verified
        if (user.email_verified) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email is already verified' 
            });
        }
        
        // Verify the email in database
        const verificationResult = await userRepository.verifyUserEmail(email.toLowerCase());
        
        if (!verificationResult) {
            return res.status(500).json({ 
                success: false, 
                message: 'Failed to verify email' 
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Email verified successfully! You can now log in.',
            data: {
                email: email.toLowerCase(),
                verified: true
            }
        });
        
    } catch (error) {
        console.error(':x: Verify Email Error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error occurred during email verification.' 
        });
    }
};

/* RESEND OTP */
const resendOTP = async (req, res) => {
    let { email } = req.body;
    
    // Sanitize input
    email = sanitizeInput(email);
    
    if (!email) {
        return res.status(400).json({ 
            success: false, 
            message: 'Email address is required' 
        });
    }
    
    // Validate email format
    if (!isValidEmail(email)) {
        return res.status(400).json({ 
            success: false, 
            message: 'Please provide a valid email address.' 
        });
    }
    
    try {
        // Check if user exists
        const user = await userRepository.findUserByEmail(email.toLowerCase());
        if (!user) {
            // Don't reveal if user exists or not (security)
            return res.status(200).json({ 
                success: true, 
                message: 'If an account with that email exists, a new OTP has been sent.' 
            });
        }
        
        // Check if already verified
        if (user.email_verified) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email is already verified' 
            });
        }
        
        // Generate and send new OTP
        const otp = generateOTP();
        storeOTP(email.toLowerCase(), otp);
        
        // DEBUG: Log OTP for testing (remove in production)
        console.log(`🔑 DEBUG RESEND: OTP for ${email.toLowerCase()}: ${otp}`);
        
        await sendVerificationOTP(email.toLowerCase(), otp);
        
        res.status(200).json({
            success: true,
            message: 'New verification code sent to your email!'
        });
        
    } catch (error) {
        console.error(':x: Resend OTP Error:', error);
        
        if (error.message.includes('authentication')) {
            return res.status(500).json({ 
                success: false, 
                message: 'Email service temporarily unavailable.' 
            });
        }
        
        res.status(500).json({ 
            success: false, 
            message: 'Failed to send verification code.' 
        });
    }
};

/* TEST EXPIRED OTP - FOR TESTING ONLY */
const testExpiredOTP = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ success: false, message: 'Email required' });
    }
    
    const otp = generateOTP();
    storeExpiredOTP(email.toLowerCase(), otp);
    console.log(`🔑 DEBUG EXPIRED OTP for ${email.toLowerCase()}: ${otp}`);
    
    res.status(200).json({ 
        success: true, 
        message: 'Expired OTP created for testing',
        otp: otp 
    });
};

module.exports = { signUp, login, logout, forgotPassword, resetPassword, verifyEmail, resendOTP, testExpiredOTP };


















