package com.bcm.service;

import com.bcm.dto.CreateVitalRecordRequest;
import com.bcm.entity.VitalRecord;
import com.bcm.enums.VitalRecordStatus;
import com.bcm.repository.VitalRecordRepository;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVPrinter;
import org.apache.commons.csv.CSVRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Service for bulk upload of Vital Records via CSV
 */
@Service
@Slf4j
public class VitalRecordBulkUploadService {

    @Autowired
    private VitalRecordRepository vitalRecordRepository;

    @Autowired
    private VitalRecordService vitalRecordService;

    private static final String[] CSV_HEADERS = {
        "Record Name*",
        "Status (ACTIVE/ARCHIVED/INACTIVE)",
        "Record Type",
        "Location",
        "Description",
        "Recovery Point Objective (hours)",
        "Owner",
        "Technical Contact",
        "Backup Frequency",
        "Storage Format",
        "Retention Period",
        "Notes"
    };

    /**
     * Generate CSV template for bulk upload
     */
    public ByteArrayOutputStream generateTemplate() throws IOException {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        CSVPrinter csvPrinter = new CSVPrinter(new PrintWriter(outputStream), 
            CSVFormat.DEFAULT.withHeader(CSV_HEADERS));

        // Add sample rows
        csvPrinter.printRecord(
            "Customer Master Database",
            "ACTIVE",
            "Database",
            "Production Server - DB01",
            "Central repository of all customer information",
            "24",
            "IT Department",
            "it-support@example.com",
            "Daily at 2:00 AM",
            "PostgreSQL",
            "7 years",
            "Critical production database"
        );

        csvPrinter.printRecord(
            "Payroll SOPs",
            "ACTIVE",
            "Document",
            "SharePoint - HR/Payroll/SOPs",
            "Step-by-step payroll processing procedures",
            "168",
            "HR Department",
            "hr@example.com",
            "Weekly",
            "PDF",
            "Indefinite",
            "Updated quarterly"
        );

        csvPrinter.flush();
        csvPrinter.close();
        return outputStream;
    }

    /**
     * Process bulk upload CSV file
     */
    @Transactional
    public BulkUploadResult processUpload(MultipartFile file) throws IOException {
        log.info("Processing vital records bulk upload: {}", file.getOriginalFilename());

        BulkUploadResult result = new BulkUploadResult();
        List<String> errors = new ArrayList<>();
        int successCount = 0;
        int failedCount = 0;

        try (Reader reader = new BufferedReader(new InputStreamReader(file.getInputStream()));
             CSVParser csvParser = new CSVParser(reader, CSVFormat.DEFAULT
                     .withFirstRecordAsHeader()
                     .withIgnoreHeaderCase()
                     .withTrim())) {

            int lineNumber = 1; // Header is line 0
            for (CSVRecord csvRecord : csvParser) {
                lineNumber++;
                try {
                    // Extract fields
                    String recordName = csvRecord.get(0).trim();
                    String statusStr = csvRecord.size() > 1 ? csvRecord.get(1).trim() : "";
                    String recordType = csvRecord.size() > 2 ? csvRecord.get(2).trim() : null;
                    String location = csvRecord.size() > 3 ? csvRecord.get(3).trim() : null;
                    String description = csvRecord.size() > 4 ? csvRecord.get(4).trim() : null;
                    String rpoStr = csvRecord.size() > 5 ? csvRecord.get(5).trim() : null;
                    String owner = csvRecord.size() > 6 ? csvRecord.get(6).trim() : null;
                    String technicalContact = csvRecord.size() > 7 ? csvRecord.get(7).trim() : null;
                    String backupFrequency = csvRecord.size() > 8 ? csvRecord.get(8).trim() : null;
                    String storageFormat = csvRecord.size() > 9 ? csvRecord.get(9).trim() : null;
                    String retentionPeriod = csvRecord.size() > 10 ? csvRecord.get(10).trim() : null;
                    String notes = csvRecord.size() > 11 ? csvRecord.get(11).trim() : null;

                    // Validate required fields
                    if (recordName.isEmpty()) {
                        errors.add("Line " + lineNumber + ": Record name is required");
                        failedCount++;
                        continue;
                    }

                    // Check for duplicate record name (case-insensitive)
                    String duplicateError = checkForDuplicate(recordName);
                    if (duplicateError != null) {
                        errors.add("Line " + lineNumber + ": " + duplicateError);
                        failedCount++;
                        continue;
                    }

                    // Parse status
                    VitalRecordStatus status = VitalRecordStatus.ACTIVE;
                    if (!statusStr.isEmpty()) {
                        try {
                            status = VitalRecordStatus.valueOf(statusStr.toUpperCase());
                        } catch (IllegalArgumentException e) {
                            errors.add("Line " + lineNumber + ": Invalid status '" + statusStr + "'. Must be ACTIVE, ARCHIVED, or INACTIVE");
                            failedCount++;
                            continue;
                        }
                    }

                    // Parse RPO
                    Integer recoveryPointObjective = null;
                    if (rpoStr != null && !rpoStr.isEmpty()) {
                        try {
                            recoveryPointObjective = Integer.parseInt(rpoStr);
                            if (recoveryPointObjective < 0) {
                                errors.add("Line " + lineNumber + ": Recovery Point Objective must be a positive number");
                                failedCount++;
                                continue;
                            }
                        } catch (NumberFormatException e) {
                            errors.add("Line " + lineNumber + ": Invalid Recovery Point Objective '" + rpoStr + "'. Must be a number");
                            failedCount++;
                            continue;
                        }
                    }

                    // Create vital record
                    CreateVitalRecordRequest request = CreateVitalRecordRequest.builder()
                            .recordName(recordName)
                            .status(status)
                            .recordType(recordType)
                            .location(location)
                            .description(description)
                            .recoveryPointObjective(recoveryPointObjective)
                            .owner(owner)
                            .technicalContact(technicalContact)
                            .backupFrequency(backupFrequency)
                            .storageFormat(storageFormat)
                            .retentionPeriod(retentionPeriod)
                            .notes(notes)
                            .build();

                    vitalRecordService.createVitalRecord(request);
                    successCount++;

                } catch (Exception e) {
                    log.error("Error processing line {}: {}", lineNumber, e.getMessage());
                    errors.add("Line " + lineNumber + ": " + e.getMessage());
                    failedCount++;
                }
            }
        }

        result.setSuccessCount(successCount);
        result.setFailedRows(failedCount);
        result.setErrors(errors);

        log.info("Bulk upload completed: {} successful, {} failed", successCount, failedCount);
        return result;
    }

    /**
     * Check if vital record already exists in the database
     * Returns error message if duplicate found, null otherwise
     */
    private String checkForDuplicate(String recordName) {
        // Check by record name (case-insensitive)
        if (vitalRecordRepository.existsByRecordNameIgnoreCaseAndIsDeletedFalse(recordName)) {
            return "Vital record with name '" + recordName + "' already exists. Skipping duplicate.";
        }
        
        return null; // No duplicate found
    }

    /**
     * Result DTO for bulk upload
     */
    @lombok.Data
    public static class BulkUploadResult {
        private int successCount;
        private int failedRows;
        private List<String> errors = new ArrayList<>();
    }
}

