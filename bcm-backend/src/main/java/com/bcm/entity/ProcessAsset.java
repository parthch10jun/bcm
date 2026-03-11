package com.bcm.entity;

import com.bcm.enums.DependencyType;
import jakarta.persistence.*;
import lombok.*;

/**
 * ProcessAsset Junction Entity - Links Processes to Assets
 * 
 * This is THE MOST IMPORTANT table for BCM asset management!
 * 
 * This table is the SOURCE of asset criticality inheritance.
 * When a process depends on an asset, the asset inherits the
 * process's criticality.
 * 
 * Example:
 * - "Payroll Process" (Criticality: High) uses "SAP Finance Server"
 * - Therefore, "SAP Finance Server" inherits criticality: High
 */
@Entity
@Table(name = "process_assets", 
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_process_asset", columnNames = {"process_id", "asset_id"})
    },
    indexes = {
        @Index(name = "idx_process_assets_process", columnList = "process_id"),
        @Index(name = "idx_process_assets_asset", columnList = "asset_id")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProcessAsset extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "process_id", nullable = false)
    private Process process;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "asset_id", nullable = false)
    private Asset asset;

    @Enumerated(EnumType.STRING)
    @Column(name = "dependency_type", length = 50)
    @Builder.Default
    private DependencyType dependencyType = DependencyType.REQUIRED;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;
}

