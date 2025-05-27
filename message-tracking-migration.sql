-- Create staff messages table for tracking all messages sent to staff
CREATE TABLE IF NOT EXISTS staff_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id),
  message_type VARCHAR(50) NOT NULL,
  urgency VARCHAR(20) NOT NULL,
  caller_name VARCHAR(255),
  caller_phone VARCHAR(50),
  caller_email VARCHAR(255),
  content TEXT NOT NULL,
  call_sid VARCHAR(255),
  routing_info JSONB,
  additional_data JSONB DEFAULT '{}',
  status VARCHAR(20) DEFAULT 'pending',
  delivery_results JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_staff_messages_tenant_id ON staff_messages(tenant_id);
CREATE INDEX IF NOT EXISTS idx_staff_messages_type ON staff_messages(message_type);
CREATE INDEX IF NOT EXISTS idx_staff_messages_urgency ON staff_messages(urgency);
CREATE INDEX IF NOT EXISTS idx_staff_messages_status ON staff_messages(status);
CREATE INDEX IF NOT EXISTS idx_staff_messages_created_at ON staff_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_staff_messages_call_sid ON staff_messages(call_sid);

-- Enable RLS
ALTER TABLE staff_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policy
CREATE POLICY "Staff messages accessible by service role" ON staff_messages
  FOR ALL USING (auth.role() = 'service_role');
