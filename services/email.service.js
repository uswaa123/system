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

// Send reset password email
const sendResetPasswordEmail = async (to, resetToken) => {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
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
    sendResetPasswordEmail
};