package com.bcm.repository;

import com.bcm.entity.Asset;
import com.bcm.enums.AssetStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for Asset entity
 */
@Repository
public interface AssetRepository extends JpaRepository<Asset, Long> {

    /**
     * Find all non-deleted assets
     */
    List<Asset> findByIsDeletedFalse();

    /**
     * Find assets by status
     */
    List<Asset> findByStatusAndIsDeletedFalse(AssetStatus status);

    /**
     * Find assets by type
     */
    @Query("SELECT a FROM Asset a WHERE a.assetType.id = :typeId AND a.isDeleted = false")
    List<Asset> findByAssetTypeId(Long typeId);

    /**
     * Find assets by category
     */
    @Query("SELECT a FROM Asset a WHERE a.category.id = :categoryId AND a.isDeleted = false")
    List<Asset> findByCategoryId(Long categoryId);

    /**
     * Find assets by location
     * TODO: Uncomment when Location entity is created
     */
    // @Query("SELECT a FROM Asset a WHERE a.location.id = :locationId AND a.isDeleted = false")
    // List<Asset> findByLocationId(Long locationId);

    /**
     * Search assets by name
     */
    @Query("SELECT a FROM Asset a WHERE LOWER(a.assetName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) AND a.isDeleted = false")
    List<Asset> searchByName(String searchTerm);

    /**
     * Check if asset exists by name (case-insensitive)
     */
    @Query("SELECT CASE WHEN COUNT(a) > 0 THEN true ELSE false END FROM Asset a WHERE LOWER(a.assetName) = LOWER(:assetName) AND a.isDeleted = false")
    boolean existsByAssetNameIgnoreCase(String assetName);

    /**
     * Check if asset exists by serial number
     */
    @Query("SELECT CASE WHEN COUNT(a) > 0 THEN true ELSE false END FROM Asset a WHERE a.serialNumber = :serialNumber AND a.isDeleted = false")
    boolean existsBySerialNumber(String serialNumber);
}

