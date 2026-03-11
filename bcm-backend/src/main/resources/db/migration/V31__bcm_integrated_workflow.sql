-- V31: BCM Integrated Workflow Enhancement
-- Description: Add upstream/downstream dependency classification, link RA to BIA, enhance BCP with dependency matrix

-- =============================================
-- 1. ENHANCE BIA DEPENDENCIES WITH DIRECTION
-- =============================================

-- Add direction column to existing dependency tables
ALTER TABLE bia_dependent_assets ADD COLUMN IF NOT EXISTS dependency_direction VARCHAR(20) DEFAULT 'UPSTREAM';
ALTER TABLE bia_dependent_assets ADD COLUMN IF NOT EXISTS is_single_point_of_failure BOOLEAN DEFAULT FALSE;
ALTER TABLE bia_dependent_assets ADD COLUMN IF NOT EXISTS alternate_option TEXT;

ALTER TABLE bia_dependent_vendors ADD COLUMN IF NOT EXISTS dependency_direction VARCHAR(20) DEFAULT 'UPSTREAM';
ALTER TABLE bia_dependent_vendors ADD COLUMN IF NOT EXISTS is_single_point_of_failure BOOLEAN DEFAULT FALSE;
ALTER TABLE bia_dependent_vendors ADD COLUMN IF NOT EXISTS alternate_option TEXT;
ALTER TABLE bia_dependent_vendors ADD COLUMN IF NOT EXISTS contracted_rto_hours INTEGER;
ALTER TABLE bia_dependent_vendors ADD COLUMN IF NOT EXISTS contracted_rpo_hours INTEGER;

ALTER TABLE bia_dependent_people ADD COLUMN IF NOT EXISTS dependency_direction VARCHAR(20) DEFAULT 'UPSTREAM';
ALTER TABLE bia_dependent_people ADD COLUMN IF NOT EXISTS is_single_point_of_failure BOOLEAN DEFAULT FALSE;
ALTER TABLE bia_dependent_people ADD COLUMN IF NOT EXISTS alternate_option TEXT;
ALTER TABLE bia_dependent_people ADD COLUMN IF NOT EXISTS minimum_required INTEGER DEFAULT 1;

ALTER TABLE bia_dependent_vital_records ADD COLUMN IF NOT EXISTS dependency_direction VARCHAR(20) DEFAULT 'UPSTREAM';
ALTER TABLE bia_dependent_vital_records ADD COLUMN IF NOT EXISTS is_single_point_of_failure BOOLEAN DEFAULT FALSE;
ALTER TABLE bia_dependent_vital_records ADD COLUMN IF NOT EXISTS alternate_option TEXT;

ALTER TABLE bia_dependent_processes ADD COLUMN IF NOT EXISTS dependency_direction VARCHAR(20) DEFAULT 'UPSTREAM';
ALTER TABLE bia_dependent_processes ADD COLUMN IF NOT EXISTS is_single_point_of_failure BOOLEAN DEFAULT FALSE;
ALTER TABLE bia_dependent_processes ADD COLUMN IF NOT EXISTS alternate_option TEXT;
ALTER TABLE bia_dependent_processes ADD COLUMN IF NOT EXISTS impact_if_unavailable TEXT;

-- =============================================
-- 2. NEW DOWNSTREAM DEPENDENCY TABLES
-- =============================================

-- Downstream: Internal processes that depend on this BIA's process
CREATE TABLE IF NOT EXISTS bia_downstream_processes (
    id BIGSERIAL PRIMARY KEY,
    bia_id BIGINT NOT NULL REFERENCES bia_records(id) ON DELETE CASCADE,
    process_id BIGINT REFERENCES processes(id),
    process_name VARCHAR(255) NOT NULL,
    process_rto_hours INTEGER,
    impact_if_unavailable TEXT,
    is_single_point_of_failure BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255),
    version BIGINT DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- Downstream: Customers/End-users
CREATE TABLE IF NOT EXISTS bia_downstream_customers (
    id BIGSERIAL PRIMARY KEY,
    bia_id BIGINT NOT NULL REFERENCES bia_records(id) ON DELETE CASCADE,
    customer_segment VARCHAR(255) NOT NULL,
    customer_count INTEGER,
    revenue_impact DECIMAL(15, 2),
    sla_commitments TEXT,
    impact_description TEXT,
    is_single_point_of_failure BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255),
    version BIGINT DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- Downstream: Regulatory obligations
CREATE TABLE IF NOT EXISTS bia_downstream_regulatory (
    id BIGSERIAL PRIMARY KEY,
    bia_id BIGINT NOT NULL REFERENCES bia_records(id) ON DELETE CASCADE,
    regulatory_body VARCHAR(255) NOT NULL,
    requirement TEXT NOT NULL,
    compliance_deadline VARCHAR(100),
    penalty_for_non_compliance TEXT,
    is_single_point_of_failure BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255),
    version BIGINT DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- Downstream: Critical reports/SLAs
CREATE TABLE IF NOT EXISTS bia_downstream_sla_reports (
    id BIGSERIAL PRIMARY KEY,
    bia_id BIGINT NOT NULL REFERENCES bia_records(id) ON DELETE CASCADE,
    report_name VARCHAR(255) NOT NULL,
    frequency VARCHAR(100),
    deadline VARCHAR(100),
    recipients TEXT,
    penalty_for_miss TEXT,
    is_single_point_of_failure BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255),
    version BIGINT DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- =============================================
-- 3. ENHANCE RISK ASSESSMENT WITH BIA LINK
-- =============================================

ALTER TABLE risk_assessments ADD COLUMN IF NOT EXISTS linked_bia_id BIGINT REFERENCES bia_records(id);
ALTER TABLE risk_assessments ADD COLUMN IF NOT EXISTS dependency_id VARCHAR(100);
ALTER TABLE risk_assessments ADD COLUMN IF NOT EXISTS dependency_category VARCHAR(50);

-- Create index for BIA lookup
CREATE INDEX IF NOT EXISTS idx_risk_assessments_bia ON risk_assessments(linked_bia_id);

-- =============================================
-- 4. DEPENDENCY RISKS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS dependency_risks (
    id BIGSERIAL PRIMARY KEY,
    bia_id BIGINT NOT NULL REFERENCES bia_records(id) ON DELETE CASCADE,
    risk_assessment_id BIGINT REFERENCES risk_assessments(id),
    dependency_id VARCHAR(100) NOT NULL,
    dependency_name VARCHAR(255) NOT NULL,
    dependency_category VARCHAR(50) NOT NULL,
    dependency_direction VARCHAR(20) NOT NULL,
    risk_name VARCHAR(255) NOT NULL,
    risk_description TEXT,
    
    -- Inherent Risk
    inherent_likelihood INTEGER CHECK (inherent_likelihood BETWEEN 1 AND 5),
    inherent_impact INTEGER CHECK (inherent_impact BETWEEN 1 AND 5),
    inherent_risk_score INTEGER,
    inherent_risk_level VARCHAR(20),
    
    -- Controls
    existing_controls TEXT,
    control_effectiveness VARCHAR(30),
    
    -- Residual Risk
    residual_likelihood INTEGER CHECK (residual_likelihood BETWEEN 1 AND 5),
    residual_impact INTEGER CHECK (residual_impact BETWEEN 1 AND 5),
    residual_risk_score INTEGER,
    residual_risk_level VARCHAR(20),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255),
    version BIGINT DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- =============================================
-- 5. CREATE BCP SCENARIOS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS bcp_scenarios (
    id BIGSERIAL PRIMARY KEY,
    scenario_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    scenario_type VARCHAR(50) NOT NULL,
    status VARCHAR(30) DEFAULT 'DRAFT',
    owner_id BIGINT,
    owner_name VARCHAR(255),
    department_id BIGINT,
    department_name VARCHAR(255),
    linked_bia_id BIGINT REFERENCES bia_records(id),
    bia_rto_hours INTEGER,
    bia_rpo_hours INTEGER,
    bia_mtd_hours INTEGER,
    recovery_objective TEXT,
    activation_criteria TEXT,
    deactivation_criteria TEXT,
    last_tested_date TIMESTAMP,
    next_test_date TIMESTAMP,
    test_frequency VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255),
    version BIGINT DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_bcp_scenarios_bia ON bcp_scenarios(linked_bia_id);

-- =============================================
-- 6. CREATE BCP TESTS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS bcp_tests (
    id BIGSERIAL PRIMARY KEY,
    test_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    test_type VARCHAR(50) NOT NULL,
    status VARCHAR(30) DEFAULT 'SCHEDULED',
    linked_bcp_id BIGINT REFERENCES bcp_scenarios(id),
    linked_bia_id BIGINT REFERENCES bia_records(id),
    test_scope TEXT,
    objectives_from_bcp TEXT,
    scheduled_date TIMESTAMP,
    actual_date TIMESTAMP,
    duration_hours INTEGER,
    facilitator_id BIGINT,
    facilitator_name VARCHAR(255),
    participants TEXT,
    test_results TEXT,
    lessons_learned TEXT,
    recommended_bcp_updates TEXT,
    success_criteria TEXT,
    actual_outcome TEXT,
    approval_status VARCHAR(30) DEFAULT 'PENDING',
    approved_by VARCHAR(255),
    approved_date TIMESTAMP,
    approval_comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255),
    version BIGINT DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_bcp_tests_bcp ON bcp_tests(linked_bcp_id);
CREATE INDEX IF NOT EXISTS idx_bcp_tests_bia ON bcp_tests(linked_bia_id);

-- =============================================
-- 7. BCP DEPENDENCY ASSURANCE MATRIX
-- =============================================

CREATE TABLE IF NOT EXISTS bcp_dependency_assurance (
    id BIGSERIAL PRIMARY KEY,
    bcp_scenario_id BIGINT NOT NULL REFERENCES bcp_scenarios(id) ON DELETE CASCADE,
    dependency_id VARCHAR(100) NOT NULL,
    dependency_name VARCHAR(255) NOT NULL,
    dependency_category VARCHAR(50) NOT NULL,
    dependency_direction VARCHAR(20) NOT NULL,
    continuity_action TEXT,
    is_single_point_of_failure BOOLEAN DEFAULT FALSE,
    alternate_option TEXT,
    linked_risk_id BIGINT REFERENCES dependency_risks(id),
    assurance_status VARCHAR(30) DEFAULT 'NOT_ADDRESSED',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255),
    version BIGINT DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- =============================================
-- 8. TEST DEPENDENCIES BEING TESTED
-- =============================================

CREATE TABLE IF NOT EXISTS bcp_test_dependencies (
    id BIGSERIAL PRIMARY KEY,
    bcp_test_id BIGINT NOT NULL REFERENCES bcp_tests(id) ON DELETE CASCADE,
    dependency_assurance_id BIGINT REFERENCES bcp_dependency_assurance(id),
    dependency_id VARCHAR(100) NOT NULL,
    dependency_name VARCHAR(255) NOT NULL,
    dependency_category VARCHAR(50) NOT NULL,
    test_result VARCHAR(30),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    version BIGINT DEFAULT 0
);

-- =============================================
-- 9. TEST CORRECTIVE ACTIONS
-- =============================================

CREATE TABLE IF NOT EXISTS bcp_test_corrective_actions (
    id BIGSERIAL PRIMARY KEY,
    bcp_test_id BIGINT NOT NULL REFERENCES bcp_tests(id) ON DELETE CASCADE,
    issue_identified TEXT NOT NULL,
    action_required TEXT NOT NULL,
    priority VARCHAR(20) NOT NULL,
    assigned_to VARCHAR(255),
    due_date DATE,
    status VARCHAR(30) DEFAULT 'OPEN',
    completed_date DATE,
    verified_by VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255),
    version BIGINT DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- =============================================
-- 10. INDEXES FOR PERFORMANCE
-- =============================================

CREATE INDEX IF NOT EXISTS idx_dep_risks_bia ON dependency_risks(bia_id);
CREATE INDEX IF NOT EXISTS idx_dep_risks_category ON dependency_risks(dependency_category);
CREATE INDEX IF NOT EXISTS idx_bcp_dep_assurance_scenario ON bcp_dependency_assurance(bcp_scenario_id);
CREATE INDEX IF NOT EXISTS idx_bcp_test_deps_test ON bcp_test_dependencies(bcp_test_id);
CREATE INDEX IF NOT EXISTS idx_bcp_test_actions_test ON bcp_test_corrective_actions(bcp_test_id);
