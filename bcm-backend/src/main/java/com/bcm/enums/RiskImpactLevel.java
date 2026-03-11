package com.bcm.enums;

/**
 * RiskImpactLevel Enum - Severity of impact if a threat occurs (for Risk Assessment)
 * Different from BIA ImpactLevel which uses NONE/LOW/MEDIUM/HIGH/CRITICAL
 */
public enum RiskImpactLevel {
    INSIGNIFICANT(1, "Insignificant", "Minimal impact, easily managed"),
    MINOR(2, "Minor", "Minor impact, manageable with existing resources"),
    MODERATE(3, "Moderate", "Moderate impact, requires additional resources"),
    MAJOR(4, "Major", "Major impact, significant disruption"),
    CATASTROPHIC(5, "Catastrophic", "Catastrophic impact, severe long-term consequences");

    private final int score;
    private final String displayName;
    private final String description;

    RiskImpactLevel(int score, String displayName, String description) {
        this.score = score;
        this.displayName = displayName;
        this.description = description;
    }

    public int getScore() {
        return score;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getDescription() {
        return description;
    }
}

