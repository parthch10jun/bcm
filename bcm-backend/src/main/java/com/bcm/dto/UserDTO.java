package com.bcm.dto;

import com.bcm.enums.UserRole;
import com.bcm.enums.UserStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for User entity
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Long id;
    private String fullName;
    private String email;
    private String contactNumber;
    private String jobTitle;
    private UserRole userRole;
    private Long organizationalUnitId;
    private String organizationalUnitName;
    private String organizationalUnitCode;
    private String hrmsEmployeeId;
    private LocalDateTime lastSyncedAt;
    private UserStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

