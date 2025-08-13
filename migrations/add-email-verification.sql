-- Add email verification columns to users table
ALTER TABLE users 
ADD COLUMN email_verified BOOLEAN DEFAULT false,
ADD COLUMN verified_at TIMESTAMP NULL;