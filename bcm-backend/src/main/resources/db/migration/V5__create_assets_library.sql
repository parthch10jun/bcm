-- =====================================================
-- Asset Library Schema
-- =====================================================
-- This migration creates the Asset Library with proper
-- BCM architecture where asset criticality is inherited
-- from the processes they support.
-- =====================================================

-- =====================================================
-- Supporting Library Tables (For Filters)
-- =====================================================

-- Asset Types (Hardware, Software, People, etc.)
CREATE TABLE IF NOT EXISTS asset_types (
    id BIGSERIAL PRIMARY KEY,
    type_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(255),
    version BIGINT DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- Asset Categories (Server, Database, Network, Application, etc.)
CREATE TABLE IF NOT EXISTS asset_categories (
    id BIGSERIAL PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE,
    asset_type_id BIGINT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(255),
    version BIGINT DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_category_type FOREIGN KEY (asset_type_id) 
        REFERENCES asset_types(id) ON DELETE SET NULL
);

-- =====================================================
-- Core Assets Table
-- =====================================================

CREATE TABLE IF NOT EXISTS assets (
    id BIGSERIAL PRIMARY KEY,
    asset_name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    asset_type_id BIGINT,
    category_id BIGINT,
    location_id BIGINT,
    vendor VARCHAR(255),
    model VARCHAR(255),
    serial_number VARCHAR(255),
    purchase_date DATE,
    warranty_expiry DATE,
    owner VARCHAR(255),
    technical_contact VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(255),
    version BIGINT DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_asset_type FOREIGN KEY (asset_type_id)
        REFERENCES asset_types(id) ON DELETE SET NULL,
    CONSTRAINT fk_asset_category FOREIGN KEY (category_id)
        REFERENCES asset_categories(id) ON DELETE SET NULL,
    -- TODO: Uncomment when locations table is created
    -- CONSTRAINT fk_asset_location FOREIGN KEY (location_id)
    --     REFERENCES locations(id) ON DELETE SET NULL,
    CONSTRAINT chk_asset_status CHECK (status IN ('ACTIVE', 'INACTIVE', 'RETIRED', 'MAINTENANCE'))
);

-- =====================================================
-- Junction Tables (The "Glue")
-- =====================================================

-- Process-Asset Relationship (Many-to-Many)
-- Links processes to the assets they depend on
-- This is the SOURCE of asset criticality inheritance
CREATE TABLE IF NOT EXISTS process_assets (
    id BIGSERIAL PRIMARY KEY,
    process_id BIGINT NOT NULL,
    asset_id BIGINT NOT NULL,
    dependency_type VARCHAR(50) DEFAULT 'REQUIRED',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(255),
    version BIGINT DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_process_asset_process FOREIGN KEY (process_id) 
        REFERENCES processes(id) ON DELETE CASCADE,
    CONSTRAINT fk_process_asset_asset FOREIGN KEY (asset_id) 
        REFERENCES assets(id) ON DELETE CASCADE,
    CONSTRAINT chk_dependency_type CHECK (dependency_type IN ('REQUIRED', 'OPTIONAL', 'PREFERRED')),
    CONSTRAINT uk_process_asset UNIQUE (process_id, asset_id)
);

-- Asset Dependencies (Many-to-Many, Self-Referencing)
-- Handles asset-to-asset dependencies
-- e.g., "SAP Server" depends on "Oracle Database"
CREATE TABLE IF NOT EXISTS asset_dependencies (
    id BIGSERIAL PRIMARY KEY,
    asset_id BIGINT NOT NULL,
    depends_on_asset_id BIGINT NOT NULL,
    dependency_type VARCHAR(50) DEFAULT 'REQUIRED',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(255),
    version BIGINT DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_asset_dependency_asset FOREIGN KEY (asset_id) 
        REFERENCES assets(id) ON DELETE CASCADE,
    CONSTRAINT fk_asset_dependency_depends_on FOREIGN KEY (depends_on_asset_id) 
        REFERENCES assets(id) ON DELETE CASCADE,
    CONSTRAINT chk_asset_dependency_type CHECK (dependency_type IN ('REQUIRED', 'OPTIONAL', 'PREFERRED')),
    CONSTRAINT uk_asset_dependency UNIQUE (asset_id, depends_on_asset_id),
    CONSTRAINT chk_no_self_dependency CHECK (asset_id != depends_on_asset_id)
);

-- =====================================================
-- Indexes for Performance
-- =====================================================

CREATE INDEX idx_assets_type ON assets(asset_type_id);
CREATE INDEX idx_assets_category ON assets(category_id);
CREATE INDEX idx_assets_location ON assets(location_id);
CREATE INDEX idx_assets_status ON assets(status);
CREATE INDEX idx_assets_name ON assets(asset_name);

CREATE INDEX idx_process_assets_process ON process_assets(process_id);
CREATE INDEX idx_process_assets_asset ON process_assets(asset_id);

CREATE INDEX idx_asset_dependencies_asset ON asset_dependencies(asset_id);
CREATE INDEX idx_asset_dependencies_depends_on ON asset_dependencies(depends_on_asset_id);

CREATE INDEX idx_asset_categories_type ON asset_categories(asset_type_id);

-- =====================================================
-- Sample Data
-- =====================================================

-- Insert Asset Types
INSERT INTO asset_types (type_name, description) VALUES
('Hardware', 'Physical equipment and infrastructure'),
('Software', 'Applications and software systems'),
('Technology', 'IT systems and platforms'),
('People', 'Human resources and key personnel'),
('Facility', 'Buildings and physical facilities'),
('Data', 'Databases and data repositories');

-- Insert Asset Categories
INSERT INTO asset_categories (category_name, asset_type_id, description) VALUES
-- Hardware categories
('Server', (SELECT id FROM asset_types WHERE type_name = 'Hardware'), 'Physical or virtual servers'),
('Network Equipment', (SELECT id FROM asset_types WHERE type_name = 'Hardware'), 'Routers, switches, firewalls'),
('Storage', (SELECT id FROM asset_types WHERE type_name = 'Hardware'), 'SAN, NAS, disk arrays'),
('Workstation', (SELECT id FROM asset_types WHERE type_name = 'Hardware'), 'Desktop and laptop computers'),

-- Software categories
('Application', (SELECT id FROM asset_types WHERE type_name = 'Software'), 'Business applications'),
('Database', (SELECT id FROM asset_types WHERE type_name = 'Software'), 'Database management systems'),
('Operating System', (SELECT id FROM asset_types WHERE type_name = 'Software'), 'OS platforms'),
('Middleware', (SELECT id FROM asset_types WHERE type_name = 'Software'), 'Integration and middleware'),

-- Technology categories
('Cloud Service', (SELECT id FROM asset_types WHERE type_name = 'Technology'), 'Cloud-based services'),
('Communication System', (SELECT id FROM asset_types WHERE type_name = 'Technology'), 'Phone, email, collaboration tools'),

-- People categories
('Key Personnel', (SELECT id FROM asset_types WHERE type_name = 'People'), 'Critical staff members'),
('Team', (SELECT id FROM asset_types WHERE type_name = 'People'), 'Functional teams'),

-- Facility categories
('Data Center', (SELECT id FROM asset_types WHERE type_name = 'Facility'), 'Data center facilities'),
('Office', (SELECT id FROM asset_types WHERE type_name = 'Facility'), 'Office buildings'),

-- Data categories
('Production Database', (SELECT id FROM asset_types WHERE type_name = 'Data'), 'Live production data'),
('Backup Repository', (SELECT id FROM asset_types WHERE type_name = 'Data'), 'Backup and archive data');

-- Insert Sample Assets
INSERT INTO assets (asset_name, description, status, asset_type_id, category_id, vendor, model) VALUES
-- Servers
('SAP Finance Server', 'Primary server hosting SAP Finance module', 'ACTIVE',
    (SELECT id FROM asset_types WHERE type_name = 'Hardware'),
    (SELECT id FROM asset_categories WHERE category_name = 'Server'),
    'Dell', 'PowerEdge R750'),

('Oracle Database Server', 'Production Oracle database server', 'ACTIVE',
    (SELECT id FROM asset_types WHERE type_name = 'Hardware'),
    (SELECT id FROM asset_categories WHERE category_name = 'Server'),
    'HP', 'ProLiant DL380'),

-- Software
('SAP ERP', 'Enterprise Resource Planning system', 'ACTIVE',
    (SELECT id FROM asset_types WHERE type_name = 'Software'),
    (SELECT id FROM asset_categories WHERE category_name = 'Application'),
    'SAP', 'S/4HANA'),

('Oracle Database 19c', 'Database management system', 'ACTIVE',
    (SELECT id FROM asset_types WHERE type_name = 'Software'),
    (SELECT id FROM asset_categories WHERE category_name = 'Database'),
    'Oracle', '19c Enterprise Edition'),

-- Network
('Core Network Switch', 'Main network switch for office', 'ACTIVE',
    (SELECT id FROM asset_types WHERE type_name = 'Hardware'),
    (SELECT id FROM asset_categories WHERE category_name = 'Network Equipment'),
    'Cisco', 'Catalyst 9300');

-- Insert Sample Asset Dependencies
-- SAP Finance Server depends on Oracle Database Server
INSERT INTO asset_dependencies (asset_id, depends_on_asset_id, dependency_type, notes) VALUES
((SELECT id FROM assets WHERE asset_name = 'SAP Finance Server'),
 (SELECT id FROM assets WHERE asset_name = 'Oracle Database Server'),
 'REQUIRED', 'SAP application requires Oracle database backend'),

-- SAP ERP depends on SAP Finance Server
((SELECT id FROM assets WHERE asset_name = 'SAP ERP'),
 (SELECT id FROM assets WHERE asset_name = 'SAP Finance Server'),
 'REQUIRED', 'Application runs on this server'),

-- Oracle Database 19c depends on Oracle Database Server
((SELECT id FROM assets WHERE asset_name = 'Oracle Database 19c'),
 (SELECT id FROM assets WHERE asset_name = 'Oracle Database Server'),
 'REQUIRED', 'Database software runs on this server');

-- Note: Process-Asset relationships will be created when processes are linked to assets
-- This is where criticality inheritance happens!

