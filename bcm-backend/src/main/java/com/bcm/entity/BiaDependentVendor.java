package com.bcm.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * BIA Dependent Vendor Entity
 * 
 * Junction table linking BIAs to Vendors (3rd Parties).
 * This is part of the BETH3V dependency mapping.
 * 
 * Tracks which external vendors/suppliers are required for a process/service to function,
 * and what services they provide.
 */
@Entity
@Table(name = "bia_dependent_vendors",
    indexes = {
        @Index(name = "idx_bia_dep_vendors_bia", columnList = "bia_id"),
        @Index(name = "idx_bia_dep_vendors_vendor", columnList = "vendor_id")
    },
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_bia_vendor", columnNames = {"bia_id", "vendor_id"})
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BiaDependentVendor extends BaseEntity {

    /**
     * Link to the BIA record
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bia_id", nullable = false)
    private BiaRecord biaRecord;

    /**
     * Link to the Vendor
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "vendor_id", nullable = false)
    private Vendor vendor;

    /**
     * Service provided by this vendor
     * Example: "Cloud Hosting", "Payroll Processing", "Data Backup"
     */
    @Column(name = "service_provided", columnDefinition = "TEXT")
    private String serviceProvided;

    /**
     * Type of dependency
     * Values: REQUIRED, IMPORTANT, OPTIONAL
     */
    @Column(name = "dependency_type", length = 50)
    @Builder.Default
    private String dependencyType = "REQUIRED";

    /**
     * Additional notes about this vendor dependency
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
     * Helper method to check if vendor has SLA defined
     */
    public boolean hasVendorSla() {
        return vendor != null && vendor.getRecoveryTimeCapability() != null;
    }

    /**
     * Helper method to get vendor's SLA recovery time
     */
    public Integer getVendorSlaRecoveryTime() {
        return vendor != null ? vendor.getRecoveryTimeCapability() : null;
    }
}

