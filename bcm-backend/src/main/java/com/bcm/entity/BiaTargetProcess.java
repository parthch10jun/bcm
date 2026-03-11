package com.bcm.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

/**
 * BIA Target Process Entity
 * 
 * Junction table linking BIAs to the processes being ANALYZED (targets).
 * This is DISTINCT from BiaDependentProcess which links to dependency/enabler processes.
 * 
 * PURPOSE:
 * - Supports single-process BIAs (1 entry per BIA)
 * - Supports multi-process BIAs (N entries per BIA)
 * - Enables analyzing multiple related processes together
 * 
 * EXAMPLES:
 * 1. Single Process BIA:
 *    - BIA "Payroll Analysis" → Process "Payroll Processing" (is_primary=true)
 * 
 * 2. Multi-Process BIA:
 *    - BIA "Finance Operations Analysis" → 
 *      - Process "Payroll Processing" (is_primary=true)
 *      - Process "Financial Reporting" (is_primary=false)
 *      - Process "Budget Management" (is_primary=false)
 * 
 * 3. Department BIA:
 *    - BIA "HR Department Analysis" →
 *      - Process "Recruitment" (is_primary=true)
 *      - Process "Onboarding" (is_primary=false)
 *      - Process "Performance Management" (is_primary=false)
 *      - Process "Payroll" (is_primary=false)
 */
@Entity
@Table(name = "bia_target_processes",
    indexes = {
        @Index(name = "idx_bia_target_proc_bia", columnList = "bia_id"),
        @Index(name = "idx_bia_target_proc_process", columnList = "process_id")
    },
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_bia_target_process", columnNames = {"bia_id", "process_id"})
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BiaTargetProcess extends BaseEntity {

    /**
     * Link to the BIA record
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bia_id", nullable = false)
    @JsonBackReference // Prevent infinite recursion during JSON serialization
    private BiaRecord biaRecord;

    /**
     * Link to the target Process being analyzed
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "process_id", nullable = false)
    private Process process;

    /**
     * Is this the primary/main process in the BIA?
     * - For single-process BIAs: always TRUE
     * - For multi-process BIAs: typically one process is marked as primary
     */
    @Column(name = "is_primary")
    @Builder.Default
    private Boolean isPrimary = false;

    /**
     * Why was this process included in the BIA?
     * Documents the rationale for including this process in the analysis.
     */
    @Column(name = "selection_reason", columnDefinition = "TEXT")
    private String selectionReason;

    /**
     * Helper method to check if this is the primary process
     */
    public boolean isPrimary() {
        return isPrimary != null && isPrimary;
    }

    /**
     * Helper method to get the process name
     */
    public String getProcessName() {
        return process != null ? process.getProcessName() : null;
    }

    /**
     * Helper method to get the process code
     */
    public String getProcessCode() {
        return process != null ? process.getProcessCode() : null;
    }

    /**
     * Helper method to get the process owner
     */
    public String getProcessOwner() {
        return process != null ? process.getProcessOwner() : null;
    }
}

