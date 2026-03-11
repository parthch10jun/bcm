-- V26: Seed Comprehensive BIA Demo Data
--
-- This migration creates a complete BIA record with all associated data:
-- 1. BIA Record (APPROVED status for demo)
-- 2. Impact Analysis Answers (questionnaire responses)
-- 3. BETH3V Dependencies (Assets, People, Vendors, Vital Records, Processes)
-- 4. Peak Times and Critical Deadlines
--
-- This provides a realistic demo for the BIA Report View Page

-- ============================================================================
-- STEP 1: Create Demo BIA Record
-- ============================================================================

INSERT INTO bia_records (
    bia_name,
    bia_target_id,
    bia_target_type,
    bia_type,
    creation_type,
    status,
    analysis_date,
    bia_coordinator,
    baseline_mtpd_hours,
    most_aggressive_peak_rto_hours,
    system_suggested_rto_hours,
    final_rto_hours,
    final_rpo_hours,
    final_criticality,
    is_rto_override,
    rto_override_justification,
    created_at,
    created_by,
    updated_at,
    updated_by,
    version,
    is_deleted
) VALUES (
    'IT Project Management - Business Impact Analysis',
    1,  -- Links to PROC-001 (IT Project Management)
    'PROCESS',
    'PROCESS',
    'DIRECT',  -- Direct BIA analysis (not aggregated)
    'APPROVED',
    DATEADD('DAY', -30, CURRENT_DATE),
    'John Doe',
    24,  -- MTPD: 24 hours (from impact analysis)
    4,   -- Most aggressive peak RTO: 4 hours (from peak times)
    4,   -- System suggested: MIN(24, 4) = 4 hours
    4,   -- Final RTO: 4 hours (accepted system suggestion)
    2,   -- Final RPO: 2 hours
    'HIGH',
    FALSE,
    NULL,
    DATEADD('DAY', -30, CURRENT_TIMESTAMP),
    'System',
    DATEADD('DAY', -1, CURRENT_TIMESTAMP),
    'System',
    0,
    FALSE
);

-- Get the BIA ID for subsequent inserts
-- Note: Assuming this is the first BIA, it will have ID=1
-- If there are existing BIAs, adjust accordingly

-- ============================================================================
-- STEP 2: Insert Impact Analysis Answers
-- ============================================================================

-- Financial Impact Answers
INSERT INTO bia_answers (bia_id, question_id, answer_value, answer_score, answer_notes, created_at, created_by, updated_at, updated_by, version, is_deleted)
SELECT 
    1,  -- BIA ID
    id,
    'Medium',
    2,
    'Project delays could result in moderate financial penalties and resource reallocation costs',
    DATEADD('DAY', -29, CURRENT_TIMESTAMP),
    'John Doe',
    DATEADD('DAY', -29, CURRENT_TIMESTAMP),
    'John Doe',
    0,
    FALSE
FROM bia_questions
WHERE question_category = 'Financial' AND impact_timeframe = '24_HOURS'
LIMIT 1;

-- Operational Impact Answers
INSERT INTO bia_answers (bia_id, question_id, answer_value, answer_score, answer_notes, created_at, created_by, updated_at, updated_by, version, is_deleted)
SELECT 
    1,
    id,
    'High',
    3,
    'Critical IT projects would be delayed, affecting multiple departments and strategic initiatives',
    DATEADD('DAY', -29, CURRENT_TIMESTAMP),
    'John Doe',
    DATEADD('DAY', -29, CURRENT_TIMESTAMP),
    'John Doe',
    0,
    FALSE
FROM bia_questions
WHERE question_category = 'Operational' AND impact_timeframe = '24_HOURS'
LIMIT 1;

-- Reputational Impact Answers
INSERT INTO bia_answers (bia_id, question_id, answer_value, answer_score, answer_notes, created_at, created_by, updated_at, updated_by, version, is_deleted)
SELECT 
    1,
    id,
    'Low',
    1,
    'Internal process with limited external visibility',
    DATEADD('DAY', -29, CURRENT_TIMESTAMP),
    'John Doe',
    DATEADD('DAY', -29, CURRENT_TIMESTAMP),
    'John Doe',
    0,
    FALSE
FROM bia_questions
WHERE question_category = 'Reputational' AND impact_timeframe = '24_HOURS'
LIMIT 1;

-- Regulatory Impact Answers
INSERT INTO bia_answers (bia_id, question_id, answer_value, answer_score, answer_notes, created_at, created_by, updated_at, updated_by, version, is_deleted)
SELECT 
    1,
    id,
    'Low',
    1,
    'No direct regulatory requirements for project management timelines',
    DATEADD('DAY', -29, CURRENT_TIMESTAMP),
    'John Doe',
    DATEADD('DAY', -29, CURRENT_TIMESTAMP),
    'John Doe',
    0,
    FALSE
FROM bia_questions
WHERE question_category = 'Regulatory' AND impact_timeframe = '24_HOURS'
LIMIT 1;

-- Customer Impact Answers
INSERT INTO bia_answers (bia_id, question_id, answer_value, answer_score, answer_notes, created_at, created_by, updated_at, updated_by, version, is_deleted)
SELECT 
    1,
    id,
    'Medium',
    2,
    'Delays in IT projects could affect internal customer service delivery timelines',
    DATEADD('DAY', -29, CURRENT_TIMESTAMP),
    'John Doe',
    DATEADD('DAY', -29, CURRENT_TIMESTAMP),
    'John Doe',
    0,
    FALSE
FROM bia_questions
WHERE question_category = 'Customer' AND impact_timeframe = '24_HOURS'
LIMIT 1;

-- ============================================================================
-- STEP 3: Insert BETH3V Dependencies
-- ============================================================================

-- Assets Dependencies (Buildings, Equipment, Technology)
-- Link to demo assets if they exist
INSERT INTO bia_dependent_assets (bia_id, asset_id, dependency_type, notes, created_at, created_by, updated_at, updated_by, version, is_deleted)
SELECT
    1,
    id,
    'REQUIRED',
    'Critical for project management operations',
    DATEADD('DAY', -28, CURRENT_TIMESTAMP),
    'John Doe',
    DATEADD('DAY', -28, CURRENT_TIMESTAMP),
    'John Doe',
    0,
    FALSE
FROM assets
WHERE is_deleted = FALSE
LIMIT 3;

-- People Dependencies (Key Personnel)
-- Link to existing users
INSERT INTO bia_dependent_people (bia_id, user_id, role_in_bia, is_critical, notes, created_at, created_by, updated_at, updated_by, version, is_deleted)
SELECT
    1,
    id,
    CASE
        WHEN id = 1 THEN 'IT Project Manager'
        WHEN id = 2 THEN 'Senior Developer'
        ELSE 'Project Team Member'
    END,
    CASE WHEN id <= 2 THEN TRUE ELSE FALSE END,
    'Key personnel required for project management activities',
    DATEADD('DAY', -28, CURRENT_TIMESTAMP),
    'John Doe',
    DATEADD('DAY', -28, CURRENT_TIMESTAMP),
    'John Doe',
    0,
    FALSE
FROM users
WHERE is_deleted = FALSE
LIMIT 5;

-- Vendor Dependencies (3rd Party Services)
-- Link to demo vendors if they exist
INSERT INTO bia_dependent_vendors (bia_id, vendor_id, service_provided, dependency_type, notes, created_at, created_by, updated_at, updated_by, version, is_deleted)
SELECT
    1,
    id,
    'Project management software and collaboration tools',
    'REQUIRED',
    'Essential for project tracking and team collaboration',
    DATEADD('DAY', -28, CURRENT_TIMESTAMP),
    'John Doe',
    DATEADD('DAY', -28, CURRENT_TIMESTAMP),
    'John Doe',
    0,
    FALSE
FROM vendors
WHERE is_deleted = FALSE
LIMIT 2;

-- Vital Records Dependencies (Documents/Data)
-- Link to demo vital records if they exist
INSERT INTO bia_dependent_vital_records (bia_id, vital_record_id, dependency_type, notes, created_at, created_by, updated_at, updated_by, version, is_deleted)
SELECT
    1,
    id,
    'REQUIRED',
    'Critical project documentation and data',
    DATEADD('DAY', -28, CURRENT_TIMESTAMP),
    'John Doe',
    DATEADD('DAY', -28, CURRENT_TIMESTAMP),
    'John Doe',
    0,
    FALSE
FROM vital_records
WHERE is_deleted = FALSE
LIMIT 3;

-- Process Dependencies (Upstream/Downstream Processes)
-- Link to other processes
INSERT INTO bia_dependent_processes (bia_id, process_id, dependency_type, notes, created_at, created_by, updated_at, updated_by, version, is_deleted)
SELECT
    1,
    id,
    'REQUIRED',
    CASE
        WHEN id = 2 THEN 'Depends on IT Asset Management for resource allocation'
        ELSE 'Supports downstream IT operations'
    END,
    DATEADD('DAY', -28, CURRENT_TIMESTAMP),
    'John Doe',
    DATEADD('DAY', -28, CURRENT_TIMESTAMP),
    'John Doe',
    0,
    FALSE
FROM processes
WHERE id != 1  -- Exclude the process this BIA is for
AND is_deleted = FALSE
LIMIT 2;

-- ============================================================================
-- STEP 4: Insert Peak Times and Critical Deadlines
-- ============================================================================

-- Peak Time 1: Quarter-End Project Reviews
INSERT INTO bia_peak_times (
    bia_id,
    peak_time_name,
    description,
    peak_rto_hours,
    peak_rpo_hours,
    recurrence_type,
    recurrence_details,
    start_date,
    end_date,
    is_critical_deadline,
    deadline_type,
    business_justification,
    impact_if_missed,
    priority,
    is_active,
    created_at,
    created_by,
    updated_at,
    updated_by,
    version,
    is_deleted
) VALUES (
    1,
    'Quarter-End Project Reviews',
    'Critical quarterly project status reviews and reporting to executive management',
    4,  -- 4-hour RTO during quarter-end
    2,  -- 2-hour RPO
    'YEARLY',
    '{"months": [3, 6, 9, 12], "days": [28, 29, 30]}',
    NULL,
    NULL,
    TRUE,
    'QUARTER_END',
    'Executive management requires timely project status reports for quarterly board meetings',
    'Delayed executive reporting, potential impact on strategic decision-making',
    1,  -- Highest priority
    TRUE,
    DATEADD('DAY', -27, CURRENT_TIMESTAMP),
    'John Doe',
    DATEADD('DAY', -27, CURRENT_TIMESTAMP),
    'John Doe',
    0,
    FALSE
);

-- Peak Time 2: Year-End Budget Planning
INSERT INTO bia_peak_times (
    bia_id,
    peak_time_name,
    description,
    peak_rto_hours,
    peak_rpo_hours,
    recurrence_type,
    recurrence_details,
    start_date,
    end_date,
    is_critical_deadline,
    deadline_type,
    business_justification,
    impact_if_missed,
    priority,
    is_active,
    created_at,
    created_by,
    updated_at,
    updated_by,
    version,
    is_deleted
) VALUES (
    1,
    'Year-End Budget Planning',
    'Annual IT project budget planning and resource allocation for next fiscal year',
    8,  -- 8-hour RTO during year-end
    4,  -- 4-hour RPO
    'YEARLY',
    '{"months": [12], "days": [15, 16, 17, 18, 19, 20]}',
    NULL,
    NULL,
    TRUE,
    'YEAR_END',
    'Critical for next year IT project planning and budget approval',
    'Delayed budget submission, potential funding gaps for critical IT initiatives',
    2,  -- High priority
    TRUE,
    DATEADD('DAY', -27, CURRENT_TIMESTAMP),
    'John Doe',
    DATEADD('DAY', -27, CURRENT_TIMESTAMP),
    'John Doe',
    0,
    FALSE
);

-- Peak Time 3: Monthly Project Status Reporting
INSERT INTO bia_peak_times (
    bia_id,
    peak_time_name,
    description,
    peak_rto_hours,
    peak_rpo_hours,
    recurrence_type,
    recurrence_details,
    start_date,
    end_date,
    is_critical_deadline,
    deadline_type,
    business_justification,
    impact_if_missed,
    priority,
    is_active,
    created_at,
    created_by,
    updated_at,
    updated_by,
    version,
    is_deleted
) VALUES (
    1,
    'Monthly Project Status Reporting',
    'Monthly project status reports to department heads and stakeholders',
    12,  -- 12-hour RTO for monthly reporting
    6,   -- 6-hour RPO
    'MONTHLY',
    '{"dayOfMonth": 28}',
    NULL,
    NULL,
    TRUE,
    'MONTH_END',
    'Regular project status updates required for departmental planning and resource allocation',
    'Delayed stakeholder communication, potential project coordination issues',
    3,  -- Medium priority
    TRUE,
    DATEADD('DAY', -27, CURRENT_TIMESTAMP),
    'John Doe',
    DATEADD('DAY', -27, CURRENT_TIMESTAMP),
    'John Doe',
    0,
    FALSE
);

-- ============================================================================
-- STEP 5: Migration Complete
-- ============================================================================

-- The BIA demo data now includes:
-- ✅ Complete BIA record (APPROVED status)
-- ✅ Impact analysis answers across all categories
-- ✅ BETH3V dependencies (Assets, People, Vendors, Vital Records, Processes)
-- ✅ Peak times and critical deadlines with RTO overrides
-- ✅ Realistic business justifications and impact descriptions


