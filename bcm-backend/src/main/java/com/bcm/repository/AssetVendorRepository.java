package com.bcm.repository;

import com.bcm.entity.AssetVendor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for AssetVendor junction table
 */
@Repository
public interface AssetVendorRepository extends JpaRepository<AssetVendor, Long> {
    
    List<AssetVendor> findByAssetIdAndIsDeletedFalse(Long assetId);
    
    List<AssetVendor> findByVendorIdAndIsDeletedFalse(Long vendorId);
    
    Optional<AssetVendor> findByAssetIdAndVendorIdAndIsDeletedFalse(Long assetId, Long vendorId);
    
    Long countByVendorIdAndIsDeletedFalse(Long vendorId);
}

