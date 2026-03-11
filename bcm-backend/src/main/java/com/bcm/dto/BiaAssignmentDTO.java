package com.bcm.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for BIA Assignment operations
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BiaAssignmentDTO {
    private Long biaId;
    private Long assignedById;
    private Long assignedToId;
    private String assignmentType;
    private String assignmentReason;
}

