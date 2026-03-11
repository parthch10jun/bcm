package com.bcm.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Junction table linking Assets to Vendors
 * Represents the many-to-many relationship between assets and their vendor support
 */
@Entity
@Table(name = "asset_vendors", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"asset_id", "vendor_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AssetVendor extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "asset_id", nullable = false)
    private Asset asset;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "vendor_id", nullable = false)
    private Vendor vendor;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;
}

