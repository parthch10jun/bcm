-- V30: Update to ADNOC Branding
-- Description: Change organization branding to ADNOC (Abu Dhabi National Oil Company) with red theme

-- Update organization name to ADNOC
UPDATE system_configuration 
SET config_value = 'ADNOC' 
WHERE category = 'organization' AND config_key = 'name';

-- Update logo to ADNOC logo
UPDATE system_configuration 
SET config_value = '/adnoc-logo.svg' 
WHERE category = 'organization' AND config_key = 'logo';

-- Update colors to ADNOC theme (red branding)
UPDATE system_configuration 
SET config_value = '#e31837' 
WHERE category = 'organization' AND config_key = 'primaryColor';

UPDATE system_configuration 
SET config_value = '#c41230' 
WHERE category = 'organization' AND config_key = 'secondaryColor';

-- Insert organization settings if they don't exist (in case of fresh database)
INSERT INTO system_configuration (category, config_key, config_value, data_type, description, is_editable, requires_admin)
SELECT 'organization', 'name', 'ADNOC', 'string', 'Organization name', TRUE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM system_configuration WHERE category = 'organization' AND config_key = 'name');

INSERT INTO system_configuration (category, config_key, config_value, data_type, description, is_editable, requires_admin)
SELECT 'organization', 'logo', '/adnoc-logo.svg', 'string', 'Organization logo URL', TRUE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM system_configuration WHERE category = 'organization' AND config_key = 'logo');

INSERT INTO system_configuration (category, config_key, config_value, data_type, description, is_editable, requires_admin)
SELECT 'organization', 'primaryColor', '#e31837', 'string', 'Primary brand color', TRUE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM system_configuration WHERE category = 'organization' AND config_key = 'primaryColor');

INSERT INTO system_configuration (category, config_key, config_value, data_type, description, is_editable, requires_admin)
SELECT 'organization', 'secondaryColor', '#c41230', 'string', 'Secondary brand color', TRUE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM system_configuration WHERE category = 'organization' AND config_key = 'secondaryColor');

