-- ============================================================================
-- Migration V4: Create Users Table for People Library
-- ============================================================================
-- Purpose: Store employee/user information with HRMS integration support
-- Author: BCM Platform
-- Date: 2025-10-17
-- ============================================================================

-- ============================================================================
-- STEP 1: Create users table
-- ============================================================================

CREATE TABLE IF NOT EXISTS users (
    -- Primary Key
    id BIGSERIAL PRIMARY KEY,
    
    -- Basic Information
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    contact_number VARCHAR(50),
    
    -- Role and Organization
    role VARCHAR(100),
    organizational_unit_id BIGINT,
    
    -- HRMS Integration Fields
    hrms_employee_id VARCHAR(100) UNIQUE,  -- External HRMS system ID
    last_synced_at TIMESTAMP,              -- Last time synced from HRMS
    
    -- Status
    status VARCHAR(50) DEFAULT 'ACTIVE',   -- ACTIVE, INACTIVE, TERMINATED
    
    -- Audit Fields
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(255),
    version BIGINT DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE,
    
    -- Foreign Keys
    CONSTRAINT fk_user_unit FOREIGN KEY (organizational_unit_id) 
        REFERENCES organizational_units(id) ON DELETE SET NULL,
    
    -- Constraints
    CONSTRAINT chk_user_status CHECK (status IN ('ACTIVE', 'INACTIVE', 'TERMINATED'))
);

-- ============================================================================
-- STEP 2: Create indexes for performance
-- ============================================================================

CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_user_unit ON users(organizational_unit_id);
CREATE INDEX idx_user_status ON users(status);
CREATE INDEX idx_user_hrms_id ON users(hrms_employee_id);
CREATE INDEX idx_user_role ON users(role);

-- ============================================================================
-- STEP 3: Create bulk_upload_logs table for tracking uploads
-- ============================================================================

CREATE TABLE IF NOT EXISTS bulk_upload_logs (
    -- Primary Key
    id BIGSERIAL PRIMARY KEY,
    
    -- Upload Information
    file_name VARCHAR(255) NOT NULL,
    upload_type VARCHAR(50) NOT NULL,      -- USERS, PROCESSES, etc.
    total_rows INTEGER NOT NULL,
    successful_rows INTEGER NOT NULL,
    failed_rows INTEGER NOT NULL,
    
    -- Error Details
    error_report TEXT,                     -- JSON or CSV of errors
    
    -- Audit Fields
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    uploaded_by VARCHAR(255),
    
    -- Constraints
    CONSTRAINT chk_upload_type CHECK (upload_type IN ('USERS', 'PROCESSES', 'LOCATIONS', 'SERVICES'))
);

-- ============================================================================
-- STEP 4: Create hrms_sync_logs table for tracking HRMS syncs
-- ============================================================================

CREATE TABLE IF NOT EXISTS hrms_sync_logs (
    -- Primary Key
    id BIGSERIAL PRIMARY KEY,
    
    -- Sync Information
    sync_status VARCHAR(50) NOT NULL,      -- SUCCESS, FAILED, PARTIAL
    users_added INTEGER DEFAULT 0,
    users_updated INTEGER DEFAULT 0,
    users_failed INTEGER DEFAULT 0,
    
    -- Error Details
    error_message TEXT,
    
    -- Timing
    started_at TIMESTAMP NOT NULL,
    completed_at TIMESTAMP,
    
    -- Audit
    triggered_by VARCHAR(255),
    
    -- Constraints
    CONSTRAINT chk_sync_status CHECK (sync_status IN ('SUCCESS', 'FAILED', 'PARTIAL', 'IN_PROGRESS'))
);

-- ============================================================================
-- STEP 5: Insert sample data
-- ============================================================================

INSERT INTO users (full_name, email, contact_number, role, organizational_unit_id, status, hrms_employee_id) VALUES
('John Doe', 'john.doe@acme.com', '+1 (555) 123-4567', 'Senior Accountant', 2, 'ACTIVE', 'HRMS-001'),
('Jane Smith', 'jane.smith@acme.com', '+1 (555) 234-5678', 'HR Manager', 2, 'ACTIVE', 'HRMS-002'),
('Bob Johnson', 'bob.johnson@acme.com', '+1 (555) 345-6789', 'IT Director', 2, 'ACTIVE', 'HRMS-003'),
('Alice Williams', 'alice.williams@acme.com', '+1 (555) 456-7890', 'Operations Manager', 2, 'ACTIVE', 'HRMS-004'),
('Charlie Brown', 'charlie.brown@acme.com', '+1 (555) 567-8901', 'Sales Representative', 2, 'ACTIVE', 'HRMS-005');

-- ============================================================================
-- End of Migration V4
-- ============================================================================

