package com.bcm.enums;

/**
 * BIA Target Type Enum
 * 
 * Defines the types of items that can be analyzed in a BIA.
 * This enables polymorphic targeting - a BIA can analyze ANY item from ANY library.
 * 
 * Supported Types:
 * - PROCESS: Business process
 * - ORGANIZATIONAL_UNIT: Department, division, team, etc.
 * - ASSET: Buildings, equipment, technology, applications
 * - LOCATION: Physical locations
 * - SERVICE: IT/Business services
 * - VENDOR: External suppliers and vendors
 * - VITAL_RECORD: Critical data and documents
 */
public enum BiaTargetType {
    /**
     * Business Process
     * Example: "Payroll Processing", "Customer Onboarding"
     */
    PROCESS("Process"),

    /**
     * Organizational Unit (Department, Division, Team, etc.)
     * Example: "Finance Department", "IT Division"
     */
    ORGANIZATIONAL_UNIT("Organizational Unit"),

    /**
     * Asset (Building, Equipment, Technology, Application)
     * Example: "SAP Finance Server", "HQ Data Center"
     */
    ASSET("Asset"),

    /**
     * Physical Location
     * Example: "Headquarters Building", "Branch Office"
     */
    LOCATION("Location"),

    /**
     * IT or Business Service
     * Example: "Email Service", "Payment Gateway"
     */
    SERVICE("Service"),

    /**
     * External Vendor or Supplier
     * Example: "ADP Payroll Services", "AWS Cloud Provider"
     */
    VENDOR("Vendor"),

    /**
     * Vital Record (Critical Data/Document)
     * Example: "Employee Master Database", "Customer Contracts"
     */
    VITAL_RECORD("Vital Record");

    private final String displayName;

    BiaTargetType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    /**
     * Get enum from string value (case-insensitive)
     */
    public static BiaTargetType fromString(String value) {
        if (value == null) {
            return null;
        }
        for (BiaTargetType type : BiaTargetType.values()) {
            if (type.name().equalsIgnoreCase(value) || 
                type.displayName.equalsIgnoreCase(value)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Unknown BIA target type: " + value);
    }
}

