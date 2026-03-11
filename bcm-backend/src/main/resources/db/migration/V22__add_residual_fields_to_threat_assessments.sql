-- V22: Add residual_impact and residual_likelihood columns to threat_assessments
-- These fields are needed for calculating residual risk after treatment plans

ALTER TABLE threat_assessments ADD COLUMN IF NOT EXISTS residual_likelihood VARCHAR(50);
ALTER TABLE threat_assessments ADD COLUMN IF NOT EXISTS residual_impact VARCHAR(50);

