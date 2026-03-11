package com.bcm.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for HRMS sync results
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HrmsSyncResult {
    private String syncStatus;      // SUCCESS, FAILED, PARTIAL
    private Integer usersAdded;
    private Integer usersUpdated;
    private Integer usersFailed;
    private String errorMessage;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
    private String triggeredBy;
}

