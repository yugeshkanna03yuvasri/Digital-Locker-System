-- Add details column to activity_logs table
ALTER TABLE activity_logs ADD COLUMN details TEXT;

-- Add security preference columns to users table if not exists
ALTER TABLE users ADD COLUMN IF NOT EXISTS two_factor_enabled BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS security_preference VARCHAR(20) DEFAULT 'PASSWORD_ONLY';