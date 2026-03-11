package com.bcm.service;

import com.bcm.dto.*;
import com.bcm.entity.OrganizationalUnit;
import com.bcm.entity.User;
import com.bcm.enums.UserStatus;
import com.bcm.exception.ResourceNotFoundException;
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
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Service for managing users
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final OrganizationalUnitRepository organizationalUnitRepository;

    /**
     * Get all users
     */
    public List<UserDTO> getAllUsers() {
        log.info("Fetching all users");
        List<User> users = userRepository.findByIsDeletedFalse();
        return users.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get user by ID
     */
    public UserDTO getUserById(Long id) {
        log.info("Fetching user with ID: {}", id);
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));
        return convertToDTO(user);
    }

    /**
     * Get users by organizational unit
     */
    public List<UserDTO> getUsersByUnit(Long unitId) {
        log.info("Fetching users for unit ID: {}", unitId);
        List<User> users = userRepository.findActiveUsersByUnit(unitId);
        return users.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get users by status
     */
    public List<UserDTO> getUsersByStatus(UserStatus status) {
        log.info("Fetching users with status: {}", status);
        List<User> users = userRepository.findByStatus(status);
        return users.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Search users by name
     */
    public List<UserDTO> searchUsers(String name) {
        log.info("Searching users with name: {}", name);
        List<User> users = userRepository.searchByName(name);
        return users.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Create a new user
     */
    @Transactional
    public UserDTO createUser(CreateUserRequest request) {
        log.info("Creating new user: {}", request.getEmail());

        // Validate email uniqueness
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already exists: " + request.getEmail());
        }

        // Validate HRMS employee ID uniqueness (if provided)
        if (request.getHrmsEmployeeId() != null && !request.getHrmsEmployeeId().isEmpty()) {
            if (userRepository.existsByHrmsEmployeeId(request.getHrmsEmployeeId())) {
                throw new IllegalArgumentException("HRMS employee ID already exists: " + request.getHrmsEmployeeId());
            }
        }

        // Get organizational unit if provided
        OrganizationalUnit unit = null;
        if (request.getOrganizationalUnitId() != null) {
            unit = organizationalUnitRepository.findById(request.getOrganizationalUnitId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Organizational unit not found with ID: " + request.getOrganizationalUnitId()));
        }

        // Create user entity
        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .contactNumber(request.getContactNumber())
                .jobTitle(request.getRole()) // Map old 'role' to 'jobTitle'
                .organizationalUnit(unit)
                .hrmsEmployeeId(request.getHrmsEmployeeId())
                .status(request.getStatus() != null ? request.getStatus() : UserStatus.ACTIVE)
                .build();

        // Set audit fields
        user.setCreatedAt(LocalDateTime.now());
        user.setCreatedBy("system"); // TODO: Get from security context
        user.setIsDeleted(false);

        User savedUser = userRepository.save(user);
        log.info("User created successfully with ID: {}", savedUser.getId());

        return convertToDTO(savedUser);
    }

    /**
     * Update an existing user
     */
    @Transactional
    public UserDTO updateUser(Long id, UpdateUserRequest request) {
        log.info("Updating user with ID: {}", id);

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));

        // Update fields if provided
        if (request.getFullName() != null) {
            user.setFullName(request.getFullName());
        }

        if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
            // Check if new email already exists
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new IllegalArgumentException("Email already exists: " + request.getEmail());
            }
            user.setEmail(request.getEmail());
        }

        if (request.getContactNumber() != null) {
            user.setContactNumber(request.getContactNumber());
        }

        if (request.getRole() != null) {
            user.setJobTitle(request.getRole()); // Map old 'role' to 'jobTitle'
        }

        if (request.getOrganizationalUnitId() != null) {
            OrganizationalUnit unit = organizationalUnitRepository.findById(request.getOrganizationalUnitId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Organizational unit not found with ID: " + request.getOrganizationalUnitId()));
            user.setOrganizationalUnit(unit);
        }

        if (request.getHrmsEmployeeId() != null && !request.getHrmsEmployeeId().equals(user.getHrmsEmployeeId())) {
            // Check if new HRMS ID already exists
            if (userRepository.existsByHrmsEmployeeId(request.getHrmsEmployeeId())) {
                throw new IllegalArgumentException("HRMS employee ID already exists: " + request.getHrmsEmployeeId());
            }
            user.setHrmsEmployeeId(request.getHrmsEmployeeId());
        }

        if (request.getStatus() != null) {
            user.setStatus(request.getStatus());
        }

        // Update audit fields
        user.setUpdatedAt(LocalDateTime.now());
        user.setUpdatedBy("system"); // TODO: Get from security context

        User updatedUser = userRepository.save(user);
        log.info("User updated successfully with ID: {}", updatedUser.getId());

        return convertToDTO(updatedUser);
    }

    /**
     * Delete a user (soft delete)
     */
    @Transactional
    public void deleteUser(Long id) {
        log.info("Deleting user with ID: {}", id);

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));

        // Soft delete
        user.setIsDeleted(true);
        user.setUpdatedAt(LocalDateTime.now());
        user.setUpdatedBy("system"); // TODO: Get from security context

        userRepository.save(user);
        log.info("User soft deleted successfully with ID: {}", id);
    }

    /**
     * Get user statistics
     */
    public UserStatsDTO getUserStats() {
        long totalUsers = userRepository.countAllUsers();
        long usersWithUnit = userRepository.countUsersWithUnit();
        long usersWithoutUnit = userRepository.countUsersWithoutUnit();
        
        return UserStatsDTO.builder()
                .totalUsers(totalUsers)
                .usersWithUnit(usersWithUnit)
                .usersWithoutUnit(usersWithoutUnit)
                .build();
    }

    /**
     * Convert User entity to DTO
     */
    private UserDTO convertToDTO(User user) {
        UserDTO.UserDTOBuilder builder = UserDTO.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .contactNumber(user.getContactNumber())
                .jobTitle(user.getJobTitle())
                .userRole(user.getUserRole())
                .hrmsEmployeeId(user.getHrmsEmployeeId())
                .lastSyncedAt(user.getLastSyncedAt())
                .status(user.getStatus())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt());

        if (user.getOrganizationalUnit() != null) {
            builder.organizationalUnitId(user.getOrganizationalUnit().getId())
                    .organizationalUnitName(user.getOrganizationalUnit().getUnitName())
                    .organizationalUnitCode(user.getOrganizationalUnit().getUnitCode());
        }

        return builder.build();
    }
}

