package com.bcm.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

/**
 * DTO for bulk upload results
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BulkUploadResult {
    private String fileName;
    private Integer totalRows;
    private Integer successfulRows;
    private Integer failedRows;
    
    @Builder.Default
    private List<String> errors = new ArrayList<>();
    
    @Builder.Default
    private List<UserDTO> createdUsers = new ArrayList<>();
    
    private String errorReportUrl;  // URL to download detailed error report
}

