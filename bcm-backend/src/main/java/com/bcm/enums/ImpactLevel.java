package com.bcm.enums;

/**
 * Impact Level for BIA analysis
 */
public enum ImpactLevel {
    NONE(0, "None"),
    LOW(1, "Low"),
    MEDIUM(2, "Medium"),
    HIGH(3, "High"),
    CRITICAL(4, "Critical");

    private final int value;
    private final String description;

    ImpactLevel(int value, String description) {
        this.value = value;
        this.description = description;
    }

    public int getValue() {
        return value;
    }

    public String getDescription() {
        return description;
    }

    public static ImpactLevel fromValue(int value) {
        for (ImpactLevel level : values()) {
            if (level.value == value) {
                return level;
            }
        }
        throw new IllegalArgumentException("Invalid impact level value: " + value);
    }
}

