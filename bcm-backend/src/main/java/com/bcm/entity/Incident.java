package com.bcm.entity;

import com.bcm.enums.IncidentSeverity;
import com.bcm.enums.IncidentStatus;
import com.bcm.enums.IncidentType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Incident Entity
 * 
 * Represents a business continuity incident that has occurred or is occurring.
 * Incidents can be linked to:
 * - Services (affected business services)
 * - Processes (impacted business processes)
 * - Assets (affected IT/physical assets)
 * - Vendors (involved third parties)
 * - Recovery Plans (activated DR/BCP plans)
 * 
 * This entity supports requirement 5.1.1: Link incidents to services, dependencies, and recovery plans
 */
@Entity
@Table(name = "incidents", indexes = {
    @Index(name = "idx_incident_type", columnList = "incident_type"),
    @Index(name = "idx_incident_severity", columnList = "severity"),
    @Index(name = "idx_incident_status", columnList = "status"),
    @Index(name = "idx_incident_reported_date", columnList = "reported_date"),
    @Index(name = "idx_incident_coordinator", columnList = "incident_coordinator")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Incident extends BaseEntity {

    @Column(name = "incident_code", unique = true, nullable = false, length = 50)
    private String incidentCode;

    @Column(name = "title", nullable = false, length = 500)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "incident_type", nullable = false, length = 50)
    private IncidentType incidentType;

    @Enumerated(EnumType.STRING)
    @Column(name = "severity", nullable = false, length = 50)
    private IncidentSeverity severity;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 50)
    @Builder.Default
    private IncidentStatus status = IncidentStatus.REPORTED;

    @Column(name = "reported_date", nullable = false)
    private LocalDateTime reportedDate;

    @Column(name = "detected_date")
    private LocalDateTime detectedDate;

    @Column(name = "resolved_date")
    private LocalDateTime resolvedDate;

    @Column(name = "closed_date")
    private LocalDateTime closedDate;

    @Column(name = "incident_coordinator", length = 255)
    private String incidentCoordinator;

    @Column(name = "incident_commander", length = 255)
    private String incidentCommander;

    @Column(name = "response_team", columnDefinition = "TEXT")
    private String responseTeam;

    // Impact metrics
    @Column(name = "affected_systems_count")
    private Integer affectedSystemsCount;

    @Column(name = "impacted_processes_count")
    private Integer impactedProcessesCount;

    @Column(name = "estimated_financial_impact")
    private java.math.BigDecimal estimatedFinancialImpact;

    @Column(name = "actual_financial_impact")
    private java.math.BigDecimal actualFinancialImpact;

    @Column(name = "users_affected")
    private Integer usersAffected;

    // Recovery information
    @Column(name = "recovery_plan_activated", length = 255)
    private String recoveryPlanActivated;

    @Column(name = "playbook_used", length = 255)
    private String playbookUsed;

    @Column(name = "actual_rto_hours")
    private Integer actualRtoHours;

    @Column(name = "actual_rpo_hours")
    private Integer actualRpoHours;

    // Root cause and lessons learned
    @Column(name = "root_cause", columnDefinition = "TEXT")
    private String rootCause;

    @Column(name = "lessons_learned", columnDefinition = "TEXT")
    private String lessonsLearned;

    @Column(name = "corrective_actions", columnDefinition = "TEXT")
    private String correctiveActions;

    // External references
    @Column(name = "external_ticket_id", length = 100)
    private String externalTicketId; // ServiceNow ticket ID

    @Column(name = "external_system", length = 100)
    private String externalSystem; // e.g., "ServiceNow", "Jira"

    // Linked entities (Many-to-Many relationships)
    @ManyToMany
    @JoinTable(
        name = "incident_processes",
        joinColumns = @JoinColumn(name = "incident_id"),
        inverseJoinColumns = @JoinColumn(name = "process_id")
    )
    @Builder.Default
    private List<Process> linkedProcesses = new ArrayList<>();

    @ManyToMany
    @JoinTable(
        name = "incident_assets",
        joinColumns = @JoinColumn(name = "incident_id"),
        inverseJoinColumns = @JoinColumn(name = "asset_id")
    )
    @Builder.Default
    private List<Asset> linkedAssets = new ArrayList<>();

    @ManyToMany
    @JoinTable(
        name = "incident_vendors",
        joinColumns = @JoinColumn(name = "incident_id"),
        inverseJoinColumns = @JoinColumn(name = "vendor_id")
    )
    @Builder.Default
    private List<Vendor> linkedVendors = new ArrayList<>();
}

