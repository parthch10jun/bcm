package com.bcm.dto;

import com.bcm.enums.ProcessStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Data Transfer Object for Process
 * Used for API responses
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProcessDTO {
    
    private Long id;
    private String processName;
    private String processCode;
    private String description;
    
    // Organizational Unit Reference
    private Long organizationalUnitId;
    private String organizationalUnitName;
    private String organizationalUnitCode;
    
    // Process Details
    private String processOwner;
    private ProcessStatus status;
    private Boolean isCritical;
    
    // Audit Fields
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String createdBy;
    private String updatedBy;
    
    // Computed Fields
    private Integer biaCount; // Number of BIAs associated with this process
}

