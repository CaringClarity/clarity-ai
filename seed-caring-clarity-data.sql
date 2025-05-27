-- Seed Caring Clarity Counseling knowledge base and business data

-- First, get the tenant ID for Caring Clarity
DO $$
DECLARE
    caring_clarity_tenant_id UUID;
BEGIN
    -- Get or create Caring Clarity tenant
    INSERT INTO tenants (business_name, business_type, contact_email, phone_number, created_at)
    VALUES ('Caring Clarity Counseling', 'counseling', 'jessica@caringclaritycounseling.com', '855-968-7862', NOW())
    ON CONFLICT (business_name) DO UPDATE SET updated_at = NOW()
    RETURNING id INTO caring_clarity_tenant_id;

    -- If tenant already exists, get the ID
    IF caring_clarity_tenant_id IS NULL THEN
        SELECT id INTO caring_clarity_tenant_id FROM tenants WHERE business_name = 'Caring Clarity Counseling';
    END IF;

    -- Insert business information
    INSERT INTO business_info (
        tenant_id, business_name, mailing_address, billing_address, phone, fax, tax_id, npi,
        director_name, director_phone, director_email, billing_contact_name, billing_contact_email,
        intake_coordinator_name, intake_coordinator_email, created_at
    ) VALUES (
        caring_clarity_tenant_id,
        'Caring Clarity Counseling',
        '1 Union Avenue, Suite #982, Bala Cynwyd, PA 19004',
        '1 Union Avenue, Suite #982, Bala Cynwyd, PA 19004',
        '855-968-7862',
        '215-307-3266',
        '33-2927806',
        '1750192605',
        'Jessica Blanding',
        '856-889-8434',
        'jessica@caringclaritycounseling.com',
        'Alesia McCorkle',
        'alesiam@caringclaritycounseling.com',
        'Stephanie Pietropaolo',
        'stephaniep@caringclaritycounseling.com',
        NOW()
    ) ON CONFLICT (tenant_id) DO UPDATE SET updated_at = NOW();

    -- Insert New Jersey providers
    INSERT INTO providers (tenant_id, name, title, specialties, states, phone, email, active, created_at) VALUES
    (caring_clarity_tenant_id, 'Jodie Reid', 'Licensed Therapist', ARRAY['Individual Therapy', 'Anxiety', 'Depression'], ARRAY['NJ'], NULL, NULL, true, NOW()),
    (caring_clarity_tenant_id, 'Jessica Blanding', 'Director/Licensed Therapist', ARRAY['Individual Therapy', 'Couples Counseling', 'Anxiety'], ARRAY['NJ', 'PA'], '856-889-8434', 'jessica@caringclaritycounseling.com', true, NOW()),
    (caring_clarity_tenant_id, 'Wendy Brown', 'Licensed Therapist', ARRAY['Individual Therapy', 'Trauma', 'PTSD'], ARRAY['NJ'], NULL, NULL, true, NOW()),
    (caring_clarity_tenant_id, 'Marchelle Coleman', 'Licensed Therapist', ARRAY['Individual Therapy', 'Family Therapy'], ARRAY['NJ'], NULL, NULL, true, NOW()),
    (caring_clarity_tenant_id, 'Sheri Colston', 'Licensed Therapist', ARRAY['Individual Therapy', 'Depression', 'Anxiety'], ARRAY['NJ'], NULL, NULL, true, NOW()),
    (caring_clarity_tenant_id, 'Michael Michna', 'Licensed Therapist', ARRAY['Individual Therapy', 'Substance Abuse'], ARRAY['NJ'], NULL, NULL, true, NOW()),
    (caring_clarity_tenant_id, 'Joshelin Cherrez', 'Licensed Therapist', ARRAY['Individual Therapy', 'Bilingual Services'], ARRAY['NJ'], NULL, NULL, true, NOW()),
    (caring_clarity_tenant_id, 'Kimberly Shumacher', 'Licensed Therapist', ARRAY['Individual Therapy', 'Child Therapy'], ARRAY['NJ'], NULL, NULL, true, NOW()),
    (caring_clarity_tenant_id, 'Tina Collins', 'Licensed Therapist', ARRAY['Individual Therapy', 'Couples Counseling'], ARRAY['NJ'], NULL, NULL, true, NOW()),
    (caring_clarity_tenant_id, 'Tamika Montague', 'Licensed Therapist', ARRAY['Individual Therapy', 'Family Therapy'], ARRAY['NJ'], NULL, NULL, true, NOW())
    ON CONFLICT (tenant_id, name) DO UPDATE SET updated_at = NOW();

    -- Insert Pennsylvania providers
    INSERT INTO providers (tenant_id, name, title, specialties, states, phone, email, active, created_at) VALUES
    (caring_clarity_tenant_id, 'Charlene Myers', 'Licensed Therapist', ARRAY['Individual Therapy', 'Anxiety', 'Depression'], ARRAY['PA'], NULL, NULL, true, NOW()),
    (caring_clarity_tenant_id, 'Alkanease Garrett', 'Licensed Therapist', ARRAY['Individual Therapy', 'Trauma'], ARRAY['PA'], NULL, NULL, true, NOW()),
    (caring_clarity_tenant_id, 'Alexis Haines', 'Licensed Therapist', ARRAY['Individual Therapy', 'Child Therapy'], ARRAY['PA'], NULL, NULL, true, NOW()),
    (caring_clarity_tenant_id, 'Cassandra Smith', 'Licensed Therapist', ARRAY['Individual Therapy', 'Family Therapy'], ARRAY['PA'], NULL, NULL, true, NOW())
    ON CONFLICT (tenant_id, name) DO UPDATE SET updated_at = NOW();

    -- Insert accepted insurance providers
    INSERT INTO insurance_providers (tenant_id, name, accepted, notes, created_at) VALUES
    (caring_clarity_tenant_id, 'Aetna', true, 'Fully accepted including EAP services', NOW()),
    (caring_clarity_tenant_id, 'Cigna', true, 'Fully accepted', NOW()),
    (caring_clarity_tenant_id, 'Horizon Blue Cross Blue Shield', true, 'Fully accepted', NOW()),
    (caring_clarity_tenant_id, 'Magellan', true, 'Fully accepted', NOW()),
    (caring_clarity_tenant_id, 'MHC (Mental Health Consultants)', true, 'Fully accepted', NOW()),
    (caring_clarity_tenant_id, 'Evernorth', true, 'Fully accepted', NOW()),
    (caring_clarity_tenant_id, 'United Healthcare', true, 'Fully accepted', NOW()),
    (caring_clarity_tenant_id, 'Optum', true, 'Fully accepted', NOW()),
    (caring_clarity_tenant_id, 'Care Bridge EAP', true, 'Employee Assistance Program', NOW()),
    (caring_clarity_tenant_id, 'Medicaid', false, 'Not accepted', NOW()),
    (caring_clarity_tenant_id, 'Medicare', false, 'Not accepted', NOW())
    ON CONFLICT (tenant_id, name) DO UPDATE SET accepted = EXCLUDED.accepted, notes = EXCLUDED.notes;

    -- Insert knowledge base categories
    INSERT INTO kb_categories (tenant_id, name, description, sort_order, active, created_at) VALUES
    (caring_clarity_tenant_id, 'Services', 'Information about therapy services offered', 1, true, NOW()),
    (caring_clarity_tenant_id, 'Insurance', 'Insurance and payment information', 2, true, NOW()),
    (caring_clarity_tenant_id, 'Policies', 'Practice policies and procedures', 3, true, NOW()),
    (caring_clarity_tenant_id, 'Contact', 'Contact information and hours', 4, true, NOW()),
    (caring_clarity_tenant_id, 'Providers', 'Information about therapists', 5, true, NOW()),
    (caring_clarity_tenant_id, 'Appointments', 'Scheduling and appointment information', 6, true, NOW())
    ON CONFLICT (tenant_id, name) DO UPDATE SET updated_at = NOW();

    -- Insert comprehensive knowledge base entries
    INSERT INTO knowledge_base (tenant_id, category, question, answer, keywords, priority, active, created_at) VALUES
    
    -- Service Information
    (caring_clarity_tenant_id, 'Services', 'What services do you offer?', 'We provide individual therapy, couples counseling, and child therapy (ages 10 and older). All services are provided via telehealth only - we do not offer in-person sessions.', ARRAY['services', 'therapy', 'counseling', 'individual', 'couples', 'child'], 10, true, NOW()),
    
    (caring_clarity_tenant_id, 'Services', 'Do you work with children?', 'Yes, we provide child therapy services, but only for children ages 10 and older. We do not work with children under 10 years of age.', ARRAY['children', 'child therapy', 'kids', 'age limit', 'young'], 10, true, NOW()),
    
    (caring_clarity_tenant_id, 'Services', 'Do you offer in-person sessions?', 'No, we provide virtual/telehealth services only. All sessions are conducted online via secure video conferencing.', ARRAY['in-person', 'telehealth', 'virtual', 'online', 'video'], 10, true, NOW()),
    
    -- Insurance Information
    (caring_clarity_tenant_id, 'Insurance', 'What insurance do you accept?', 'We accept Aetna, Cigna, Horizon Blue Cross Blue Shield, Magellan, MHC (Mental Health Consultants), Evernorth, United Healthcare, Optum, and Care Bridge EAP. We do not accept Medicaid or Medicare.', ARRAY['insurance', 'accepted', 'coverage', 'aetna', 'cigna', 'blue cross', 'united'], 10, true, NOW()),
    
    (caring_clarity_tenant_id, 'Insurance', 'Do you accept Medicaid or Medicare?', 'No, we do not accept Medicaid or Medicare. We accept private insurance plans and self-pay clients.', ARRAY['medicaid', 'medicare', 'government insurance'], 10, true, NOW()),
    
    (caring_clarity_tenant_id, 'Insurance', 'Do you accept self-pay clients?', 'Yes, we accept self-pay clients. Please contact us for current rates and payment options.', ARRAY['self-pay', 'out of pocket', 'private pay', 'cash'], 8, true, NOW()),
    
    -- Policies
    (caring_clarity_tenant_id, 'Policies', 'What is your cancellation policy?', 'If an appointment is canceled with less than 24 hours notice, a $125 late cancellation fee may be applied.', ARRAY['cancellation', 'cancel', 'reschedule', 'policy', 'fee', '24 hours'], 9, true, NOW()),
    
    (caring_clarity_tenant_id, 'Policies', 'Do you provide court ordered services?', 'No, we do not provide supervised visitation or court ordered services.', ARRAY['court', 'supervised visitation', 'legal', 'mandated'], 8, true, NOW()),
    
    -- Contact Information
    (caring_clarity_tenant_id, 'Contact', 'What are your hours?', 'Our office hours are Monday through Friday, 9 AM to 5 PM. We also offer evening and weekend appointments based on provider availability.', ARRAY['hours', 'schedule', 'time', 'open', 'closed'], 8, true, NOW()),
    
    (caring_clarity_tenant_id, 'Contact', 'What is your phone number?', 'Our main phone number is 855-968-7862.', ARRAY['phone', 'number', 'call', 'contact'], 8, true, NOW()),
    
    (caring_clarity_tenant_id, 'Contact', 'What is your address?', 'Our mailing and billing address is 1 Union Avenue, Suite #982, Bala Cynwyd, PA 19004.', ARRAY['address', 'location', 'mailing', 'billing'], 7, true, NOW()),
    
    (caring_clarity_tenant_id, 'Contact', 'What is your fax number?', 'Our fax number is 215-307-3266.', ARRAY['fax', 'fax number'], 5, true, NOW()),
    
    -- Provider Information
    (caring_clarity_tenant_id, 'Providers', 'Who are your New Jersey providers?', 'Our New Jersey providers include Jodie Reid, Jessica Blanding, Wendy Brown, Marchelle Coleman, Sheri Colston, Michael Michna, Joshelin Cherrez, Kimberly Shumacher, Tina Collins, and Tamika Montague.', ARRAY['providers', 'therapists', 'new jersey', 'nj', 'staff'], 7, true, NOW()),
    
    (caring_clarity_tenant_id, 'Providers', 'Who are your Pennsylvania providers?', 'Our Pennsylvania providers include Jessica Blanding, Charlene Myers, Alkanease Garrett, Alexis Haines, and Cassandra Smith.', ARRAY['providers', 'therapists', 'pennsylvania', 'pa', 'staff'], 7, true, NOW()),
    
    (caring_clarity_tenant_id, 'Providers', 'Who is the director?', 'Jessica Blanding is our Director. You can reach her at 856-889-8434 or jessica@caringclaritycounseling.com.', ARRAY['director', 'jessica blanding', 'manager', 'supervisor'], 6, true, NOW()),
    
    -- Appointment Information
    (caring_clarity_tenant_id, 'Appointments', 'How quickly can you schedule new clients?', 'We have open availability and are currently accepting new referrals. We can typically get new clients scheduled within 48 business hours, especially for EAP referrals.', ARRAY['availability', 'schedule', 'new clients', 'eap', 'referrals', 'openings'], 9, true, NOW()),
    
    (caring_clarity_tenant_id, 'Appointments', 'Are you accepting new clients?', 'Yes, we are currently accepting new clients and have open availability. We can schedule new clients within 48 business hours.', ARRAY['accepting', 'new clients', 'availability', 'openings'], 9, true, NOW()),
    
    -- EAP Specific
    (caring_clarity_tenant_id, 'Appointments', 'Do you work with EAP programs?', 'Yes, we work with various Employee Assistance Programs including Aetna EAP and Care Bridge EAP. We have open availability and can schedule EAP referrals within 48 business hours.', ARRAY['eap', 'employee assistance', 'aetna eap', 'care bridge', 'work'], 9, true, NOW()),
    
    -- Billing
    (caring_clarity_tenant_id, 'Contact', 'Who handles billing questions?', 'For billing questions, please contact Alesia McCorkle at alesiam@caringclaritycounseling.com or leave a message and our billing team will respond quickly.', ARRAY['billing', 'payment', 'insurance claims', 'alesia'], 8, true, NOW()),
    
    -- Intake
    (caring_clarity_tenant_id, 'Contact', 'Who is the intake coordinator?', 'Stephanie Pietropaolo is our Intake Coordinator. You can reach her at stephaniep@caringclaritycounseling.com.', ARRAY['intake', 'coordinator', 'stephanie', 'new client'], 7, true, NOW());

END $$;
