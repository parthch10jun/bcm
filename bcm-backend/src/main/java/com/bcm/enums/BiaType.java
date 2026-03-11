package com.bcm.enums;

/**
 * BIA Type - Determines the scope of the Business Impact Analysis
 */
public enum BiaType {
    PROCESS("Process BIA", "Analyze impact of a specific business process"),
    DEPARTMENT("Department BIA", "Analyze impact of an organizational unit/department"),
    LOCATION("Location BIA", "Analyze impact of a physical location");

    private final String displayName;
    private final String description;

    BiaType(String displayName, String description) {
        this.displayName = displayName;
        this.description = description;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getDescription() {
        return description;
    }
}

