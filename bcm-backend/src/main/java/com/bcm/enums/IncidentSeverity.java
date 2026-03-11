package com.bcm.enums;

/**
 * Incident Severity Enum
 * Indicates the severity level of an incident
 */
public enum IncidentSeverity {
    CRITICAL("Critical", 4),
    HIGH("High", 3),
    MEDIUM("Medium", 2),
    LOW("Low", 1);

    private final String displayName;
    private final int level;

    IncidentSeverity(String displayName, int level) {
        this.displayName = displayName;
        this.level = level;
    }

    public String getDisplayName() {
        return displayName;
    }

    public int getLevel() {
        return level;
    }
}

