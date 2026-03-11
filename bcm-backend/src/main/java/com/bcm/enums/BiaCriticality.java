package com.bcm.enums;

/**
 * BIA Criticality Enum
 * 
 * Defines the criticality levels for BIA analysis results.
 * This is the final, approved criticality after questionnaire analysis.
 * 
 * Levels (from highest to lowest):
 * - CRITICAL: Mission-critical, immediate impact
 * - HIGH: Significant impact, urgent recovery needed
 * - MEDIUM: Moderate impact, recovery within reasonable timeframe
 * - LOW: Minimal impact, can tolerate extended downtime
 */
public enum BiaCriticality {
    /**
     * Mission-critical
     * Immediate and severe impact if unavailable
     * Typically requires RTO < 4 hours
     */
    CRITICAL("Critical"),

    /**
     * High criticality
     * Significant impact if unavailable
     * Typically requires RTO < 24 hours
     */
    HIGH("High"),

    /**
     * Medium criticality
     * Moderate impact if unavailable
     * Typically requires RTO < 3 days
     */
    MEDIUM("Medium"),

    /**
     * Low criticality
     * Minimal impact if unavailable
     * Can tolerate RTO > 3 days
     */
    LOW("Low");

    private final String displayName;

    BiaCriticality(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    /**
     * Get enum from string value (case-insensitive)
     */
    public static BiaCriticality fromString(String value) {
        if (value == null) {
            return null;
        }
        for (BiaCriticality criticality : BiaCriticality.values()) {
            if (criticality.name().equalsIgnoreCase(value) || 
                criticality.displayName.equalsIgnoreCase(value)) {
                return criticality;
            }
        }
        throw new IllegalArgumentException("Unknown BIA criticality: " + value);
    }

    /**
     * Determine criticality from RTO hours
     * This is a helper method for automatic criticality calculation
     */
    public static BiaCriticality fromRtoHours(Integer rtoHours) {
        if (rtoHours == null) {
            return null;
        }
        if (rtoHours <= 4) {
            return CRITICAL;
        } else if (rtoHours <= 24) {
            return HIGH;
        } else if (rtoHours <= 72) {  // 3 days
            return MEDIUM;
        } else {
            return LOW;
        }
    }
}

