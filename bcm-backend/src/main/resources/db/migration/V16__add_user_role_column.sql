-- Migration V16: Add user_role column and job_title to users table
-- This migration adds role-based access control (RBAC) support

-- Add user_role column (enum: ADMIN, COORDINATOR, MANAGER, USER)
ALTER TABLE users ADD COLUMN IF NOT EXISTS user_role VARCHAR(50) NOT NULL DEFAULT 'USER';

-- Add job_title column
ALTER TABLE users ADD COLUMN IF NOT EXISTS job_title VARCHAR(255);

-- Rename old 'role' column to avoid confusion (if it exists)
-- The old 'role' was a free-text field, new 'user_role' is an enum
ALTER TABLE users RENAME COLUMN role TO legacy_role;

-- Create an index on user_role for faster role-based queries
CREATE INDEX IF NOT EXISTS idx_users_user_role ON users(user_role);

-- Seed default admin user for testing (email: admin@golfsaudi.com)
-- Using MERGE for H2 compatibility (equivalent to INSERT ... ON CONFLICT)
MERGE INTO users (
    full_name,
    email,
    contact_number,
    job_title,
    user_role,
    status,
    created_at,
    updated_at,
    version,
    is_deleted
) KEY(email) VALUES (
    'System Administrator',
    'admin@golfsaudi.com',
    '+966-12-345-6789',
    'System Administrator',
    'ADMIN',
    'ACTIVE',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    0,
    FALSE
);

-- Seed BIA Coordinator for testing (email: coordinator@golfsaudi.com)
MERGE INTO users (
    full_name,
    email,
    contact_number,
    job_title,
    user_role,
    status,
    created_at,
    updated_at,
    version,
    is_deleted
) KEY(email) VALUES (
    'BIA Coordinator',
    'coordinator@golfsaudi.com',
    '+966-12-345-6790',
    'Business Continuity Coordinator',
    'COORDINATOR',
    'ACTIVE',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    0,
    FALSE
);

-- Seed Manager for testing (email: manager@golfsaudi.com)
MERGE INTO users (
    full_name,
    email,
    contact_number,
    job_title,
    user_role,
    status,
    created_at,
    updated_at,
    version,
    is_deleted
) KEY(email) VALUES (
    'Department Manager',
    'manager@golfsaudi.com',
    '+966-12-345-6791',
    'Department Manager',
    'MANAGER',
    'ACTIVE',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    0,
    FALSE
);

-- Seed Regular User for testing (email: user@golfsaudi.com)
MERGE INTO users (
    full_name,
    email,
    contact_number,
    job_title,
    user_role,
    status,
    created_at,
    updated_at,
    version,
    is_deleted
) KEY(email) VALUES (
    'Regular User',
    'user@golfsaudi.com',
    '+966-12-345-6792',
    'Business Analyst',
    'USER',
    'ACTIVE',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    0,
    FALSE
);

