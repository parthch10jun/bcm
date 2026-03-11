-- V25: Seed Demo Treatment Plans for High-Risk Threats
-- This migration creates sample treatment plans for high-risk threats in demo risk assessments
-- Purpose: Demo/Presentation - Shows complete risk treatment workflow

-- ============================================
-- Treatment Plans for PROCESS Risk Assessment (ID 100)
-- ============================================

-- Threat 101: Cyberattack (HIGH RISK - Score 20)
INSERT INTO risk_treatment_plans (id, threat_assessment_id, treatment_option, action_description, 
    action_owner, target_date, status, created_at, updated_at, is_deleted)
VALUES 
    (1, 101, 'MITIGATE', 
     'Implement Zero Trust Architecture with micro-segmentation and enhanced MFA for all critical systems',
     'CISO - Security Team', '2025-03-31', 'IN_PROGRESS', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
    (2, 101, 'TRANSFER', 
     'Purchase cyber insurance policy covering ransomware and data breach incidents up to $5M',
     'CFO - Risk Management', '2025-01-31', 'PLANNED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false);

-- ============================================
-- Treatment Plans for APPLICATION Risk Assessment (ID 400)
-- ============================================

-- Threat 401: Data Corruption (HIGH RISK - Score 15)
INSERT INTO risk_treatment_plans (id, threat_assessment_id, treatment_option, action_description,
    action_owner, target_date, status, created_at, updated_at, is_deleted)
VALUES
    (3, 401, 'MITIGATE',
     'Implement real-time database replication to secondary data center with automated failover capability',
     'IT Infrastructure Manager', '2025-02-28', 'IN_PROGRESS', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
    (4, 401, 'MITIGATE',
     'Deploy data integrity monitoring tools with automated alerts for anomaly detection',
     'Database Administrator', '2025-01-15', 'PLANNED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false);

-- Reset sequence for auto-increment (H2 specific)
ALTER TABLE risk_treatment_plans ALTER COLUMN id RESTART WITH 100;

