-- V10: Add Peak Times & Critical Deadlines Support
--
-- This migration adds support for Peak Times and Critical Deadlines in BIA analysis.
-- Peak times represent time-sensitive business requirements where RTO/RPO may be more aggressive.
--
-- FEATURES:
-- - Multiple peak times per BIA record
-- - Peak-specific RTO/RPO values
-- - Recurring patterns (daily, weekly, monthly, yearly)
-- - Critical deadlines (month-end, quarter-end, year-end, etc.)
-- - System calculation of most aggressive RTO from peak times

-- ============================================================================
-- STEP 1: Create BIA Peak Times Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS bia_peak_times (
    -- Primary Key
    id BIGSERIAL PRIMARY KEY,
    
    -- Relationship to BIA Record
    bia_id BIGINT NOT NULL,
    
    -- Peak Time Details
    peak_time_name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Peak RTO/RPO (more aggressive than baseline)
    peak_rto_hours INTEGER NOT NULL,
    peak_rpo_hours INTEGER,
    
    -- Recurrence Pattern
    recurrence_type VARCHAR(50),  -- 'DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY', 'ONE_TIME'
    recurrence_details TEXT,  -- JSON: {"dayOfWeek": "Monday", "time": "09:00"}
    
    -- Date Range (for one-time or seasonal peaks)
    start_date DATE,
    end_date DATE,
    
    -- Time Range (for daily peaks)
    start_time TIME,
    end_time TIME,
    
    -- Critical Deadline Type
    is_critical_deadline BOOLEAN DEFAULT FALSE,
    deadline_type VARCHAR(100),  -- 'MONTH_END', 'QUARTER_END', 'YEAR_END', 'PAYROLL', 'REGULATORY_FILING', 'CUSTOM'
    
    -- Business Impact
    business_justification TEXT,
    impact_if_missed TEXT,
    
    -- Priority
    priority INTEGER DEFAULT 1,  -- 1 = Highest, 5 = Lowest
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Audit Fields
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(255),
    version BIGINT DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE,
    
    -- Foreign Keys
    CONSTRAINT fk_peak_time_bia FOREIGN KEY (bia_id)
        REFERENCES bia_records(id) ON DELETE CASCADE,
    
    -- Check Constraints
    CONSTRAINT chk_peak_rto_positive CHECK (peak_rto_hours > 0),
    CONSTRAINT chk_peak_rpo_positive CHECK (peak_rpo_hours IS NULL OR peak_rpo_hours >= 0),
    CONSTRAINT chk_recurrence_type CHECK (recurrence_type IS NULL OR recurrence_type IN ('DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY', 'ONE_TIME')),
    CONSTRAINT chk_deadline_type CHECK (deadline_type IS NULL OR deadline_type IN ('MONTH_END', 'QUARTER_END', 'YEAR_END', 'PAYROLL', 'REGULATORY_FILING', 'CUSTOM')),
    CONSTRAINT chk_priority_range CHECK (priority BETWEEN 1 AND 5)
);

-- Indexes for performance
CREATE INDEX idx_peak_times_bia ON bia_peak_times(bia_id);
CREATE INDEX idx_peak_times_active ON bia_peak_times(is_active);
CREATE INDEX idx_peak_times_deadline_type ON bia_peak_times(deadline_type);
CREATE INDEX idx_peak_times_recurrence ON bia_peak_times(recurrence_type);

-- ============================================================================
-- STEP 2: Add RTO Override Fields to BIA Records
-- ============================================================================

-- Add fields to track RTO override logic
ALTER TABLE bia_records ADD COLUMN IF NOT EXISTS baseline_mtpd_hours INTEGER;
ALTER TABLE bia_records ADD COLUMN IF NOT EXISTS most_aggressive_peak_rto_hours INTEGER;
ALTER TABLE bia_records ADD COLUMN IF NOT EXISTS system_suggested_rto_hours INTEGER;
ALTER TABLE bia_records ADD COLUMN IF NOT EXISTS is_rto_override BOOLEAN DEFAULT FALSE;
ALTER TABLE bia_records ADD COLUMN IF NOT EXISTS rto_override_justification TEXT;

-- Add comments for documentation
COMMENT ON COLUMN bia_records.baseline_mtpd_hours IS 'MTPD calculated from impact analysis matrix';
COMMENT ON COLUMN bia_records.most_aggressive_peak_rto_hours IS 'Most aggressive RTO from all peak times';
COMMENT ON COLUMN bia_records.system_suggested_rto_hours IS 'MIN(baseline_mtpd_hours, most_aggressive_peak_rto_hours)';
COMMENT ON COLUMN bia_records.is_rto_override IS 'TRUE if final_rto_hours exceeds system_suggested_rto_hours';
COMMENT ON COLUMN bia_records.rto_override_justification IS 'Required justification when RTO override is used';

COMMENT ON TABLE bia_peak_times IS 'Peak times and critical deadlines requiring more aggressive RTO/RPO';
COMMENT ON COLUMN bia_peak_times.peak_rto_hours IS 'Recovery time objective during peak period (more aggressive than baseline)';
COMMENT ON COLUMN bia_peak_times.peak_rpo_hours IS 'Recovery point objective during peak period';
COMMENT ON COLUMN bia_peak_times.recurrence_type IS 'How often this peak time occurs: DAILY, WEEKLY, MONTHLY, YEARLY, ONE_TIME';
COMMENT ON COLUMN bia_peak_times.is_critical_deadline IS 'TRUE if this is a critical business deadline (month-end, payroll, etc.)';

-- ============================================================================
-- STEP 3: Insert Sample Peak Times Data
-- ============================================================================

-- Note: Sample data will be inserted via application code when BIAs are created
-- This section is reserved for future seed data if needed

-- ============================================================================
-- STEP 4: Migration Complete
-- ============================================================================

-- The BIA system now supports:
-- ✅ Peak times and critical deadlines
-- ✅ Peak-specific RTO/RPO values
-- ✅ Recurring patterns (daily, weekly, monthly, yearly)
-- ✅ System calculation of most aggressive RTO
-- ✅ RTO override with justification tracking

