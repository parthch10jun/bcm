package com.bcm.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * BIA Dependent Vital Record Entity
 * 
 * Junction table linking BIAs to Vital Records (Critical Data/Documents).
 * This is part of the BETH3V dependency mapping.
 * 
 * Tracks which data/documents are required for a process/service to function,
 * and the criticality of that dependency.
 */
@Entity
@Table(name = "bia_dependent_vital_records",
    indexes = {
        @Index(name = "idx_bia_dep_vr_bia", columnList = "bia_id"),
        @Index(name = "idx_bia_dep_vr_vr", columnList = "vital_record_id")
    },
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_bia_vital_record", columnNames = {"bia_id", "vital_record_id"})
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BiaDependentVitalRecord extends BaseEntity {

    /**
     * Link to the BIA record
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bia_id", nullable = false)
    private BiaRecord biaRecord;

    /**
     * Link to the Vital Record
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "vital_record_id", nullable = false)
    private VitalRecord vitalRecord;

    /**
     * Type of dependency
     * Values: REQUIRED, IMPORTANT, OPTIONAL
     */
    @Column(name = "dependency_type", length = 50)
    @Builder.Default
    private String dependencyType = "REQUIRED";

    /**
     * Additional notes about this vital record dependency
     */
    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    /**
     * Helper method to check if this is a required dependency
     */
    public boolean isRequired() {
        return "REQUIRED".equalsIgnoreCase(dependencyType);
    }

    /**
     * Helper method to check if this is an important dependency
     */
    public boolean isImportant() {
        return "IMPORTANT".equalsIgnoreCase(dependencyType);
    }

    /**
     * Helper method to check if this is an optional dependency
     */
    public boolean isOptional() {
        return "OPTIONAL".equalsIgnoreCase(dependencyType);
    }

    /**
     * Helper method to check if vital record has RPO defined
     */
    public boolean hasVitalRecordRpo() {
        return vitalRecord != null && vitalRecord.getRecoveryPointObjective() != null;
    }

    /**
     * Helper method to get vital record's RPO
     */
    public Integer getVitalRecordRpo() {
        return vitalRecord != null ? vitalRecord.getRecoveryPointObjective() : null;
    }

    /**
     * Helper method to check if vital record has backup frequency defined
     */
    public boolean hasBackupFrequency() {
        return vitalRecord != null && vitalRecord.getBackupFrequency() != null;
    }
}

