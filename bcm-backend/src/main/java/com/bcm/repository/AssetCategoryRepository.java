package com.bcm.repository;

import com.bcm.entity.AssetCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for AssetCategory entity
 */
@Repository
public interface AssetCategoryRepository extends JpaRepository<AssetCategory, Long> {

    /**
     * Find all non-deleted asset categories
     */
    List<AssetCategory> findByIsDeletedFalse();

    /**
     * Find categories by asset type
     */
    @Query("SELECT ac FROM AssetCategory ac WHERE ac.assetType.id = :typeId AND ac.isDeleted = false")
    List<AssetCategory> findByAssetTypeId(Long typeId);

    /**
     * Find category by name
     */
    Optional<AssetCategory> findByCategoryNameAndIsDeletedFalse(String categoryName);

    /**
     * Find category by name (case-insensitive)
     */
    Optional<AssetCategory> findByCategoryNameIgnoreCase(String categoryName);
}

