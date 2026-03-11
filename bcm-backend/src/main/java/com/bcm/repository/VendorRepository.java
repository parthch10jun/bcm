package com.bcm.repository;

import com.bcm.entity.Vendor;
import com.bcm.enums.ServiceType;
import com.bcm.enums.VendorStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for Vendor entity
 */
@Repository
public interface VendorRepository extends JpaRepository<Vendor, Long> {
    
    List<Vendor> findByIsDeletedFalse();
    
    List<Vendor> findByStatusAndIsDeletedFalse(VendorStatus status);
    
    List<Vendor> findByServiceTypeAndIsDeletedFalse(ServiceType serviceType);
    
    List<Vendor> findByStatusAndServiceTypeAndIsDeletedFalse(VendorStatus status, ServiceType serviceType);

    List<Vendor> findByVendorNameContainingIgnoreCaseAndIsDeletedFalse(String vendorName);

    /**
     * Check if vendor exists by name (case-insensitive)
     */
    boolean existsByVendorNameIgnoreCaseAndIsDeletedFalse(String vendorName);
}

