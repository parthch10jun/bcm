package com.bcm.service;

import com.bcm.entity.Vendor;
import com.bcm.enums.ServiceType;
import com.bcm.enums.VendorStatus;
import com.bcm.repository.VendorRepository;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVPrinter;
import org.apache.commons.csv.CSVRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

/**
 * Service for handling bulk upload of vendors via CSV
 */
@Service
@Transactional
public class VendorBulkUploadService {

    @Autowired
    private VendorRepository vendorRepository;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    private static final String[] CSV_HEADERS = {
        "Vendor Name*",
        "Description",
        "Status (ACTIVE/INACTIVE/UNDER_REVIEW)",
        "Service Type (CLOUD_PROVIDER/SAAS/MANAGED_SERVICE/etc)",
        "Contact Name",
        "Contact Email",
        "Contact Phone",
        "Recovery Time Capability (hours)*",
        "Contract Start Date (yyyy-MM-dd)",
        "Contract End Date (yyyy-MM-dd)",
        "Website",
        "Address",
        "Notes"
    };

    /**
     * Generate CSV template for vendor bulk upload
     */
    public ByteArrayOutputStream generateTemplate() throws IOException {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        CSVPrinter csvPrinter = new CSVPrinter(new PrintWriter(outputStream), 
            CSVFormat.DEFAULT.withHeader(CSV_HEADERS));

        // Add sample row
        csvPrinter.printRecord(
            "Amazon Web Services",
            "Cloud infrastructure and services provider",
            "ACTIVE",
            "CLOUD_PROVIDER",
            "AWS Support",
            "support@aws.amazon.com",
            "+1-800-123-4567",
            "8",
            "2023-01-01",
            "2025-12-31",
            "https://aws.amazon.com",
            "410 Terry Avenue North, Seattle, WA 98109",
            "Primary cloud provider for infrastructure"
        );

        csvPrinter.flush();
        csvPrinter.close();

        return outputStream;
    }

    /**
     * Process bulk upload CSV file
     */
    public BulkUploadResult processBulkUpload(MultipartFile file) throws IOException {
        BulkUploadResult result = new BulkUploadResult();
        
        try (Reader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            CSVParser csvParser = new CSVParser(reader, CSVFormat.DEFAULT
                .withFirstRecordAsHeader()
                .withIgnoreHeaderCase()
                .withTrim());

            int rowNumber = 1; // Start at 1 (header is 0)
            for (CSVRecord record : csvParser) {
                rowNumber++;
                try {
                    Vendor vendor = parseVendorFromRecord(record);

                    // Check for duplicates
                    String duplicateReason = checkForDuplicate(vendor);
                    if (duplicateReason != null) {
                        result.errorCount++;
                        result.messages.add("Row " + rowNumber + ": " + duplicateReason);
                        continue;
                    }

                    vendorRepository.save(vendor);
                    result.successCount++;
                    result.messages.add("Row " + rowNumber + ": Successfully imported vendor '" + vendor.getVendorName() + "'");
                } catch (Exception e) {
                    result.errorCount++;
                    result.messages.add("Row " + rowNumber + ": ERROR - " + e.getMessage());
                }
            }
            
            csvParser.close();
        }

        return result;
    }

    /**
     * Parse a vendor from a CSV record
     */
    private Vendor parseVendorFromRecord(CSVRecord record) {
        Vendor vendor = new Vendor();

        // Required fields
        String vendorName = getFieldValue(record, "Vendor Name*");
        if (vendorName == null || vendorName.trim().isEmpty()) {
            throw new IllegalArgumentException("Vendor Name is required");
        }
        vendor.setVendorName(vendorName.trim());

        // Recovery Time Capability (required)
        String rtoC = getFieldValue(record, "Recovery Time Capability (hours)*");
        if (rtoC == null || rtoC.trim().isEmpty()) {
            throw new IllegalArgumentException("Recovery Time Capability is required");
        }
        try {
            vendor.setRecoveryTimeCapability(Integer.parseInt(rtoC.trim()));
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Recovery Time Capability must be a valid number");
        }

        // Optional fields
        vendor.setDescription(getFieldValue(record, "Description"));

        // Status
        String statusStr = getFieldValue(record, "Status (ACTIVE/INACTIVE/UNDER_REVIEW)");
        if (statusStr != null && !statusStr.trim().isEmpty()) {
            try {
                vendor.setStatus(VendorStatus.valueOf(statusStr.trim().toUpperCase()));
            } catch (IllegalArgumentException e) {
                vendor.setStatus(VendorStatus.ACTIVE);
            }
        } else {
            vendor.setStatus(VendorStatus.ACTIVE);
        }

        // Service Type
        String serviceTypeStr = getFieldValue(record, "Service Type (CLOUD_PROVIDER/SAAS/MANAGED_SERVICE/etc)");
        if (serviceTypeStr != null && !serviceTypeStr.trim().isEmpty()) {
            try {
                vendor.setServiceType(ServiceType.valueOf(serviceTypeStr.trim().toUpperCase()));
            } catch (IllegalArgumentException e) {
                vendor.setServiceType(ServiceType.OTHER);
            }
        }

        // Contact details
        vendor.setContactName(getFieldValue(record, "Contact Name"));
        vendor.setContactEmail(getFieldValue(record, "Contact Email"));
        vendor.setContactPhone(getFieldValue(record, "Contact Phone"));

        // Dates
        String contractStartDate = getFieldValue(record, "Contract Start Date (yyyy-MM-dd)");
        if (contractStartDate != null && !contractStartDate.trim().isEmpty()) {
            try {
                vendor.setContractStartDate(LocalDate.parse(contractStartDate.trim(), DATE_FORMATTER));
            } catch (Exception e) {
                // Skip invalid dates
            }
        }

        String contractEndDate = getFieldValue(record, "Contract End Date (yyyy-MM-dd)");
        if (contractEndDate != null && !contractEndDate.trim().isEmpty()) {
            try {
                vendor.setContractEndDate(LocalDate.parse(contractEndDate.trim(), DATE_FORMATTER));
            } catch (Exception e) {
                // Skip invalid dates
            }
        }

        // Other details
        vendor.setWebsite(getFieldValue(record, "Website"));
        vendor.setAddress(getFieldValue(record, "Address"));
        vendor.setNotes(getFieldValue(record, "Notes"));

        return vendor;
    }

    /**
     * Check if vendor already exists in the database
     * Returns error message if duplicate found, null otherwise
     */
    private String checkForDuplicate(Vendor vendor) {
        // Check by vendor name (case-insensitive)
        if (vendorRepository.existsByVendorNameIgnoreCaseAndIsDeletedFalse(vendor.getVendorName())) {
            return "Vendor with name '" + vendor.getVendorName() + "' already exists. Skipping duplicate.";
        }

        return null; // No duplicate found
    }

    /**
     * Helper method to safely get field value from CSV record
     */
    private String getFieldValue(CSVRecord record, String fieldName) {
        try {
            return record.get(fieldName);
        } catch (IllegalArgumentException e) {
            return null;
        }
    }

    /**
     * Result object for bulk upload operation
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BulkUploadResult {
        private int successCount = 0;
        private int errorCount = 0;
        private List<String> messages = new ArrayList<>();
    }
}

