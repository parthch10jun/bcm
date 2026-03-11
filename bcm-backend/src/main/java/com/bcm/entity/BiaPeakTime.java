package com.bcm.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

/**
 * BIA Peak Time Entity
 * 
 * Represents peak operational times and critical deadlines where RTO/RPO requirements
 * may be more aggressive than baseline values.
 * 
 * Examples:
 * - Month-end financial close (requires 2-hour RTO vs. 8-hour baseline)
 * - Payroll processing window (requires 1-hour RTO)
 * - Peak trading hours (requires 15-minute RTO)
 * - Year-end regulatory reporting (requires 4-hour RTO)
 * 
 * The system uses peak times to calculate the most aggressive RTO requirement,
 * which becomes the system-suggested RTO for the BIA.
 */
@Entity
@Table(name = "bia_peak_times", indexes = {
    @Index(name = "idx_peak_times_bia", columnList = "bia_id"),
    @Index(name = "idx_peak_times_active", columnList = "is_active"),
    @Index(name = "idx_peak_times_deadline_type", columnList = "deadline_type"),
    @Index(name = "idx_peak_times_recurrence", columnList = "recurrence_type")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BiaPeakTime extends BaseEntity {

    /**
     * Link to the BIA record
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bia_id", nullable = false)
    private BiaRecord biaRecord;

    /**
     * Peak time name (e.g., "Month-End Close", "Payroll Processing")
     */
    @Column(name = "peak_time_name", nullable = false)
    private String peakTimeName;

    /**
     * Description of the peak time and its business significance
     */
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    /**
     * Peak RTO in hours (more aggressive than baseline)
     * This is the recovery time objective during the peak period
     */
    @Column(name = "peak_rto_hours", nullable = false)
    private Integer peakRtoHours;

    /**
     * Peak RPO in hours (more aggressive than baseline)
     * This is the recovery point objective during the peak period
     */
    @Column(name = "peak_rpo_hours")
    private Integer peakRpoHours;

    /**
     * Recurrence pattern type
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "recurrence_type", length = 50)
    private RecurrenceType recurrenceType;

    /**
     * Recurrence details in JSON format
     * Examples:
     * - Daily: {"time": "09:00-17:00"}
     * - Weekly: {"dayOfWeek": "Monday", "time": "09:00"}
     * - Monthly: {"dayOfMonth": 1, "time": "00:00"}
     * - Yearly: {"month": 12, "day": 31}
     */
    @Column(name = "recurrence_details", columnDefinition = "TEXT")
    private String recurrenceDetails;

    /**
     * Start date (for one-time or seasonal peaks)
     */
    @Column(name = "start_date")
    private LocalDate startDate;

    /**
     * End date (for one-time or seasonal peaks)
     */
    @Column(name = "end_date")
    private LocalDate endDate;

    /**
     * Start time (for daily peaks)
     */
    @Column(name = "start_time")
    private LocalTime startTime;

    /**
     * End time (for daily peaks)
     */
    @Column(name = "end_time")
    private LocalTime endTime;

    /**
     * Whether this is a critical business deadline
     */
    @Column(name = "is_critical_deadline")
    private Boolean isCriticalDeadline = false;

    /**
     * Type of critical deadline
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "deadline_type", length = 100)
    private DeadlineType deadlineType;

    /**
     * Business justification for this peak time
     */
    @Column(name = "business_justification", columnDefinition = "TEXT")
    private String businessJustification;

    /**
     * Impact if this deadline is missed
     */
    @Column(name = "impact_if_missed", columnDefinition = "TEXT")
    private String impactIfMissed;

    /**
     * Priority (1 = Highest, 5 = Lowest)
     */
    @Column(name = "priority")
    private Integer priority = 1;

    /**
     * Whether this peak time is currently active
     */
    @Column(name = "is_active")
    private Boolean isActive = true;

    /**
     * Recurrence Type Enum
     */
    public enum RecurrenceType {
        DAILY,      // Occurs every day
        WEEKLY,     // Occurs on specific day(s) of week
        MONTHLY,    // Occurs on specific day(s) of month
        YEARLY,     // Occurs on specific date(s) each year
        ONE_TIME    // Occurs only once
    }

    /**
     * Deadline Type Enum
     */
    public enum DeadlineType {
        MONTH_END,          // End of month processing
        QUARTER_END,        // End of quarter reporting
        YEAR_END,           // End of year close
        PAYROLL,            // Payroll processing deadline
        REGULATORY_FILING,  // Regulatory submission deadline
        CUSTOM              // Custom business deadline
    }

    /**
     * Helper method to check if peak time is currently in effect
     * 
     * @return true if the peak time is currently active based on date/time
     */
    public boolean isCurrentlyInEffect() {
        if (!isActive) {
            return false;
        }

        LocalDate now = LocalDate.now();
        
        // Check date range for one-time or seasonal peaks
        if (startDate != null && endDate != null) {
            return !now.isBefore(startDate) && !now.isAfter(endDate);
        }

        // For recurring peaks, would need more complex logic based on recurrence type
        // This is a simplified check
        return true;
    }

    /**
     * Helper method to get display name for recurrence
     * 
     * @return human-readable recurrence description
     */
    public String getRecurrenceDisplay() {
        if (recurrenceType == null) {
            return "Not specified";
        }

        switch (recurrenceType) {
            case DAILY:
                return "Daily";
            case WEEKLY:
                return "Weekly";
            case MONTHLY:
                return "Monthly";
            case YEARLY:
                return "Yearly";
            case ONE_TIME:
                return "One-time";
            default:
                return recurrenceType.toString();
        }
    }

    /**
     * Helper method to get display name for deadline type
     * 
     * @return human-readable deadline type
     */
    public String getDeadlineTypeDisplay() {
        if (deadlineType == null) {
            return "N/A";
        }

        switch (deadlineType) {
            case MONTH_END:
                return "Month-End";
            case QUARTER_END:
                return "Quarter-End";
            case YEAR_END:
                return "Year-End";
            case PAYROLL:
                return "Payroll";
            case REGULATORY_FILING:
                return "Regulatory Filing";
            case CUSTOM:
                return "Custom";
            default:
                return deadlineType.toString();
        }
    }
}

