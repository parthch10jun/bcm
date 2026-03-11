package com.bcm.enums;

/**
 * User roles for role-based access control (RBAC)
 */
public enum UserRole {
    /**
     * System administrator with full access to all features
     */
    ADMIN,
    
    /**
     * BIA Coordinator who can create/edit BIA records and manage templates
     */
    COORDINATOR,
    
    /**
     * Manager who can view/edit processes and BIAs in their department
     */
    MANAGER,
    
    /**
     * Regular user with read-only access
     */
    USER
}

