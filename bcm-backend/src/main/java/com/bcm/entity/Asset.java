package com.bcm.entity;

import com.bcm.enums.AssetStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * Asset Entity - Represents a business asset
 * 
 * IMPORTANT: Asset criticality is NOT stored here!
 * It is calculated dynamically based on the criticality of processes
 * that depend on this asset (via ProcessAsset junction table).
 * 
 * An asset is only critical if it supports a critical process.
 */
@Entity
@Table(name = "assets", indexes = {
    @Index(name = "idx_assets_type", columnList = "asset_type_id"),
    @Index(name = "idx_assets_category", columnList = "category_id"),
    @Index(name = "idx_assets_location", columnList = "location_id"),
    @Index(name = "idx_assets_status", columnList = "status"),
    @Index(name = "idx_assets_name", columnList = "asset_name")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Asset extends BaseEntity {

    @Column(name = "asset_name", nullable = false, length = 255)
    private String assetName;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 50)
    @Builder.Default
    private AssetStatus status = AssetStatus.ACTIVE;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "asset_type_id")
    private AssetType assetType;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id")
    private AssetCategory category;

    // TODO: Uncomment when Location entity is created
    // @ManyToOne(fetch = FetchType.EAGER)
    // @JoinColumn(name = "location_id")
    // private Location location;

    @Column(name = "vendor", length = 255)
    private String vendor;

    @Column(name = "model", length = 255)
    private String model;

    @Column(name = "serial_number", length = 255)
    private String serialNumber;

    @Column(name = "purchase_date")
    private LocalDate purchaseDate;

    @Column(name = "warranty_expiry")
    private LocalDate warrantyExpiry;

    @Column(name = "owner", length = 255)
    private String owner;

    @Column(name = "technical_contact", length = 255)
    private String technicalContact;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    /**
     * Recovery Time Objective (RTO) in hours
     * Maximum acceptable time to restore asset after disruption
     * Used for dependency gap analysis in BIA
     */
    @Column(name = "rto_hours")
    private Integer rtoHours;

    /**
     * Recovery Point Objective (RPO) in hours
     * Maximum acceptable data loss window
     * Used for backup and recovery planning
     */
    @Column(name = "rpo_hours")
    private Integer rpoHours;

    /**
     * Asset-level criticality (independent of process inheritance)
     * Values: CRITICAL, HIGH, MEDIUM, LOW
     * Used for asset-specific recovery prioritization
     */
    @Column(name = "asset_criticality", length = 20)
    private String assetCriticality;

    /**
     * Recovery Time Capability (RTO-C) in hours
     * The asset's recovery time capability - how quickly it can be restored
     * Critical for BIA gap analysis
     *
     * Examples:
     * - 1 = Can be recovered in 1 hour
     * - 4 = Can be recovered in 4 hours
     * - 24 = Can be recovered in 24 hours
     */
    @Column(name = "recovery_time_capability")
    private Integer recoveryTimeCapability;

    /**
     * Process-Asset relationships
     * This is the SOURCE of criticality inheritance!
     */
    @OneToMany(mappedBy = "asset", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ProcessAsset> processAssets = new ArrayList<>();

    /**
     * Assets that THIS asset depends on
     */
    @OneToMany(mappedBy = "asset", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<AssetDependency> dependencies = new ArrayList<>();

    /**
     * Assets that depend on THIS asset
     */
    @OneToMany(mappedBy = "dependsOnAsset", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<AssetDependency> dependents = new ArrayList<>();
}

