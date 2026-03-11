package com.bcm.enums;

/**
 * Organizational Unit Type
 * Flexible hierarchy supporting unlimited levels
 */
public enum UnitType {
    ORGANIZATION("Organization", 0),
    DIVISION("Division", 1),
    DEPARTMENT("Department", 2),
    TEAM("Team", 3),
    SUB_TEAM("Sub-Team", 4),
    CUSTOM("Custom", 99);

    private final String displayName;
    private final int defaultLevel;

    UnitType(String displayName, int defaultLevel) {
        this.displayName = displayName;
        this.defaultLevel = defaultLevel;
    }

    public String getDisplayName() {
        return displayName;
    }

    public int getDefaultLevel() {
        return defaultLevel;
    }
}

