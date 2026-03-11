-- V21: Seed Risk Category Threat Mappings for Testing
-- This migration assigns threats to risk categories for wizard testing

-- PROCESS Risk Category (ID=3) - Assign operational threats
INSERT INTO risk_category_threats (risk_category_id, threat_id, is_default_selected, is_deleted, created_at, created_by, updated_at, updated_by, version)
VALUES
    (3, 8, true, false, CURRENT_TIMESTAMP, 'SYSTEM', CURRENT_TIMESTAMP, 'SYSTEM', 0),  -- Ransomware Attack
    (3, 12, true, false, CURRENT_TIMESTAMP, 'SYSTEM', CURRENT_TIMESTAMP, 'SYSTEM', 0), -- Power Outage
    (3, 16, true, false, CURRENT_TIMESTAMP, 'SYSTEM', CURRENT_TIMESTAMP, 'SYSTEM', 0), -- Vendor/Supplier Failure
    (3, 19, true, false, CURRENT_TIMESTAMP, 'SYSTEM', CURRENT_TIMESTAMP, 'SYSTEM', 0), -- Key Personnel Loss
    (3, 23, true, false, CURRENT_TIMESTAMP, 'SYSTEM', CURRENT_TIMESTAMP, 'SYSTEM', 0); -- Regulatory Non-Compliance

-- LOCATION Risk Category (ID=1) - Assign location-based threats
INSERT INTO risk_category_threats (risk_category_id, threat_id, is_default_selected, is_deleted, created_at, created_by, updated_at, updated_by, version)
VALUES
    (1, 1, true, false, CURRENT_TIMESTAMP, 'SYSTEM', CURRENT_TIMESTAMP, 'SYSTEM', 0),  -- Earthquake
    (1, 5, true, false, CURRENT_TIMESTAMP, 'SYSTEM', CURRENT_TIMESTAMP, 'SYSTEM', 0),  -- Fire
    (1, 12, true, false, CURRENT_TIMESTAMP, 'SYSTEM', CURRENT_TIMESTAMP, 'SYSTEM', 0); -- Power Outage

-- SUPPLIER Risk Category (ID=4) - Assign vendor-related threats
INSERT INTO risk_category_threats (risk_category_id, threat_id, is_default_selected, is_deleted, created_at, created_by, updated_at, updated_by, version)
VALUES
    (4, 16, true, false, CURRENT_TIMESTAMP, 'SYSTEM', CURRENT_TIMESTAMP, 'SYSTEM', 0), -- Vendor/Supplier Failure
    (4, 8, true, false, CURRENT_TIMESTAMP, 'SYSTEM', CURRENT_TIMESTAMP, 'SYSTEM', 0),  -- Ransomware Attack
    (4, 23, true, false, CURRENT_TIMESTAMP, 'SYSTEM', CURRENT_TIMESTAMP, 'SYSTEM', 0); -- Regulatory Non-Compliance

-- APPLICATION Risk Category (ID=5) - Assign technology threats
INSERT INTO risk_category_threats (risk_category_id, threat_id, is_default_selected, is_deleted, created_at, created_by, updated_at, updated_by, version)
VALUES
    (5, 8, true, false, CURRENT_TIMESTAMP, 'SYSTEM', CURRENT_TIMESTAMP, 'SYSTEM', 0),  -- Ransomware Attack
    (5, 12, true, false, CURRENT_TIMESTAMP, 'SYSTEM', CURRENT_TIMESTAMP, 'SYSTEM', 0); -- Power Outage

-- PEOPLE Risk Category (ID=8) - Assign people-related threats
INSERT INTO risk_category_threats (risk_category_id, threat_id, is_default_selected, is_deleted, created_at, created_by, updated_at, updated_by, version)
VALUES
    (8, 19, true, false, CURRENT_TIMESTAMP, 'SYSTEM', CURRENT_TIMESTAMP, 'SYSTEM', 0); -- Key Personnel Loss

