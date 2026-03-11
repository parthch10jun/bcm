package com.bcm.entity;

import com.bcm.enums.ProcessStatus;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

/**
 * Process Entity - Represents a business process
 * 
 * Processes are linked to organizational units and can have BIAs performed on them.
 * This is the traditional "process-level BIA" approach.
 */
@Entity
@Table(name = "processes", indexes = {
    @Index(name = "idx_process_unit", columnList = "organizational_unit_id"),
    @Index(name = "idx_process_status", columnList = "status")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Process extends BaseEntity {

    @Column(name = "process_name", nullable = false, length = 255)
    private String processName;

    @Column(name = "process_code", unique = true, length = 50)
    private String processCode;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    /**
     * Link to the organizational unit that owns this process
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organizational_unit_id", nullable = false)
    private OrganizationalUnit organizationalUnit;

    /**
     * Process owner
     */
    @Column(name = "process_owner", length = 255)
    private String processOwner;

    /**
     * Process status
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 50)
    @Builder.Default
    private ProcessStatus status = ProcessStatus.ACTIVE;

    /**
     * BIAs associated with this process
     */
    @OneToMany(mappedBy = "process", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<BiaRecord> biaRecords = new ArrayList<>();

    /**
     * Is this process critical?
     */
    @Column(name = "is_critical")
    @Builder.Default
    private Boolean isCritical = false;
}

