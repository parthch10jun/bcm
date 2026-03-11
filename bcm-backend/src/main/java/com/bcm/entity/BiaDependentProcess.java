package com.bcm.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * BIA Dependent Process Entity
 * 
 * Junction table linking BIAs to other Processes.
 * This is used for:
 * 1. Roll-ups: A Department BIA depends on multiple Process BIAs
 * 2. Process dependencies: Process A depends on Process B
 * 
 * Enables hierarchical BIA aggregation and process dependency mapping.
 */
@Entity
@Table(name = "bia_dependent_processes",
    indexes = {
        @Index(name = "idx_bia_dep_proc_bia", columnList = "bia_id"),
        @Index(name = "idx_bia_dep_proc_process", columnList = "process_id")
    },
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_bia_process", columnNames = {"bia_id", "process_id"})
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BiaDependentProcess extends BaseEntity {

    /**
     * Link to the BIA record
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bia_id", nullable = false)
    private BiaRecord biaRecord;

    /**
     * Link to the dependent Process
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "process_id", nullable = false)
    private Process process;

    /**
     * Type of dependency
     * Values: REQUIRED, IMPORTANT, OPTIONAL
     */
    @Column(name = "dependency_type", length = 50)
    @Builder.Default
    private String dependencyType = "REQUIRED";

    /**
     * Additional notes about this process dependency
     */
    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    /**
     * Helper method to check if this is a required dependency
     */
    public boolean isRequired() {
        return "REQUIRED".equalsIgnoreCase(dependencyType);
    }

    /**
     * Helper method to check if this is an important dependency
     */
    public boolean isImportant() {
        return "IMPORTANT".equalsIgnoreCase(dependencyType);
    }

    /**
     * Helper method to check if this is an optional dependency
     */
    public boolean isOptional() {
        return "OPTIONAL".equalsIgnoreCase(dependencyType);
    }

    /**
     * Helper method to check if the dependent process has a BIA
     */
    public boolean hasDependentProcessBia() {
        return process != null && process.getBiaRecords() != null && !process.getBiaRecords().isEmpty();
    }

    /**
     * Helper method to get the dependent process's RTO (if it has a BIA)
     */
    public Integer getDependentProcessRto() {
        if (!hasDependentProcessBia()) {
            return null;
        }
        // Get the official or most recent BIA
        return process.getBiaRecords().stream()
            .filter(bia -> bia.getIsOfficial() != null && bia.getIsOfficial())
            .findFirst()
            .map(BiaRecord::getEffectiveRto)
            .orElse(null);
    }
}

