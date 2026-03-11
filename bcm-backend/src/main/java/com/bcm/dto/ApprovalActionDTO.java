package com.bcm.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for BIA Approval actions
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApprovalActionDTO {
    private Long biaId;
    private Integer stageNumber;
    private Long approvedById;
    private String comments;
    private Boolean isChangeRequest;
}

