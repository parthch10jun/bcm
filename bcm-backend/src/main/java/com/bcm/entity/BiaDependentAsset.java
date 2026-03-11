package com.bcm.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * BIA Dependent Asset Entity
 * 
 * Junction table linking BIAs to Assets (Buildings, Equipment, Technology).
 * This is part of the BETH3V dependency mapping.
 * 
 * Tracks which assets are required for a process/service to function,
 * and the criticality of that dependency.
 */
@Entity
@Table(name = "bia_dependent_assets",
    indexes = {
        @Index(name = "idx_bia_dep_assets_bia", columnList = "bia_id"),
        @Index(name = "idx_bia_dep_assets_asset", columnList = "asset_id")
    },
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_bia_asset", columnNames = {"bia_id", "asset_id"})
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BiaDependentAsset extends BaseEntity {

    /**
     * Link to the BIA record
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bia_id", nullable = false)
    private BiaRecord biaRecord;

    /**
     * Link to the Asset
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "asset_id", nullable = false)
    private Asset asset;

    /**
     * Type of dependency
     * Values: REQUIRED, IMPORTANT, OPTIONAL
     */
    @Column(name = "dependency_type", length = 50)
    @Builder.Default
    private String dependencyType = "REQUIRED";

    /**
     * Additional notes about this dependency
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
}

