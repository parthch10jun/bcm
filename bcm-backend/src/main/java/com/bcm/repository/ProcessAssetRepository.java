package com.bcm.repository;

import com.bcm.entity.ProcessAsset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for ProcessAsset junction entity
 * This is critical for criticality inheritance!
 */
@Repository
public interface ProcessAssetRepository extends JpaRepository<ProcessAsset, Long> {

    /**
     * Find all process-asset links for a specific asset
     * Used to calculate inherited criticality
     */
    @Query("SELECT pa FROM ProcessAsset pa WHERE pa.asset.id = :assetId AND pa.isDeleted = false")
    List<ProcessAsset> findByAssetId(Long assetId);

    /**
     * Find all process-asset links for a specific process
     */
    @Query("SELECT pa FROM ProcessAsset pa WHERE pa.process.id = :processId AND pa.isDeleted = false")
    List<ProcessAsset> findByProcessId(Long processId);

    /**
     * Count processes supported by an asset
     */
    @Query("SELECT COUNT(pa) FROM ProcessAsset pa WHERE pa.asset.id = :assetId AND pa.isDeleted = false")
    Long countByAssetId(Long assetId);
}

