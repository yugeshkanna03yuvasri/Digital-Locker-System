-- Add missing columns to existing users table
USE digital_lock_db;

-- Add phone column if it doesn't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20);

-- Add company column if it doesn't exist  
ALTER TABLE users ADD COLUMN IF NOT EXISTS company VARCHAR(100);

-- Add job_title column if it doesn't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS job_title VARCHAR(100);

-- Verify the columns were added
DESCRIBE users;