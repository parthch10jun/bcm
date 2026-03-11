package com.bcm.dto;

import com.bcm.enums.IncidentSeverity;
import com.bcm.enums.IncidentStatus;
import com.bcm.enums.IncidentType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Request DTO for creating a new incident
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateIncidentRequest {
    
    @NotBlank(message = "Title is required")
    private String title;
    
    private String description;
    
    @NotNull(message = "Incident type is required")
    private IncidentType incidentType;
    
    @NotNull(message = "Severity is required")
    private IncidentSeverity severity;
    
    private IncidentStatus status;
    
    @NotNull(message = "Reported date is required")
    private LocalDateTime reportedDate;
    
    private LocalDateTime detectedDate;
    
    private String incidentCoordinator;
    private String incidentCommander;
    private String responseTeam;
    
    // Impact metrics
    private Integer affectedSystemsCount;
    private Integer impactedProcessesCount;
    private BigDecimal estimatedFinancialImpact;
    private Integer usersAffected;
    
    // Recovery information
    private String recoveryPlanActivated;
    private String playbookUsed;
    
    // External references
    private String externalTicketId;
    private String externalSystem;
    
    // Linked entities
    private List<Long> linkedProcessIds;
    private List<Long> linkedAssetIds;
    private List<Long> linkedVendorIds;
}

