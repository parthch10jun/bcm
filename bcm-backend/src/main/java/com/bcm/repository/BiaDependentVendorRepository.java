package com.bcm.repository;

import com.bcm.entity.BiaDependentVendor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for BIA Dependent Vendors
 */
@Repository
public interface BiaDependentVendorRepository extends JpaRepository<BiaDependentVendor, Long> {

    /**
     * Find all vendor dependencies for a specific BIA
     */
    @Query("SELECT d FROM BiaDependentVendor d WHERE d.biaRecord.id = :biaId AND d.isDeleted = false")
    List<BiaDependentVendor> findByBiaId(@Param("biaId") Long biaId);

    /**
     * Find all BIAs that depend on a specific vendor
     */
    @Query("SELECT d FROM BiaDependentVendor d WHERE d.vendor.id = :vendorId AND d.isDeleted = false")
    List<BiaDependentVendor> findByVendorId(@Param("vendorId") Long vendorId);

    /**
     * Find required vendor dependencies for a BIA
     */
    @Query("SELECT d FROM BiaDependentVendor d WHERE d.biaRecord.id = :biaId AND d.dependencyType = 'REQUIRED' AND d.isDeleted = false")
    List<BiaDependentVendor> findRequiredByBiaId(@Param("biaId") Long biaId);

    /**
     * Count vendor dependencies for a BIA
     */
    @Query("SELECT COUNT(d) FROM BiaDependentVendor d WHERE d.biaRecord.id = :biaId AND d.isDeleted = false")
    Long countByBiaId(@Param("biaId") Long biaId);
}

