-- V12: Add template_used field to BIA Records
-- 
-- This migration adds:
-- 1. template_used field to track which BIA template was used to create the BIA
-- 2. Index for template-based queries
--
-- Purpose: Track which template configuration was used for each BIA record
-- This enables:
-- - Template usage analytics
-- - Template-based filtering and reporting
-- - Audit trail of template changes
-- - Template effectiveness analysis

-- ============================================================================
-- STEP 1: Add template_used field to bia_records
-- ============================================================================

-- Add template_used column to track which template was used
ALTER TABLE bia_records ADD COLUMN IF NOT EXISTS template_used VARCHAR(255);

-- Add index for template-based queries
CREATE INDEX IF NOT EXISTS idx_bia_template_used ON bia_records(template_used);

-- ============================================================================
-- STEP 2: Add documentation comments
-- ============================================================================

COMMENT ON COLUMN bia_records.template_used IS 'Name or identifier of the BIA template used to create this record';

-- ============================================================================
-- STEP 3: Migration Complete
-- ============================================================================

-- The BIA system now supports template tracking:
-- ✅ template_used field added to bia_records
-- ✅ Index created for efficient template-based queries
-- ✅ Documentation added for clarity

