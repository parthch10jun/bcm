package com.bcm.enums;

/**
 * Process Status - Represents the lifecycle state of a process
 */
public enum ProcessStatus {
    DRAFT,      // Process is being defined but not yet official
    ACTIVE,     // Process is officially recognized and part of operations
    ARCHIVED    // Process is no longer in use
}

