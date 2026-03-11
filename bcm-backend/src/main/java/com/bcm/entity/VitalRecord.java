package com.bcm.entity;

import com.bcm.enums.VitalRecordStatus;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

/**
 * Vital Record Entity - Represents essential data, files, and documents
 * 
 * This is NOT a document storage system, but a manifest of what exists
 * and where to find it. Used for BIA gap analysis (RPO requirements vs capabilities).
 */
@Entity
@Table(name = "vital_records", indexes = {
    @Index(name = "idx_vital_records_status", columnList = "status"),
    @Index(name = "idx_vital_records_type", columnList = "record_type"),
    @Index(name = "idx_vital_records_name", columnList = "record_name")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VitalRecord extends BaseEntity {

    @Column(name = "record_name", nullable = false, length = 255)
    private String recordName;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 50)
    @Builder.Default
    private VitalRecordStatus status = VitalRecordStatus.ACTIVE;

    @Column(name = "record_type", length = 100)
    private String recordType;

    @Column(name = "location", columnDefinition = "TEXT")
    private String location;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    /**
     * Recovery Point Objective Capability (RPO-C) in hours
     * The data backup frequency - how much data loss is acceptable
     * Critical for BIA gap analysis
     * 
     * Examples:
     * - 1 = Hourly backups (1 hour of data loss)
     * - 24 = Daily backups (24 hours of data loss)
     * - 168 = Weekly backups (1 week of data loss)
     */
    @Column(name = "recovery_point_objective")
    private Integer recoveryPointObjective;

    @Column(name = "owner", length = 255)
    private String owner;

    @Column(name = "technical_contact", length = 255)
    private String technicalContact;

    @Column(name = "backup_frequency", length = 100)
    private String backupFrequency;

    @Column(name = "storage_format", length = 100)
    private String storageFormat;

    @Column(name = "retention_period", length = 100)
    private String retentionPeriod;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    /**
     * Process-Vital Record relationships
     * Used for BIA gap analysis
     */
    @OneToMany(mappedBy = "vitalRecord", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ProcessVitalRecord> processVitalRecords = new ArrayList<>();
}

