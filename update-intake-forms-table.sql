-- Update intake_forms table to include all required fields
ALTER TABLE intake_forms 
ADD COLUMN IF NOT EXISTS first_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS last_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS state VARCHAR(10),
ADD COLUMN IF NOT EXISTS service_type VARCHAR(50),
ADD COLUMN IF NOT EXISTS insurance_accepted BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS availability TEXT,
ADD COLUMN IF NOT EXISTS child_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS partner_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS partner_email VARCHAR(255),
ADD COLUMN IF NOT EXISTS partner_phone VARCHAR(50);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_intake_forms_service_type ON intake_forms(service_type);
CREATE INDEX IF NOT EXISTS idx_intake_forms_state ON intake_forms(state);
CREATE INDEX IF NOT EXISTS idx_intake_forms_status ON intake_forms(status);
