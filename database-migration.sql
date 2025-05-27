-- Create crisis logs table
CREATE TABLE IF NOT EXISTS crisis_logs (
  id SERIAL PRIMARY KEY,
  call_sid VARCHAR(255) NOT NULL,
  transcript_excerpt TEXT,
  escalation_reason VARCHAR(255),
  action_taken VARCHAR(255),
  priority VARCHAR(50),
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  follow_up_required BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create intake forms table
CREATE TABLE IF NOT EXISTS intake_forms (
  id SERIAL PRIMARY KEY,
  call_sid VARCHAR(255) NOT NULL,
  tenant_id UUID REFERENCES tenants(id),
  name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  insurance VARCHAR(255),
  reason TEXT,
  scheduling_preferences JSONB,
  completed_at TIMESTAMPTZ,
  status VARCHAR(50) DEFAULT 'in_progress',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create conversation metrics table
CREATE TABLE IF NOT EXISTS conversation_metrics (
  id SERIAL PRIMARY KEY,
  call_sid VARCHAR(255) NOT NULL,
  duration_seconds INTEGER,
  average_response_time_ms INTEGER,
  intent_accuracy DECIMAL(3,2),
  emotional_state VARCHAR(50),
  escalation_triggered BOOLEAN DEFAULT FALSE,
  user_satisfaction_score INTEGER,
  intake_completed BOOLEAN DEFAULT FALSE,
  total_exchanges INTEGER DEFAULT 0,
  cache_hit_rate DECIMAL(3,2) DEFAULT 0,
  error_count INTEGER DEFAULT 0,
  accessibility_adjustments JSONB,
  quality_score INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_crisis_logs_call_sid ON crisis_logs(call_sid);
CREATE INDEX IF NOT EXISTS idx_crisis_logs_timestamp ON crisis_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_intake_forms_call_sid ON intake_forms(call_sid);
CREATE INDEX IF NOT EXISTS idx_intake_forms_tenant_id ON intake_forms(tenant_id);
CREATE INDEX IF NOT EXISTS idx_conversation_metrics_call_sid ON conversation_metrics(call_sid);
CREATE INDEX IF NOT EXISTS idx_conversation_metrics_created_at ON conversation_metrics(created_at);

-- Add RLS policies
ALTER TABLE crisis_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE intake_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_metrics ENABLE ROW LEVEL SECURITY;

-- Crisis logs policies (admin only)
CREATE POLICY "Crisis logs are viewable by service role" ON crisis_logs
  FOR ALL USING (auth.role() = 'service_role');

-- Intake forms policies
CREATE POLICY "Intake forms are viewable by tenant" ON intake_forms
  FOR ALL USING (auth.role() = 'service_role');

-- Conversation metrics policies
CREATE POLICY "Conversation metrics are viewable by service role" ON conversation_metrics
  FOR ALL USING (auth.role() = 'service_role');
