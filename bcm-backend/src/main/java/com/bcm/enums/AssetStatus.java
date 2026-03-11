package com.bcm.enums;

/**
 * Asset Status Enum
 */
public enum AssetStatus {
    ACTIVE,      // Asset is currently in use
    INACTIVE,    // Asset is not currently in use but available
    RETIRED,     // Asset has been retired/decommissioned
    MAINTENANCE  // Asset is under maintenance
}

