package com.bcm.controller;

import com.bcm.dto.*;
import com.bcm.enums.UserStatus;
import com.bcm.service.BulkUploadService;
import com.bcm.service.HrmsSyncService;
import com.bcm.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * REST Controller for User management
 */
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;
    private final BulkUploadService bulkUploadService;
    private final HrmsSyncService hrmsSyncService;

    /**
     * Get all users
     * Optional filters: unit_id, status, role, search
     */
    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers(
            @RequestParam(required = false) Long unit_id,
            @RequestParam(required = false) UserStatus status,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String search) {
        
        log.info("GET /api/users - unit_id: {}, status: {}, role: {}, search: {}", 
                unit_id, status, role, search);

        List<UserDTO> users;

        if (unit_id != null) {
            users = userService.getUsersByUnit(unit_id);
        } else if (status != null) {
            users = userService.getUsersByStatus(status);
        } else if (search != null && !search.isEmpty()) {
            users = userService.searchUsers(search);
        } else {
            users = userService.getAllUsers();
        }

        // Additional filtering by role if provided
        if (role != null && !role.isEmpty()) {
            users = users.stream()
                    .filter(u -> u.getUserRole() != null && role.equals(u.getUserRole().name()))
                    .toList();
        }

        return ResponseEntity.ok(users);
    }

    /**
     * Get user by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        log.info("GET /api/users/{}", id);
        UserDTO user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    /**
     * Get user statistics
     */
    @GetMapping("/stats")
    public ResponseEntity<UserStatsDTO> getUserStats() {
        log.info("GET /api/users/stats");
        UserStatsDTO stats = userService.getUserStats();
        return ResponseEntity.ok(stats);
    }

    /**
     * Create a new user
     */
    @PostMapping
    public ResponseEntity<UserDTO> createUser(@Valid @RequestBody CreateUserRequest request) {
        log.info("POST /api/users - Creating user: {}", request.getEmail());
        UserDTO createdUser = userService.createUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
    }

    /**
     * Update an existing user
     */
    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserRequest request) {
        log.info("PUT /api/users/{} - Updating user", id);
        UserDTO updatedUser = userService.updateUser(id, request);
        return ResponseEntity.ok(updatedUser);
    }

    /**
     * Delete a user
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        log.info("DELETE /api/users/{}", id);
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Bulk upload users from CSV file
     */
    @PostMapping("/bulk-upload")
    public ResponseEntity<BulkUploadResult> bulkUploadUsers(
            @RequestParam("file") MultipartFile file) {
        log.info("POST /api/users/bulk-upload - File: {}", file.getOriginalFilename());

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        if (!file.getOriginalFilename().endsWith(".csv")) {
            return ResponseEntity.badRequest().build();
        }

        BulkUploadResult result = bulkUploadService.processBulkUpload(file);
        return ResponseEntity.ok(result);
    }

    /**
     * Download CSV template for bulk upload
     */
    @GetMapping("/bulk-upload/template")
    public ResponseEntity<String> downloadTemplate() {
        log.info("GET /api/users/bulk-upload/template");
        
        String csvTemplate = bulkUploadService.generateCsvTemplate();
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("text/csv"));
        headers.setContentDispositionFormData("attachment", "user_upload_template.csv");
        
        return ResponseEntity.ok()
                .headers(headers)
                .body(csvTemplate);
    }

    /**
     * Sync users from HRMS system
     */
    @PostMapping("/sync-hrms")
    public ResponseEntity<HrmsSyncResult> syncFromHrms() {
        log.info("POST /api/users/sync-hrms - Starting HRMS sync");
        HrmsSyncResult result = hrmsSyncService.syncFromHrms();
        return ResponseEntity.ok(result);
    }

    /**
     * Get last HRMS sync status
     */
    @GetMapping("/sync-hrms/status")
    public ResponseEntity<HrmsSyncResult> getLastSyncStatus() {
        log.info("GET /api/users/sync-hrms/status");
        HrmsSyncResult status = hrmsSyncService.getLastSyncStatus();
        return ResponseEntity.ok(status);
    }
}

