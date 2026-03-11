-- V15: Create System Configuration Table
-- This table stores global system settings including organization branding and BIA configuration

CREATE TABLE system_configuration (
    id BIGSERIAL PRIMARY KEY,
    category VARCHAR(100) NOT NULL,
    config_key VARCHAR(100) NOT NULL,
    config_value TEXT,
    data_type VARCHAR(50),
    description VARCHAR(500),
    is_editable BOOLEAN NOT NULL DEFAULT TRUE,
    requires_admin BOOLEAN NOT NULL DEFAULT TRUE,
    
    -- Audit fields
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255),
    version INTEGER DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE,
    
    -- Unique constraint on category + key
    CONSTRAINT uk_system_config_category_key UNIQUE (category, config_key)
);

-- Create indexes for faster lookups
CREATE INDEX idx_system_config_category ON system_configuration(category);
CREATE INDEX idx_system_config_editable ON system_configuration(is_editable);
CREATE INDEX idx_system_config_admin ON system_configuration(requires_admin);

-- Insert default organization settings
INSERT INTO system_configuration (category, config_key, config_value, data_type, description, is_editable, requires_admin)
VALUES 
    ('organization', 'name', 'BCM 360', 'string', 'Organization name', TRUE, TRUE),
    ('organization', 'logo', '/golf-saudi-logo.svg', 'string', 'Organization logo URL', TRUE, TRUE),
    ('organization', 'primaryColor', '#1e3a1e', 'string', 'Primary brand color', TRUE, TRUE),
    ('organization', 'secondaryColor', '#4a9d4a', 'string', 'Secondary brand color', TRUE, TRUE),
    ('organization', 'contactEmail', '', 'string', 'Contact email', TRUE, TRUE),
    ('organization', 'website', '', 'string', 'Website URL', TRUE, TRUE),
    ('organization', 'industry', '', 'string', 'Industry', TRUE, TRUE),
    ('organization', 'size', '', 'string', 'Organization size', TRUE, TRUE);

-- Insert default BIA configuration (stored as JSON)
INSERT INTO system_configuration (category, config_key, config_value, data_type, description, is_editable, requires_admin)
VALUES (
    'bia_config',
    'config',
    '{
        "timeFrames": [
            {"id": "1", "label": "1 Hour", "valueInHours": 1},
            {"id": "2", "label": "4 Hours", "valueInHours": 4},
            {"id": "3", "label": "24 Hours", "valueInHours": 24},
            {"id": "4", "label": "3 Days", "valueInHours": 72},
            {"id": "5", "label": "1 Week", "valueInHours": 168}
        ],
        "impactCategories": [
            {
                "id": "1",
                "name": "Financial",
                "severityDefinitions": {
                    "0": "No financial impact",
                    "1": "Less than $10,000 impact",
                    "2": "$10,000 - $100,000 impact",
                    "3": "$100,000 - $1,000,000 impact",
                    "4": ">$1,000,000 or threat to business viability"
                }
            },
            {
                "id": "2",
                "name": "Operational",
                "severityDefinitions": {
                    "0": "No operational impact",
                    "1": "Minimal operational disruption",
                    "2": "Minor delays in non-critical functions",
                    "3": "Moderate impact on core operations",
                    "4": "Complete operational shutdown"
                }
            },
            {
                "id": "3",
                "name": "Reputational",
                "severityDefinitions": {
                    "0": "No reputational impact",
                    "1": "No public awareness or concern",
                    "2": "Limited local media attention",
                    "3": "Regional media coverage, customer complaints",
                    "4": "International coverage, permanent brand damage"
                }
            },
            {
                "id": "4",
                "name": "Legal/Regulatory",
                "severityDefinitions": {
                    "0": "No legal or regulatory implications",
                    "1": "Minor compliance issues, easily resolved",
                    "2": "Moderate regulatory scrutiny or fines",
                    "3": "Significant legal action or regulatory penalties",
                    "4": "Criminal liability or license revocation"
                }
            }
        ],
        "criticalityThreshold": 3,
        "rtoOptions": ["15 minutes", "1 hour", "4 hours", "8 hours", "1 day", "3 days", "1 week"],
        "rpoOptions": ["0 minutes", "15 minutes", "1 hour", "4 hours", "8 hours", "1 day"]
    }',
    'json',
    'BIA configuration settings',
    TRUE,
    TRUE
);

