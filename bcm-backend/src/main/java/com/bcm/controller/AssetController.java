package com.bcm.controller;

import com.bcm.dto.AssetDTO;
import com.bcm.entity.AssetCategory;
import com.bcm.entity.AssetType;
import com.bcm.repository.AssetCategoryRepository;
import com.bcm.repository.AssetTypeRepository;
import com.bcm.service.AssetService;
import com.bcm.service.AssetBulkUploadService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.util.List;

/**
 * REST Controller for Asset Library
 * 
 * Provides endpoints for:
 * - Asset CRUD operations
 * - Asset types and categories (for filters)
 * - Assets with inherited criticality from processes
 */
@RestController
@RequestMapping("/api/assets")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class AssetController {

    private final AssetService assetService;
    private final AssetTypeRepository assetTypeRepository;
    private final AssetCategoryRepository assetCategoryRepository;
    private final AssetBulkUploadService assetBulkUploadService;

    /**
     * Get all assets with inherited criticality
     * 
     * This is the main endpoint for the Asset Library.
     * Each asset includes:
     * - Basic asset information
     * - Inherited criticality from linked processes
     * - Process count (how many processes depend on this asset)
     * - Dependency count (how many other assets this depends on)
     * - Dependent count (how many other assets depend on this)
     */
    @GetMapping
    public ResponseEntity<List<AssetDTO>> getAllAssets() {
        log.info("GET /api/assets - Fetching all assets");
        List<AssetDTO> assets = assetService.getAllAssets();
        return ResponseEntity.ok(assets);
    }

    /**
     * Get asset by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<AssetDTO> getAssetById(@PathVariable Long id) {
        log.info("GET /api/assets/{} - Fetching asset", id);
        AssetDTO asset = assetService.getAssetById(id);
        return ResponseEntity.ok(asset);
    }

    /**
     * Create a new asset
     */
    @PostMapping
    public ResponseEntity<AssetDTO> createAsset(@RequestBody AssetDTO assetDTO) {
        log.info("POST /api/assets - Creating new asset: {}", assetDTO.getAssetName());
        AssetDTO createdAsset = assetService.createAsset(assetDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdAsset);
    }

    /**
     * Update an existing asset
     */
    @PutMapping("/{id}")
    public ResponseEntity<AssetDTO> updateAsset(@PathVariable Long id, @RequestBody AssetDTO assetDTO) {
        log.info("PUT /api/assets/{} - Updating asset", id);
        AssetDTO updatedAsset = assetService.updateAsset(id, assetDTO);
        return ResponseEntity.ok(updatedAsset);
    }

    /**
     * Delete an asset (soft delete)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAsset(@PathVariable Long id) {
        log.info("DELETE /api/assets/{} - Deleting asset", id);
        assetService.deleteAsset(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Get all asset types (for filter dropdown)
     */
    @GetMapping("/types")
    public ResponseEntity<List<AssetType>> getAllAssetTypes() {
        log.info("GET /api/assets/types - Fetching all asset types");
        List<AssetType> types = assetTypeRepository.findByIsDeletedFalse();
        return ResponseEntity.ok(types);
    }

    /**
     * Get all asset categories (for filter dropdown)
     */
    @GetMapping("/categories")
    public ResponseEntity<List<AssetCategory>> getAllAssetCategories() {
        log.info("GET /api/assets/categories - Fetching all asset categories");
        List<AssetCategory> categories = assetCategoryRepository.findByIsDeletedFalse();
        return ResponseEntity.ok(categories);
    }

    /**
     * Get categories by asset type (for cascading filter)
     */
    @GetMapping("/types/{typeId}/categories")
    public ResponseEntity<List<AssetCategory>> getCategoriesByType(@PathVariable Long typeId) {
        log.info("GET /api/assets/types/{}/categories - Fetching categories for type", typeId);
        List<AssetCategory> categories = assetCategoryRepository.findByAssetTypeId(typeId);
        return ResponseEntity.ok(categories);
    }

    /**
     * Download CSV template for bulk asset upload
     */
    @GetMapping("/bulk-upload/template")
    public ResponseEntity<byte[]> downloadTemplate() {
        log.info("GET /api/assets/bulk-upload/template - Downloading CSV template");
        try {
            ByteArrayOutputStream outputStream = assetBulkUploadService.generateTemplate();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType("text/csv"));
            headers.setContentDispositionFormData("attachment", "asset_bulk_upload_template.csv");

            return new ResponseEntity<>(outputStream.toByteArray(), headers, HttpStatus.OK);
        } catch (Exception e) {
            log.error("Error generating CSV template", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Process bulk upload CSV file
     */
    @PostMapping("/bulk-upload")
    public ResponseEntity<AssetBulkUploadService.BulkUploadResult> processBulkUpload(
            @RequestParam("file") MultipartFile file) {
        log.info("POST /api/assets/bulk-upload - Processing bulk upload file: {}", file.getOriginalFilename());

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        try {
            AssetBulkUploadService.BulkUploadResult result = assetBulkUploadService.processBulkUpload(file);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Error processing bulk upload", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}

