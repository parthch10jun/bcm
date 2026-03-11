package com.bcm.enums;

/**
 * Incident Status Enum
 * Tracks the lifecycle status of an incident
 */
public enum IncidentStatus {
    REPORTED("Reported"),
    IN_PROGRESS("In Progress"),
    MONITORING("Monitoring"),
    UNDER_INVESTIGATION("Under Investigation"),
    RESOLVED("Resolved"),
    CLOSED("Closed");

    private final String displayName;

    IncidentStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}

