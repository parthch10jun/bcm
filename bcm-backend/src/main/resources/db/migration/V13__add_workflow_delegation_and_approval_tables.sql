-- V13: Add Workflow Delegation and Approval Tables

-- BIA Assignments Table (Delegation Tracking)
CREATE TABLE IF NOT EXISTS bia_assignments (
    id BIGSERIAL PRIMARY KEY,
    bia_id BIGINT NOT NULL,
    assigned_by_id BIGINT NOT NULL,
    assigned_by_name VARCHAR(255),
    assigned_to_id BIGINT NOT NULL,
    assigned_to_name VARCHAR(255),
    assignment_type VARCHAR(50) DEFAULT 'DELEGATION',
    assignment_reason TEXT,
    assignment_notes TEXT,
    status VARCHAR(50) DEFAULT 'PENDING',
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    accepted_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(255),
    version BIGINT DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_assignment_bia FOREIGN KEY (bia_id) REFERENCES bia_records(id) ON DELETE CASCADE,
    CONSTRAINT fk_assignment_by FOREIGN KEY (assigned_by_id) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT fk_assignment_to FOREIGN KEY (assigned_to_id) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT chk_assignment_type CHECK (assignment_type IN ('DELEGATION', 'REASSIGNMENT', 'ESCALATION')),
    CONSTRAINT chk_assignment_status CHECK (status IN ('PENDING', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'REJECTED'))
);

CREATE INDEX idx_bia_assignments_bia ON bia_assignments(bia_id);
CREATE INDEX idx_bia_assignments_assigned_by ON bia_assignments(assigned_by_id);
CREATE INDEX idx_bia_assignments_assigned_to ON bia_assignments(assigned_to_id);
CREATE INDEX idx_bia_assignments_status ON bia_assignments(status);

-- BIA Approval Workflow Table (Sequential Approval Chain)
CREATE TABLE IF NOT EXISTS bia_approval_workflow (
    id BIGSERIAL PRIMARY KEY,
    bia_id BIGINT NOT NULL,
    stage_number INTEGER NOT NULL,
    stage_name VARCHAR(100) NOT NULL,
    role_name VARCHAR(255),
    approver_id BIGINT,
    approver_name VARCHAR(255),
    approver_email VARCHAR(255),
    status VARCHAR(50) DEFAULT 'PENDING',
    decision VARCHAR(50),
    comments TEXT,
    decision_date TIMESTAMP,
    notified_at TIMESTAMP,
    responded_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(255),
    version BIGINT DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_approval_workflow_bia FOREIGN KEY (bia_id) REFERENCES bia_records(id) ON DELETE CASCADE,
    CONSTRAINT fk_approval_workflow_approver FOREIGN KEY (approver_id) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT uk_bia_approval_stage UNIQUE (bia_id, stage_number),
    CONSTRAINT chk_approval_stage_name CHECK (stage_name IN ('REVIEWER', 'VERIFIER', 'APPROVER')),
    CONSTRAINT chk_approval_status CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'CHANGES_REQUESTED')),
    CONSTRAINT chk_approval_decision CHECK (decision IS NULL OR decision IN ('APPROVE', 'REJECT', 'REQUEST_CHANGES'))
);

CREATE INDEX idx_bia_approval_workflow_bia ON bia_approval_workflow(bia_id);
CREATE INDEX idx_bia_approval_workflow_approver ON bia_approval_workflow(approver_id);
CREATE INDEX idx_bia_approval_workflow_status ON bia_approval_workflow(status);
CREATE INDEX idx_bia_approval_workflow_stage ON bia_approval_workflow(bia_id, stage_number);

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    user_name VARCHAR(255),
    user_email VARCHAR(255),
    notification_type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    entity_type VARCHAR(50),
    entity_id BIGINT,
    action_url VARCHAR(500),
    action_label VARCHAR(100),
    status VARCHAR(50) DEFAULT 'UNREAD',
    priority VARCHAR(50) DEFAULT 'NORMAL',
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP,
    archived_at TIMESTAMP,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(255),
    version BIGINT DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_notification_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT chk_notification_type CHECK (notification_type IN ('BIA_ASSIGNED', 'BIA_SUBMITTED', 'APPROVAL_REQUIRED', 'APPROVED', 'REJECTED', 'CHANGES_REQUESTED', 'COMMENT_ADDED', 'DEADLINE_REMINDER')),
    CONSTRAINT chk_notification_status CHECK (status IN ('UNREAD', 'READ', 'ARCHIVED')),
    CONSTRAINT chk_notification_priority CHECK (priority IN ('LOW', 'NORMAL', 'HIGH', 'URGENT')),
    CONSTRAINT chk_notification_entity_type CHECK (entity_type IS NULL OR entity_type IN ('BIA', 'ASSIGNMENT', 'APPROVAL', 'COMMENT'))
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_status ON notifications(status);
CREATE INDEX idx_notifications_type ON notifications(notification_type);
CREATE INDEX idx_notifications_entity ON notifications(entity_type, entity_id);
CREATE INDEX idx_notifications_sent_at ON notifications(sent_at DESC);

-- BIA Workflow History Table (Audit Trail)
DROP TABLE IF EXISTS bia_workflow_history;
CREATE TABLE bia_workflow_history (
    id BIGSERIAL PRIMARY KEY,
    bia_id BIGINT NOT NULL,
    from_stage VARCHAR(50),
    to_stage VARCHAR(50) NOT NULL,
    from_status VARCHAR(50),
    to_status VARCHAR(50) NOT NULL,
    workflow_action VARCHAR(100) NOT NULL,
    performed_by_id BIGINT,
    performed_by_name VARCHAR(255),
    performed_by_role VARCHAR(100),
    comments TEXT,
    metadata TEXT,
    performed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    version BIGINT DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_bia_workflow_history_bia ON bia_workflow_history(bia_id);
CREATE INDEX IF NOT EXISTS idx_bia_workflow_history_performed_by ON bia_workflow_history(performed_by_id);
CREATE INDEX IF NOT EXISTS idx_bia_workflow_history_performed_at ON bia_workflow_history(performed_at);
CREATE INDEX IF NOT EXISTS idx_bia_workflow_history_action ON bia_workflow_history(workflow_action);

