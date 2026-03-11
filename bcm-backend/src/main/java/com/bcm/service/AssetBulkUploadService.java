package com.bcm.service;

import com.bcm.dto.AssetDTO;
import com.bcm.entity.Asset;
import com.bcm.entity.AssetCategory;
import com.bcm.entity.AssetType;
import com.bcm.enums.AssetStatus;
import com.bcm.repository.AssetCategoryRepository;
import com.bcm.repository.AssetRepository;
import com.bcm.repository.AssetTypeRepository;
// TODO: Uncomment when Location entity is created
// import com.bcm.repository.LocationRepository;
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

@Service
public class AssetBulkUploadService {

    @Autowired
    private AssetRepository assetRepository;

    @Autowired
    private AssetTypeRepository assetTypeRepository;

    @Autowired
    private AssetCategoryRepository assetCategoryRepository;

    // TODO: Uncomment when Location entity is created
    // @Autowired
    // private LocationRepository locationRepository;

    @Autowired
    private AssetService assetService;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    private static final String[] CSV_HEADERS = {
        "Asset Name*",
        "Description",
        "Status (ACTIVE/INACTIVE/RETIRED/MAINTENANCE)",
        "Asset Type",
        "Category",
        "Location",
        "Vendor",
        "Model",
        "Serial Number",
        "Purchase Date (yyyy-MM-dd)",
        "Warranty Expiry (yyyy-MM-dd)",
        "Owner",
        "Technical Contact",
        "Notes"
    };

    /**
     * Generate CSV template for bulk asset upload
     */
    public ByteArrayOutputStream generateTemplate() throws IOException {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        CSVPrinter csvPrinter = new CSVPrinter(new PrintWriter(outputStream), 
            CSVFormat.DEFAULT.withHeader(CSV_HEADERS));

        // Add sample row
        csvPrinter.printRecord(
            "Example Server",
            "Production web server",
            "ACTIVE",
            "Technology",
            "Server",
            "Data Center 1",
            "Dell",
            "PowerEdge R740",
            "SN123456789",
            "2023-01-15",
            "2026-01-15",
            "John Doe",
            "tech@example.com",
            "Critical production server"
        );

        csvPrinter.flush();
        csvPrinter.close();
        return outputStream;
    }

    /**
     * Process bulk upload CSV file
     */
    @Transactional
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
                    Asset asset = parseAssetFromRecord(record);

                    // Check for duplicates
                    String duplicateReason = checkForDuplicate(asset);
                    if (duplicateReason != null) {
                        result.addError(rowNumber, duplicateReason);
                        continue;
                    }

                    Asset savedAsset = assetRepository.save(asset);
                    result.addSuccess(rowNumber, savedAsset.getAssetName());
                } catch (Exception e) {
                    result.addError(rowNumber, e.getMessage());
                }
            }
        }

        return result;
    }

    private Asset parseAssetFromRecord(CSVRecord record) {
        Asset asset = new Asset();

        // Required fields
        String assetName = getFieldValue(record, "Asset Name*");
        if (assetName == null || assetName.trim().isEmpty()) {
            throw new IllegalArgumentException("Asset Name is required");
        }
        asset.setAssetName(assetName.trim());

        // Optional fields
        asset.setDescription(getFieldValue(record, "Description"));

        // Status
        String statusStr = getFieldValue(record, "Status (ACTIVE/INACTIVE/RETIRED/MAINTENANCE)");
        if (statusStr != null && !statusStr.trim().isEmpty()) {
            try {
                asset.setStatus(AssetStatus.valueOf(statusStr.trim().toUpperCase()));
            } catch (IllegalArgumentException e) {
                asset.setStatus(AssetStatus.ACTIVE);
            }
        } else {
            asset.setStatus(AssetStatus.ACTIVE);
        }

        // Asset Type
        String assetTypeName = getFieldValue(record, "Asset Type");
        if (assetTypeName != null && !assetTypeName.trim().isEmpty()) {
            AssetType assetType = assetTypeRepository.findByTypeNameIgnoreCase(assetTypeName.trim())
                .orElseGet(() -> {
                    AssetType newType = new AssetType();
                    newType.setTypeName(assetTypeName.trim());
                    return assetTypeRepository.save(newType);
                });
            asset.setAssetType(assetType);
        }

        // Category
        String categoryName = getFieldValue(record, "Category");
        if (categoryName != null && !categoryName.trim().isEmpty()) {
            AssetCategory category = assetCategoryRepository.findByCategoryNameIgnoreCase(categoryName.trim())
                .orElseGet(() -> {
                    AssetCategory newCategory = new AssetCategory();
                    newCategory.setCategoryName(categoryName.trim());
                    if (asset.getAssetType() != null) {
                        newCategory.setAssetType(asset.getAssetType());
                    }
                    return assetCategoryRepository.save(newCategory);
                });
            asset.setCategory(category);
        }

        // Location - TODO: Uncomment when Location entity is created
        // String locationName = getFieldValue(record, "Location");
        // if (locationName != null && !locationName.trim().isEmpty()) {
        //     locationRepository.findByNameIgnoreCase(locationName.trim())
        //         .ifPresent(asset::setLocation);
        // }

        // Technical details
        asset.setVendor(getFieldValue(record, "Vendor"));
        asset.setModel(getFieldValue(record, "Model"));
        asset.setSerialNumber(getFieldValue(record, "Serial Number"));

        // Dates
        String purchaseDate = getFieldValue(record, "Purchase Date (yyyy-MM-dd)");
        if (purchaseDate != null && !purchaseDate.trim().isEmpty()) {
            try {
                asset.setPurchaseDate(LocalDate.parse(purchaseDate.trim(), DATE_FORMATTER));
            } catch (Exception e) {
                // Skip invalid dates
            }
        }

        String warrantyExpiry = getFieldValue(record, "Warranty Expiry (yyyy-MM-dd)");
        if (warrantyExpiry != null && !warrantyExpiry.trim().isEmpty()) {
            try {
                asset.setWarrantyExpiry(LocalDate.parse(warrantyExpiry.trim(), DATE_FORMATTER));
            } catch (Exception e) {
                // Skip invalid dates
            }
        }

        // Ownership
        asset.setOwner(getFieldValue(record, "Owner"));
        asset.setTechnicalContact(getFieldValue(record, "Technical Contact"));
        asset.setNotes(getFieldValue(record, "Notes"));

        return asset;
    }

    /**
     * Check if asset already exists in the database
     * Returns error message if duplicate found, null otherwise
     */
    private String checkForDuplicate(Asset asset) {
        // Priority 1: Check by serial number (if provided) - most unique identifier
        if (asset.getSerialNumber() != null && !asset.getSerialNumber().trim().isEmpty()) {
            if (assetRepository.existsBySerialNumber(asset.getSerialNumber())) {
                return "Asset with serial number '" + asset.getSerialNumber() + "' already exists. Skipping duplicate.";
            }
        }

        // Priority 2: Check by asset name (case-insensitive)
        if (assetRepository.existsByAssetNameIgnoreCase(asset.getAssetName())) {
            return "Asset with name '" + asset.getAssetName() + "' already exists. Skipping duplicate.";
        }

        return null; // No duplicate found
    }

    private String getFieldValue(CSVRecord record, String fieldName) {
        try {
            String value = record.get(fieldName);
            return (value != null && !value.trim().isEmpty()) ? value.trim() : null;
        } catch (IllegalArgumentException e) {
            return null;
        }
    }

    public static class BulkUploadResult {
        private int totalRows = 0;
        private int successCount = 0;
        private int errorCount = 0;
        private List<String> successMessages = new ArrayList<>();
        private List<String> errorMessages = new ArrayList<>();

        public void addSuccess(int rowNumber, String assetName) {
            totalRows++;
            successCount++;
            successMessages.add("Row " + rowNumber + ": Successfully created asset '" + assetName + "'");
        }

        public void addError(int rowNumber, String errorMessage) {
            totalRows++;
            errorCount++;
            errorMessages.add("Row " + rowNumber + ": " + errorMessage);
        }

        // Getters
        public int getTotalRows() { return totalRows; }
        public int getSuccessCount() { return successCount; }
        public int getErrorCount() { return errorCount; }
        public List<String> getSuccessMessages() { return successMessages; }
        public List<String> getErrorMessages() { return errorMessages; }
    }
}

