-- =====================================================
-- Migration V20: Enhance Risk Assessment Module for Wizard
-- =====================================================
-- Purpose: Add treatment plans table and enhance threat_assessments
-- Date: 2025-11-13
-- =====================================================

-- =====================================================
-- 1. CREATE RISK TREATMENT PLANS TABLE
-- =====================================================

CREATE TABLE risk_treatment_plans (
    id BIGSERIAL PRIMARY KEY,
    threat_assessment_id BIGINT NOT NULL,
    
    -- Treatment details
    treatment_option VARCHAR(50) NOT NULL,
    action_description TEXT,
    action_owner VARCHAR(255),
    target_date DATE,
    
    -- Status tracking
    status VARCHAR(50) DEFAULT 'PLANNED',
    completion_date DATE,
    effectiveness_review TEXT,
    
    -- Audit fields
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255) DEFAULT 'system',
    updated_by VARCHAR(255) DEFAULT 'system',
    version INT DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE,
    
    CONSTRAINT fk_treatment_plan_threat_assessment 
        FOREIGN KEY (threat_assessment_id) 
        REFERENCES threat_assessments(id) 
        ON DELETE CASCADE
);

-- Create indexes for performance
CREATE INDEX idx_treatment_plans_threat_assessment ON risk_treatment_plans(threat_assessment_id);
CREATE INDEX idx_treatment_plans_status ON risk_treatment_plans(status);
CREATE INDEX idx_treatment_plans_owner ON risk_treatment_plans(action_owner);

-- =====================================================
-- 2. ENHANCE THREAT_ASSESSMENTS TABLE
-- =====================================================

-- Add velocity and vulnerability fields
ALTER TABLE threat_assessments ADD COLUMN IF NOT EXISTS velocity VARCHAR(50);
ALTER TABLE threat_assessments ADD COLUMN IF NOT EXISTS vulnerability VARCHAR(50);
ALTER TABLE threat_assessments ADD COLUMN IF NOT EXISTS treatment_option VARCHAR(50);

-- Add residual risk fields
ALTER TABLE threat_assessments ADD COLUMN IF NOT EXISTS residual_likelihood VARCHAR(50);
ALTER TABLE threat_assessments ADD COLUMN IF NOT EXISTS residual_impact VARCHAR(50);
ALTER TABLE threat_assessments ADD COLUMN IF NOT EXISTS residual_risk_score INTEGER;

-- Add is_selected flag for threat selection step
ALTER TABLE threat_assessments ADD COLUMN IF NOT EXISTS is_selected BOOLEAN DEFAULT TRUE;

-- =====================================================
-- 3. ENHANCE RISK_ASSESSMENTS TABLE
-- =====================================================

-- Add risk threshold configuration
ALTER TABLE risk_assessments ADD COLUMN IF NOT EXISTS risk_threshold INTEGER DEFAULT 12;

-- Add completion percentage
ALTER TABLE risk_assessments ADD COLUMN IF NOT EXISTS completion_percentage INTEGER DEFAULT 0;

-- Add current step tracking
ALTER TABLE risk_assessments ADD COLUMN IF NOT EXISTS current_step INTEGER DEFAULT 1;

-- =====================================================
-- 4. INSERT SAMPLE DATA (Optional - for testing)
-- =====================================================

-- This section can be used to create a sample RA for testing
-- Uncomment if you want sample data

/*
-- Sample Risk Assessment
INSERT INTO risk_assessments (
    assessment_name, description, risk_category_id, context_type, context_id, 
    context_name, status, assessment_date, assessor_name, assessor_email,
    created_at, created_by, is_deleted
) VALUES (
    'Q4 2025 Payroll Process Risk Assessment',
    'Comprehensive risk assessment for payroll processing',
    (SELECT id FROM risk_categories WHERE code = 'PROCESS' LIMIT 1),
    'PROCESS',
    1,
    'Payroll Processing',
    'DRAFT',
    CURRENT_DATE,
    'John Doe',
    'john.doe@company.com',
    CURRENT_TIMESTAMP,
    'system',
    FALSE
);
*/

-- =====================================================
-- 5. ADD COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON TABLE risk_treatment_plans IS 'Treatment plans for high-risk threats requiring mitigation actions';
COMMENT ON COLUMN risk_treatment_plans.treatment_option IS 'Treatment strategy: ACCEPT, MITIGATE, TRANSFER, AVOID';
COMMENT ON COLUMN risk_treatment_plans.status IS 'Plan status: PLANNED, IN_PROGRESS, COMPLETED, CANCELLED';

COMMENT ON COLUMN threat_assessments.velocity IS 'Speed at which threat materializes: SLOW, MODERATE, FAST, IMMEDIATE';
COMMENT ON COLUMN threat_assessments.vulnerability IS 'Control weakness level: LOW, MEDIUM, HIGH, CRITICAL';
COMMENT ON COLUMN threat_assessments.treatment_option IS 'Selected treatment option for this threat';
COMMENT ON COLUMN threat_assessments.is_selected IS 'Whether this threat is included in the assessment';

COMMENT ON COLUMN risk_assessments.risk_threshold IS 'Risk score threshold (L×I) above which treatment plans are required';
COMMENT ON COLUMN risk_assessments.completion_percentage IS 'Wizard completion percentage (0-100)';
COMMENT ON COLUMN risk_assessments.current_step IS 'Current wizard step (1-7)';

-- =====================================================
-- END OF MIGRATION V20
-- =====================================================

