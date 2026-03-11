-- Migration V6: Create Vendors Library
-- Creates vendors table and junction tables for process-vendor and asset-vendor relationships

-- Create vendors table
CREATE TABLE IF NOT EXISTS vendors (
    id BIGSERIAL PRIMARY KEY,
    vendor_name VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    service_type VARCHAR(50),
    description TEXT,
    contact_name VARCHAR(255),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    recovery_time_capability INT,
    contract_start_date DATE,
    contract_end_date DATE,
    website VARCHAR(500),
    address TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(255),
    version BIGINT DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_vendor_name ON vendors(vendor_name);
CREATE INDEX IF NOT EXISTS idx_vendor_status ON vendors(status);
CREATE INDEX IF NOT EXISTS idx_vendor_service_type ON vendors(service_type);
CREATE INDEX IF NOT EXISTS idx_vendor_is_deleted ON vendors(is_deleted);

-- Create process_vendors junction table
CREATE TABLE IF NOT EXISTS process_vendors (
    id BIGSERIAL PRIMARY KEY,
    process_id BIGINT NOT NULL,
    vendor_id BIGINT NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(255),
    version BIGINT DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (process_id) REFERENCES processes(id) ON DELETE CASCADE,
    FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE,
    UNIQUE (process_id, vendor_id)
);

CREATE INDEX IF NOT EXISTS idx_process_vendor_process_id ON process_vendors(process_id);
CREATE INDEX IF NOT EXISTS idx_process_vendor_vendor_id ON process_vendors(vendor_id);
CREATE INDEX IF NOT EXISTS idx_process_vendor_is_deleted ON process_vendors(is_deleted);

-- Create asset_vendors junction table
CREATE TABLE IF NOT EXISTS asset_vendors (
    id BIGSERIAL PRIMARY KEY,
    asset_id BIGINT NOT NULL,
    vendor_id BIGINT NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(255),
    version BIGINT DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE,
    FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE,
    UNIQUE (asset_id, vendor_id)
);

CREATE INDEX IF NOT EXISTS idx_asset_vendor_asset_id ON asset_vendors(asset_id);
CREATE INDEX IF NOT EXISTS idx_asset_vendor_vendor_id ON asset_vendors(vendor_id);
CREATE INDEX IF NOT EXISTS idx_asset_vendor_is_deleted ON asset_vendors(is_deleted);

-- Insert sample vendors
INSERT INTO vendors (vendor_name, status, service_type, description, contact_name, contact_email, contact_phone, recovery_time_capability, contract_start_date, contract_end_date, website) VALUES
('Amazon Web Services', 'ACTIVE', 'CLOUD_PROVIDER', 'Cloud infrastructure and services provider', 'AWS Support', 'support@aws.amazon.com', '+1-800-123-4567', 8, '2023-01-01', '2025-12-31', 'https://aws.amazon.com'),
('Microsoft Azure', 'ACTIVE', 'CLOUD_PROVIDER', 'Cloud computing platform and services', 'Azure Support', 'support@azure.microsoft.com', '+1-800-234-5678', 4, '2023-06-01', '2026-05-31', 'https://azure.microsoft.com'),
('ADP Payroll', 'ACTIVE', 'SAAS', 'Payroll and HR management system', 'John Smith', 'john.smith@adp.com', '+1-800-345-6789', 4, '2022-01-01', '2025-12-31', 'https://www.adp.com'),
('Salesforce', 'ACTIVE', 'SAAS', 'Customer relationship management platform', 'Sarah Johnson', 'sarah.j@salesforce.com', '+1-800-456-7890', 2, '2023-03-01', '2026-02-28', 'https://www.salesforce.com'),
('Oracle Database', 'ACTIVE', 'SOFTWARE_LICENSE', 'Enterprise database management system', 'Oracle Support', 'support@oracle.com', '+1-800-567-8901', 12, '2021-01-01', '2024-12-31', 'https://www.oracle.com'),
('Cisco Systems', 'ACTIVE', 'INFRASTRUCTURE', 'Network infrastructure and security solutions', 'Mike Chen', 'mike.chen@cisco.com', '+1-800-678-9012', 24, '2022-06-01', '2025-05-31', 'https://www.cisco.com'),
('Dell Technologies', 'ACTIVE', 'HARDWARE_VENDOR', 'Server and hardware infrastructure provider', 'Dell Support', 'support@dell.com', '+1-800-789-0123', 48, '2023-01-15', '2026-01-14', 'https://www.dell.com'),
('Verizon Business', 'ACTIVE', 'TELECOM', 'Telecommunications and internet services', 'Verizon Support', 'business@verizon.com', '+1-800-890-1234', 4, '2022-01-01', '2025-12-31', 'https://www.verizon.com/business'),
('Iron Mountain', 'ACTIVE', 'SUPPLIER', 'Document storage and data management', 'Records Team', 'records@ironmountain.com', '+1-800-901-2345', 72, '2021-06-01', '2024-05-31', 'https://www.ironmountain.com'),
('Acme Consulting', 'UNDER_REVIEW', 'CONSULTING', 'IT consulting and advisory services', 'Jane Doe', 'jane.doe@acmeconsulting.com', '+1-800-012-3456', 168, '2023-09-01', '2024-08-31', 'https://www.acmeconsulting.com');

-- Sample process-vendor and asset-vendor relationships can be added later
-- after processes and assets are created in the system

