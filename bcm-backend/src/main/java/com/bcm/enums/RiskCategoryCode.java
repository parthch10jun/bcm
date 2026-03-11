package com.bcm.enums;

/**
 * RiskCategoryCode Enum - Types of risk assessment contexts
 * Defines what type of object is being assessed
 */
public enum RiskCategoryCode {
    LOCATION("Location Level", "Risk assessment at location/facility level"),
    PROCESS("Process", "Risk assessment for business processes"),
    SUPPLIER("Suppliers", "Risk assessment for third-party vendors/suppliers"),
    APPLICATION("Application/Software", "Risk assessment for IT applications and software"),
    ORG_UNIT("Organizational Unit", "Risk assessment at department/division level"),
    ASSET("Asset", "Risk assessment for physical or IT assets"),
    PROJECT("Project", "Risk assessment for projects and initiatives"),
    PEOPLE("People/Personnel", "Risk assessment for key personnel and human resources"),
    DATA("Data Assets", "Risk assessment for critical data and information assets");

    private final String displayName;
    private final String description;

    RiskCategoryCode(String displayName, String description) {
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

