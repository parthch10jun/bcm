-- V9: Multi-Process BIA Support
-- 
-- This migration adds support for BIAs that analyze MULTIPLE processes simultaneously.
-- 
-- ARCHITECTURE CHANGE:
-- - Previously: One BIA → One Target (via biaTargetId + biaTargetType)
-- - Now: One BIA → Multiple Processes (via bia_target_processes junction table)
-- 
-- DISTINCTION:
-- - bia_target_processes: The processes being ANALYZED by this BIA
-- - bia_dependent_processes: The processes this BIA DEPENDS ON (enablers/dependencies)
--
-- USE CASES:
-- 1. Single Process BIA: Analyze one process (1 entry in bia_target_processes)
-- 2. Multi-Process BIA: Analyze multiple related processes together (N entries)
-- 3. Department BIA: Analyze all processes in a department (N entries)

-- ============================================================================
-- STEP 1: Create bia_target_processes junction table
-- ============================================================================

CREATE TABLE IF NOT EXISTS bia_target_processes (
    -- Primary Key
    id BIGSERIAL PRIMARY KEY,
    
    -- Foreign Keys
    bia_id BIGINT NOT NULL,
    process_id BIGINT NOT NULL,
    
    -- Process Role in BIA
    is_primary BOOLEAN DEFAULT FALSE,  -- Is this the primary/main process being analyzed?
    selection_reason TEXT,  -- Why was this process included in the BIA?
    
    -- Audit Fields
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(255),
    version BIGINT DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE,
    
    -- Foreign Key Constraints
    CONSTRAINT fk_bia_target_proc_bia FOREIGN KEY (bia_id)
        REFERENCES bia_records(id) ON DELETE CASCADE,
    CONSTRAINT fk_bia_target_proc_process FOREIGN KEY (process_id)
        REFERENCES processes(id) ON DELETE CASCADE,
    
    -- Unique Constraint: A process can only be a target once per BIA
    CONSTRAINT uk_bia_target_process UNIQUE (bia_id, process_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_bia_target_proc_bia ON bia_target_processes(bia_id);
CREATE INDEX IF NOT EXISTS idx_bia_target_proc_process ON bia_target_processes(process_id);
CREATE INDEX IF NOT EXISTS idx_bia_target_proc_primary ON bia_target_processes(bia_id, is_primary);

-- ============================================================================
-- STEP 2: Migrate existing single-process BIAs to new structure
-- ============================================================================

-- Migrate existing process BIAs to the new junction table
-- Only migrate where biaTargetType = 'PROCESS' and biaTargetId is not null
INSERT INTO bia_target_processes (bia_id, process_id, is_primary, created_at, created_by)
SELECT 
    id as bia_id,
    bia_target_id as process_id,
    TRUE as is_primary,  -- Existing single process is the primary
    created_at,
    created_by
FROM bia_records
WHERE bia_target_type = 'PROCESS' 
  AND bia_target_id IS NOT NULL
  AND NOT EXISTS (
      SELECT 1 FROM bia_target_processes btp 
      WHERE btp.bia_id = bia_records.id 
        AND btp.process_id = bia_records.bia_target_id
  );

-- ============================================================================
-- STEP 3: Add helper view for easy querying
-- ============================================================================

-- View to easily see which processes are being analyzed by which BIAs
CREATE OR REPLACE VIEW v_bia_process_targets AS
SELECT 
    br.id as bia_id,
    br.bia_name,
    br.status,
    br.final_criticality,
    br.final_rto_hours,
    br.final_rpo_hours,
    btp.process_id,
    p.process_name,
    p.process_code,
    p.process_owner,
    btp.is_primary,
    btp.selection_reason,
    ou.id as org_unit_id,
    ou.unit_name as org_unit_name
FROM bia_records br
INNER JOIN bia_target_processes btp ON br.id = btp.bia_id
INNER JOIN processes p ON btp.process_id = p.id
LEFT JOIN organizational_units ou ON p.organizational_unit_id = ou.id
WHERE br.is_deleted = FALSE 
  AND btp.is_deleted = FALSE
  AND p.is_deleted = FALSE;

-- ============================================================================
-- STEP 4: Add table and column comments
-- ============================================================================

COMMENT ON TABLE bia_target_processes IS 
'Junction table linking BIAs to the processes being ANALYZED (targets). 
Distinct from bia_dependent_processes which links to dependency/enabler processes.
Supports both single-process and multi-process BIA analysis.';

COMMENT ON COLUMN bia_target_processes.is_primary IS 
'Indicates the primary/main process in a multi-process BIA. 
For single-process BIAs, this is always TRUE.
For multi-process BIAs, typically one process is marked as primary.';

COMMENT ON COLUMN bia_target_processes.selection_reason IS 
'Documents why this process was included in the BIA analysis.
Useful for audit trails and understanding the scope of multi-process BIAs.';

COMMENT ON VIEW v_bia_process_targets IS 
'Convenient view showing all processes being analyzed by each BIA.
Includes both single-process and multi-process BIAs.';

-- Note: We keep bia_target_id and bia_target_type for backward compatibility
-- and for non-process BIAs (ORGANIZATIONAL_UNIT, ASSET, LOCATION, etc.)
-- For PROCESS type BIAs, the source of truth is now bia_target_processes table.

