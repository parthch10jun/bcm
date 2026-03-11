-- V18: Seed Sample Threats for Risk Assessment Module
-- This migration adds comprehensive sample threats across all threat types

-- ============================================================================
-- NATURAL DISASTER THREATS
-- ============================================================================

-- Earthquake
INSERT INTO threats (name, description, threat_type_id, display_order, created_at, updated_at, is_deleted)
SELECT
    'Earthquake',
    'Seismic activity causing structural damage to buildings, equipment failure, and potential casualties. Can disrupt operations for extended periods.',
    id,
    1,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    FALSE
FROM threat_types WHERE name = 'Natural Disaster';

-- Link Earthquake to affected enabler types (Buildings, Equipment, Technology)
INSERT INTO threat_enabler_types (threat_id, enabler_type_id, created_at, updated_at, is_deleted)
SELECT 
    t.id,
    et.id,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    FALSE
FROM threats t
CROSS JOIN enabler_types et
WHERE t.name = 'Earthquake'
AND et.code IN ('BUILDING', 'EQUIPMENT', 'TECHNOLOGY');

-- Flood
INSERT INTO threats (name, description, threat_type_id, display_order, created_at, updated_at, is_deleted)
SELECT 
    'Flood',
    'Water damage from heavy rainfall, storm surge, or dam failure affecting buildings, equipment, and vital records.',
    id,
    2,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    FALSE
FROM threat_types WHERE name = 'Natural Disaster';

INSERT INTO threat_enabler_types (threat_id, enabler_type_id, created_at, updated_at, is_deleted)
SELECT 
    t.id,
    et.id,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    FALSE
FROM threats t
CROSS JOIN enabler_types et
WHERE t.name = 'Flood'
AND et.code IN ('BUILDING', 'EQUIPMENT', 'TECHNOLOGY', 'VITAL_RECORD');

-- Hurricane/Typhoon
INSERT INTO threats (name, description, threat_type_id, display_order, created_at, updated_at, is_deleted)
SELECT 
    'Hurricane/Typhoon',
    'Severe tropical storm with high winds, heavy rain, and storm surge causing widespread damage to infrastructure.',
    id,
    3,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    FALSE
FROM threat_types WHERE name = 'Natural Disaster';

INSERT INTO threat_enabler_types (threat_id, enabler_type_id, created_at, updated_at, is_deleted)
SELECT 
    t.id,
    et.id,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    FALSE
FROM threats t
CROSS JOIN enabler_types et
WHERE t.name = 'Hurricane/Typhoon'
AND et.code IN ('BUILDING', 'EQUIPMENT', 'TECHNOLOGY');

-- Wildfire
INSERT INTO threats (name, description, threat_type_id, display_order, created_at, updated_at, is_deleted)
SELECT 
    'Wildfire',
    'Uncontrolled fire spreading through vegetation, threatening buildings and causing air quality issues.',
    id,
    4,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    FALSE
FROM threat_types WHERE name = 'Natural Disaster';

INSERT INTO threat_enabler_types (threat_id, enabler_type_id, created_at, updated_at, is_deleted)
SELECT 
    t.id,
    et.id,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    FALSE
FROM threats t
CROSS JOIN enabler_types et
WHERE t.name = 'Wildfire'
AND et.code IN ('BUILDING', 'EQUIPMENT', 'PEOPLE');

-- ============================================================================
-- MAN-MADE DISASTER THREATS
-- ============================================================================

-- Fire
INSERT INTO threats (name, description, threat_type_id, display_order, created_at, updated_at, is_deleted)
SELECT 
    'Fire',
    'Building fire caused by electrical faults, human error, or arson, resulting in property damage and potential casualties.',
    id,
    1,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    FALSE
FROM threat_types WHERE name = 'Man-made Disaster';

INSERT INTO threat_enabler_types (threat_id, enabler_type_id, created_at, updated_at, is_deleted)
SELECT 
    t.id,
    et.id,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    FALSE
FROM threats t
CROSS JOIN enabler_types et
WHERE t.name = 'Fire'
AND et.code IN ('BUILDING', 'EQUIPMENT', 'TECHNOLOGY', 'VITAL_RECORD', 'PEOPLE');

-- Terrorism/Active Shooter
INSERT INTO threats (name, description, threat_type_id, display_order, created_at, updated_at, is_deleted)
SELECT 
    'Terrorism/Active Shooter',
    'Violent attack targeting facilities or personnel, causing casualties and operational disruption.',
    id,
    2,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    FALSE
FROM threat_types WHERE name = 'Man-made Disaster';

INSERT INTO threat_enabler_types (threat_id, enabler_type_id, created_at, updated_at, is_deleted)
SELECT 
    t.id,
    et.id,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    FALSE
FROM threats t
CROSS JOIN enabler_types et
WHERE t.name = 'Terrorism/Active Shooter'
AND et.code IN ('BUILDING', 'PEOPLE');

-- Chemical Spill/Hazmat Incident
INSERT INTO threats (name, description, threat_type_id, display_order, created_at, updated_at, is_deleted)
SELECT 
    'Chemical Spill/Hazmat Incident',
    'Release of hazardous materials requiring evacuation and specialized cleanup, affecting operations and safety.',
    id,
    3,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    FALSE
FROM threat_types WHERE name = 'Man-made Disaster';

INSERT INTO threat_enabler_types (threat_id, enabler_type_id, created_at, updated_at, is_deleted)
SELECT 
    t.id,
    et.id,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    FALSE
FROM threats t
CROSS JOIN enabler_types et
WHERE t.name = 'Chemical Spill/Hazmat Incident'
AND et.code IN ('BUILDING', 'EQUIPMENT', 'PEOPLE');

-- ============================================================================
-- CYBER SECURITY THREATS
-- ============================================================================

-- Ransomware Attack
INSERT INTO threats (name, description, threat_type_id, display_order, created_at, updated_at, is_deleted)
SELECT 
    'Ransomware Attack',
    'Malicious software encrypting critical data and systems, demanding payment for decryption keys.',
    id,
    1,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    FALSE
FROM threat_types WHERE name = 'Cyber Security';

INSERT INTO threat_enabler_types (threat_id, enabler_type_id, created_at, updated_at, is_deleted)
SELECT 
    t.id,
    et.id,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    FALSE
FROM threats t
CROSS JOIN enabler_types et
WHERE t.name = 'Ransomware Attack'
AND et.code IN ('TECHNOLOGY', 'VITAL_RECORD');

-- Data Breach
INSERT INTO threats (name, description, threat_type_id, display_order, created_at, updated_at, is_deleted)
SELECT 
    'Data Breach',
    'Unauthorized access to sensitive data including customer information, intellectual property, or financial records.',
    id,
    2,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    FALSE
FROM threat_types WHERE name = 'Cyber Security';

INSERT INTO threat_enabler_types (threat_id, enabler_type_id, created_at, updated_at, is_deleted)
SELECT 
    t.id,
    et.id,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    FALSE
FROM threats t
CROSS JOIN enabler_types et
WHERE t.name = 'Data Breach'
AND et.code IN ('TECHNOLOGY', 'VITAL_RECORD');

-- DDoS Attack
INSERT INTO threats (name, description, threat_type_id, display_order, created_at, updated_at, is_deleted)
SELECT 
    'DDoS Attack',
    'Distributed Denial of Service attack overwhelming systems and making services unavailable to users.',
    id,
    3,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    FALSE
FROM threat_types WHERE name = 'Cyber Security';

INSERT INTO threat_enabler_types (threat_id, enabler_type_id, created_at, updated_at, is_deleted)
SELECT 
    t.id,
    et.id,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    FALSE
FROM threats t
CROSS JOIN enabler_types et
WHERE t.name = 'DDoS Attack'
AND et.code IN ('TECHNOLOGY');

-- Phishing/Social Engineering
INSERT INTO threats (name, description, threat_type_id, display_order, created_at, updated_at, is_deleted)
SELECT 
    'Phishing/Social Engineering',
    'Deceptive tactics to trick employees into revealing credentials or sensitive information.',
    id,
    4,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    FALSE
FROM threat_types WHERE name = 'Cyber Security';

INSERT INTO threat_enabler_types (threat_id, enabler_type_id, created_at, updated_at, is_deleted)
SELECT 
    t.id,
    et.id,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    FALSE
FROM threats t
CROSS JOIN enabler_types et
WHERE t.name = 'Phishing/Social Engineering'
AND et.code IN ('TECHNOLOGY', 'PEOPLE');

-- ============================================================================
-- IT/EQUIPMENT DISRUPTION THREATS
-- ============================================================================

-- Power Outage
INSERT INTO threats (name, description, threat_type_id, display_order, created_at, updated_at, is_deleted)
SELECT 
    'Power Outage',
    'Loss of electrical power affecting operations, data centers, and critical equipment.',
    id,
    1,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    FALSE
FROM threat_types WHERE name = 'IT/Equipment Disruption';

INSERT INTO threat_enabler_types (threat_id, enabler_type_id, created_at, updated_at, is_deleted)
SELECT 
    t.id,
    et.id,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    FALSE
FROM threats t
CROSS JOIN enabler_types et
WHERE t.name = 'Power Outage'
AND et.code IN ('BUILDING', 'EQUIPMENT', 'TECHNOLOGY');

-- Hardware Failure
INSERT INTO threats (name, description, threat_type_id, display_order, created_at, updated_at, is_deleted)
SELECT 
    'Hardware Failure',
    'Critical equipment or server failure causing system downtime and data loss.',
    id,
    2,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    FALSE
FROM threat_types WHERE name = 'IT/Equipment Disruption';

INSERT INTO threat_enabler_types (threat_id, enabler_type_id, created_at, updated_at, is_deleted)
SELECT 
    t.id,
    et.id,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    FALSE
FROM threats t
CROSS JOIN enabler_types et
WHERE t.name = 'Hardware Failure'
AND et.code IN ('EQUIPMENT', 'TECHNOLOGY');

-- Telecommunications Failure
INSERT INTO threats (name, description, threat_type_id, display_order, created_at, updated_at, is_deleted)
SELECT 
    'Telecommunications Failure',
    'Loss of phone, internet, or network connectivity disrupting communications and operations.',
    id,
    3,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    FALSE
FROM threat_types WHERE name = 'IT/Equipment Disruption';

INSERT INTO threat_enabler_types (threat_id, enabler_type_id, created_at, updated_at, is_deleted)
SELECT 
    t.id,
    et.id,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    FALSE
FROM threats t
CROSS JOIN enabler_types et
WHERE t.name = 'Telecommunications Failure'
AND et.code IN ('TECHNOLOGY');

-- Software/Application Failure
INSERT INTO threats (name, description, threat_type_id, display_order, created_at, updated_at, is_deleted)
SELECT 
    'Software/Application Failure',
    'Critical business application crash or malfunction preventing normal operations.',
    id,
    4,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    FALSE
FROM threat_types WHERE name = 'IT/Equipment Disruption';

INSERT INTO threat_enabler_types (threat_id, enabler_type_id, created_at, updated_at, is_deleted)
SELECT 
    t.id,
    et.id,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    FALSE
FROM threats t
CROSS JOIN enabler_types et
WHERE t.name = 'Software/Application Failure'
AND et.code IN ('TECHNOLOGY');

-- ============================================================================
-- SUPPLY CHAIN THREATS
-- ============================================================================

-- Vendor/Supplier Failure
INSERT INTO threats (name, description, threat_type_id, display_order, created_at, updated_at, is_deleted)
SELECT
    'Vendor/Supplier Failure',
    'Critical vendor going out of business or unable to deliver essential goods/services.',
    id,
    1,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    FALSE
FROM threat_types WHERE name = 'Supply Chain';

INSERT INTO threat_enabler_types (threat_id, enabler_type_id, created_at, updated_at, is_deleted)
SELECT
    t.id,
    et.id,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    FALSE
FROM threats t
CROSS JOIN enabler_types et
WHERE t.name = 'Vendor/Supplier Failure'
AND et.code IN ('VENDOR');

-- Supply Chain Disruption
INSERT INTO threats (name, description, threat_type_id, display_order, created_at, updated_at, is_deleted)
SELECT
    'Supply Chain Disruption',
    'Interruption in the supply of critical materials, components, or services due to logistics issues.',
    id,
    2,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    FALSE
FROM threat_types WHERE name = 'Supply Chain';

INSERT INTO threat_enabler_types (threat_id, enabler_type_id, created_at, updated_at, is_deleted)
SELECT
    t.id,
    et.id,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    FALSE
FROM threats t
CROSS JOIN enabler_types et
WHERE t.name = 'Supply Chain Disruption'
AND et.code IN ('VENDOR', 'EQUIPMENT');

-- Transportation Disruption
INSERT INTO threats (name, description, threat_type_id, display_order, created_at, updated_at, is_deleted)
SELECT
    'Transportation Disruption',
    'Inability to transport goods or personnel due to strikes, fuel shortages, or infrastructure damage.',
    id,
    3,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    FALSE
FROM threat_types WHERE name = 'Supply Chain';

INSERT INTO threat_enabler_types (threat_id, enabler_type_id, created_at, updated_at, is_deleted)
SELECT
    t.id,
    et.id,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    FALSE
FROM threats t
CROSS JOIN enabler_types et
WHERE t.name = 'Transportation Disruption'
AND et.code IN ('VENDOR', 'PEOPLE');

-- ============================================================================
-- HUMAN RESOURCES THREATS
-- ============================================================================

-- Key Personnel Loss
INSERT INTO threats (name, description, threat_type_id, display_order, created_at, updated_at, is_deleted)
SELECT
    'Key Personnel Loss',
    'Sudden departure or unavailability of critical employees with specialized knowledge or skills.',
    id,
    1,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    FALSE
FROM threat_types WHERE name = 'Human Resources';

INSERT INTO threat_enabler_types (threat_id, enabler_type_id, created_at, updated_at, is_deleted)
SELECT
    t.id,
    et.id,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    FALSE
FROM threats t
CROSS JOIN enabler_types et
WHERE t.name = 'Key Personnel Loss'
AND et.code IN ('PEOPLE');

-- Pandemic/Epidemic
INSERT INTO threats (name, description, threat_type_id, display_order, created_at, updated_at, is_deleted)
SELECT
    'Pandemic/Epidemic',
    'Widespread illness affecting workforce availability and requiring remote work or facility closures.',
    id,
    2,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    FALSE
FROM threat_types WHERE name = 'Human Resources';

INSERT INTO threat_enabler_types (threat_id, enabler_type_id, created_at, updated_at, is_deleted)
SELECT
    t.id,
    et.id,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    FALSE
FROM threats t
CROSS JOIN enabler_types et
WHERE t.name = 'Pandemic/Epidemic'
AND et.code IN ('PEOPLE', 'BUILDING');

-- Labor Strike/Dispute
INSERT INTO threats (name, description, threat_type_id, display_order, created_at, updated_at, is_deleted)
SELECT
    'Labor Strike/Dispute',
    'Work stoppage or industrial action by employees or contractors disrupting operations.',
    id,
    3,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    FALSE
FROM threat_types WHERE name = 'Human Resources';

INSERT INTO threat_enabler_types (threat_id, enabler_type_id, created_at, updated_at, is_deleted)
SELECT
    t.id,
    et.id,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    FALSE
FROM threats t
CROSS JOIN enabler_types et
WHERE t.name = 'Labor Strike/Dispute'
AND et.code IN ('PEOPLE');

-- Workplace Violence
INSERT INTO threats (name, description, threat_type_id, display_order, created_at, updated_at, is_deleted)
SELECT
    'Workplace Violence',
    'Violent behavior by employees or visitors threatening safety and disrupting operations.',
    id,
    4,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    FALSE
FROM threat_types WHERE name = 'Human Resources';

INSERT INTO threat_enabler_types (threat_id, enabler_type_id, created_at, updated_at, is_deleted)
SELECT
    t.id,
    et.id,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    FALSE
FROM threats t
CROSS JOIN enabler_types et
WHERE t.name = 'Workplace Violence'
AND et.code IN ('PEOPLE', 'BUILDING');

-- ============================================================================
-- REGULATORY/COMPLIANCE THREATS
-- ============================================================================

-- Regulatory Non-Compliance
INSERT INTO threats (name, description, threat_type_id, display_order, created_at, updated_at, is_deleted)
SELECT
    'Regulatory Non-Compliance',
    'Failure to meet regulatory requirements resulting in fines, sanctions, or operational restrictions.',
    id,
    1,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    FALSE
FROM threat_types WHERE name = 'Regulatory/Compliance';

INSERT INTO threat_enabler_types (threat_id, enabler_type_id, created_at, updated_at, is_deleted)
SELECT
    t.id,
    et.id,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    FALSE
FROM threats t
CROSS JOIN enabler_types et
WHERE t.name = 'Regulatory Non-Compliance'
AND et.code IN ('VITAL_RECORD', 'TECHNOLOGY');

-- License/Permit Revocation
INSERT INTO threats (name, description, threat_type_id, display_order, created_at, updated_at, is_deleted)
SELECT
    'License/Permit Revocation',
    'Loss of critical operating licenses or permits forcing suspension of business activities.',
    id,
    2,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    FALSE
FROM threat_types WHERE name = 'Regulatory/Compliance';

INSERT INTO threat_enabler_types (threat_id, enabler_type_id, created_at, updated_at, is_deleted)
SELECT
    t.id,
    et.id,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    FALSE
FROM threats t
CROSS JOIN enabler_types et
WHERE t.name = 'License/Permit Revocation'
AND et.code IN ('VITAL_RECORD');

-- Legal Action/Litigation
INSERT INTO threats (name, description, threat_type_id, display_order, created_at, updated_at, is_deleted)
SELECT
    'Legal Action/Litigation',
    'Lawsuits or legal proceedings consuming resources and potentially restricting operations.',
    id,
    3,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    FALSE
FROM threat_types WHERE name = 'Regulatory/Compliance';

INSERT INTO threat_enabler_types (threat_id, enabler_type_id, created_at, updated_at, is_deleted)
SELECT
    t.id,
    et.id,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    FALSE
FROM threats t
CROSS JOIN enabler_types et
WHERE t.name = 'Legal Action/Litigation'
AND et.code IN ('VITAL_RECORD', 'PEOPLE');

-- ============================================================================
-- FINANCIAL THREATS
-- ============================================================================

-- Financial Institution Failure
INSERT INTO threats (name, description, threat_type_id, display_order, created_at, updated_at, is_deleted)
SELECT
    'Financial Institution Failure',
    'Bank failure or financial crisis affecting access to funds and payment processing.',
    id,
    1,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    FALSE
FROM threat_types WHERE name = 'Financial';

INSERT INTO threat_enabler_types (threat_id, enabler_type_id, created_at, updated_at, is_deleted)
SELECT
    t.id,
    et.id,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    FALSE
FROM threats t
CROSS JOIN enabler_types et
WHERE t.name = 'Financial Institution Failure'
AND et.code IN ('VENDOR', 'TECHNOLOGY');

-- Payment System Failure
INSERT INTO threats (name, description, threat_type_id, display_order, created_at, updated_at, is_deleted)
SELECT
    'Payment System Failure',
    'Inability to process payments or receive funds due to system outages or fraud.',
    id,
    2,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    FALSE
FROM threat_types WHERE name = 'Financial';

INSERT INTO threat_enabler_types (threat_id, enabler_type_id, created_at, updated_at, is_deleted)
SELECT
    t.id,
    et.id,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    FALSE
FROM threats t
CROSS JOIN enabler_types et
WHERE t.name = 'Payment System Failure'
AND et.code IN ('TECHNOLOGY', 'VENDOR');

-- Fraud/Embezzlement
INSERT INTO threats (name, description, threat_type_id, display_order, created_at, updated_at, is_deleted)
SELECT
    'Fraud/Embezzlement',
    'Financial fraud or theft by employees, vendors, or external parties causing monetary losses.',
    id,
    3,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    FALSE
FROM threat_types WHERE name = 'Financial';

INSERT INTO threat_enabler_types (threat_id, enabler_type_id, created_at, updated_at, is_deleted)
SELECT
    t.id,
    et.id,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    FALSE
FROM threats t
CROSS JOIN enabler_types et
WHERE t.name = 'Fraud/Embezzlement'
AND et.code IN ('PEOPLE', 'TECHNOLOGY', 'VENDOR');

-- Economic Downturn
INSERT INTO threats (name, description, threat_type_id, display_order, created_at, updated_at, is_deleted)
SELECT
    'Economic Downturn',
    'Recession or economic crisis reducing revenue and affecting business viability.',
    id,
    4,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    FALSE
FROM threat_types WHERE name = 'Financial';

INSERT INTO threat_enabler_types (threat_id, enabler_type_id, created_at, updated_at, is_deleted)
SELECT
    t.id,
    et.id,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    FALSE
FROM threats t
CROSS JOIN enabler_types et
WHERE t.name = 'Economic Downturn'
AND et.code IN ('PEOPLE', 'VENDOR');

