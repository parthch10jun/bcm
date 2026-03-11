package com.bcm.dto;

import com.bcm.enums.UserStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for updating an existing user
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserRequest {
    
    @Size(max = 255, message = "Full name must not exceed 255 characters")
    private String fullName;
    
    @Email(message = "Email must be valid")
    @Size(max = 255, message = "Email must not exceed 255 characters")
    private String email;
    
    @Size(max = 50, message = "Contact number must not exceed 50 characters")
    private String contactNumber;
    
    @Size(max = 100, message = "Role must not exceed 100 characters")
    private String role;
    
    private Long organizationalUnitId;
    
    @Size(max = 100, message = "HRMS employee ID must not exceed 100 characters")
    private String hrmsEmployeeId;
    
    private UserStatus status;
}

