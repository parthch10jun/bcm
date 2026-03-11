package com.bcm.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for Organization Settings
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrganizationSettingsDTO {
    private String name;
    private String logo;
    private String primaryColor;
    private String secondaryColor;
    private String contactEmail;
    private String website;
    private String industry;
    private String size;
}

