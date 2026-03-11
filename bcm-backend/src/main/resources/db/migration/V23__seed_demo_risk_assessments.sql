-- V23: Seed Demo Risk Assessment Data for Customer Walkthrough
-- This migration creates sample risk assessments for each risk category type
-- Purpose: Demo/Presentation - Can be removed for production

-- ============================================
-- 1. PROCESS Risk Assessment (IT Operations)
-- ============================================
INSERT INTO risk_assessments (id, risk_category_id, context_type, context_id, context_name, 
    assessment_name, description, assessor_name, assessor_email, assessment_date, 
    risk_threshold, status, completion_percentage, current_step, created_at, updated_at, is_deleted)
VALUES (100, 3, 'PROCESS', 1, 'IT Operations Process',
    'IT Operations Risk Assessment Q4 2024',
    'Comprehensive risk assessment for IT operations covering cyber threats, infrastructure failures, and vendor dependencies',
    'Sarah Johnson', 'sarah.johnson@company.com', '2024-11-01',
    12, 'APPROVED', 100, 7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false);

-- Threat Assessments for PROCESS (4 threats from V21 mapping)
INSERT INTO threat_assessments (id, risk_assessment_id, threat_id, likelihood, impact, risk_score, risk_level,
    current_controls, control_effectiveness, is_selected, created_at, updated_at, is_deleted)
VALUES
    (101, 100, 1, 'LIKELY', 'CATASTROPHIC', 20, 'HIGH',
     'Firewall, EDR, Email filtering, Regular backups, Incident response plan',
     'MODERATE', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
    (102, 100, 2, 'POSSIBLE', 'MAJOR', 12, 'MEDIUM',
     'UPS systems, Backup generators, Redundant power feeds',
     'STRONG', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
    (103, 100, 3, 'UNLIKELY', 'MAJOR', 8, 'MEDIUM',
     'Vendor SLAs, Multiple suppliers, Regular vendor audits',
     'MODERATE', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
    (104, 100, 4, 'POSSIBLE', 'MODERATE', 9, 'MEDIUM',
     'Succession planning, Cross-training, Knowledge documentation',
     'MODERATE', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false);

-- ============================================
-- 2. LOCATION Risk Assessment (Head Office)
-- ============================================
INSERT INTO risk_assessments (id, risk_category_id, context_type, context_id, context_name,
    assessment_name, description, assessor_name, assessor_email, assessment_date,
    risk_threshold, status, completion_percentage, current_step, created_at, updated_at, is_deleted)
VALUES (200, 1, 'LOCATION', 1, 'Head Office - Downtown',
    'Head Office Facility Risk Assessment 2024',
    'Physical and environmental risk assessment for primary business location including natural disasters and infrastructure',
    'Michael Chen', 'michael.chen@company.com', '2024-10-15',
    10, 'APPROVED', 100, 7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false);

-- Threat Assessments for LOCATION (3 threats from V21 mapping)
INSERT INTO threat_assessments (id, risk_assessment_id, threat_id, likelihood, impact, risk_score, risk_level,
    current_controls, control_effectiveness, is_selected, created_at, updated_at, is_deleted)
VALUES
    (201, 200, 5, 'RARE', 'CATASTROPHIC', 5, 'LOW',
     'Seismic building design, Emergency evacuation plan, Insurance coverage',
     'STRONG', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
    (202, 200, 6, 'UNLIKELY', 'MAJOR', 8, 'MEDIUM',
     'Fire suppression systems, Smoke detectors, Fire drills, Emergency exits',
     'STRONG', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
    (203, 200, 2, 'POSSIBLE', 'MODERATE', 9, 'MEDIUM',
     'Backup power, UPS systems, Generator maintenance',
     'MODERATE', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false);

-- ============================================
-- 3. SUPPLIER Risk Assessment (Cloud Provider)
-- ============================================
INSERT INTO risk_assessments (id, risk_category_id, context_type, context_id, context_name,
    assessment_name, description, assessor_name, assessor_email, assessment_date,
    risk_threshold, status, completion_percentage, current_step, created_at, updated_at, is_deleted)
VALUES (300, 4, 'SUPPLIER', 1, 'AWS Cloud Services',
    'Critical Supplier Risk Assessment - AWS',
    'Third-party risk assessment for primary cloud infrastructure provider',
    'David Martinez', 'david.martinez@company.com', '2024-11-10',
    15, 'UNDER_REVIEW', 100, 7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false);

-- Threat Assessments for SUPPLIER (3 threats from V21 mapping)
INSERT INTO threat_assessments (id, risk_assessment_id, threat_id, likelihood, impact, risk_score, risk_level,
    current_controls, control_effectiveness, is_selected, created_at, updated_at, is_deleted)
VALUES
    (301, 300, 3, 'UNLIKELY', 'CATASTROPHIC', 10, 'MEDIUM',
     'Multi-cloud strategy, SLA monitoring, Disaster recovery plan',
     'MODERATE', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
    (302, 300, 7, 'POSSIBLE', 'MAJOR', 12, 'MEDIUM',
     'Data encryption, Access controls, Regular security audits',
     'STRONG', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
    (303, 300, 8, 'UNLIKELY', 'MAJOR', 8, 'MEDIUM',
     'Compliance monitoring, Regular audits, Legal review',
     'STRONG', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false);

-- ============================================
-- 4. APPLICATION Risk Assessment (ERP System)
-- ============================================
INSERT INTO risk_assessments (id, risk_category_id, context_type, context_id, context_name,
    assessment_name, description, assessor_name, assessor_email, assessment_date,
    risk_threshold, status, completion_percentage, current_step, created_at, updated_at, is_deleted)
VALUES (400, 5, 'APPLICATION', 1, 'SAP ERP System',
    'Enterprise Application Risk Assessment - SAP',
    'Critical application risk assessment covering availability, security, and data integrity',
    'Emily Rodriguez', 'emily.rodriguez@company.com', '2024-11-05',
    12, 'DRAFT', 75, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false);

-- Threat Assessments for APPLICATION (2 threats from V21 mapping)
INSERT INTO threat_assessments (id, risk_assessment_id, threat_id, likelihood, impact, risk_score, risk_level,
    current_controls, control_effectiveness, is_selected, created_at, updated_at, is_deleted)
VALUES
    (401, 400, 9, 'POSSIBLE', 'CATASTROPHIC', 15, 'HIGH',
     'Regular backups, Database replication, Data validation rules',
     'MODERATE', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
    (402, 400, 10, 'UNLIKELY', 'MAJOR', 8, 'MEDIUM',
     'Patch management, Vulnerability scanning, Penetration testing',
     'MODERATE', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false);

-- ============================================
-- 5. PEOPLE Risk Assessment (Executive Team)
-- ============================================
INSERT INTO risk_assessments (id, risk_category_id, context_type, context_id, context_name,
    assessment_name, description, assessor_name, assessor_email, assessment_date,
    risk_threshold, status, completion_percentage, current_step, created_at, updated_at, is_deleted)
VALUES (500, 8, 'PEOPLE', 1, 'Executive Leadership Team',
    'Key Personnel Risk Assessment - C-Suite',
    'Assessment of risks related to loss of critical executive personnel',
    'Robert Taylor', 'robert.taylor@company.com', '2024-10-20',
    10, 'APPROVED', 100, 7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false);

-- Threat Assessment for PEOPLE (1 threat from V21 mapping)
INSERT INTO threat_assessments (id, risk_assessment_id, threat_id, likelihood, impact, risk_score, risk_level,
    current_controls, control_effectiveness, is_selected, created_at, updated_at, is_deleted)
VALUES
    (501, 500, 4, 'UNLIKELY', 'MAJOR', 8, 'MEDIUM',
     'Succession planning, Deputy roles, Knowledge transfer programs, Retention bonuses',
     'MODERATE', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false);

-- Reset sequence for auto-increment (H2 specific)
ALTER TABLE risk_assessments ALTER COLUMN id RESTART WITH 1000;
ALTER TABLE threat_assessments ALTER COLUMN id RESTART WITH 1000;

