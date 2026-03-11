-- V8: Polymorphic BIA Hub Architecture Migration
-- 
-- This migration transforms the BIA system into a flexible hub-and-spoke model:
-- 1. Enhances bia_records to support polymorphic targeting (ANY library item)
-- 2. Creates BIA questionnaire tables (questions and answers)
-- 3. Creates BETH3V dependency junction tables
-- 4. Adds gap analysis support
-- 5. Enables roll-up and aggregation capabilities
--
-- ARCHITECTURE:
-- - Hub: bia_records table with polymorphic targeting
-- - Spokes: Junction tables linking to BETH3V libraries
-- - Engine: Questionnaire system for impact analysis
-- - Output: Gap analysis comparing requirements vs capabilities

-- ============================================================================
-- STEP 1: Enhance bia_records table for polymorphic targeting
-- ============================================================================

-- Add new columns for polymorphic targeting
ALTER TABLE bia_records ADD COLUMN IF NOT EXISTS bia_target_id BIGINT;
ALTER TABLE bia_records ADD COLUMN IF NOT EXISTS bia_target_type VARCHAR(50);

-- Add new columns for enhanced BIA data
ALTER TABLE bia_records ADD COLUMN IF NOT EXISTS analysis_date DATE;
ALTER TABLE bia_records ADD COLUMN IF NOT EXISTS final_rto_hours INTEGER;
ALTER TABLE bia_records ADD COLUMN IF NOT EXISTS final_rpo_hours INTEGER;
ALTER TABLE bia_records ADD COLUMN IF NOT EXISTS final_criticality VARCHAR(50);
ALTER TABLE bia_records ADD COLUMN IF NOT EXISTS bia_coordinator VARCHAR(255);

-- Migrate existing data to new polymorphic structure
UPDATE bia_records
SET bia_target_id = process_id,
    bia_target_type = 'PROCESS',
    final_rto_hours = rto_hours,
    final_rpo_hours = rpo_hours
WHERE process_id IS NOT NULL;

UPDATE bia_records
SET bia_target_id = unit_id,
    bia_target_type = 'ORGANIZATIONAL_UNIT',
    final_rto_hours = rto_hours,
    final_rpo_hours = rpo_hours
WHERE unit_id IS NOT NULL;

-- Add indexes for polymorphic targeting
CREATE INDEX IF NOT EXISTS idx_bia_target ON bia_records(bia_target_id, bia_target_type);
CREATE INDEX IF NOT EXISTS idx_bia_criticality ON bia_records(final_criticality);

-- Add recovery_time_capability to assets table for gap analysis
ALTER TABLE assets ADD COLUMN IF NOT EXISTS recovery_time_capability INTEGER;

-- Drop old constraint that required unit_id OR process_id
ALTER TABLE bia_records DROP CONSTRAINT IF EXISTS chk_bia_link;

-- Add check constraint for valid target types (matching Java enum names)
ALTER TABLE bia_records DROP CONSTRAINT IF EXISTS chk_bia_target_type;
ALTER TABLE bia_records ADD CONSTRAINT chk_bia_target_type
    CHECK (bia_target_type IN ('PROCESS', 'ORGANIZATIONAL_UNIT', 'ASSET', 'LOCATION', 'SERVICE', 'VENDOR', 'VITAL_RECORD'));

-- Add check constraint for valid criticality levels (matching Java enum names)
ALTER TABLE bia_records DROP CONSTRAINT IF EXISTS chk_bia_criticality;
ALTER TABLE bia_records ADD CONSTRAINT chk_bia_criticality
    CHECK (final_criticality IS NULL OR final_criticality IN ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW'));

-- ============================================================================
-- STEP 2: Create BIA Questionnaire Tables
-- ============================================================================

CREATE TABLE IF NOT EXISTS bia_questions (
    -- Primary Key
    id BIGSERIAL PRIMARY KEY,
    
    -- Question Details
    question_code VARCHAR(50) UNIQUE NOT NULL,
    question_text TEXT NOT NULL,
    question_category VARCHAR(100) NOT NULL,  -- 'Financial', 'Operational', 'Reputational', 'Regulatory', 'Customer'
    question_type VARCHAR(50) NOT NULL,  -- 'MULTIPLE_CHOICE', 'NUMERIC', 'TEXT', 'TIMEFRAME'
    
    -- Impact Timeframe (for timeframe-based questions)
    impact_timeframe VARCHAR(50),  -- '1_HOUR', '4_HOURS', '24_HOURS', '3_DAYS', '1_WEEK'
    
    -- Scoring Configuration
    weight INTEGER DEFAULT 1,  -- Weight for RTO/RPO calculation
    is_active BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    
    -- Answer Options (JSON for multiple choice)
    answer_options TEXT,  -- JSON array: [{"value": "None", "score": 0}, {"value": "Low", "score": 1}, ...]
    
    -- Help Text
    help_text TEXT,
    
    -- Audit Fields
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(255),
    version BIGINT DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE,
    
    -- Constraints
    CONSTRAINT chk_question_category CHECK (question_category IN ('Financial', 'Operational', 'Reputational', 'Regulatory', 'Customer', 'Safety')),
    CONSTRAINT chk_question_type CHECK (question_type IN ('MULTIPLE_CHOICE', 'NUMERIC', 'TEXT', 'TIMEFRAME'))
);

CREATE INDEX idx_bia_questions_category ON bia_questions(question_category);
CREATE INDEX idx_bia_questions_active ON bia_questions(is_active);
CREATE INDEX idx_bia_questions_order ON bia_questions(display_order);

CREATE TABLE IF NOT EXISTS bia_answers (
    -- Primary Key
    id BIGSERIAL PRIMARY KEY,
    
    -- Relationships
    bia_id BIGINT NOT NULL,
    question_id BIGINT NOT NULL,
    
    -- Answer Data
    answer_value TEXT,  -- The actual answer (text, number, or selected option)
    answer_score INTEGER,  -- Calculated score for this answer
    answer_notes TEXT,  -- Additional notes/justification
    
    -- Audit Fields
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(255),
    version BIGINT DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE,
    
    -- Foreign Keys
    CONSTRAINT fk_answer_bia FOREIGN KEY (bia_id) 
        REFERENCES bia_records(id) ON DELETE CASCADE,
    CONSTRAINT fk_answer_question FOREIGN KEY (question_id) 
        REFERENCES bia_questions(id) ON DELETE CASCADE,
    
    -- Unique constraint: one answer per question per BIA
    CONSTRAINT uk_bia_question UNIQUE (bia_id, question_id)
);

CREATE INDEX idx_bia_answers_bia ON bia_answers(bia_id);
CREATE INDEX idx_bia_answers_question ON bia_answers(question_id);

-- ============================================================================
-- STEP 3: Create BETH3V Dependency Junction Tables
-- ============================================================================

-- BIA -> Assets (Buildings, Equipment, Technology)
CREATE TABLE IF NOT EXISTS bia_dependent_assets (
    id BIGSERIAL PRIMARY KEY,
    bia_id BIGINT NOT NULL,
    asset_id BIGINT NOT NULL,
    dependency_type VARCHAR(50) DEFAULT 'REQUIRED',  -- 'REQUIRED', 'IMPORTANT', 'OPTIONAL'
    notes TEXT,

    -- Audit Fields
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(255),
    version BIGINT DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE,

    -- Foreign Keys
    CONSTRAINT fk_bia_dep_asset_bia FOREIGN KEY (bia_id)
        REFERENCES bia_records(id) ON DELETE CASCADE,
    CONSTRAINT fk_bia_dep_asset_asset FOREIGN KEY (asset_id)
        REFERENCES assets(id) ON DELETE CASCADE,

    -- Unique constraint
    CONSTRAINT uk_bia_asset UNIQUE (bia_id, asset_id),

    -- Check constraint
    CONSTRAINT chk_dep_asset_type CHECK (dependency_type IN ('REQUIRED', 'IMPORTANT', 'OPTIONAL'))
);

CREATE INDEX idx_bia_dep_assets_bia ON bia_dependent_assets(bia_id);
CREATE INDEX idx_bia_dep_assets_asset ON bia_dependent_assets(asset_id);

-- BIA -> People (Human Resources)
CREATE TABLE IF NOT EXISTS bia_dependent_people (
    id BIGSERIAL PRIMARY KEY,
    bia_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    role_in_bia VARCHAR(255),  -- 'Key Personnel', 'Recovery Team', 'Subject Matter Expert'
    is_critical BOOLEAN DEFAULT FALSE,
    notes TEXT,

    -- Audit Fields
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(255),
    version BIGINT DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE,

    -- Foreign Keys
    CONSTRAINT fk_bia_dep_people_bia FOREIGN KEY (bia_id)
        REFERENCES bia_records(id) ON DELETE CASCADE,
    CONSTRAINT fk_bia_dep_people_user FOREIGN KEY (user_id)
        REFERENCES users(id) ON DELETE CASCADE,

    -- Unique constraint
    CONSTRAINT uk_bia_user UNIQUE (bia_id, user_id)
);

CREATE INDEX idx_bia_dep_people_bia ON bia_dependent_people(bia_id);
CREATE INDEX idx_bia_dep_people_user ON bia_dependent_people(user_id);

-- BIA -> Vendors (3rd Parties)
CREATE TABLE IF NOT EXISTS bia_dependent_vendors (
    id BIGSERIAL PRIMARY KEY,
    bia_id BIGINT NOT NULL,
    vendor_id BIGINT NOT NULL,
    service_provided TEXT,
    dependency_type VARCHAR(50) DEFAULT 'REQUIRED',
    notes TEXT,

    -- Audit Fields
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(255),
    version BIGINT DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE,

    -- Foreign Keys
    CONSTRAINT fk_bia_dep_vendor_bia FOREIGN KEY (bia_id)
        REFERENCES bia_records(id) ON DELETE CASCADE,
    CONSTRAINT fk_bia_dep_vendor_vendor FOREIGN KEY (vendor_id)
        REFERENCES vendors(id) ON DELETE CASCADE,

    -- Unique constraint
    CONSTRAINT uk_bia_vendor UNIQUE (bia_id, vendor_id),

    -- Check constraint
    CONSTRAINT chk_dep_vendor_type CHECK (dependency_type IN ('REQUIRED', 'IMPORTANT', 'OPTIONAL'))
);

CREATE INDEX idx_bia_dep_vendors_bia ON bia_dependent_vendors(bia_id);
CREATE INDEX idx_bia_dep_vendors_vendor ON bia_dependent_vendors(vendor_id);

-- BIA -> Vital Records (Data/Documents)
CREATE TABLE IF NOT EXISTS bia_dependent_vital_records (
    id BIGSERIAL PRIMARY KEY,
    bia_id BIGINT NOT NULL,
    vital_record_id BIGINT NOT NULL,
    dependency_type VARCHAR(50) DEFAULT 'REQUIRED',
    notes TEXT,

    -- Audit Fields
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(255),
    version BIGINT DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE,

    -- Foreign Keys
    CONSTRAINT fk_bia_dep_vr_bia FOREIGN KEY (bia_id)
        REFERENCES bia_records(id) ON DELETE CASCADE,
    CONSTRAINT fk_bia_dep_vr_vr FOREIGN KEY (vital_record_id)
        REFERENCES vital_records(id) ON DELETE CASCADE,

    -- Unique constraint
    CONSTRAINT uk_bia_vital_record UNIQUE (bia_id, vital_record_id),

    -- Check constraint
    CONSTRAINT chk_dep_vr_type CHECK (dependency_type IN ('REQUIRED', 'IMPORTANT', 'OPTIONAL'))
);

CREATE INDEX idx_bia_dep_vr_bia ON bia_dependent_vital_records(bia_id);
CREATE INDEX idx_bia_dep_vr_vr ON bia_dependent_vital_records(vital_record_id);

-- BIA -> Processes (for roll-ups and dependencies)
CREATE TABLE IF NOT EXISTS bia_dependent_processes (
    id BIGSERIAL PRIMARY KEY,
    bia_id BIGINT NOT NULL,
    process_id BIGINT NOT NULL,
    dependency_type VARCHAR(50) DEFAULT 'REQUIRED',
    notes TEXT,

    -- Audit Fields
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(255),
    version BIGINT DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE,

    -- Foreign Keys
    CONSTRAINT fk_bia_dep_proc_bia FOREIGN KEY (bia_id)
        REFERENCES bia_records(id) ON DELETE CASCADE,
    CONSTRAINT fk_bia_dep_proc_process FOREIGN KEY (process_id)
        REFERENCES processes(id) ON DELETE CASCADE,

    -- Unique constraint
    CONSTRAINT uk_bia_process UNIQUE (bia_id, process_id),

    -- Check constraint
    CONSTRAINT chk_dep_proc_type CHECK (dependency_type IN ('REQUIRED', 'IMPORTANT', 'OPTIONAL'))
);

CREATE INDEX idx_bia_dep_proc_bia ON bia_dependent_processes(bia_id);
CREATE INDEX idx_bia_dep_proc_process ON bia_dependent_processes(process_id);

-- ============================================================================
-- STEP 4: Add Comments for Documentation
-- ============================================================================

COMMENT ON TABLE bia_records IS 'Polymorphic BIA Hub - can analyze ANY item from ANY library (Process, Unit, Asset, Location, Service, Vendor, VitalRecord)';
COMMENT ON COLUMN bia_records.bia_target_id IS 'ID of the item being analyzed (polymorphic)';
COMMENT ON COLUMN bia_records.bia_target_type IS 'Type of item being analyzed: Process, OrganizationalUnit, Asset, Location, Service, Vendor, VitalRecord';
COMMENT ON COLUMN bia_records.creation_type IS 'DIRECT = manual analysis, AGGREGATED = calculated from child BIAs';
COMMENT ON COLUMN bia_records.final_rto_hours IS 'Final approved Recovery Time Objective in hours';
COMMENT ON COLUMN bia_records.final_rpo_hours IS 'Final approved Recovery Point Objective in hours';
COMMENT ON COLUMN bia_records.final_criticality IS 'Final approved criticality: Critical, High, Medium, Low';

COMMENT ON TABLE bia_questions IS 'Master questionnaire for BIA impact analysis';
COMMENT ON TABLE bia_answers IS 'User responses to BIA questionnaire questions';

COMMENT ON TABLE bia_dependent_assets IS 'Links BIAs to required Assets (Buildings, Equipment, Technology)';
COMMENT ON TABLE bia_dependent_people IS 'Links BIAs to required People (Human Resources)';
COMMENT ON TABLE bia_dependent_vendors IS 'Links BIAs to required Vendors (3rd Parties)';
COMMENT ON TABLE bia_dependent_vital_records IS 'Links BIAs to required Vital Records (Data/Documents)';
COMMENT ON TABLE bia_dependent_processes IS 'Links BIAs to dependent Processes (for roll-ups and dependencies)';

-- ============================================================================
-- STEP 5: Insert Sample BIA Questions
-- ============================================================================

-- Financial Impact Questions
INSERT INTO bia_questions (question_code, question_text, question_category, question_type, impact_timeframe, weight, display_order, answer_options) VALUES
('FIN_1HR', 'What is the estimated financial impact if this process/service is unavailable for 1 hour?', 'Financial', 'MULTIPLE_CHOICE', '1_HOUR', 10, 1, '[{"value":"None","score":0},{"value":"Low (<$10K)","score":1},{"value":"Medium ($10K-$100K)","score":2},{"value":"High ($100K-$1M)","score":3},{"value":"Critical (>$1M)","score":4}]'),
('FIN_4HR', 'What is the estimated financial impact if this process/service is unavailable for 4 hours?', 'Financial', 'MULTIPLE_CHOICE', '4_HOURS', 8, 2, '[{"value":"None","score":0},{"value":"Low (<$10K)","score":1},{"value":"Medium ($10K-$100K)","score":2},{"value":"High ($100K-$1M)","score":3},{"value":"Critical (>$1M)","score":4}]'),
('FIN_24HR', 'What is the estimated financial impact if this process/service is unavailable for 24 hours?', 'Financial', 'MULTIPLE_CHOICE', '24_HOURS', 6, 3, '[{"value":"None","score":0},{"value":"Low (<$10K)","score":1},{"value":"Medium ($10K-$100K)","score":2},{"value":"High ($100K-$1M)","score":3},{"value":"Critical (>$1M)","score":4}]'),
('FIN_3DAY', 'What is the estimated financial impact if this process/service is unavailable for 3 days?', 'Financial', 'MULTIPLE_CHOICE', '3_DAYS', 4, 4, '[{"value":"None","score":0},{"value":"Low (<$10K)","score":1},{"value":"Medium ($10K-$100K)","score":2},{"value":"High ($100K-$1M)","score":3},{"value":"Critical (>$1M)","score":4}]'),
('FIN_1WK', 'What is the estimated financial impact if this process/service is unavailable for 1 week?', 'Financial', 'MULTIPLE_CHOICE', '1_WEEK', 2, 5, '[{"value":"None","score":0},{"value":"Low (<$10K)","score":1},{"value":"Medium ($10K-$100K)","score":2},{"value":"High ($100K-$1M)","score":3},{"value":"Critical (>$1M)","score":4}]');

-- Operational Impact Questions
INSERT INTO bia_questions (question_code, question_text, question_category, question_type, impact_timeframe, weight, display_order, answer_options) VALUES
('OPS_1HR', 'What is the operational impact if this process/service is unavailable for 1 hour?', 'Operational', 'MULTIPLE_CHOICE', '1_HOUR', 10, 6, '[{"value":"None","score":0},{"value":"Low","score":1},{"value":"Medium","score":2},{"value":"High","score":3},{"value":"Critical","score":4}]'),
('OPS_4HR', 'What is the operational impact if this process/service is unavailable for 4 hours?', 'Operational', 'MULTIPLE_CHOICE', '4_HOURS', 8, 7, '[{"value":"None","score":0},{"value":"Low","score":1},{"value":"Medium","score":2},{"value":"High","score":3},{"value":"Critical","score":4}]'),
('OPS_24HR', 'What is the operational impact if this process/service is unavailable for 24 hours?', 'Operational', 'MULTIPLE_CHOICE', '24_HOURS', 6, 8, '[{"value":"None","score":0},{"value":"Low","score":1},{"value":"Medium","score":2},{"value":"High","score":3},{"value":"Critical","score":4}]');

-- Reputational Impact Questions
INSERT INTO bia_questions (question_code, question_text, question_category, question_type, weight, display_order, answer_options) VALUES
('REP_IMPACT', 'What is the potential reputational impact if this process/service fails?', 'Reputational', 'MULTIPLE_CHOICE', 5, 9, '[{"value":"None","score":0},{"value":"Low","score":1},{"value":"Medium","score":2},{"value":"High","score":3},{"value":"Critical","score":4}]');

-- Regulatory Impact Questions
INSERT INTO bia_questions (question_code, question_text, question_category, question_type, weight, display_order, answer_options) VALUES
('REG_IMPACT', 'Are there regulatory or compliance requirements for this process/service?', 'Regulatory', 'MULTIPLE_CHOICE', 7, 10, '[{"value":"None","score":0},{"value":"Low","score":1},{"value":"Medium","score":2},{"value":"High","score":3},{"value":"Critical","score":4}]');

-- Customer Impact Questions
INSERT INTO bia_questions (question_code, question_text, question_category, question_type, weight, display_order, answer_options) VALUES
('CUST_IMPACT', 'What is the impact on customers if this process/service is unavailable?', 'Customer', 'MULTIPLE_CHOICE', 6, 11, '[{"value":"None","score":0},{"value":"Low","score":1},{"value":"Medium","score":2},{"value":"High","score":3},{"value":"Critical","score":4}]');

-- ============================================================================
-- STEP 6: Migration Complete
-- ============================================================================

-- The BIA system is now a fully polymorphic hub-and-spoke model:
-- ✅ Can analyze ANY item from ANY library
-- ✅ Questionnaire-driven impact analysis
-- ✅ BETH3V dependency mapping
-- ✅ Gap analysis ready (requirements vs capabilities)
-- ✅ Roll-up and aggregation support

