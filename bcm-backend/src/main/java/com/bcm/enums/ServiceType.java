package com.bcm.enums;

/**
 * Enum representing the type of service provided by a vendor
 */
public enum ServiceType {
    CLOUD_PROVIDER("Cloud Provider"),
    SAAS("SaaS"),
    MANAGED_SERVICE("Managed Service"),
    SUPPLIER("Supplier"),
    CONSULTING("Consulting"),
    INFRASTRUCTURE("Infrastructure"),
    SOFTWARE_LICENSE("Software License"),
    HARDWARE_VENDOR("Hardware Vendor"),
    TELECOM("Telecom"),
    UTILITIES("Utilities"),
    LOGISTICS("Logistics"),
    OTHER("Other");

    private final String displayName;

    ServiceType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}

