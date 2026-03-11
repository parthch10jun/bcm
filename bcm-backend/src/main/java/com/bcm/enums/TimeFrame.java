package com.bcm.enums;

/**
 * Time Frame for impact analysis
 */
public enum TimeFrame {
    ONE_HOUR(1, 10, "1 Hour"),
    FOUR_HOURS(4, 8, "4 Hours"),
    TWENTY_FOUR_HOURS(24, 6, "24 Hours"),
    THREE_DAYS(72, 4, "3 Days"),
    ONE_WEEK(168, 2, "1 Week");

    private final int hours;
    private final int weight;
    private final String description;

    TimeFrame(int hours, int weight, String description) {
        this.hours = hours;
        this.weight = weight;
        this.description = description;
    }

    public int getHours() {
        return hours;
    }

    public int getWeight() {
        return weight;
    }

    public String getDescription() {
        return description;
    }
}

