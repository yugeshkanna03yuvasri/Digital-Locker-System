-- Add user profile fields to users table
ALTER TABLE users ADD COLUMN phone VARCHAR(20);
ALTER TABLE users ADD COLUMN company VARCHAR(100);
ALTER TABLE users ADD COLUMN job_title VARCHAR(100);