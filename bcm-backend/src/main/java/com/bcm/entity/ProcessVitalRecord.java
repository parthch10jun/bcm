package com.bcm.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * Junction table linking Processes to Vital Records
 * Used for BIA gap analysis (RPO requirements vs capabilities)
 */
@Entity
@Table(name = "process_vital_records", indexes = {
    @Index(name = "idx_process_vital_records_process", columnList = "process_id"),
    @Index(name = "idx_process_vital_records_vital_record", columnList = "vital_record_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProcessVitalRecord extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "process_id", nullable = false)
    private Process process;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vital_record_id", nullable = false)
    private VitalRecord vitalRecord;

    @Column(name = "dependency_type", length = 50)
    @Builder.Default
    private String dependencyType = "REQUIRED";

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;
}

