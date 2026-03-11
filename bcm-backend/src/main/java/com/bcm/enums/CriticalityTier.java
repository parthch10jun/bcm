package com.bcm.enums;

/**
 * Criticality Tier based on impact score
 * Tier 1: Score >= 32 (Most Critical)
 * Tier 2: Score >= 24
 * Tier 3: Score >= 16
 * Tier 4: Score >= 8
 */
public enum CriticalityTier {
    TIER_1("Tier 1 - Mission Critical", 32),
    TIER_2("Tier 2 - Critical", 24),
    TIER_3("Tier 3 - Important", 16),
    TIER_4("Tier 4 - Standard", 8),
    TIER_5("Tier 5 - Non-Critical", 0);

    private final String description;
    private final int minScore;

    CriticalityTier(String description, int minScore) {
        this.description = description;
        this.minScore = minScore;
    }

    public String getDescription() {
        return description;
    }

    public int getMinScore() {
        return minScore;
    }

    public static CriticalityTier fromScore(int score) {
        if (score >= TIER_1.minScore) return TIER_1;
        if (score >= TIER_2.minScore) return TIER_2;
        if (score >= TIER_3.minScore) return TIER_3;
        if (score >= TIER_4.minScore) return TIER_4;
        return TIER_5;
    }
}

