// Email validation
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
};

// Password strength validation
const validatePassword = (password) => {
    const errors = [];
    
    if (!password || password.length < 8) {
        errors.push('Password must be at least 8 characters long');
    }
    
    if (password.length > 128) {
        errors.push('Password must be less than 128 characters');
    }
    
    if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/\d/.test(password)) {
        errors.push('Password must contain at least one number');
    }
    
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        errors.push('Password must contain at least one special character');
    }
    
    // Check for common weak passwords
    const commonPasswords = [
        'password', '12345678', 'qwerty', 'abc123', 'password123', 
        '123456789', 'welcome', 'admin', 'letmein', 'monkey'
    ];
    
    if (commonPasswords.includes(password.toLowerCase())) {
        errors.push('Password is too common. Please choose a stronger password');
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
};

// Name validation - only alphabets allowed
const validateName = (name) => {
    const errors = [];
    
    if (!name || name.trim().length < 2) {
        errors.push('Name must be at least 2 characters long');
    }
    
    if (name.trim().length > 50) {
        errors.push('Name must be less than 50 characters');
    }
    
    // Only allow alphabets and spaces
    if (!/^[a-zA-Z\s]+$/.test(name.trim())) {
        errors.push('Name can only contain alphabets and spaces');
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
};

// Sanitize input to prevent XSS
const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;
    
    return input
        .trim()
        .replace(/[<>]/g, '') // Remove < and > characters
        .substring(0, 1000); // Limit length
};

// Generate OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

// OTP storage (in production, use Redis or database)
const otpStore = new Map();

const storeOTP = (email, otp) => {
    const expiryTime = Date.now() + 10 * 60 * 1000; // 10 minutes
    otpStore.set(email.toLowerCase(), { otp, expiry: expiryTime });
};

const verifyOTP = (email, otp) => {
    const stored = otpStore.get(email.toLowerCase());
    
    if (!stored) {
        return { isValid: false, message: 'No OTP found for this email' };
    }
    
    if (Date.now() > stored.expiry) {
        otpStore.delete(email.toLowerCase());
        return { isValid: false, message: 'OTP has expired' };
    }
    
    if (stored.otp !== otp) {
        return { isValid: false, message: 'Invalid OTP' };
    }
    
    // OTP is valid, remove it
    otpStore.delete(email.toLowerCase());
    return { isValid: true, message: 'OTP verified successfully' };
};

// Rate limiting helper (simple in-memory store)
const loginAttempts = new Map();

const checkLoginAttempts = (email) => {
    const now = Date.now();
    const attempts = loginAttempts.get(email) || { count: 0, lastAttempt: now };
    
    // Reset after 15 minutes
    if (now - attempts.lastAttempt > 15 * 60 * 1000) {
        attempts.count = 0;
        attempts.lastAttempt = now;
    }
    
    return {
        isBlocked: attempts.count >= 5,
        remainingAttempts: Math.max(0, 5 - attempts.count),
        resetTime: new Date(attempts.lastAttempt + 15 * 60 * 1000)
    };
};

const recordLoginAttempt = (email, success = false) => {
    const now = Date.now();
    const attempts = loginAttempts.get(email) || { count: 0, lastAttempt: now };
    
    if (success) {
        // Reset on successful login
        loginAttempts.delete(email);
    } else {
        attempts.count += 1;
        attempts.lastAttempt = now;
        loginAttempts.set(email, attempts);
    }
};

module.exports = {
    isValidEmail,
    validatePassword,
    validateName,
    sanitizeInput,
    generateOTP,
    storeOTP,
    verifyOTP,
    checkLoginAttempts,
    recordLoginAttempt
};