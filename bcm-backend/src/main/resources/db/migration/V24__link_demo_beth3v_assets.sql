-- V24: Link BETH3V assets to demo processes for Risk Assessment demo
-- This migration creates realistic BETH3V linkages for demo purposes

-- Link Assets (Technology) to Process ID 1 (IT Project Management)
INSERT INTO process_assets (process_id, asset_id, dependency_type, notes, created_at, updated_at)
VALUES
    (1, 3, 'REQUIRED', 'SAP ERP system used for project tracking and resource management', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (1, 4, 'REQUIRED', 'Oracle Database for project data storage', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (1, 5, 'OPTIONAL', 'Network infrastructure for team collaboration', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Link Vendors (Third-Party) to Process ID 1 (IT Project Management)
INSERT INTO process_vendors (process_id, vendor_id, notes, created_at, updated_at)
VALUES
    (1, 1, 'AWS provides cloud hosting for project management tools', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (1, 4, 'Salesforce for stakeholder management', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Link Vital Records to Process ID 1 (IT Project Management)
INSERT INTO process_vital_records (process_id, vital_record_id, dependency_type, notes, created_at, updated_at)
VALUES
    (1, 1, 'REQUIRED', 'Customer requirements and specifications', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (1, 5, 'OPTIONAL', 'Vendor contract templates for procurement', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Link Assets to Process ID 2 (Payroll Processing) if it exists
INSERT INTO process_assets (process_id, asset_id, dependency_type, notes, created_at, updated_at)
SELECT 2, 1, 'REQUIRED', 'SAP Finance Server for payroll calculations', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE EXISTS (SELECT 1 FROM processes WHERE id = 2);

INSERT INTO process_assets (process_id, asset_id, dependency_type, notes, created_at, updated_at)
SELECT 2, 2, 'REQUIRED', 'Oracle Database for payroll data', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE EXISTS (SELECT 1 FROM processes WHERE id = 2);

-- Link Vendors to Process ID 2 (Payroll Processing)
INSERT INTO process_vendors (process_id, vendor_id, notes, created_at, updated_at)
SELECT 2, 3, 'ADP for payroll processing', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE EXISTS (SELECT 1 FROM processes WHERE id = 2);

-- Link Vital Records to Process ID 2 (Payroll Processing)
INSERT INTO process_vital_records (process_id, vital_record_id, dependency_type, notes, created_at, updated_at)
SELECT 2, 2, 'REQUIRED', 'Financial transactions for payroll', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE EXISTS (SELECT 1 FROM processes WHERE id = 2);

INSERT INTO process_vital_records (process_id, vital_record_id, dependency_type, notes, created_at, updated_at)
SELECT 2, 4, 'REQUIRED', 'Payroll SOPs and procedures', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE EXISTS (SELECT 1 FROM processes WHERE id = 2);

-- Link Assets to Process ID 3 (Customer Service) if it exists
INSERT INTO process_assets (process_id, asset_id, dependency_type, notes, created_at, updated_at)
SELECT 3, 3, 'REQUIRED', 'SAP ERP for customer data', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE EXISTS (SELECT 1 FROM processes WHERE id = 3);

-- Link Vendors to Process ID 3 (Customer Service)
INSERT INTO process_vendors (process_id, vendor_id, notes, created_at, updated_at)
SELECT 3, 4, 'Salesforce for customer relationship management', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE EXISTS (SELECT 1 FROM processes WHERE id = 3);

-- Link Vital Records to Process ID 3 (Customer Service)
INSERT INTO process_vital_records (process_id, vital_record_id, dependency_type, notes, created_at, updated_at)
SELECT 3, 1, 'REQUIRED', 'Customer master database', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE EXISTS (SELECT 1 FROM processes WHERE id = 3);

