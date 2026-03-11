package com.bcm.enums;

/**
 * Enum representing the status of a vendor
 */
public enum VendorStatus {
    ACTIVE("Active"),
    INACTIVE("Inactive"),
    UNDER_REVIEW("Under Review");

    private final String displayName;

    VendorStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}

