-- ========================================
-- Risk Assessment Module - Database Schema
-- ========================================
-- This migration creates all tables for the Risk Assessment module
-- including Threat Library, Risk Category Library, and Risk Assessments

-- ========================================
-- 1. THREAT LIBRARY TABLES
-- ========================================

-- Threat Types (categorization)
CREATE TABLE threat_types (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    display_order INT,

    -- Audit fields
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255),
    version INT DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_threat_types_name ON threat_types(name);

-- Enabler Types (BETH3V framework)
CREATE TABLE enabler_types (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    display_order INT,

    -- Audit fields
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255),
    version INT DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_enabler_types_code ON enabler_types(code);

-- Threats (main catalog)
CREATE TABLE threats (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    threat_type_id BIGINT NOT NULL,

    -- Default risk parameters
    default_likelihood VARCHAR(50),
    default_impact VARCHAR(50),

    -- Threat characteristics
    velocity VARCHAR(50),
    warning_time VARCHAR(50),
    recovery_complexity VARCHAR(50),

    display_order INT,

    -- Audit fields
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255),
    version INT DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE,

    FOREIGN KEY (threat_type_id) REFERENCES threat_types(id)
);

CREATE INDEX idx_threats_name ON threats(name);
CREATE INDEX idx_threats_type ON threats(threat_type_id);

-- Threat-Enabler Type Junction (which enabler types a threat can impact)
CREATE TABLE threat_enabler_types (
    id BIGSERIAL PRIMARY KEY,
    threat_id BIGINT NOT NULL,
    enabler_type_id BIGINT NOT NULL,
    scenario_description TEXT,

    -- Audit fields
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255),
    version INT DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE,

    FOREIGN KEY (threat_id) REFERENCES threats(id),
    FOREIGN KEY (enabler_type_id) REFERENCES enabler_types(id),
    CONSTRAINT uk_threat_enabler UNIQUE (threat_id, enabler_type_id)
);

CREATE INDEX idx_threat_enabler_threat ON threat_enabler_types(threat_id);
CREATE INDEX idx_threat_enabler_type ON threat_enabler_types(enabler_type_id);

-- ========================================
-- 2. RISK CATEGORY LIBRARY TABLES
-- ========================================

-- Risk Categories (assessment contexts)
CREATE TABLE risk_categories (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INT,

    -- Audit fields
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255),
    version INT DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_risk_categories_code ON risk_categories(code);

-- Risk Category-Threat Junction (which threats apply to each category)
CREATE TABLE risk_category_threats (
    id BIGSERIAL PRIMARY KEY,
    risk_category_id BIGINT NOT NULL,
    threat_id BIGINT NOT NULL,
    is_default_selected BOOLEAN DEFAULT FALSE,

    -- Audit fields
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255),
    version INT DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE,

    FOREIGN KEY (risk_category_id) REFERENCES risk_categories(id),
    FOREIGN KEY (threat_id) REFERENCES threats(id),
    CONSTRAINT uk_category_threat UNIQUE (risk_category_id, threat_id)
);

CREATE INDEX idx_category_threat_category ON risk_category_threats(risk_category_id);
CREATE INDEX idx_category_threat_threat ON risk_category_threats(threat_id);

-- ========================================
-- 3. RISK ASSESSMENT TABLES
-- ========================================

-- Risk Assessments (main RA entity)
CREATE TABLE risk_assessments (
    id BIGSERIAL PRIMARY KEY,
    assessment_name VARCHAR(255) NOT NULL,
    description TEXT,

    -- Risk category and context
    risk_category_id BIGINT NOT NULL,
    context_type VARCHAR(50) NOT NULL,
    context_id BIGINT NOT NULL,
    context_name VARCHAR(255),

    -- Assessment metadata
    assessment_date DATE,
    assessor_name VARCHAR(255),
    assessor_email VARCHAR(255),

    -- Status and workflow
    status VARCHAR(50) DEFAULT 'DRAFT',

    -- Review information
    review_date DATE,
    next_review_date DATE,
    reviewer_name VARCHAR(255),
    reviewer_email VARCHAR(255),

    -- Summary fields
    executive_summary TEXT,
    recommendations TEXT,

    -- Audit fields
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255),
    version INT DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE,

    FOREIGN KEY (risk_category_id) REFERENCES risk_categories(id)
);

CREATE INDEX idx_risk_assessments_context ON risk_assessments(context_type, context_id);
CREATE INDEX idx_risk_assessments_status ON risk_assessments(status);
CREATE INDEX idx_risk_assessments_category ON risk_assessments(risk_category_id);

-- Threat Assessments (individual threat evaluations)
CREATE TABLE threat_assessments (
    id BIGSERIAL PRIMARY KEY,
    risk_assessment_id BIGINT NOT NULL,
    threat_id BIGINT NOT NULL,

    -- Risk evaluation
    likelihood VARCHAR(50),
    impact VARCHAR(50),
    risk_level VARCHAR(50),
    risk_score INT,

    -- Analysis
    current_controls TEXT,
    control_effectiveness VARCHAR(50),
    residual_risk_level VARCHAR(50),

    -- Mitigation
    mitigation_actions TEXT,
    mitigation_owner VARCHAR(255),
    mitigation_deadline DATE,
    mitigation_status VARCHAR(50),

    -- Notes
    notes TEXT,

    -- Audit fields
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255),
    version INT DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE,

    FOREIGN KEY (risk_assessment_id) REFERENCES risk_assessments(id) ON DELETE CASCADE,
    FOREIGN KEY (threat_id) REFERENCES threats(id),
    CONSTRAINT uk_ra_threat UNIQUE (risk_assessment_id, threat_id)
);

CREATE INDEX idx_threat_assessments_ra ON threat_assessments(risk_assessment_id);
CREATE INDEX idx_threat_assessments_threat ON threat_assessments(threat_id);
CREATE INDEX idx_threat_assessments_risk_level ON threat_assessments(risk_level);

-- ========================================
-- 4. SEED DATA
-- ========================================

-- Insert BETH3V Enabler Types
INSERT INTO enabler_types (code, name, description, display_order) VALUES
('BUILDING', 'Buildings', 'Physical locations and facilities', 1),
('EQUIPMENT', 'Equipment', 'Physical equipment and machinery', 2),
('TECHNOLOGY', 'Technology/Applications', 'IT systems, applications, and technology infrastructure', 3),
('PEOPLE', 'Human Resources', 'People, teams, and human resources', 4),
('VENDOR', 'Third-Party Vendors', 'External vendors and suppliers', 5),
('VITAL_RECORD', 'Vital Records', 'Critical documents and information assets', 6);

-- Insert Default Risk Categories
INSERT INTO risk_categories (code, name, description, is_active, display_order) VALUES
('LOCATION', 'Location Level', 'Risk assessment for physical locations and facilities', TRUE, 1),
('ORG_UNIT', 'Organizational Unit', 'Risk assessment for departments and organizational units', TRUE, 2),
('PROCESS', 'Process', 'Risk assessment for business processes', TRUE, 3),
('SUPPLIER', 'Supplier/Vendor', 'Risk assessment for third-party suppliers and vendors', TRUE, 4),
('APPLICATION', 'Application/Software', 'Risk assessment for IT applications and software systems', TRUE, 5),
('ASSET', 'Asset', 'Risk assessment for critical assets', TRUE, 6),
('PROJECT', 'Project', 'Risk assessment for projects and initiatives', TRUE, 7);

-- Insert Sample Threat Types
INSERT INTO threat_types (name, description, display_order) VALUES
('Natural Disaster', 'Natural disasters and environmental threats', 1),
('Man-made Disaster', 'Human-caused disasters and accidents', 2),
('Cyber Security', 'Cyber attacks and information security threats', 3),
('IT/Equipment Disruption', 'Technology and equipment failures', 4),
('Supply Chain', 'Supply chain and vendor-related threats', 5),
('Human Resources', 'People-related threats and disruptions', 6),
('Regulatory/Compliance', 'Regulatory and compliance risks', 7),
('Financial', 'Financial and economic threats', 8);

-- ========================================
-- END OF MIGRATION
-- ========================================

