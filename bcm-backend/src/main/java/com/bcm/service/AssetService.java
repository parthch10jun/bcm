package com.bcm.service;

import com.bcm.dto.AssetDTO;
import com.bcm.entity.*;
import com.bcm.enums.CriticalityTier;
import com.bcm.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for Asset management
 * 
 * KEY FEATURE: Criticality Inheritance
 * This service calculates asset criticality dynamically based on
 * the criticality of processes that depend on the asset.
 * 
 * The highest criticality wins!
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AssetService {

    private final AssetRepository assetRepository;
    private final AssetTypeRepository assetTypeRepository;
    private final AssetCategoryRepository assetCategoryRepository;
    private final ProcessAssetRepository processAssetRepository;
    private final AssetDependencyRepository assetDependencyRepository;

    /**
     * Get all assets with inherited criticality
     */
    @Transactional(readOnly = true)
    public List<AssetDTO> getAllAssets() {
        log.info("Fetching all assets with inherited criticality");
        List<Asset> assets = assetRepository.findByIsDeletedFalse();
        return assets.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get asset by ID with inherited criticality
     */
    @Transactional(readOnly = true)
    public AssetDTO getAssetById(Long id) {
        log.info("Fetching asset with ID: {}", id);
        Asset asset = assetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Asset not found with id: " + id));
        
        if (asset.getIsDeleted()) {
            throw new RuntimeException("Asset has been deleted");
        }
        
        return convertToDTO(asset);
    }

    /**
     * Create a new asset
     */
    @Transactional
    public AssetDTO createAsset(AssetDTO assetDTO) {
        log.info("Creating new asset: {}", assetDTO.getAssetName());
        
        Asset asset = new Asset();
        asset.setAssetName(assetDTO.getAssetName());
        asset.setDescription(assetDTO.getDescription());
        asset.setStatus(assetDTO.getStatus());
        asset.setVendor(assetDTO.getVendor());
        asset.setModel(assetDTO.getModel());
        asset.setSerialNumber(assetDTO.getSerialNumber());
        asset.setPurchaseDate(assetDTO.getPurchaseDate());
        asset.setWarrantyExpiry(assetDTO.getWarrantyExpiry());
        asset.setOwner(assetDTO.getOwner());
        asset.setTechnicalContact(assetDTO.getTechnicalContact());
        asset.setNotes(assetDTO.getNotes());
        // Recovery objectives
        asset.setRtoHours(assetDTO.getRtoHours());
        asset.setRpoHours(assetDTO.getRpoHours());
        asset.setAssetCriticality(assetDTO.getAssetCriticality());

        // Set relationships
        if (assetDTO.getAssetTypeId() != null) {
            AssetType assetType = assetTypeRepository.findById(assetDTO.getAssetTypeId())
                    .orElseThrow(() -> new RuntimeException("Asset type not found"));
            asset.setAssetType(assetType);
        }
        
        if (assetDTO.getCategoryId() != null) {
            AssetCategory category = assetCategoryRepository.findById(assetDTO.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Asset category not found"));
            asset.setCategory(category);
        }
        
        // Note: Location will be set via LocationRepository when implemented
        
        Asset savedAsset = assetRepository.save(asset);
        log.info("Asset created successfully with ID: {}", savedAsset.getId());
        
        return convertToDTO(savedAsset);
    }

    /**
     * Update an existing asset
     */
    @Transactional
    public AssetDTO updateAsset(Long id, AssetDTO assetDTO) {
        log.info("Updating asset with ID: {}", id);
        
        Asset asset = assetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Asset not found with id: " + id));
        
        if (asset.getIsDeleted()) {
            throw new RuntimeException("Cannot update deleted asset");
        }
        
        asset.setAssetName(assetDTO.getAssetName());
        asset.setDescription(assetDTO.getDescription());
        asset.setStatus(assetDTO.getStatus());
        asset.setVendor(assetDTO.getVendor());
        asset.setModel(assetDTO.getModel());
        asset.setSerialNumber(assetDTO.getSerialNumber());
        asset.setPurchaseDate(assetDTO.getPurchaseDate());
        asset.setWarrantyExpiry(assetDTO.getWarrantyExpiry());
        asset.setOwner(assetDTO.getOwner());
        asset.setTechnicalContact(assetDTO.getTechnicalContact());
        asset.setNotes(assetDTO.getNotes());
        // Recovery objectives
        asset.setRtoHours(assetDTO.getRtoHours());
        asset.setRpoHours(assetDTO.getRpoHours());
        asset.setAssetCriticality(assetDTO.getAssetCriticality());

        // Update relationships
        if (assetDTO.getAssetTypeId() != null) {
            AssetType assetType = assetTypeRepository.findById(assetDTO.getAssetTypeId())
                    .orElseThrow(() -> new RuntimeException("Asset type not found"));
            asset.setAssetType(assetType);
        }
        
        if (assetDTO.getCategoryId() != null) {
            AssetCategory category = assetCategoryRepository.findById(assetDTO.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Asset category not found"));
            asset.setCategory(category);
        }
        
        Asset updatedAsset = assetRepository.save(asset);
        log.info("Asset updated successfully");
        
        return convertToDTO(updatedAsset);
    }

    /**
     * Delete an asset (soft delete)
     */
    @Transactional
    public void deleteAsset(Long id) {
        log.info("Deleting asset with ID: {}", id);
        
        Asset asset = assetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Asset not found with id: " + id));
        
        asset.setIsDeleted(true);
        assetRepository.save(asset);
        
        log.info("Asset soft-deleted successfully");
    }

    /**
     * Calculate inherited criticality for an asset
     * 
     * This is THE CORE LOGIC for BCM asset management!
     * 
     * Algorithm:
     * 1. Find all processes that depend on this asset (via ProcessAsset table)
     * 2. For each process, get its criticality from its BIA records
     * 3. Return the HIGHEST criticality found
     * 
     * If no processes depend on this asset, it defaults to TIER_5 (Non-Critical)
     */
    private CriticalityTier calculateInheritedCriticality(Asset asset) {
        // Get all process-asset links for this asset
        List<ProcessAsset> processAssets = processAssetRepository.findByAssetId(asset.getId());
        
        if (processAssets.isEmpty()) {
            log.debug("Asset {} has no linked processes, defaulting to TIER_5", asset.getAssetName());
            return CriticalityTier.TIER_5;
        }
        
        // Find the highest criticality among all linked processes
        CriticalityTier highestCriticality = CriticalityTier.TIER_5;
        
        for (ProcessAsset processAsset : processAssets) {
            com.bcm.entity.Process process = processAsset.getProcess();

            // Get the process's criticality from its BIA records
            CriticalityTier processCriticality = getProcessCriticality(process);
            
            // Keep the highest criticality
            if (processCriticality.getMinScore() > highestCriticality.getMinScore()) {
                highestCriticality = processCriticality;
            }
        }
        
        log.debug("Asset {} inherited criticality: {} from {} processes", 
                asset.getAssetName(), highestCriticality, processAssets.size());
        
        return highestCriticality;
    }

    /**
     * Get process criticality from its BIA records
     * Returns the highest criticality from all BIA records for this process
     */
    private CriticalityTier getProcessCriticality(com.bcm.entity.Process process) {
        // If process has isCritical flag set, return TIER_1
        if (Boolean.TRUE.equals(process.getIsCritical())) {
            return CriticalityTier.TIER_1;
        }

        // TODO: When BIA records have criticality scores, calculate from them
        // For now, use the isCritical flag as a simple indicator

        // Default to TIER_5 if not marked as critical
        return CriticalityTier.TIER_5;
    }

    /**
     * Convert Asset entity to DTO with all computed fields
     */
    private AssetDTO convertToDTO(Asset asset) {
        // Calculate inherited criticality
        CriticalityTier inheritedCriticality = calculateInheritedCriticality(asset);
        
        // Count relationships
        Long processCount = processAssetRepository.countByAssetId(asset.getId());
        Long dependencyCount = assetDependencyRepository.countDependenciesByAssetId(asset.getId());
        Long dependentCount = (long) assetDependencyRepository.findDependentsByAssetId(asset.getId()).size();
        
        return AssetDTO.builder()
                .id(asset.getId())
                .assetName(asset.getAssetName())
                .description(asset.getDescription())
                .status(asset.getStatus())
                .assetTypeId(asset.getAssetType() != null ? asset.getAssetType().getId() : null)
                .assetTypeName(asset.getAssetType() != null ? asset.getAssetType().getTypeName() : null)
                .categoryId(asset.getCategory() != null ? asset.getCategory().getId() : null)
                .categoryName(asset.getCategory() != null ? asset.getCategory().getCategoryName() : null)
                // TODO: Uncomment when Location entity is created
                // .locationId(asset.getLocation() != null ? asset.getLocation().getId() : null)
                // .locationName(asset.getLocation() != null ? asset.getLocation().getName() : null)
                .vendor(asset.getVendor())
                .model(asset.getModel())
                .serialNumber(asset.getSerialNumber())
                .purchaseDate(asset.getPurchaseDate())
                .warrantyExpiry(asset.getWarrantyExpiry())
                .owner(asset.getOwner())
                .technicalContact(asset.getTechnicalContact())
                .notes(asset.getNotes())
                // Recovery objectives
                .rtoHours(asset.getRtoHours())
                .rpoHours(asset.getRpoHours())
                .assetCriticality(asset.getAssetCriticality())
                .createdAt(asset.getCreatedAt())
                .updatedAt(asset.getUpdatedAt())
                .createdBy(asset.getCreatedBy())
                .updatedBy(asset.getUpdatedBy())
                // Computed fields
                .inheritedCriticality(inheritedCriticality)
                .criticalityScore(inheritedCriticality.getMinScore())
                .processCount(processCount)
                .dependencyCount(dependencyCount)
                .dependentCount(dependentCount)
                .isCritical(inheritedCriticality == CriticalityTier.TIER_1 || 
                           inheritedCriticality == CriticalityTier.TIER_2)
                .build();
    }
}

