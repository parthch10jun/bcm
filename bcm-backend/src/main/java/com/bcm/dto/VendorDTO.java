package com.bcm.dto;

import com.bcm.enums.ServiceType;
import com.bcm.enums.VendorStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * DTO for Vendor entity
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VendorDTO {
    
    private Long id;
    private String vendorName;
    private VendorStatus status;
    private ServiceType serviceType;
    private String description;
    private String contactName;
    private String contactEmail;
    private String contactPhone;
    private Integer recoveryTimeCapability;
    private LocalDate contractStartDate;
    private LocalDate contractEndDate;
    private String website;
    private String address;
    private String notes;
    
    // Audit fields
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Relationship counts
    private Long processCount;
    private Long assetCount;
}

