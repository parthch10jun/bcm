package com.bcm.repository;

import com.bcm.entity.ProcessVendor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for ProcessVendor junction table
 */
@Repository
public interface ProcessVendorRepository extends JpaRepository<ProcessVendor, Long> {
    
    List<ProcessVendor> findByProcessIdAndIsDeletedFalse(Long processId);
    
    List<ProcessVendor> findByVendorIdAndIsDeletedFalse(Long vendorId);
    
    Optional<ProcessVendor> findByProcessIdAndVendorIdAndIsDeletedFalse(Long processId, Long vendorId);
    
    Long countByVendorIdAndIsDeletedFalse(Long vendorId);
}

