package com.bcm.repository;

import com.bcm.entity.AssetType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for AssetType entity
 */
@Repository
public interface AssetTypeRepository extends JpaRepository<AssetType, Long> {

    /**
     * Find all non-deleted asset types
     */
    List<AssetType> findByIsDeletedFalse();

    /**
     * Find asset type by name
     */
    Optional<AssetType> findByTypeNameAndIsDeletedFalse(String typeName);

    /**
     * Find asset type by name (case-insensitive)
     */
    Optional<AssetType> findByTypeNameIgnoreCase(String typeName);
}

