package com.bcm.controller;

import com.bcm.dto.BIAConfigDTO;
import com.bcm.dto.OrganizationSettingsDTO;
import com.bcm.service.SystemConfigService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Map;
import java.util.UUID;

/**
 * REST Controller for System Configuration
 * Handles organization settings, BIA configuration, and file uploads
 * ADMIN role required for all endpoints
 */
@RestController
@RequestMapping("/api/system-config")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class SystemConfigController {

    private final SystemConfigService systemConfigService;

    // Directory for storing uploaded files (logos, etc.)
    private static final String UPLOAD_DIR = "uploads/";

    /**
     * Get organization settings
     * GET /api/system-config/organization
     */
    @GetMapping("/organization")
    public ResponseEntity<OrganizationSettingsDTO> getOrganizationSettings() {
        log.info("GET /api/system-config/organization - Fetching organization settings");
        OrganizationSettingsDTO settings = systemConfigService.getOrganizationSettings();
        return ResponseEntity.ok(settings);
    }

    /**
     * Update organization settings
     * PUT /api/system-config/organization
     */
    @PutMapping("/organization")
    public ResponseEntity<OrganizationSettingsDTO> updateOrganizationSettings(
            @RequestBody OrganizationSettingsDTO settings) {
        log.info("PUT /api/system-config/organization - Updating organization settings");
        OrganizationSettingsDTO updated = systemConfigService.updateOrganizationSettings(settings);
        return ResponseEntity.ok(updated);
    }

    /**
     * Upload organization logo
     * POST /api/system-config/organization/logo
     */
    @PostMapping("/organization/logo")
    public ResponseEntity<Map<String, String>> uploadLogo(@RequestParam("file") MultipartFile file) {
        log.info("POST /api/system-config/organization/logo - Uploading logo");

        try {
            // Validate file
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "File is empty"));
            }

            // Validate file type
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.badRequest().body(Map.of("error", "File must be an image"));
            }

            // Validate file size (5MB max)
            if (file.getSize() > 5 * 1024 * 1024) {
                return ResponseEntity.badRequest().body(Map.of("error", "File size must be less than 5MB"));
            }

            // Create upload directory if it doesn't exist
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename != null && originalFilename.contains(".")
                    ? originalFilename.substring(originalFilename.lastIndexOf("."))
                    : "";
            String filename = "logo-" + UUID.randomUUID() + extension;

            // Save file
            Path filePath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Return URL
            String logoUrl = "/" + UPLOAD_DIR + filename;
            log.info("Logo uploaded successfully: {}", logoUrl);

            return ResponseEntity.ok(Map.of(
                    "url", logoUrl,
                    "filename", filename,
                    "message", "Logo uploaded successfully"
            ));

        } catch (IOException e) {
            log.error("Error uploading logo", e);
            return ResponseEntity.internalServerError().body(Map.of("error", "Failed to upload logo"));
        }
    }

    /**
     * Get BIA configuration
     * GET /api/system-config/bia-config
     */
    @GetMapping("/bia-config")
    public ResponseEntity<BIAConfigDTO> getBIAConfig() {
        log.info("GET /api/system-config/bia-config - Fetching BIA configuration");
        BIAConfigDTO config = systemConfigService.getBIAConfig();
        return ResponseEntity.ok(config);
    }

    /**
     * Update BIA configuration
     * PUT /api/system-config/bia-config
     */
    @PutMapping("/bia-config")
    public ResponseEntity<BIAConfigDTO> updateBIAConfig(@RequestBody BIAConfigDTO config) {
        log.info("PUT /api/system-config/bia-config - Updating BIA configuration");
        BIAConfigDTO updated = systemConfigService.updateBIAConfig(config);
        return ResponseEntity.ok(updated);
    }

    /**
     * Get all configurations by category
     * GET /api/system-config/category/{category}
     */
    @GetMapping("/category/{category}")
    public ResponseEntity<Map<String, String>> getConfigsByCategory(@PathVariable String category) {
        log.info("GET /api/system-config/category/{} - Fetching configs by category", category);
        Map<String, String> configs = systemConfigService.getConfigsByCategory(category);
        return ResponseEntity.ok(configs);
    }

    /**
     * Health check endpoint
     * GET /api/system-config/health
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "service", "System Configuration API"
        ));
    }
}

