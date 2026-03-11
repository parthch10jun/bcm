-- V19: Add PEOPLE and DATA risk categories
-- Description: Adds two new risk category types to support personnel and data asset risk assessments

-- Insert PEOPLE risk category
INSERT INTO risk_categories (code, name, description, display_order, is_active, is_deleted, created_at, created_by)
VALUES (
    'PEOPLE',
    'People/Personnel',
    'Risk assessment for key personnel and human resources',
    8,
    TRUE,
    FALSE,
    CURRENT_TIMESTAMP,
    'system'
);

-- Insert DATA risk category
INSERT INTO risk_categories (code, name, description, display_order, is_active, is_deleted, created_at, created_by)
VALUES (
    'DATA',
    'Data Assets',
    'Risk assessment for critical data and information assets',
    9,
    TRUE,
    FALSE,
    CURRENT_TIMESTAMP,
    'system'
);

