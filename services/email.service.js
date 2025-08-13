const nodemailer = require('nodemailer');
require('dotenv').config();

// Create transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Send email verification OTP
const sendVerificationOTP = async (to, otp) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        subject: 'Email Verification - OTP Code',
        html: `
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
                <h2 style="color: #333; text-align: center;">Email Verification</h2>
                
                <p>Hello,</p>
                
                <p>Thank you for signing up! To complete your registration, please use the verification code below:</p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <div style="background-color: #f8f9fa; border: 2px dashed #007bff; padding: 20px; border-radius: 10px; display: inline-block;">
                        <h1 style="color: #007bff; margin: 0; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
                    </div>
                </div>
                
                <p style="text-align: center; color: #666; font-size: 16px;">
                    Enter this code in your verification form to activate your account.
                </p>
                
                <p style="color: #666; font-size: 14px; margin-top: 30px;">
                    This code will expire in 10 minutes for security reasons.
                </p>
                
                <p style="color: #666; font-size: 14px;">
                    If you didn't request this verification, please ignore this email.
                </p>
                
                <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                <p style="color: #999; font-size: 12px; text-align: center;">
                    This is an automated email. Please do not reply.
                </p>
            </div>
        `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Verification OTP email sent:', info.response);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending verification OTP email:', error);
        throw new Error('Failed to send verification email');
    }
};

// Send reset password email
const sendResetPasswordEmail = async (to, resetToken) => {
    const resetUrl = `${process.env.FRONTEND_URL}/newpassword.html?token=${resetToken}`;
    
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        subject: 'Password Reset Request',
        html: `
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
                <h2 style="color: #333; text-align: center;">Password Reset Request</h2>
                
                <p>Hello,</p>
                
                <p>You requested a password reset for your account. Click the button below to reset your password:</p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}" 
                       style="background-color: #007bff; color: white; padding: 12px 30px; 
                              text-decoration: none; border-radius: 5px; display: inline-block;">
                        Reset Password
                    </a>
                </div>
                
                <p>Or copy and paste this link into your browser:</p>
                <p style="word-break: break-all; color: #007bff;">${resetUrl}</p>
                
                <p style="color: #666; font-size: 14px; margin-top: 30px;">
                    This link will expire in 1 hour for security reasons.
                </p>
                
                <p style="color: #666; font-size: 14px;">
                    If you didn't request this password reset, please ignore this email.
                </p>
            </div>
        `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Reset password email sent:', info.response);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending reset password email:', error);
        throw new Error('Failed to send reset password email');
    }
};

module.exports = {
    sendVerificationOTP,
    sendResetPasswordEmail
};