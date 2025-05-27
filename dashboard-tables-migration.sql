-- Dashboard Tables Migration
-- Creates all tables needed for the enhanced dashboard

-- Conversations table (main call records)
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    call_sid VARCHAR(255) UNIQUE,
    user_id VARCHAR(255),
    channel VARCHAR(50) NOT NULL DEFAULT 'voice', -- 'voice', 'sms', 'web'
    status VARCHAR(50) NOT NULL DEFAULT 'active', -- 'active', 'completed', 'failed', 'abandoned'
    intent VARCHAR(255),
    duration_seconds INTEGER DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE,
    context JSONB DEFAULT '{}',
    transcript TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Conversation metrics table (performance data)
CREATE TABLE IF NOT EXISTS conversation_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    call_sid VARCHAR(255) NOT NULL,
    duration_seconds INTEGER DEFAULT 0,
    average_response_time_ms INTEGER DEFAULT 0,
    intent_accuracy DECIMAL(5,2) DEFAULT 0,
    emotional_state VARCHAR(100),
    escalation_triggered BOOLEAN DEFAULT FALSE,
    user_satisfaction_score INTEGER,
    intake_completed BOOLEAN DEFAULT FALSE,
    total_exchanges INTEGER DEFAULT 0,
    cache_hit_rate DECIMAL(5,2) DEFAULT 0,
    error_count INTEGER DEFAULT 0,
    accessibility_adjustments JSONB DEFAULT '{}',
    quality_score INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crisis logs table (crisis intervention tracking)
CREATE TABLE IF NOT EXISTS crisis_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    call_sid VARCHAR(255),
    user_id VARCHAR(255),
    crisis_type VARCHAR(100) NOT NULL, -- 'suicide', 'self_harm', 'domestic_violence', 'substance_abuse'
    severity_level VARCHAR(50) NOT NULL DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
    intervention_taken TEXT,
    follow_up_required BOOLEAN DEFAULT TRUE,
    follow_up_completed BOOLEAN DEFAULT FALSE,
    staff_notified BOOLEAN DEFAULT FALSE,
    emergency_services_contacted BOOLEAN DEFAULT FALSE,
    transcript_excerpt TEXT,
    metadata JSONB DEFAULT '{}',
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- Staff messages table (message routing logs)
CREATE TABLE IF NOT EXISTS staff_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    call_sid VARCHAR(255),
    message_type VARCHAR(100) NOT NULL, -- 'escalation', 'crisis_alert', 'follow_up', 'system_notification'
    priority VARCHAR(50) NOT NULL DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
    subject VARCHAR(255),
    message TEXT NOT NULL,
    recipient_email VARCHAR(255),
    sent_successfully BOOLEAN DEFAULT FALSE,
    delivery_status VARCHAR(100) DEFAULT 'pending', -- 'pending', 'sent', 'delivered', 'failed'
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    sent_at TIMESTAMP WITH TIME ZONE
);

-- Intake forms table (client onboarding data)
CREATE TABLE IF NOT EXISTS intake_forms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    call_sid VARCHAR(255),
    user_id VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'in_progress', -- 'in_progress', 'completed', 'abandoned', 'requires_follow_up'
    form_data JSONB NOT NULL DEFAULT '{}',
    completion_percentage INTEGER DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- System health logs table (for monitoring)
CREATE TABLE IF NOT EXISTS system_health_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_name VARCHAR(100) NOT NULL, -- 'deepgram', 'groq', 'twilio', 'supabase'
    status VARCHAR(50) NOT NULL, -- 'healthy', 'degraded', 'down'
    response_time_ms INTEGER,
    error_message TEXT,
    metadata JSONB DEFAULT '{}',
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_conversations_created_at ON conversations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_status ON conversations(status);
CREATE INDEX IF NOT EXISTS idx_conversations_channel ON conversations(channel);
CREATE INDEX IF NOT EXISTS idx_conversations_call_sid ON conversations(call_sid);

CREATE INDEX IF NOT EXISTS idx_conversation_metrics_created_at ON conversation_metrics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversation_metrics_call_sid ON conversation_metrics(call_sid);

CREATE INDEX IF NOT EXISTS idx_crisis_logs_timestamp ON crisis_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_crisis_logs_severity ON crisis_logs(severity_level);
CREATE INDEX IF NOT EXISTS idx_crisis_logs_follow_up ON crisis_logs(follow_up_required);

CREATE INDEX IF NOT EXISTS idx_staff_messages_created_at ON staff_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_staff_messages_priority ON staff_messages(priority);
CREATE INDEX IF NOT EXISTS idx_staff_messages_type ON staff_messages(message_type);

CREATE INDEX IF NOT EXISTS idx_intake_forms_created_at ON intake_forms(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_intake_forms_status ON intake_forms(status);

CREATE INDEX IF NOT EXISTS idx_system_health_timestamp ON system_health_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_system_health_service ON system_health_logs(service_name);

-- Add Row Level Security (RLS) policies
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE crisis_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE intake_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_health_logs ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all operations for service role)
CREATE POLICY "Allow service role full access" ON conversations FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow service role full access" ON conversation_metrics FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow service role full access" ON crisis_logs FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow service role full access" ON staff_messages FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow service role full access" ON intake_forms FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow service role full access" ON system_health_logs FOR ALL USING (auth.role() = 'service_role');
