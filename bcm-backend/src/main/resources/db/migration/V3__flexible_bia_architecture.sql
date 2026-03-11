-- V3: Flexible BIA Architecture Migration
-- 
-- This migration implements the new flexible BIA model:
-- 1. Removes is_bia_eligible constraint from organizational_units
-- 2. Creates processes table
-- 3. Creates bia_records table with reconciliation support
-- 4. Supports BIAs at ANY organizational level
-- 5. Tracks DIRECT vs AGGREGATED BIAs for conflict resolution

-- ============================================================================
-- STEP 1: Remove BIA eligibility constraint from organizational_units
-- ============================================================================

-- Drop the index on is_bia_eligible
DROP INDEX IF EXISTS idx_bia_eligible;

-- Remove the is_bia_eligible column
-- Note: This is a breaking change, but necessary for the new architecture
ALTER TABLE organizational_units DROP COLUMN IF EXISTS is_bia_eligible;

-- ============================================================================
-- STEP 2: Create processes table
-- ============================================================================

CREATE TABLE IF NOT EXISTS processes (
    -- Primary Key
    id BIGSERIAL PRIMARY KEY,

    -- Basic Information
    process_name VARCHAR(255) NOT NULL,
    process_code VARCHAR(50) UNIQUE,
    description TEXT,

    -- Relationships
    organizational_unit_id BIGINT NOT NULL,

    -- Process Details
    process_owner VARCHAR(255),
    status VARCHAR(50) DEFAULT 'ACTIVE',
    is_critical BOOLEAN DEFAULT FALSE,

    -- Audit Fields
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(255),
    version BIGINT DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE,

    -- Foreign Keys
    CONSTRAINT fk_process_unit FOREIGN KEY (organizational_unit_id)
        REFERENCES organizational_units(id) ON DELETE CASCADE
);

-- Indexes for processes
CREATE INDEX idx_process_unit ON processes(organizational_unit_id);
CREATE INDEX idx_process_status ON processes(status);
CREATE INDEX idx_process_code ON processes(process_code);

-- ============================================================================
-- STEP 3: Create bia_records table with reconciliation support
-- ============================================================================

CREATE TABLE IF NOT EXISTS bia_records (
    -- Primary Key
    id BIGSERIAL PRIMARY KEY,
    
    -- Basic Information
    bia_name VARCHAR(255) NOT NULL,
    
    -- Flexible Linking: Can link to EITHER a unit OR a process (one must be NULL)
    unit_id BIGINT,
    process_id BIGINT,
    
    -- BIA Type and Creation Type
    bia_type VARCHAR(50) NOT NULL,  -- PROCESS, DEPARTMENT, LOCATION
    creation_type VARCHAR(50) NOT NULL,  -- DIRECT or AGGREGATED
    
    -- Status
    status VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
    
    -- BIA Metrics
    rto_hours INTEGER,
    rpo_hours INTEGER,
    mtpd_hours INTEGER,
    critical_assets_count INTEGER,
    financial_impact DECIMAL(15, 2),
    operational_impact TEXT,
    reputational_impact TEXT,
    
    -- Reconciliation Fields
    is_official BOOLEAN DEFAULT FALSE,  -- Is this the "official" BIA for reporting?
    conflicting_bia_id BIGINT,  -- Reference to conflicting BIA (if any)
    reconciled_at TIMESTAMP,
    reconciled_by VARCHAR(255),
    reconciliation_notes TEXT,
    
    -- Audit Fields
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(255),
    version BIGINT DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE,
    
    -- Foreign Keys
    CONSTRAINT fk_bia_unit FOREIGN KEY (unit_id) 
        REFERENCES organizational_units(id) ON DELETE CASCADE,
    CONSTRAINT fk_bia_process FOREIGN KEY (process_id) 
        REFERENCES processes(id) ON DELETE CASCADE,
    CONSTRAINT fk_bia_conflicting FOREIGN KEY (conflicting_bia_id) 
        REFERENCES bia_records(id) ON DELETE SET NULL,
    
    -- Constraints
    CONSTRAINT chk_bia_link CHECK (
        (unit_id IS NOT NULL AND process_id IS NULL) OR 
        (unit_id IS NULL AND process_id IS NOT NULL)
    ),
    CONSTRAINT chk_creation_type CHECK (creation_type IN ('DIRECT', 'AGGREGATED')),
    CONSTRAINT chk_bia_type CHECK (bia_type IN ('PROCESS', 'DEPARTMENT', 'LOCATION')),
    CONSTRAINT chk_status CHECK (status IN ('DRAFT', 'IN_PROGRESS', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'ARCHIVED'))
);

-- Indexes for bia_records
CREATE INDEX idx_bia_unit ON bia_records(unit_id);
CREATE INDEX idx_bia_process ON bia_records(process_id);
CREATE INDEX idx_bia_status ON bia_records(status);
CREATE INDEX idx_bia_creation_type ON bia_records(creation_type);
CREATE INDEX idx_bia_official ON bia_records(is_official);

-- ============================================================================
-- STEP 4: Add comments for documentation
-- ============================================================================

COMMENT ON TABLE processes IS 'Business processes that can have BIAs performed on them';
COMMENT ON TABLE bia_records IS 'Flexible BIA records supporting both unit-level and process-level BIAs with reconciliation';

COMMENT ON COLUMN bia_records.creation_type IS 'DIRECT = user-created override, AGGREGATED = system-calculated rollup';
COMMENT ON COLUMN bia_records.is_official IS 'When both DIRECT and AGGREGATED exist, this marks which is official for reporting';
COMMENT ON COLUMN bia_records.conflicting_bia_id IS 'Reference to the conflicting BIA (e.g., DIRECT points to AGGREGATED or vice versa)';

-- ============================================================================
-- STEP 5: Migration complete
-- ============================================================================

-- Note: Existing organizational units will no longer have is_bia_eligible
-- BIAs can now be created for ANY unit in the hierarchy
-- The reconciliation model handles conflicts between DIRECT and AGGREGATED BIAs

