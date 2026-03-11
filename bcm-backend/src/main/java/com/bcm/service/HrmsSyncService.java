package com.bcm.service;

import com.bcm.dto.HrmsSyncResult;
import com.bcm.entity.OrganizationalUnit;
import com.bcm.entity.User;
import com.bcm.enums.UserStatus;
import com.bcm.repository.OrganizationalUnitRepository;
import com.bcm.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * Service for syncing users from HRMS system
 * This is a mock implementation - replace with actual HRMS API integration
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class HrmsSyncService {

    private final UserRepository userRepository;
    private final OrganizationalUnitRepository organizationalUnitRepository;

    /**
     * Sync users from HRMS system
     * This is a mock implementation that simulates HRMS sync
     * In production, this would call the actual HRMS API
     */
    @Transactional
    public HrmsSyncResult syncFromHrms() {
        log.info("Starting HRMS sync");

        LocalDateTime startTime = LocalDateTime.now();
        
        HrmsSyncResult result = HrmsSyncResult.builder()
                .syncStatus("IN_PROGRESS")
                .usersAdded(0)
                .usersUpdated(0)
                .usersFailed(0)
                .startedAt(startTime)
                .triggeredBy("system") // TODO: Get from security context
                .build();

        try {
            // Fetch users from HRMS (mock data for now)
            List<HrmsEmployee> hrmsEmployees = fetchFromHrmsApi();

            for (HrmsEmployee hrmsEmployee : hrmsEmployees) {
                try {
                    // Check if user already exists by HRMS employee ID
                    Optional<User> existingUser = userRepository.findByHrmsEmployeeId(hrmsEmployee.getEmployeeId());

                    if (existingUser.isPresent()) {
                        // Update existing user
                        User user = existingUser.get();
                        boolean updated = false;

                        if (!user.getFullName().equals(hrmsEmployee.getFullName())) {
                            user.setFullName(hrmsEmployee.getFullName());
                            updated = true;
                        }

                        if (!user.getEmail().equals(hrmsEmployee.getEmail())) {
                            // Check if new email is already taken by another user
                            Optional<User> userWithEmail = userRepository.findByEmail(hrmsEmployee.getEmail());
                            if (userWithEmail.isEmpty() || userWithEmail.get().getId().equals(user.getId())) {
                                user.setEmail(hrmsEmployee.getEmail());
                                updated = true;
                            }
                        }

                        if (hrmsEmployee.getContactNumber() != null && 
                            !hrmsEmployee.getContactNumber().equals(user.getContactNumber())) {
                            user.setContactNumber(hrmsEmployee.getContactNumber());
                            updated = true;
                        }

                        if (hrmsEmployee.getRole() != null &&
                            !hrmsEmployee.getRole().equals(user.getJobTitle())) {
                            user.setJobTitle(hrmsEmployee.getRole());
                            updated = true;
                        }

                        if (updated) {
                            user.setLastSyncedAt(LocalDateTime.now());
                            user.setUpdatedAt(LocalDateTime.now());
                            user.setUpdatedBy("hrms-sync");
                            userRepository.save(user);
                            result.setUsersUpdated(result.getUsersUpdated() + 1);
                            log.info("Updated user from HRMS: {}", hrmsEmployee.getEmail());
                        }

                    } else {
                        // Create new user
                        User newUser = User.builder()
                                .fullName(hrmsEmployee.getFullName())
                                .email(hrmsEmployee.getEmail())
                                .contactNumber(hrmsEmployee.getContactNumber())
                                .jobTitle(hrmsEmployee.getRole())
                                .hrmsEmployeeId(hrmsEmployee.getEmployeeId())
                                .status(UserStatus.ACTIVE)
                                .lastSyncedAt(LocalDateTime.now())
                                .build();

                        newUser.setCreatedAt(LocalDateTime.now());
                        newUser.setCreatedBy("hrms-sync");
                        newUser.setIsDeleted(false);

                        userRepository.save(newUser);
                        result.setUsersAdded(result.getUsersAdded() + 1);
                        log.info("Added new user from HRMS: {}", hrmsEmployee.getEmail());
                    }

                } catch (Exception e) {
                    log.error("Error processing HRMS employee {}: {}", hrmsEmployee.getEmployeeId(), e.getMessage());
                    result.setUsersFailed(result.getUsersFailed() + 1);
                }
            }

            result.setSyncStatus("SUCCESS");
            result.setCompletedAt(LocalDateTime.now());
            log.info("HRMS sync completed successfully. Added: {}, Updated: {}, Failed: {}",
                    result.getUsersAdded(), result.getUsersUpdated(), result.getUsersFailed());

        } catch (Exception e) {
            log.error("HRMS sync failed: {}", e.getMessage());
            result.setSyncStatus("FAILED");
            result.setErrorMessage(e.getMessage());
            result.setCompletedAt(LocalDateTime.now());
        }

        return result;
    }

    /**
     * Mock method to fetch employees from HRMS API
     * In production, this would make actual API calls to the HRMS system
     */
    private List<HrmsEmployee> fetchFromHrmsApi() {
        log.info("Fetching employees from HRMS API (mock)");
        
        // Mock data - replace with actual HRMS API call
        List<HrmsEmployee> employees = new ArrayList<>();
        
        employees.add(new HrmsEmployee(
                "HRMS-101",
                "Michael Johnson",
                "michael.johnson@acme.com",
                "+1 (555) 111-2222",
                "Chief Financial Officer"
        ));
        
        employees.add(new HrmsEmployee(
                "HRMS-102",
                "Sarah Williams",
                "sarah.williams@acme.com",
                "+1 (555) 222-3333",
                "Marketing Director"
        ));
        
        employees.add(new HrmsEmployee(
                "HRMS-103",
                "David Brown",
                "david.brown@acme.com",
                "+1 (555) 333-4444",
                "Operations Manager"
        ));

        return employees;
    }

    /**
     * Inner class representing an employee from HRMS
     * In production, this would be replaced with actual HRMS API response model
     */
    @lombok.Data
    @lombok.AllArgsConstructor
    private static class HrmsEmployee {
        private String employeeId;
        private String fullName;
        private String email;
        private String contactNumber;
        private String role;
    }

    /**
     * Get last sync status
     */
    public HrmsSyncResult getLastSyncStatus() {
        // In production, this would fetch from hrms_sync_logs table
        // For now, return a mock status
        return HrmsSyncResult.builder()
                .syncStatus("SUCCESS")
                .usersAdded(3)
                .usersUpdated(2)
                .usersFailed(0)
                .startedAt(LocalDateTime.now().minusHours(2))
                .completedAt(LocalDateTime.now().minusHours(2).plusMinutes(5))
                .triggeredBy("admin")
                .build();
    }
}

