package com.bcm.dto;

import com.bcm.enums.VitalRecordStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for creating a new Vital Record
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateVitalRecordRequest {

    @NotBlank(message = "Record name is required")
    @Size(max = 255, message = "Record name must not exceed 255 characters")
    private String recordName;

    private VitalRecordStatus status;

    @Size(max = 100, message = "Record type must not exceed 100 characters")
    private String recordType;

    private String location;

    private String description;

    private Integer recoveryPointObjective;

    @Size(max = 255, message = "Owner must not exceed 255 characters")
    private String owner;

    @Size(max = 255, message = "Technical contact must not exceed 255 characters")
    private String technicalContact;

    @Size(max = 100, message = "Backup frequency must not exceed 100 characters")
    private String backupFrequency;

    @Size(max = 100, message = "Storage format must not exceed 100 characters")
    private String storageFormat;

    @Size(max = 100, message = "Retention period must not exceed 100 characters")
    private String retentionPeriod;

    private String notes;
}

