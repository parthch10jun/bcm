package com.bcm.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * AssetCategory Entity - Represents categories within asset types
 * (e.g., Server, Database, Network under Hardware type)
 */
@Entity
@Table(name = "asset_categories", indexes = {
    @Index(name = "idx_asset_categories_type", columnList = "asset_type_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssetCategory extends BaseEntity {

    @Column(name = "category_name", nullable = false, unique = true, length = 100)
    private String categoryName;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "asset_type_id")
    private AssetType assetType;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
}

