package com.bcm.entity;

import com.bcm.enums.DependencyType;
import jakarta.persistence.*;
import lombok.*;

/**
 * AssetDependency Junction Entity - Links Assets to other Assets
 * 
 * This is a self-referencing many-to-many relationship.
 * It handles asset-to-asset dependencies.
 * 
 * Example:
 * - "SAP Finance Server" depends on "Oracle Database Server"
 * - "SAP ERP" depends on "SAP Finance Server"
 * 
 * This allows you to build dependency chains and understand
 * cascading impacts when an asset fails.
 */
@Entity
@Table(name = "asset_dependencies",
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_asset_dependency", columnNames = {"asset_id", "depends_on_asset_id"})
    },
    indexes = {
        @Index(name = "idx_asset_dependencies_asset", columnList = "asset_id"),
        @Index(name = "idx_asset_dependencies_depends_on", columnList = "depends_on_asset_id")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssetDependency extends BaseEntity {

    /**
     * The asset that HAS the dependency
     * (e.g., "SAP Finance Server")
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "asset_id", nullable = false)
    private Asset asset;

    /**
     * The asset that is DEPENDED ON
     * (e.g., "Oracle Database Server")
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "depends_on_asset_id", nullable = false)
    private Asset dependsOnAsset;

    @Enumerated(EnumType.STRING)
    @Column(name = "dependency_type", length = 50)
    @Builder.Default
    private DependencyType dependencyType = DependencyType.REQUIRED;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;
}

