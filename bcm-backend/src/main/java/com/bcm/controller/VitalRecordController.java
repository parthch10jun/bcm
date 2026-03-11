package com.bcm.controller;

import com.bcm.dto.CreateVitalRecordRequest;
import com.bcm.dto.UpdateVitalRecordRequest;
import com.bcm.dto.VitalRecordDTO;
import com.bcm.enums.VitalRecordStatus;
import com.bcm.service.VitalRecordBulkUploadService;
import com.bcm.service.VitalRecordService;
import jakarta.validation.Valid;
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
 * REST Controller for Vital Records
 */
@RestController
@RequestMapping("/api/vital-records")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
@Slf4j
public class VitalRecordController {

    @Autowired
    private VitalRecordService vitalRecordService;

    @Autowired
    private VitalRecordBulkUploadService bulkUploadService;

    /**
     * Get all vital records
     */
    @GetMapping
    public ResponseEntity<List<VitalRecordDTO>> getAllVitalRecords(
            @RequestParam(required = false) VitalRecordStatus status,
            @RequestParam(required = false) String recordType,
            @RequestParam(required = false) String search) {
        
        log.info("GET /api/vital-records - status: {}, recordType: {}, search: {}", status, recordType, search);

        List<VitalRecordDTO> vitalRecords;

        if (search != null && !search.isEmpty()) {
            vitalRecords = vitalRecordService.searchVitalRecords(search);
        } else if (status != null) {
            vitalRecords = vitalRecordService.getVitalRecordsByStatus(status);
        } else if (recordType != null) {
            vitalRecords = vitalRecordService.getVitalRecordsByType(recordType);
        } else {
            vitalRecords = vitalRecordService.getAllVitalRecords();
        }

        return ResponseEntity.ok(vitalRecords);
    }

    /**
     * Get vital record by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<VitalRecordDTO> getVitalRecordById(@PathVariable Long id) {
        log.info("GET /api/vital-records/{}", id);
        VitalRecordDTO vitalRecord = vitalRecordService.getVitalRecordById(id);
        return ResponseEntity.ok(vitalRecord);
    }

    /**
     * Create a new vital record
     */
    @PostMapping
    public ResponseEntity<VitalRecordDTO> createVitalRecord(@Valid @RequestBody CreateVitalRecordRequest request) {
        log.info("POST /api/vital-records - Creating vital record: {}", request.getRecordName());
        VitalRecordDTO createdVitalRecord = vitalRecordService.createVitalRecord(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdVitalRecord);
    }

    /**
     * Update an existing vital record
     */
    @PutMapping("/{id}")
    public ResponseEntity<VitalRecordDTO> updateVitalRecord(
            @PathVariable Long id,
            @Valid @RequestBody UpdateVitalRecordRequest request) {
        log.info("PUT /api/vital-records/{} - Updating vital record", id);
        VitalRecordDTO updatedVitalRecord = vitalRecordService.updateVitalRecord(id, request);
        return ResponseEntity.ok(updatedVitalRecord);
    }

    /**
     * Delete a vital record
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVitalRecord(@PathVariable Long id) {
        log.info("DELETE /api/vital-records/{}", id);
        vitalRecordService.deleteVitalRecord(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Get statistics
     */
    @GetMapping("/statistics")
    public ResponseEntity<VitalRecordService.VitalRecordStatistics> getStatistics() {
        log.info("GET /api/vital-records/statistics");
        VitalRecordService.VitalRecordStatistics stats = vitalRecordService.getStatistics();
        return ResponseEntity.ok(stats);
    }

    /**
     * Download CSV template for bulk upload
     */
    @GetMapping("/bulk-upload/template")
    public ResponseEntity<byte[]> downloadTemplate() {
        log.info("GET /api/vital-records/bulk-upload/template - Downloading CSV template");
        try {
            ByteArrayOutputStream outputStream = bulkUploadService.generateTemplate();
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType("text/csv"));
            headers.setContentDispositionFormData("attachment", "vital_records_bulk_upload_template.csv");
            
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(outputStream.toByteArray());
        } catch (Exception e) {
            log.error("Error generating CSV template", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Bulk upload vital records via CSV
     */
    @PostMapping("/bulk-upload")
    public ResponseEntity<VitalRecordBulkUploadService.BulkUploadResult> bulkUpload(
            @RequestParam("file") MultipartFile file) {
        log.info("POST /api/vital-records/bulk-upload - File: {}", file.getOriginalFilename());
        
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        try {
            VitalRecordBulkUploadService.BulkUploadResult result = bulkUploadService.processUpload(file);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Error processing bulk upload", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}

