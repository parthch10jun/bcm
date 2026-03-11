-- V27: Update Theme to Blue and Remove Golf Saudi Branding
-- Description: Change organization branding from Golf Saudi green to professional blue theme

-- Update organization colors to blue theme
UPDATE system_configuration 
SET config_value = '#1e3a8a' 
WHERE category = 'organization' AND config_key = 'primaryColor';

UPDATE system_configuration 
SET config_value = '#3b82f6' 
WHERE category = 'organization' AND config_key = 'secondaryColor';

-- Remove Golf Saudi logo (set to null for now, can be replaced with client logo)
UPDATE system_configuration 
SET config_value = NULL 
WHERE category = 'organization' AND config_key = 'logo';

-- Update organization name to generic BCM Platform
UPDATE system_configuration 
SET config_value = 'BCM Platform' 
WHERE category = 'organization' AND config_key = 'name';

