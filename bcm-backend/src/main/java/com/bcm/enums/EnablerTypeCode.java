package com.bcm.enums;

/**
 * EnablerTypeCode Enum - BETH3V Framework Resource Categories
 * 
 * B - Buildings (Locations/Facilities)
 * E - Equipment (Physical assets)
 * T - Technology (Applications/IT Systems)
 * H - Human Resources (People/Teams)
 * 3 - Third-Party (Vendors/Suppliers)
 * V - Vital Records (Documents/Information Assets)
 */
public enum EnablerTypeCode {
    BUILDING("Buildings", "Physical locations and facilities"),
    EQUIPMENT("Equipment", "Physical equipment and machinery"),
    TECHNOLOGY("Technology/Applications", "IT systems, applications, and technology infrastructure"),
    PEOPLE("Human Resources", "People, teams, and human resources"),
    VENDOR("Third-Party Vendors", "External vendors and suppliers"),
    VITAL_RECORD("Vital Records", "Critical documents and information assets");

    private final String displayName;
    private final String description;

    EnablerTypeCode(String displayName, String description) {
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

