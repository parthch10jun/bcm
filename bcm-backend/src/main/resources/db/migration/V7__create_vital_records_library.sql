-- =====================================================
-- Vital Records Library Schema
-- =====================================================
-- This migration creates the Vital Records Library
-- for tracking essential data, files, and documents
-- needed for business processes.
-- =====================================================

-- =====================================================
-- Core Vital Records Table
-- =====================================================

CREATE TABLE IF NOT EXISTS vital_records (
    id BIGSERIAL PRIMARY KEY,
    record_name VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    record_type VARCHAR(100),
    location TEXT,
    description TEXT,
    recovery_point_objective INTEGER,
    owner VARCHAR(255),
    technical_contact VARCHAR(255),
    backup_frequency VARCHAR(100),
    storage_format VARCHAR(100),
    retention_period VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(255),
    version BIGINT DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE,
    CONSTRAINT chk_vital_record_status CHECK (status IN ('ACTIVE', 'ARCHIVED', 'INACTIVE'))
);

-- =====================================================
-- Junction Table: Process-Vital Records
-- =====================================================
-- Links processes to the vital records they depend on
-- Used for BIA gap analysis (RPO requirements vs capabilities)

CREATE TABLE IF NOT EXISTS process_vital_records (
    id BIGSERIAL PRIMARY KEY,
    process_id BIGINT NOT NULL,
    vital_record_id BIGINT NOT NULL,
    dependency_type VARCHAR(50) DEFAULT 'REQUIRED',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(255),
    version BIGINT DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_process_vital_record_process FOREIGN KEY (process_id) 
        REFERENCES processes(id) ON DELETE CASCADE,
    CONSTRAINT fk_process_vital_record_vital_record FOREIGN KEY (vital_record_id) 
        REFERENCES vital_records(id) ON DELETE CASCADE,
    CONSTRAINT chk_vital_record_dependency_type CHECK (dependency_type IN ('REQUIRED', 'OPTIONAL', 'PREFERRED')),
    CONSTRAINT uk_process_vital_record UNIQUE (process_id, vital_record_id)
);

-- =====================================================
-- Indexes for Performance
-- =====================================================

CREATE INDEX idx_vital_records_status ON vital_records(status);
CREATE INDEX idx_vital_records_type ON vital_records(record_type);
CREATE INDEX idx_vital_records_name ON vital_records(record_name);

CREATE INDEX idx_process_vital_records_process ON process_vital_records(process_id);
CREATE INDEX idx_process_vital_records_vital_record ON process_vital_records(vital_record_id);

-- =====================================================
-- Sample Data
-- =====================================================

-- Insert Sample Vital Records
INSERT INTO vital_records (record_name, status, record_type, location, description, recovery_point_objective, owner, backup_frequency, storage_format) VALUES
-- Databases
('Customer Master Database', 'ACTIVE', 'Database', 'Production Server - DB01', 'Central repository of all customer information', 24, 'IT Department', 'Daily at 2:00 AM', 'PostgreSQL'),
('Financial Transactions Database', 'ACTIVE', 'Database', 'Production Server - DB02', 'All financial transactions and accounting data', 1, 'Finance Department', 'Hourly', 'Oracle'),
('Inventory Management Database', 'ACTIVE', 'Database', 'Production Server - DB03', 'Real-time inventory tracking system', 4, 'Operations', 'Every 4 hours', 'MySQL'),

-- Documents
('Payroll Standard Operating Procedures', 'ACTIVE', 'Document', 'SharePoint - HR/Payroll/SOPs', 'Step-by-step payroll processing procedures', 168, 'HR Department', 'Weekly', 'PDF'),
('Vendor Contract Templates', 'ACTIVE', 'Document', 'SharePoint - Legal/Templates', 'Standard vendor agreement templates', 720, 'Legal Department', 'Monthly', 'Word Document'),
('Business Continuity Plan', 'ACTIVE', 'Document', 'SharePoint - BCM/Plans', 'Master BCP document', 24, 'BCM Team', 'Daily', 'PDF'),

-- Contact Lists
('Emergency Contact List', 'ACTIVE', 'Contact List', 'SharePoint - HR/Emergency', 'Employee emergency contact information', 24, 'HR Department', 'Daily', 'Excel'),
('Vendor Contact Directory', 'ACTIVE', 'Contact List', 'SharePoint - Procurement/Contacts', 'Critical vendor contact information', 168, 'Procurement', 'Weekly', 'Excel'),

-- SOPs
('IT Disaster Recovery Procedures', 'ACTIVE', 'SOP', 'SharePoint - IT/DR', 'IT disaster recovery step-by-step guide', 24, 'IT Department', 'Daily', 'PDF'),
('Customer Service Scripts', 'ACTIVE', 'SOP', 'SharePoint - CustomerService/Scripts', 'Standard customer service response scripts', 168, 'Customer Service', 'Weekly', 'Word Document'),

-- Configuration Files
('Network Configuration Backup', 'ACTIVE', 'Configuration', 'Backup Server - /configs/network', 'Router and switch configurations', 24, 'Network Team', 'Daily', 'Text Files'),
('Application Configuration Files', 'ACTIVE', 'Configuration', 'Git Repository - configs/', 'Application settings and configurations', 4, 'Development Team', 'Every 4 hours', 'YAML/JSON');

-- Note: Process-Vital Record relationships will be created when processes are linked to vital records
-- This is where RPO gap analysis happens!

