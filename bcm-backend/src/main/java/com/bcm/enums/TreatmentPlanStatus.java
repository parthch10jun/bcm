package com.bcm.enums;

/**
 * TreatmentPlanStatus Enum - Status of risk treatment plan execution
 */
public enum TreatmentPlanStatus {
    PLANNED("Planned", "Treatment plan created but not yet started"),
    IN_PROGRESS("In Progress", "Actions are being implemented"),
    COMPLETED("Completed", "All actions completed successfully"),
    CANCELLED("Cancelled", "Plan cancelled or no longer needed");

    private final String displayName;
    private final String description;

    TreatmentPlanStatus(String displayName, String description) {
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

