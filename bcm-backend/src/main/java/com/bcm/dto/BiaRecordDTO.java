package com.bcm.dto;

import com.bcm.enums.BiaStatus;
import com.bcm.enums.BiaTargetType;
import com.bcm.enums.BiaType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * DTO for BIA Record
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BiaRecordDTO {
    
    private Long id;
    private String biaName;
    private Long biaTargetId;
    private BiaTargetType biaTargetType;
    private BiaType biaType;
    private BiaStatus status;
    private String biaOwner;
    private String biaCoordinator;
    private String purpose;
    private String scope;
    private LocalDate analysisDate;
    private String templateUsed;
    private Integer finalRtoHours;
    private Integer finalRpoHours;
    private String finalCriticality;
    
    // Legacy fields (for backward compatibility)
    private Long processId;
    private Long unitId;
    private Integer rtoHours;
    private Integer rpoHours;
    private Integer mtpdHours;
}

