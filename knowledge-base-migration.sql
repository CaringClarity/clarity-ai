-- Create knowledge base tables for multi-tenant system

-- Main knowledge base table
CREATE TABLE IF NOT EXISTS knowledge_base (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id),
  category VARCHAR(100) NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  keywords TEXT[] DEFAULT '{}',
  priority INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  is_template BOOLEAN DEFAULT false, -- For shared templates
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Knowledge base categories for organization
CREATE TABLE IF NOT EXISTS kb_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Provider information table
CREATE TABLE IF NOT EXISTS providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id),
  name VARCHAR(255) NOT NULL,
  title VARCHAR(100),
  specialties TEXT[],
  states TEXT[], -- States where they practice
  phone VARCHAR(50),
  email VARCHAR(255),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Business information table
CREATE TABLE IF NOT EXISTS business_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id),
  business_name VARCHAR(255) NOT NULL,
  mailing_address TEXT,
  billing_address TEXT,
  phone VARCHAR(50),
  fax VARCHAR(50),
  tax_id VARCHAR(50),
  npi VARCHAR(50),
  director_name VARCHAR(255),
  director_phone VARCHAR(50),
  director_email VARCHAR(255),
  billing_contact_name VARCHAR(255),
  billing_contact_email VARCHAR(255),
  intake_coordinator_name VARCHAR(255),
  intake_coordinator_email VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insurance providers table
CREATE TABLE IF NOT EXISTS insurance_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id),
  name VARCHAR(255) NOT NULL,
  accepted BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_knowledge_base_tenant_id ON knowledge_base(tenant_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_category ON knowledge_base(category);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_keywords ON knowledge_base USING GIN(keywords);
CREATE INDEX IF NOT EXISTS idx_providers_tenant_id ON providers(tenant_id);
CREATE INDEX IF NOT EXISTS idx_providers_states ON providers USING GIN(states);
CREATE INDEX IF NOT EXISTS idx_business_info_tenant_id ON business_info(tenant_id);
CREATE INDEX IF NOT EXISTS idx_insurance_providers_tenant_id ON insurance_providers(tenant_id);

-- Enable RLS
ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE kb_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE insurance_providers ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Knowledge base accessible by service role" ON knowledge_base
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Categories accessible by service role" ON kb_categories
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Providers accessible by service role" ON providers
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Business info accessible by service role" ON business_info
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Insurance providers accessible by service role" ON insurance_providers
  FOR ALL USING (auth.role() = 'service_role');
