package com.bcm.dto;

import com.bcm.enums.UnitType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for creating a new organizational unit
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateOrganizationalUnitRequest {

    @Size(max = 50, message = "Unit code must not exceed 50 characters")
    private String unitCode;

    @NotBlank(message = "Unit name is required")
    @Size(max = 255, message = "Unit name must not exceed 255 characters")
    private String unitName;

    @Size(max = 2000, message = "Description must not exceed 2000 characters")
    private String description;

    /**
     * Parent unit ID - null for top-level units
     */
    private Long parentUnitId;

    @NotNull(message = "Unit type is required")
    private UnitType unitType;

    /**
     * NOTE: isBiaEligible is NOT included here because it's automatically calculated
     * A unit is BIA-eligible if and only if it's at the operational level (has no subordinate units)
     */

    @Size(max = 255, message = "Unit head name must not exceed 255 characters")
    private String unitHead;

    @Size(max = 255, message = "Unit head email must not exceed 255 characters")
    private String unitHeadEmail;

    @Size(max = 50, message = "Unit head phone must not exceed 50 characters")
    private String unitHeadPhone;

    @Size(max = 255, message = "Location must not exceed 255 characters")
    private String location;

    private Integer employeeCount;

    private Double annualBudget;
}

