-- Add password protection columns to documents table
ALTER TABLE documents ADD COLUMN is_password_protected BOOLEAN DEFAULT FALSE;
ALTER TABLE documents ADD COLUMN password_hash VARCHAR(255);

-- Add password protection columns to folders table  
ALTER TABLE folders ADD COLUMN is_password_protected BOOLEAN DEFAULT FALSE;
ALTER TABLE folders ADD COLUMN password_hash VARCHAR(255);

-- Update existing records to have default values
UPDATE documents SET is_password_protected = FALSE WHERE is_password_protected IS NULL;
UPDATE folders SET is_password_protected = FALSE WHERE is_password_protected IS NULL;