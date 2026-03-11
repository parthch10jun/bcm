-- V28: Update to Ascent Branding
-- Description: Change organization branding to Ascent with professional blue/green theme

-- Update organization name to Ascent
UPDATE system_configuration 
SET config_value = 'Ascent' 
WHERE category = 'organization' AND config_key = 'name';

-- Update logo to Ascent logo
UPDATE system_configuration 
SET config_value = '/ascent-logo.svg' 
WHERE category = 'organization' AND config_key = 'logo';

-- Update colors to Ascent theme (professional blue with green accent)
UPDATE system_configuration 
SET config_value = '#1e3a5f' 
WHERE category = 'organization' AND config_key = 'primaryColor';

UPDATE system_configuration 
SET config_value = '#00a86b' 
WHERE category = 'organization' AND config_key = 'secondaryColor';

