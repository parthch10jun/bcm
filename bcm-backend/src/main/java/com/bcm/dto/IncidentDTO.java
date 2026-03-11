package com.bcm.dto;

import com.bcm.enums.IncidentSeverity;
import com.bcm.enums.IncidentStatus;
import com.bcm.enums.IncidentType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO for Incident entity
 * Used for API responses
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IncidentDTO {
    private Long id;
    private String incidentCode;
    private String title;
    private String description;
    private IncidentType incidentType;
    private IncidentSeverity severity;
    private IncidentStatus status;
    private LocalDateTime reportedDate;
    private LocalDateTime detectedDate;
    private LocalDateTime resolvedDate;
    private LocalDateTime closedDate;
    private String incidentCoordinator;
    private String incidentCommander;
    private String responseTeam;
    
    // Impact metrics
    private Integer affectedSystemsCount;
    private Integer impactedProcessesCount;
    private BigDecimal estimatedFinancialImpact;
    private BigDecimal actualFinancialImpact;
    private Integer usersAffected;
    
    // Recovery information
    private String recoveryPlanActivated;
    private String playbookUsed;
    private Integer actualRtoHours;
    private Integer actualRpoHours;
    
    // Root cause and lessons learned
    private String rootCause;
    private String lessonsLearned;
    private String correctiveActions;
    
    // External references
    private String externalTicketId;
    private String externalSystem;
    
    // Linked entities (IDs only for list view)
    private List<Long> linkedProcessIds;
    private List<Long> linkedAssetIds;
    private List<Long> linkedVendorIds;
    
    // Linked entities (full details for detail view)
    private List<LinkedEntityDTO> linkedProcesses;
    private List<LinkedEntityDTO> linkedAssets;
    private List<LinkedEntityDTO> linkedVendors;
    
    // Audit fields
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String createdBy;
    private String updatedBy;
    
    /**
     * Nested DTO for linked entities
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LinkedEntityDTO {
        private Long id;
        private String name;
        private String code;
        private String type;
        private String status;
    }
}

