-- V29: Add RTO, RPO, and Asset Criticality fields to Assets table
-- Description: Add recovery objective fields and asset-level criticality for dependency gap analysis

-- Add RTO (Recovery Time Objective) in hours
ALTER TABLE assets ADD COLUMN IF NOT EXISTS rto_hours INTEGER;

-- Add RPO (Recovery Point Objective) in hours
ALTER TABLE assets ADD COLUMN IF NOT EXISTS rpo_hours INTEGER;

-- Add Asset Criticality (separate from inherited process criticality)
-- Values: CRITICAL, HIGH, MEDIUM, LOW
ALTER TABLE assets ADD COLUMN IF NOT EXISTS asset_criticality VARCHAR(20);

-- Add comments for documentation
COMMENT ON COLUMN assets.rto_hours IS 'Recovery Time Objective in hours - maximum acceptable time to restore asset after disruption';
COMMENT ON COLUMN assets.rpo_hours IS 'Recovery Point Objective in hours - maximum acceptable data loss window';
COMMENT ON COLUMN assets.asset_criticality IS 'Asset-level criticality: CRITICAL, HIGH, MEDIUM, LOW';

-- Create index for filtering by criticality and RTO
CREATE INDEX IF NOT EXISTS idx_assets_criticality ON assets(asset_criticality);
CREATE INDEX IF NOT EXISTS idx_assets_rto ON assets(rto_hours);

-- Update existing demo assets with sample RTO/RPO values
UPDATE assets SET rto_hours = 4, rpo_hours = 1, asset_criticality = 'CRITICAL' 
WHERE asset_name LIKE '%SAP%' OR asset_name LIKE '%ERP%' OR asset_name LIKE '%Core%';

UPDATE assets SET rto_hours = 8, rpo_hours = 2, asset_criticality = 'HIGH' 
WHERE asset_name LIKE '%Server%' AND rto_hours IS NULL;

UPDATE assets SET rto_hours = 24, rpo_hours = 4, asset_criticality = 'MEDIUM' 
WHERE asset_name LIKE '%Database%' AND rto_hours IS NULL;

UPDATE assets SET rto_hours = 72, rpo_hours = 24, asset_criticality = 'LOW' 
WHERE rto_hours IS NULL;

