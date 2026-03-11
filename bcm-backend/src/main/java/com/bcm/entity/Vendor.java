package com.bcm.entity;

import com.bcm.enums.ServiceType;
import com.bcm.enums.VendorStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Entity representing a Vendor (3rd Party)
 * Central registry of external suppliers, vendors, and partners
 */
@Entity
@Table(name = "vendors")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Vendor extends BaseEntity {

    @Column(name = "vendor_name", nullable = false, length = 255)
    private String vendorName;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 50)
    private VendorStatus status = VendorStatus.ACTIVE;

    @Enumerated(EnumType.STRING)
    @Column(name = "service_type", length = 50)
    private ServiceType serviceType;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "contact_name", length = 255)
    private String contactName;

    @Column(name = "contact_email", length = 255)
    private String contactEmail;

    @Column(name = "contact_phone", length = 50)
    private String contactPhone;

    /**
     * Recovery Time Capability (RTO-C) in hours
     * The vendor's contractual SLA for recovery
     * Critical for BIA gap analysis
     */
    @Column(name = "recovery_time_capability")
    private Integer recoveryTimeCapability;

    @Column(name = "contract_start_date")
    private java.time.LocalDate contractStartDate;

    @Column(name = "contract_end_date")
    private java.time.LocalDate contractEndDate;

    @Column(name = "website", length = 500)
    private String website;

    @Column(name = "address", columnDefinition = "TEXT")
    private String address;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;
}

