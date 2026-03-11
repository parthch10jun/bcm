package com.bcm.repository;

import com.bcm.entity.BiaDependentAsset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for BIA Dependent Assets
 */
@Repository
public interface BiaDependentAssetRepository extends JpaRepository<BiaDependentAsset, Long> {

    /**
     * Find all asset dependencies for a specific BIA
     */
    @Query("SELECT d FROM BiaDependentAsset d WHERE d.biaRecord.id = :biaId AND d.isDeleted = false")
    List<BiaDependentAsset> findByBiaId(@Param("biaId") Long biaId);

    /**
     * Find all BIAs that depend on a specific asset
     */
    @Query("SELECT d FROM BiaDependentAsset d WHERE d.asset.id = :assetId AND d.isDeleted = false")
    List<BiaDependentAsset> findByAssetId(@Param("assetId") Long assetId);

    /**
     * Find required asset dependencies for a BIA
     */
    @Query("SELECT d FROM BiaDependentAsset d WHERE d.biaRecord.id = :biaId AND d.dependencyType = 'REQUIRED' AND d.isDeleted = false")
    List<BiaDependentAsset> findRequiredByBiaId(@Param("biaId") Long biaId);

    /**
     * Count asset dependencies for a BIA
     */
    @Query("SELECT COUNT(d) FROM BiaDependentAsset d WHERE d.biaRecord.id = :biaId AND d.isDeleted = false")
    Long countByBiaId(@Param("biaId") Long biaId);
}

