-- Add additional user profile fields to users table
ALTER TABLE users 
ADD COLUMN phone VARCHAR(20),
ADD COLUMN company VARCHAR(100),
ADD COLUMN job_title VARCHAR(100);

-- Update existing users to have proper role format
UPDATE users SET role = 'ROLE_USER' WHERE role = 'USER' OR role IS NULL;
UPDATE users SET role = 'ROLE_ADMIN' WHERE role = 'ADMIN';