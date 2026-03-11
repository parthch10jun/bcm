package com.bcm.enums;

/**
 * RiskLevel Enum - Overall risk rating calculated from Likelihood × Impact
 * Used for color-coding in heat maps and dashboards
 */
public enum RiskLevel {
    LOW("Low", "Low risk - acceptable with routine monitoring", "#28a745"),      // Green
    MEDIUM("Medium", "Medium risk - requires management attention", "#ffc107"),  // Amber/Yellow
    HIGH("High", "High risk - requires immediate action", "#dc3545");            // Red

    private final String displayName;
    private final String description;
    private final String colorCode;

    RiskLevel(String displayName, String description, String colorCode) {
        this.displayName = displayName;
        this.description = description;
        this.colorCode = colorCode;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getDescription() {
        return description;
    }

    public String getColorCode() {
        return colorCode;
    }

    /**
     * Calculate risk level from likelihood and impact scores
     * Risk Score = Likelihood × Impact
     * 1-6: Low, 7-14: Medium, 15-25: High
     */
    public static RiskLevel fromScores(int likelihoodScore, int impactScore) {
        int riskScore = likelihoodScore * impactScore;
        
        if (riskScore <= 6) {
            return LOW;
        } else if (riskScore <= 14) {
            return MEDIUM;
        } else {
            return HIGH;
        }
    }
}

