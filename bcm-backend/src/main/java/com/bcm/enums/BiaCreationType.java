package com.bcm.enums;

/**
 * BIA Creation Type Enumeration
 * 
 * Defines how a BIA was created to support the reconciliation model:
 * - DIRECT: Manually created by a user (override)
 * - AGGREGATED: Automatically calculated by rolling up data from children
 * 
 * This allows the system to track both direct BIAs (user-entered) and aggregated BIAs
 * (system-calculated rollups), enabling conflict detection and reconciliation.
 */
public enum BiaCreationType {
    /**
     * Direct BIA - Manually created by a user
     * 
     * This represents an "override" where the user has explicitly defined BIA values
     * for a unit, regardless of what its children might indicate.
     * 
     * Use case: A division manager performs a direct BIA on their division,
     * even though the division has departments with their own BIAs.
     */
    DIRECT,
    
    /**
     * Aggregated BIA - Automatically calculated from children
     * 
     * This is a system-calculated rollup of BIA data from subordinate units and processes.
     * It represents the consolidated view based on the hierarchy.
     * 
     * Use case: The system automatically calculates a division's BIA by rolling up
     * the RTOs, critical assets, and impacts from all departments under it.
     */
    AGGREGATED
}

