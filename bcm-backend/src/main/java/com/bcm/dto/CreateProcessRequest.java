package com.bcm.dto;

import com.bcm.enums.ProcessStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for creating a new Process
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateProcessRequest {
    
    @NotBlank(message = "Process name is required")
    @Size(max = 255, message = "Process name must not exceed 255 characters")
    private String processName;
    
    @Size(max = 50, message = "Process code must not exceed 50 characters")
    private String processCode;
    
    private String description;
    
    @NotNull(message = "Organizational unit ID is required")
    private Long organizationalUnitId;
    
    @Size(max = 255, message = "Process owner must not exceed 255 characters")
    private String processOwner;

    private ProcessStatus status;
}

