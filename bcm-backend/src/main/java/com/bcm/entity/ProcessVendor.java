package com.bcm.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Junction table linking Processes to Vendors
 * Represents the many-to-many relationship between processes and their vendor dependencies
 */
@Entity
@Table(name = "process_vendors", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"process_id", "vendor_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProcessVendor extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "process_id", nullable = false)
    private com.bcm.entity.Process process;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "vendor_id", nullable = false)
    private Vendor vendor;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;
}

