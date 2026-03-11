package com.bcm.dto;

import com.bcm.enums.VitalRecordStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for Vital Record
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VitalRecordDTO {
    private Long id;
    private String recordName;
    private VitalRecordStatus status;
    private String recordType;
    private String location;
    private String description;
    private Integer recoveryPointObjective;
    private String owner;
    private String technicalContact;
    private String backupFrequency;
    private String storageFormat;
    private String retentionPeriod;
    private String notes;
    private LocalDateTime createdAt;
    private String createdBy;
    private LocalDateTime updatedAt;
    private String updatedBy;
    private Long version;
}

