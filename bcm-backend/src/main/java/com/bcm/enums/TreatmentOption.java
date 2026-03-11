package com.bcm.enums;

/**
 * TreatmentOption Enum - Risk treatment strategies
 * Defines how an organization chooses to handle identified risks
 */
public enum TreatmentOption {
    ACCEPT("Accept", "Accept the risk as is - no action required"),
    MITIGATE("Mitigate", "Implement controls to reduce likelihood or impact"),
    TRANSFER("Transfer", "Transfer risk to third party (insurance, outsourcing, contracts)"),
    AVOID("Avoid", "Eliminate the activity or process causing the risk");

    private final String displayName;
    private final String description;

    TreatmentOption(String displayName, String description) {
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

