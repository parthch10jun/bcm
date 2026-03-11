package com.bcm.enums;

/**
 * LikelihoodLevel Enum - Probability of a threat occurring
 */
public enum LikelihoodLevel {
    RARE(1, "Rare", "May occur only in exceptional circumstances (< 10%)"),
    UNLIKELY(2, "Unlikely", "Could occur at some time (10-30%)"),
    POSSIBLE(3, "Possible", "Might occur at some time (30-50%)"),
    LIKELY(4, "Likely", "Will probably occur in most circumstances (50-80%)"),
    ALMOST_CERTAIN(5, "Almost Certain", "Expected to occur in most circumstances (> 80%)");

    private final int score;
    private final String displayName;
    private final String description;

    LikelihoodLevel(int score, String displayName, String description) {
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

