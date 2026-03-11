package com.bcm.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * AssetType Entity - Represents types of assets (Hardware, Software, People, etc.)
 */
@Entity
@Table(name = "asset_types")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssetType extends BaseEntity {

    @Column(name = "type_name", nullable = false, unique = true, length = 100)
    private String typeName;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
}

