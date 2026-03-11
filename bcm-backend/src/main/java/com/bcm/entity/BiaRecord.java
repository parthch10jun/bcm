package com.bcm.entity;

import com.bcm.enums.BiaCreationType;
import com.bcm.enums.BiaStatus;
import com.bcm.enums.BiaType;
import com.bcm.enums.BiaCriticality;
import com.bcm.enums.BiaTargetType;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * BIA Record Entity - Polymorphic BIA Hub Architecture
 *
 * HUB-AND-SPOKE MODEL:
 * - Hub: This table stores BIA instances with polymorphic targeting
 * - Spokes: Junction tables link to BETH3V libraries (Assets, People, Vendors, Vital Records, Processes)
 * - Engine: Questionnaire system (BiaQuestion + BiaAnswer) drives impact analysis
 * - Output: Gap analysis comparing requirements vs capabilities
 *
 * POLYMORPHIC TARGETING:
 * - Can analyze ANY item from ANY library using (biaTargetId, biaTargetType)
 * - Supported types: Process, OrganizationalUnit, Asset, Location, Service, Vendor, VitalRecord
 *
 * Key Features:
 * - Polymorphic targeting: Analyze ANY library item
 * - Questionnaire-driven: Impact analysis through structured questions
 * - BETH3V dependencies: Links to all enabler libraries
 * - Gap analysis: Compare requirements (RTO/RPO) vs capabilities
 * - Roll-up support: Aggregate child BIAs (DIRECT vs AGGREGATED)
 * - Reconciliation: Conflict resolution between direct and aggregated BIAs
 */
@Entity
@Table(name = "bia_records", indexes = {
    @Index(name = "idx_bia_unit", columnList = "unit_id"),
    @Index(name = "idx_bia_process", columnList = "process_id"),
    @Index(name = "idx_bia_status", columnList = "status"),
    @Index(name = "idx_bia_creation_type", columnList = "creation_type")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BiaRecord extends BaseEntity {

    @Column(name = "bia_name", nullable = false, length = 255)
    private String biaName;

    /**
     * POLYMORPHIC TARGETING FIELDS
     * These replace the old unit_id/process_id approach
     */

    /**
     * ID of the item being analyzed (polymorphic)
     * Could be a Process ID, OrganizationalUnit ID, Asset ID, Location ID, etc.
     */
    @Column(name = "bia_target_id")
    private Long biaTargetId;

    /**
     * Type of item being analyzed
     * Values: Process, OrganizationalUnit, Asset, Location, Service, Vendor, VitalRecord
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "bia_target_type", length = 50)
    private BiaTargetType biaTargetType;

    /**
     * LEGACY FIELDS (kept for backward compatibility)
     * These are populated from biaTargetId/biaTargetType for existing queries
     */

    /**
     * Link to organizational unit (LEGACY - use biaTargetId/biaTargetType instead)
     * NULL if this is not a unit-level BIA
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "unit_id")
    private OrganizationalUnit organizationalUnit;

    /**
     * Link to process (LEGACY - use biaTargetId/biaTargetType instead)
     * NULL if this is not a process-level BIA
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "process_id")
    private Process process;

    /**
     * Scope of the BIA (Process, Department, Location)
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "bia_type", nullable = false, length = 50)
    private BiaType biaType;

    /**
     * CRITICAL: How this BIA was created
     * - DIRECT: User manually created this BIA (override)
     * - AGGREGATED: System calculated this by rolling up child data
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "creation_type", nullable = false, length = 50)
    private BiaCreationType creationType;

    /**
     * Status of the BIA workflow
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 50)
    @Builder.Default
    private BiaStatus status = BiaStatus.DRAFT;

    /**
     * BIA COORDINATOR
     */
    @Column(name = "bia_coordinator", length = 255)
    private String biaCoordinator;

    /**
     * ANALYSIS DATE
     */
    @Column(name = "analysis_date")
    private LocalDate analysisDate;

    /**
     * TEMPLATE USED
     * Name or identifier of the BIA template used to create this record
     * Enables template usage analytics and audit trail
     */
    @Column(name = "template_used", length = 255)
    private String templateUsed;

    /**
     * WORKFLOW FIELDS (Golf Saudi Specific)
     * Support for 5-stage workflow: Initiate -> Complete -> Review -> Verification -> Approval
     */

    /**
     * Current workflow stage
     */
    @Column(name = "workflow_stage", length = 50)
    private String workflowStage;

    /**
     * Current workflow status
     */
    @Column(name = "workflow_status", length = 50)
    private String workflowStatus;

    /**
     * Stage timestamps
     */
    @Column(name = "initiated_at")
    private LocalDateTime initiatedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;

    @Column(name = "verified_at")
    private LocalDateTime verifiedAt;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    /**
     * Stage assignees (user IDs)
     */
    @Column(name = "champion_id")
    private Long championId;

    @Column(name = "sme_id")
    private Long smeId;

    @Column(name = "division_head_id")
    private Long divisionHeadId;

    @Column(name = "bcm_verifier_id")
    private Long bcmVerifierId;

    @Column(name = "approver_id")
    private Long approverId;

    /**
     * Stage assignee names (for display)
     */
    @Column(name = "champion_name", length = 255)
    private String championName;

    @Column(name = "sme_name", length = 255)
    private String smeName;

    @Column(name = "division_head_name", length = 255)
    private String divisionHeadName;

    @Column(name = "bcm_verifier_name", length = 255)
    private String bcmVerifierName;

    @Column(name = "approver_name", length = 255)
    private String approverName;

    /**
     * FINAL APPROVED METRICS
     * These are the user-approved values after questionnaire analysis
     */

    /**
     * Final approved Recovery Time Objective (in hours)
     */
    @Column(name = "final_rto_hours")
    private Integer finalRtoHours;

    /**
     * Final approved Recovery Point Objective (in hours)
     */
    @Column(name = "final_rpo_hours")
    private Integer finalRpoHours;

    /**
     * PEAK TIMES & RTO CALCULATION FIELDS
     * These support the enhanced RTO/RPO determination logic
     */

    /**
     * Baseline MTPD calculated from impact analysis matrix (in hours)
     */
    @Column(name = "baseline_mtpd_hours")
    private Integer baselineMtpdHours;

    /**
     * Most aggressive (lowest) RTO from all peak times (in hours)
     */
    @Column(name = "most_aggressive_peak_rto_hours")
    private Integer mostAggressivePeakRtoHours;

    /**
     * System suggested RTO = MIN(baseline_mtpd_hours, most_aggressive_peak_rto_hours)
     */
    @Column(name = "system_suggested_rto_hours")
    private Integer systemSuggestedRtoHours;

    /**
     * Whether the final RTO is an override (exceeds system suggested RTO)
     */
    @Column(name = "is_rto_override")
    @Builder.Default
    private Boolean isRtoOverride = false;

    /**
     * Required justification when RTO override is used
     */
    @Column(name = "rto_override_justification", columnDefinition = "TEXT")
    private String rtoOverrideJustification;

    /**
     * Final approved Criticality level
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "final_criticality", length = 50)
    private BiaCriticality finalCriticality;

    /**
     * LEGACY FIELDS (kept for backward compatibility)
     */

    /**
     * Recovery Time Objective (in hours) - LEGACY
     */
    @Column(name = "rto_hours")
    private Integer rtoHours;

    /**
     * Recovery Point Objective (in hours) - LEGACY
     */
    @Column(name = "rpo_hours")
    private Integer rpoHours;

    /**
     * Maximum Tolerable Period of Disruption (in hours)
     */
    @Column(name = "mtpd_hours")
    private Integer mtpdHours;

    /**
     * Number of critical assets identified
     */
    @Column(name = "critical_assets_count")
    private Integer criticalAssetsCount;

    /**
     * Financial impact estimate
     */
    @Column(name = "financial_impact", precision = 15, scale = 2)
    private BigDecimal financialImpact;

    /**
     * Operational impact description
     */
    @Column(name = "operational_impact", columnDefinition = "TEXT")
    private String operationalImpact;

    /**
     * Reputational impact description
     */
    @Column(name = "reputational_impact", columnDefinition = "TEXT")
    private String reputationalImpact;

    /**
     * RECONCILIATION FIELDS
     * When a unit has both DIRECT and AGGREGATED BIAs, these fields track the conflict
     */
    
    /**
     * Is this the "official" BIA to use for reporting?
     * When both DIRECT and AGGREGATED exist, user must choose which is official
     */
    @Column(name = "is_official", nullable = false)
    @Builder.Default
    private Boolean isOfficial = false;

    /**
     * If this is AGGREGATED, reference to the DIRECT BIA (if one exists)
     * Used to detect conflicts
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "conflicting_bia_id")
    private BiaRecord conflictingBia;

    /**
     * Timestamp when reconciliation was last performed
     */
    @Column(name = "reconciled_at")
    private LocalDateTime reconciledAt;

    /**
     * User who performed the reconciliation
     */
    @Column(name = "reconciled_by", length = 255)
    private String reconciledBy;

    /**
     * Notes about the reconciliation decision
     */
    @Column(name = "reconciliation_notes", columnDefinition = "TEXT")
    private String reconciliationNotes;

    /**
     * BETH3V DEPENDENCY RELATIONSHIPS
     * These are the "spokes" in the hub-and-spoke model
     */

    /**
     * Questionnaire answers for this BIA
     */
    @OneToMany(mappedBy = "biaRecord", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<BiaAnswer> answers = new ArrayList<>();

    /**
     * Dependent Assets (Buildings, Equipment, Technology)
     */
    @OneToMany(mappedBy = "biaRecord", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<BiaDependentAsset> dependentAssets = new ArrayList<>();

    /**
     * Dependent People (Human Resources)
     */
    @OneToMany(mappedBy = "biaRecord", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<BiaDependentPerson> dependentPeople = new ArrayList<>();

    /**
     * Dependent Vendors (3rd Parties)
     */
    @OneToMany(mappedBy = "biaRecord", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<BiaDependentVendor> dependentVendors = new ArrayList<>();

    /**
     * Dependent Vital Records (Data/Documents)
     */
    @OneToMany(mappedBy = "biaRecord", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<BiaDependentVitalRecord> dependentVitalRecords = new ArrayList<>();

    /**
     * Dependent Processes (for roll-ups and dependencies)
     * These are processes that this BIA DEPENDS ON (enablers/dependencies)
     */
    @OneToMany(mappedBy = "biaRecord", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<BiaDependentProcess> dependentProcesses = new ArrayList<>();

    /**
     * Target Processes (the processes being ANALYZED by this BIA)
     * This supports multi-process BIA analysis.
     * - Single-process BIA: 1 entry
     * - Multi-process BIA: N entries
     */
    @OneToMany(mappedBy = "biaRecord", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference // Prevent infinite recursion during JSON serialization
    @Builder.Default
    private List<BiaTargetProcess> targetProcesses = new ArrayList<>();

    /**
     * Validation: Ensure polymorphic target is set
     */
    @PrePersist
    @PreUpdate
    private void validateLinks() {
        // New validation: polymorphic targeting
        if (biaTargetId != null && biaTargetType == null) {
            throw new IllegalStateException("BIA target type must be specified when target ID is set");
        }
        if (biaTargetId == null && biaTargetType != null) {
            throw new IllegalStateException("BIA target ID must be specified when target type is set");
        }

        // Legacy validation (for backward compatibility)
        // Allow DRAFT BIAs to exist without a target (they will be linked to processes later via BiaTargetProcess)
        if (status != BiaStatus.DRAFT &&
            biaTargetId == null && organizationalUnit == null && process == null) {
            throw new IllegalStateException("BIA must have a target (either polymorphic or legacy unit/process)");
        }
    }

    /**
     * HELPER METHODS
     */

    /**
     * Get the target type (polymorphic or legacy)
     */
    public String getTargetType() {
        if (biaTargetType != null) {
            return biaTargetType.name();
        }
        if (process != null) {
            return "Process";
        }
        if (organizationalUnit != null) {
            return "OrganizationalUnit";
        }
        return null;
    }

    /**
     * Get the target ID (polymorphic or legacy)
     */
    public Long getTargetId() {
        if (biaTargetId != null) {
            return biaTargetId;
        }
        if (process != null) {
            return process.getId();
        }
        if (organizationalUnit != null) {
            return organizationalUnit.getId();
        }
        return null;
    }

    /**
     * Helper method to check if this is a unit-level BIA (LEGACY)
     */
    public boolean isUnitLevelBia() {
        return organizationalUnit != null ||
               (biaTargetType != null && biaTargetType == BiaTargetType.ORGANIZATIONAL_UNIT);
    }

    /**
     * Helper method to check if this is a process-level BIA (LEGACY)
     */
    public boolean isProcessLevelBia() {
        return process != null ||
               (biaTargetType != null && biaTargetType == BiaTargetType.PROCESS);
    }

    /**
     * Helper method to check if there's a conflict with another BIA
     */
    public boolean hasConflict() {
        return conflictingBia != null;
    }

    /**
     * Helper method to check if this BIA has gap analysis data
     */
    public boolean hasGaps() {
        // A BIA has gaps if any dependency's capability is less than the requirement
        // This will be implemented in the service layer
        return false;
    }

    /**
     * Helper method to get the effective RTO (final or calculated)
     */
    public Integer getEffectiveRto() {
        return finalRtoHours != null ? finalRtoHours : rtoHours;
    }

    /**
     * Helper method to get the effective RPO (final or calculated)
     */
    public Integer getEffectiveRpo() {
        return finalRpoHours != null ? finalRpoHours : rpoHours;
    }
}

