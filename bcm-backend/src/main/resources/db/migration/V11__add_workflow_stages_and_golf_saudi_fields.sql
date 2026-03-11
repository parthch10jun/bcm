-- V11: Add Workflow Stages and Golf Saudi Specific Fields
-- 
-- This migration adds:
-- 1. Workflow stage tracking (Initiate, Complete, Review, Verification, Approval)
-- 2. Golf Saudi specific fields (Champion, SME assignment, location, competencies)
-- 3. Comments and change request functionality
-- 4. Enhanced people dependency fields (competencies, backup resources, timeframe)
-- 5. Process location field
--
-- WORKFLOW STAGES:
-- 1. Initiate (by Champion or Plan Owner)
-- 2. Complete Data Entry (by Champion or SME)
-- 3. Review & Comments (by Division Head / Reviewer)
-- 4. Verification (by BCM Department / BCD)
-- 5. Approval (by Chief of Department Head)

-- ============================================================================
-- STEP 1: Add Workflow Stage Fields to bia_records
-- ============================================================================

-- Workflow stage tracking
ALTER TABLE bia_records ADD COLUMN IF NOT EXISTS workflow_stage VARCHAR(50) DEFAULT 'INITIATE';
ALTER TABLE bia_records ADD COLUMN IF NOT EXISTS workflow_status VARCHAR(50) DEFAULT 'DRAFT';

-- Stage timestamps
ALTER TABLE bia_records ADD COLUMN IF NOT EXISTS initiated_at TIMESTAMP;
ALTER TABLE bia_records ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP;
ALTER TABLE bia_records ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP;
ALTER TABLE bia_records ADD COLUMN IF NOT EXISTS verified_at TIMESTAMP;
ALTER TABLE bia_records ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP;

-- Stage assignees (user IDs)
ALTER TABLE bia_records ADD COLUMN IF NOT EXISTS champion_id BIGINT;
ALTER TABLE bia_records ADD COLUMN IF NOT EXISTS sme_id BIGINT;
ALTER TABLE bia_records ADD COLUMN IF NOT EXISTS division_head_id BIGINT;
ALTER TABLE bia_records ADD COLUMN IF NOT EXISTS bcm_verifier_id BIGINT;
ALTER TABLE bia_records ADD COLUMN IF NOT EXISTS approver_id BIGINT;

-- Stage assignee names (for display)
ALTER TABLE bia_records ADD COLUMN IF NOT EXISTS champion_name VARCHAR(255);
ALTER TABLE bia_records ADD COLUMN IF NOT EXISTS sme_name VARCHAR(255);
ALTER TABLE bia_records ADD COLUMN IF NOT EXISTS division_head_name VARCHAR(255);
ALTER TABLE bia_records ADD COLUMN IF NOT EXISTS bcm_verifier_name VARCHAR(255);
ALTER TABLE bia_records ADD COLUMN IF NOT EXISTS approver_name VARCHAR(255);

-- Department/Division profile fields
ALTER TABLE bia_records ADD COLUMN IF NOT EXISTS department_description TEXT;
ALTER TABLE bia_records ADD COLUMN IF NOT EXISTS department_location VARCHAR(255);
ALTER TABLE bia_records ADD COLUMN IF NOT EXISTS number_of_employees INTEGER;

-- Add check constraints for workflow stages
ALTER TABLE bia_records DROP CONSTRAINT IF EXISTS chk_workflow_stage;
ALTER TABLE bia_records ADD CONSTRAINT chk_workflow_stage
    CHECK (workflow_stage IN ('INITIATE', 'COMPLETE', 'REVIEW', 'VERIFICATION', 'APPROVAL', 'APPROVED'));

ALTER TABLE bia_records DROP CONSTRAINT IF EXISTS chk_workflow_status;
ALTER TABLE bia_records ADD CONSTRAINT chk_workflow_status
    CHECK (workflow_status IN ('DRAFT', 'SUBMITTED', 'IN_REVIEW', 'CHANGES_REQUESTED', 'IN_VERIFICATION', 'VERIFIED', 'APPROVED', 'REJECTED'));

-- Add foreign keys for assignees
ALTER TABLE bia_records ADD CONSTRAINT fk_bia_champion 
    FOREIGN KEY (champion_id) REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE bia_records ADD CONSTRAINT fk_bia_sme 
    FOREIGN KEY (sme_id) REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE bia_records ADD CONSTRAINT fk_bia_division_head 
    FOREIGN KEY (division_head_id) REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE bia_records ADD CONSTRAINT fk_bia_bcm_verifier 
    FOREIGN KEY (bcm_verifier_id) REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE bia_records ADD CONSTRAINT fk_bia_approver 
    FOREIGN KEY (approver_id) REFERENCES users(id) ON DELETE SET NULL;

-- Add indexes for workflow queries
CREATE INDEX IF NOT EXISTS idx_bia_workflow_stage ON bia_records(workflow_stage);
CREATE INDEX IF NOT EXISTS idx_bia_workflow_status ON bia_records(workflow_status);
CREATE INDEX IF NOT EXISTS idx_bia_champion ON bia_records(champion_id);
CREATE INDEX IF NOT EXISTS idx_bia_sme ON bia_records(sme_id);

-- ============================================================================
-- STEP 2: Add Process Location Field
-- ============================================================================

-- Add location field to processes table
ALTER TABLE processes ADD COLUMN IF NOT EXISTS process_location VARCHAR(255);

-- Add index for location queries
CREATE INDEX IF NOT EXISTS idx_process_location ON processes(process_location);

-- ============================================================================
-- STEP 3: Enhance People Dependencies with Golf Saudi Fields
-- ============================================================================

-- Add competencies, backup resources, and timeframe fields
ALTER TABLE bia_dependent_people ADD COLUMN IF NOT EXISTS competencies_required TEXT;
ALTER TABLE bia_dependent_people ADD COLUMN IF NOT EXISTS backup_resource_id BIGINT;
ALTER TABLE bia_dependent_people ADD COLUMN IF NOT EXISTS backup_resource_name VARCHAR(255);
ALTER TABLE bia_dependent_people ADD COLUMN IF NOT EXISTS critical_availability_timeframe INTEGER; -- in hours

-- Add foreign key for backup resource
ALTER TABLE bia_dependent_people ADD CONSTRAINT fk_bia_people_backup 
    FOREIGN KEY (backup_resource_id) REFERENCES users(id) ON DELETE SET NULL;

-- Add index for backup resource queries
CREATE INDEX IF NOT EXISTS idx_bia_people_backup ON bia_dependent_people(backup_resource_id);

-- ============================================================================
-- STEP 4: Create BIA Comments Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS bia_comments (
    -- Primary Key
    id BIGSERIAL PRIMARY KEY,
    
    -- Relationships
    bia_id BIGINT NOT NULL,
    
    -- Comment Details
    comment_text TEXT NOT NULL,
    comment_type VARCHAR(50) NOT NULL, -- 'REVIEW', 'CHANGE_REQUEST', 'VERIFICATION', 'APPROVAL', 'GENERAL'
    workflow_stage VARCHAR(50), -- Stage when comment was made
    
    -- Change Request Fields
    is_change_request BOOLEAN DEFAULT FALSE,
    change_request_status VARCHAR(50), -- 'PENDING', 'ADDRESSED', 'REJECTED'
    addressed_at TIMESTAMP,
    addressed_by VARCHAR(255),
    
    -- Audit Fields
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255) NOT NULL,
    created_by_id BIGINT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(255),
    version BIGINT DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE,
    
    -- Foreign Keys
    CONSTRAINT fk_comment_bia FOREIGN KEY (bia_id) 
        REFERENCES bia_records(id) ON DELETE CASCADE,
    CONSTRAINT fk_comment_creator FOREIGN KEY (created_by_id) 
        REFERENCES users(id) ON DELETE SET NULL,
    
    -- Check constraints
    CONSTRAINT chk_comment_type CHECK (comment_type IN ('REVIEW', 'CHANGE_REQUEST', 'VERIFICATION', 'APPROVAL', 'GENERAL')),
    CONSTRAINT chk_change_request_status CHECK (change_request_status IS NULL OR change_request_status IN ('PENDING', 'ADDRESSED', 'REJECTED'))
);

CREATE INDEX IF NOT EXISTS idx_bia_comments_bia ON bia_comments(bia_id);
CREATE INDEX IF NOT EXISTS idx_bia_comments_type ON bia_comments(comment_type);
CREATE INDEX IF NOT EXISTS idx_bia_comments_creator ON bia_comments(created_by_id);
CREATE INDEX IF NOT EXISTS idx_bia_comments_change_request ON bia_comments(is_change_request);

-- ============================================================================
-- STEP 5: Create BIA Workflow History Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS bia_workflow_history (
    -- Primary Key
    id BIGSERIAL PRIMARY KEY,
    
    -- Relationships
    bia_id BIGINT NOT NULL,
    
    -- Workflow Transition
    from_stage VARCHAR(50),
    to_stage VARCHAR(50) NOT NULL,
    from_status VARCHAR(50),
    to_status VARCHAR(50) NOT NULL,
    
    -- Transition Details
    action VARCHAR(100) NOT NULL, -- 'SUBMIT', 'APPROVE', 'REJECT', 'REQUEST_CHANGES', 'VERIFY', etc.
    comments TEXT,
    
    -- Audit Fields
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255) NOT NULL,
    created_by_id BIGINT,
    
    -- Foreign Keys
    CONSTRAINT fk_workflow_history_bia FOREIGN KEY (bia_id) 
        REFERENCES bia_records(id) ON DELETE CASCADE,
    CONSTRAINT fk_workflow_history_creator FOREIGN KEY (created_by_id) 
        REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_workflow_history_bia ON bia_workflow_history(bia_id);
CREATE INDEX IF NOT EXISTS idx_workflow_history_created ON bia_workflow_history(created_at);

-- ============================================================================
-- STEP 6: Create Golf Saudi Locations Reference Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS golf_saudi_locations (
    -- Primary Key
    id BIGSERIAL PRIMARY KEY,
    
    -- Location Details
    location_code VARCHAR(50) UNIQUE NOT NULL,
    location_name VARCHAR(255) NOT NULL,
    location_type VARCHAR(50), -- 'HEADQUARTERS', 'GOLF_COURSE', 'FACILITY', 'OFFICE'
    address TEXT,
    city VARCHAR(100),
    region VARCHAR(100),
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Audit Fields
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(255),
    version BIGINT DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE,
    
    -- Check constraint
    CONSTRAINT chk_location_type CHECK (location_type IS NULL OR location_type IN ('HEADQUARTERS', 'GOLF_COURSE', 'FACILITY', 'OFFICE', 'OTHER'))
);

CREATE INDEX IF NOT EXISTS idx_golf_locations_active ON golf_saudi_locations(is_active);
CREATE INDEX IF NOT EXISTS idx_golf_locations_type ON golf_saudi_locations(location_type);

-- ============================================================================
-- STEP 7: Insert Sample Golf Saudi Locations
-- ============================================================================

MERGE INTO golf_saudi_locations (location_code, location_name, location_type, city, region)
KEY(location_code) VALUES
('HQ-RYD', 'Golf Saudi Headquarters', 'HEADQUARTERS', 'Riyadh', 'Central'),
('GC-RYD-01', 'Riyadh Golf Club', 'GOLF_COURSE', 'Riyadh', 'Central'),
('GC-JED-01', 'Jeddah Golf Club', 'GOLF_COURSE', 'Jeddah', 'Western'),
('GC-DHR-01', 'Dhahran Golf Club', 'GOLF_COURSE', 'Dhahran', 'Eastern'),
('FAC-RYD-01', 'Riyadh Training Facility', 'FACILITY', 'Riyadh', 'Central'),
('OFF-JED-01', 'Jeddah Regional Office', 'OFFICE', 'Jeddah', 'Western');

-- ============================================================================
-- STEP 8: Add Comments for Documentation
-- ============================================================================

COMMENT ON COLUMN bia_records.workflow_stage IS 'Current workflow stage: INITIATE, COMPLETE, REVIEW, VERIFICATION, APPROVAL, APPROVED';
COMMENT ON COLUMN bia_records.workflow_status IS 'Current workflow status: DRAFT, SUBMITTED, IN_REVIEW, CHANGES_REQUESTED, IN_VERIFICATION, VERIFIED, APPROVED, REJECTED';
COMMENT ON COLUMN bia_records.champion_id IS 'Champion who initiates and owns the BIA (Golf Saudi specific)';
COMMENT ON COLUMN bia_records.sme_id IS 'Subject Matter Expert assigned to complete process-level data (Golf Saudi specific)';
COMMENT ON COLUMN bia_records.division_head_id IS 'Division Head who reviews and approves (Golf Saudi specific)';
COMMENT ON COLUMN bia_records.bcm_verifier_id IS 'BCM Department member who verifies completeness (Golf Saudi specific)';
COMMENT ON COLUMN bia_records.approver_id IS 'Chief of Department Head who provides final approval (Golf Saudi specific)';

COMMENT ON COLUMN bia_dependent_people.competencies_required IS 'Competencies required for this role (Golf Saudi specific)';
COMMENT ON COLUMN bia_dependent_people.backup_resource_id IS 'Backup resource for this critical person (Golf Saudi specific)';
COMMENT ON COLUMN bia_dependent_people.critical_availability_timeframe IS 'Timeframe in hours for critical employee availability (Golf Saudi specific)';

COMMENT ON TABLE bia_comments IS 'Comments and change requests for BIA workflow (Golf Saudi specific)';
COMMENT ON TABLE bia_workflow_history IS 'Audit trail of workflow stage transitions (Golf Saudi specific)';
COMMENT ON TABLE golf_saudi_locations IS 'Reference table for Golf Saudi locations';

-- ============================================================================
-- STEP 9: Migration Complete
-- ============================================================================

-- The BIA system now supports Golf Saudi workflow:
-- ✅ 5-stage workflow (Initiate, Complete, Review, Verification, Approval)
-- ✅ Role-based assignments (Champion, SME, Division Head, BCM, Approver)
-- ✅ Comments and change requests
-- ✅ Workflow history and audit trail
-- ✅ Enhanced people dependencies (competencies, backup, timeframe)
-- ✅ Process location field
-- ✅ Golf Saudi locations reference table

