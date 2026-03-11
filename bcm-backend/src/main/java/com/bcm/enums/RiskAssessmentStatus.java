package com.bcm.enums;

/**
 * RiskAssessmentStatus Enum - Status of a risk assessment
 */
public enum RiskAssessmentStatus {
    DRAFT("Draft", "Assessment is being prepared"),
    IN_PROGRESS("In Progress", "Assessment is actively being conducted"),
    UNDER_REVIEW("Under Review", "Assessment is being reviewed"),
    APPROVED("Approved", "Assessment has been approved"),
    ARCHIVED("Archived", "Assessment has been archived");

    private final String displayName;
    private final String description;

    RiskAssessmentStatus(String displayName, String description) {
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

