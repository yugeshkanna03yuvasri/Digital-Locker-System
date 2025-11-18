-- Add access logs table
CREATE TABLE IF NOT EXISTS access_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    document_id BIGINT,
    action VARCHAR(50) NOT NULL,
    success BOOLEAN NOT NULL DEFAULT FALSE,
    ip_address VARCHAR(45),
    user_agent TEXT,
    timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    details TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
    INDEX idx_user_timestamp (user_id, timestamp),
    INDEX idx_document_timestamp (document_id, timestamp),
    INDEX idx_action (action),
    INDEX idx_success (success)
);

-- Add security fields to users table for future features
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS two_factor_enabled BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS two_factor_secret VARCHAR(255),
ADD COLUMN IF NOT EXISTS failed_login_attempts INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS account_locked_until DATETIME,
ADD COLUMN IF NOT EXISTS last_login DATETIME,
ADD COLUMN IF NOT EXISTS allowed_ips TEXT,
ADD COLUMN IF NOT EXISTS trusted_devices TEXT;

-- Add encryption fields to documents table
ALTER TABLE documents 
ADD COLUMN IF NOT EXISTS is_encrypted BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS encryption_key_hash VARCHAR(255);

-- Add encryption fields to folders table  
ALTER TABLE folders
ADD COLUMN IF NOT EXISTS is_encrypted BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS encryption_key_hash VARCHAR(255);

-- Create security events table for future audit trail
CREATE TABLE IF NOT EXISTS security_events (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    event_type VARCHAR(50) NOT NULL,
    event_data JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    severity ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') DEFAULT 'LOW',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_timestamp (user_id, timestamp),
    INDEX idx_event_type (event_type),
    INDEX idx_severity (severity)
);

-- Insert sample security events for demo
INSERT INTO security_events (user_id, event_type, event_data, ip_address, severity) VALUES
(1, 'PASSWORD_POLICY_VIOLATION', '{"reason": "Password too weak"}', '127.0.0.1', 'MEDIUM'),
(1, 'SUSPICIOUS_LOGIN', '{"location": "Unknown", "device": "New device"}', '192.168.1.100', 'HIGH');