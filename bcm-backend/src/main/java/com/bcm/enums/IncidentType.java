package com.bcm.enums;

/**
 * Incident Type Enum
 * Categorizes incidents by their nature
 */
public enum IncidentType {
    CYBERATTACK("Cyberattack"),
    INFRASTRUCTURE("Infrastructure"),
    NATURAL_DISASTER("Natural Disaster"),
    HEALTH_SAFETY("Health & Safety"),
    SUPPLY_CHAIN("Supply Chain"),
    HUMAN_ERROR("Human Error"),
    TECHNOLOGY_FAILURE("Technology Failure"),
    SECURITY_BREACH("Security Breach"),
    DATA_LOSS("Data Loss"),
    REGULATORY("Regulatory"),
    REPUTATIONAL("Reputational"),
    OTHER("Other");

    private final String displayName;

    IncidentType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}

