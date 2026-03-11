package com.bcm.controller;

import com.bcm.dto.VendorDTO;
import com.bcm.enums.ServiceType;
import com.bcm.enums.VendorStatus;
import com.bcm.service.VendorService;
import com.bcm.service.VendorBulkUploadService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.util.List;

/**
 * REST Controller for Vendor management
 */
@RestController
@RequestMapping("/api/vendors")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class VendorController {

    private final VendorService vendorService;

    @Autowired
    private VendorBulkUploadService vendorBulkUploadService;

    /**
     * Get all vendors
     */
    @GetMapping
    public ResponseEntity<List<VendorDTO>> getAllVendors(
            @RequestParam(required = false) VendorStatus status,
            @RequestParam(required = false) ServiceType serviceType,
            @RequestParam(required = false) String search) {
        
        log.info("GET /api/vendors - Fetching vendors with filters - status: {}, serviceType: {}, search: {}", 
                status, serviceType, search);
        
        List<VendorDTO> vendors;
        
        if (search != null && !search.trim().isEmpty()) {
            vendors = vendorService.searchVendorsByName(search);
        } else if (status != null && serviceType != null) {
            // Both filters applied - need to implement this in service if needed
            vendors = vendorService.getAllVendors().stream()
                    .filter(v -> v.getStatus() == status && v.getServiceType() == serviceType)
                    .toList();
        } else if (status != null) {
            vendors = vendorService.getVendorsByStatus(status);
        } else if (serviceType != null) {
            vendors = vendorService.getVendorsByServiceType(serviceType);
        } else {
            vendors = vendorService.getAllVendors();
        }
        
        return ResponseEntity.ok(vendors);
    }

    /**
     * Get vendor by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<VendorDTO> getVendorById(@PathVariable Long id) {
        log.info("GET /api/vendors/{} - Fetching vendor", id);
        VendorDTO vendor = vendorService.getVendorById(id);
        return ResponseEntity.ok(vendor);
    }

    /**
     * Create a new vendor
     */
    @PostMapping
    public ResponseEntity<VendorDTO> createVendor(@Valid @RequestBody VendorDTO vendorDTO) {
        log.info("POST /api/vendors - Creating new vendor: {}", vendorDTO.getVendorName());
        VendorDTO createdVendor = vendorService.createVendor(vendorDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdVendor);
    }

    /**
     * Update an existing vendor
     */
    @PutMapping("/{id}")
    public ResponseEntity<VendorDTO> updateVendor(
            @PathVariable Long id,
            @Valid @RequestBody VendorDTO vendorDTO) {
        log.info("PUT /api/vendors/{} - Updating vendor", id);
        VendorDTO updatedVendor = vendorService.updateVendor(id, vendorDTO);
        return ResponseEntity.ok(updatedVendor);
    }

    /**
     * Delete a vendor (soft delete)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVendor(@PathVariable Long id) {
        log.info("DELETE /api/vendors/{} - Soft deleting vendor", id);
        vendorService.deleteVendor(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Download CSV template for bulk upload
     */
    @GetMapping("/bulk-upload/template")
    public ResponseEntity<byte[]> downloadTemplate() {
        log.info("GET /api/vendors/bulk-upload/template - Generating CSV template");

        try {
            ByteArrayOutputStream outputStream = vendorBulkUploadService.generateTemplate();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType("text/csv"));
            headers.setContentDispositionFormData("attachment", "vendor_bulk_upload_template.csv");

            return new ResponseEntity<>(outputStream.toByteArray(), headers, HttpStatus.OK);
        } catch (Exception e) {
            log.error("Error generating vendor bulk upload template", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Process bulk upload CSV file
     */
    @PostMapping("/bulk-upload")
    public ResponseEntity<VendorBulkUploadService.BulkUploadResult> processBulkUpload(
            @RequestParam("file") MultipartFile file) {

        log.info("POST /api/vendors/bulk-upload - Processing bulk upload file: {}", file.getOriginalFilename());

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        try {
            VendorBulkUploadService.BulkUploadResult result = vendorBulkUploadService.processBulkUpload(file);
            log.info("Bulk upload completed - Success: {}, Errors: {}", result.getSuccessCount(), result.getErrorCount());
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Error processing vendor bulk upload", e);
            return ResponseEntity.internalServerError().build();
        }
    }
}

