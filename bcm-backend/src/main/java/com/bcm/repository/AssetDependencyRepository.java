package com.bcm.repository;

import com.bcm.entity.AssetDependency;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for AssetDependency junction entity
 */
@Repository
public interface AssetDependencyRepository extends JpaRepository<AssetDependency, Long> {

    /**
     * Find all dependencies FOR an asset (what this asset depends on)
     */
    @Query("SELECT ad FROM AssetDependency ad WHERE ad.asset.id = :assetId AND ad.isDeleted = false")
    List<AssetDependency> findDependenciesByAssetId(Long assetId);

    /**
     * Find all dependents OF an asset (what depends on this asset)
     */
    @Query("SELECT ad FROM AssetDependency ad WHERE ad.dependsOnAsset.id = :assetId AND ad.isDeleted = false")
    List<AssetDependency> findDependentsByAssetId(Long assetId);

    /**
     * Count dependencies for an asset
     */
    @Query("SELECT COUNT(ad) FROM AssetDependency ad WHERE ad.asset.id = :assetId AND ad.isDeleted = false")
    Long countDependenciesByAssetId(Long assetId);
}

