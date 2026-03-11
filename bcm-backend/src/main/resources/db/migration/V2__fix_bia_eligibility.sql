-- =====================================================
-- V2: Fix BIA Eligibility Based on Organizational Level
-- =====================================================
-- This migration updates is_bia_eligible to match the actual hierarchy
-- A unit is BIA-eligible ONLY if it has NO subordinate units (operational level)
-- =====================================================

-- Step 1: Set all units to NOT BIA-eligible by default
UPDATE organizational_units SET is_bia_eligible = false;

-- Step 2: Set BIA-eligible = true for all operational-level units (units with no subordinates)
UPDATE organizational_units ou
SET is_bia_eligible = true
WHERE NOT EXISTS (
    SELECT 1
    FROM organizational_units subordinate
    WHERE subordinate.parent_unit_id = ou.id
    AND subordinate.is_deleted = false
);

-- Verification query (for manual checking in H2 console):
-- SELECT id, unit_name, unit_type, is_bia_eligible,
--        (SELECT COUNT(*) FROM organizational_units WHERE parent_unit_id = ou.id) as subordinate_count
-- FROM organizational_units ou
-- ORDER BY id;

