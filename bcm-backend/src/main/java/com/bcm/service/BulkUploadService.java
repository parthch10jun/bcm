package com.bcm.service;

import com.bcm.dto.BulkUploadResult;
import com.bcm.dto.CreateUserRequest;
import com.bcm.dto.UserDTO;
import com.bcm.entity.OrganizationalUnit;
import com.bcm.entity.User;
import com.bcm.enums.UserStatus;
import com.bcm.repository.OrganizationalUnitRepository;
import com.bcm.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Service for bulk uploading users from CSV files
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class BulkUploadService {

    private final UserRepository userRepository;
    private final OrganizationalUnitRepository organizationalUnitRepository;
    private final UserService userService;

    /**
     * Process bulk upload of users from CSV file
     * Expected CSV format: FullName,Email,ContactNumber,Role,UnitID
     */
    @Transactional
    public BulkUploadResult processBulkUpload(MultipartFile file) {
        log.info("Processing bulk upload file: {}", file.getOriginalFilename());

        BulkUploadResult result = BulkUploadResult.builder()
                .fileName(file.getOriginalFilename())
                .totalRows(0)
                .successfulRows(0)
                .failedRows(0)
                .errors(new ArrayList<>())
                .createdUsers(new ArrayList<>())
                .build();

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            String line;
            int lineNumber = 0;
            boolean isHeader = true;

            while ((line = reader.readLine()) != null) {
                lineNumber++;

                // Skip header row
                if (isHeader) {
                    isHeader = false;
                    continue;
                }

                result.setTotalRows(result.getTotalRows() + 1);

                try {
                    // Parse CSV line
                    String[] fields = parseCsvLine(line);

                    if (fields.length < 2) {
                        result.getErrors().add("Line " + lineNumber + ": Insufficient fields. Expected at least FullName and Email.");
                        result.setFailedRows(result.getFailedRows() + 1);
                        continue;
                    }

                    // Extract fields
                    String fullName = fields[0].trim();
                    String email = fields[1].trim();
                    String contactNumber = fields.length > 2 ? fields[2].trim() : null;
                    String role = fields.length > 3 ? fields[3].trim() : null;
                    String unitIdStr = fields.length > 4 ? fields[4].trim() : null;
                    String hrmsEmployeeId = fields.length > 5 ? fields[5].trim() : null;

                    // Validate required fields
                    if (fullName.isEmpty()) {
                        result.getErrors().add("Line " + lineNumber + ": Full name is required.");
                        result.setFailedRows(result.getFailedRows() + 1);
                        continue;
                    }

                    if (email.isEmpty()) {
                        result.getErrors().add("Line " + lineNumber + ": Email is required.");
                        result.setFailedRows(result.getFailedRows() + 1);
                        continue;
                    }

                    // Validate email format
                    if (!isValidEmail(email)) {
                        result.getErrors().add("Line " + lineNumber + ": Invalid email format: " + email);
                        result.setFailedRows(result.getFailedRows() + 1);
                        continue;
                    }

                    // Check if email already exists (case-insensitive)
                    if (userRepository.existsByEmail(email)) {
                        result.getErrors().add("Line " + lineNumber + ": User with email '" + email + "' already exists. Skipping duplicate.");
                        result.setFailedRows(result.getFailedRows() + 1);
                        continue;
                    }

                    // Check if HRMS Employee ID already exists (if provided)
                    if (hrmsEmployeeId != null && !hrmsEmployeeId.isEmpty()) {
                        if (userRepository.existsByHrmsEmployeeId(hrmsEmployeeId)) {
                            result.getErrors().add("Line " + lineNumber + ": User with HRMS Employee ID '" + hrmsEmployeeId + "' already exists. Skipping duplicate.");
                            result.setFailedRows(result.getFailedRows() + 1);
                            continue;
                        }
                    }

                    // Parse and validate organizational unit ID
                    Long unitId = null;
                    if (unitIdStr != null && !unitIdStr.isEmpty()) {
                        try {
                            unitId = Long.parseLong(unitIdStr);
                            
                            // Verify unit exists
                            if (!organizationalUnitRepository.existsById(unitId)) {
                                result.getErrors().add("Line " + lineNumber + ": Organizational unit not found with ID: " + unitId);
                                result.setFailedRows(result.getFailedRows() + 1);
                                continue;
                            }
                        } catch (NumberFormatException e) {
                            result.getErrors().add("Line " + lineNumber + ": Invalid unit ID format: " + unitIdStr);
                            result.setFailedRows(result.getFailedRows() + 1);
                            continue;
                        }
                    }

                    // Create user
                    CreateUserRequest request = CreateUserRequest.builder()
                            .fullName(fullName)
                            .email(email)
                            .contactNumber(contactNumber)
                            .role(role)
                            .organizationalUnitId(unitId)
                            .hrmsEmployeeId(hrmsEmployeeId)
                            .status(UserStatus.ACTIVE)
                            .build();

                    UserDTO createdUser = userService.createUser(request);
                    result.getCreatedUsers().add(createdUser);
                    result.setSuccessfulRows(result.getSuccessfulRows() + 1);

                    log.info("Successfully created user from line {}: {}", lineNumber, email);

                } catch (Exception e) {
                    log.error("Error processing line {}: {}", lineNumber, e.getMessage());
                    result.getErrors().add("Line " + lineNumber + ": " + e.getMessage());
                    result.setFailedRows(result.getFailedRows() + 1);
                }
            }

            log.info("Bulk upload completed. Total: {}, Success: {}, Failed: {}",
                    result.getTotalRows(), result.getSuccessfulRows(), result.getFailedRows());

        } catch (Exception e) {
            log.error("Error reading bulk upload file: {}", e.getMessage());
            result.getErrors().add("File reading error: " + e.getMessage());
        }

        return result;
    }

    /**
     * Parse CSV line handling quoted fields
     */
    private String[] parseCsvLine(String line) {
        List<String> fields = new ArrayList<>();
        StringBuilder currentField = new StringBuilder();
        boolean inQuotes = false;

        for (int i = 0; i < line.length(); i++) {
            char c = line.charAt(i);

            if (c == '"') {
                inQuotes = !inQuotes;
            } else if (c == ',' && !inQuotes) {
                fields.add(currentField.toString());
                currentField = new StringBuilder();
            } else {
                currentField.append(c);
            }
        }

        fields.add(currentField.toString());
        return fields.toArray(new String[0]);
    }

    /**
     * Validate email format
     */
    private boolean isValidEmail(String email) {
        String emailRegex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$";
        return email.matches(emailRegex);
    }

    /**
     * Generate CSV template for bulk upload
     */
    public String generateCsvTemplate() {
        return "FullName,Email,ContactNumber,Role,UnitID,HRMSEmployeeID\n" +
               "John Doe,john.doe@example.com,+1 (555) 123-4567,Senior Manager,1,EMP001\n" +
               "Jane Smith,jane.smith@example.com,+1 (555) 234-5678,HR Specialist,2,EMP002\n";
    }
}

