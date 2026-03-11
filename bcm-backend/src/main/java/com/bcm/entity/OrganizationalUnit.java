package com.bcm.entity;

import com.bcm.enums.CriticalityTier;
import com.bcm.enums.UnitType;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

/**
 * OrganizationalUnit Entity - Self-referencing hierarchical model for organizational structure
 * Supports unlimited levels: Organization -> Division -> Department -> Team -> Sub-Team, etc.
 *
 * Key Features:
 * - Self-referencing via parentUnit (allows unlimited nesting)
 * - isBiaEligible flag marks operational-level units where BIAs can be conducted
 * - Flexible structure supports reorganizations by simply updating parentUnit
 */
@Entity
@Table(name = "organizational_units", indexes = {
    @Index(name = "idx_parent_unit", columnList = "parent_unit_id"),
    @Index(name = "idx_unit_type", columnList = "unit_type"),
    @Index(name = "idx_bia_eligible", columnList = "is_bia_eligible")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrganizationalUnit extends BaseEntity {

    @Column(name = "unit_code", unique = true, length = 50)
    private String unitCode;

    @Column(name = "unit_name", nullable = false, length = 255)
    private String unitName;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    /**
     * Self-referencing relationship - points to parent unit
     * NULL for top-level organization
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_unit_id")
    private OrganizationalUnit parentUnit;

    /**
     * Children units under this unit
     */
    @OneToMany(mappedBy = "parentUnit", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<OrganizationalUnit> childUnits = new ArrayList<>();

    /**
     * Type of organizational unit (Organization, Division, Department, Team, etc.)
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "unit_type", nullable = false, length = 50)
    private UnitType unitType;

    /**
     * REMOVED: is_bia_eligible field
     *
     * NEW ARCHITECTURE: BIAs can now be created for ANY organizational unit,
     * not just "operational-level" units. This provides flexibility for different
     * client workflows while maintaining data integrity through the reconciliation model.
     *
     * See BiaRecord entity for the new flexible BIA model.
     */

    /**
     * Head of the unit
     */
    @Column(name = "unit_head", length = 255)
    private String unitHead;

    @Column(name = "unit_head_email", length = 255)
    private String unitHeadEmail;

    @Column(name = "unit_head_phone", length = 50)
    private String unitHeadPhone;

    /**
     * Location of the unit (optional)
     * TODO: Uncomment when Location entity is created (part of BETH3V framework)
     */
    // @ManyToOne(fetch = FetchType.LAZY)
    // @JoinColumn(name = "location_id")
    // private Location location;

    /**
     * Criticality tier (inherited from BIA or manually set)
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "criticality_tier", length = 20)
    private CriticalityTier criticalityTier;

    @Column(name = "criticality_score")
    private Integer criticalityScore;

    /**
     * Number of employees in this unit
     */
    @Column(name = "employee_count")
    private Integer employeeCount;

    /**
     * Annual budget for this unit
     */
    @Column(name = "annual_budget")
    private Double annualBudget;

    /**
     * Processes belonging to this organizational unit
     */
    @OneToMany(mappedBy = "organizationalUnit", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Process> processes = new ArrayList<>();

    /**
     * BIA records for this organizational unit
     * NEW: Can have BIAs at ANY level, not just operational-level units
     */
    @OneToMany(mappedBy = "organizationalUnit", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<BiaRecord> biaRecords = new ArrayList<>();

    /**
     * Additional metadata (JSON format for flexibility)
     */
    @Column(name = "metadata", columnDefinition = "TEXT")
    private String metadata;

    /**
     * Helper method to get full hierarchical path
     * Example: "ACME Corporation > Operations > IT Infrastructure"
     */
    @Transient
    public String getFullPath() {
        if (parentUnit == null) {
            return unitName;
        }
        return parentUnit.getFullPath() + " > " + unitName;
    }

    /**
     * Helper method to get depth level in hierarchy
     * 0 = top level (organization)
     * 1 = division
     * 2 = department
     * etc.
     */
    @Transient
    public int getLevel() {
        if (parentUnit == null) {
            return 0;
        }
        return parentUnit.getLevel() + 1;
    }

    /**
     * Check if this unit has subordinate organizational units
     * @return true if this unit has subordinate units, false otherwise
     */
    @Transient
    public boolean hasSubordinateUnits() {
        return childUnits != null && !childUnits.isEmpty();
    }

    /**
     * Check if this is an operational-level unit (no subordinates)
     * Operational-level units are eligible for BIA assessments
     * @return true if this unit has no subordinates, false otherwise
     */
    @Transient
    public boolean isOperationalLevel() {
        return !hasSubordinateUnits();
    }

    /**
     * Get the actual BIA eligibility status
     * A unit is BIA-eligible ONLY if it's at the operational level (has no subordinate units)
     * This prevents data integrity issues where a unit has a BIA but then gets subordinate units added
     */
    @Transient
    public boolean getActualBiaEligibility() {
        return isOperationalLevel();
    }

    /**
     * Legacy method for backward compatibility
     * @deprecated Use isOperationalLevel() instead
     */
    @Deprecated
    @Transient
    public boolean isLeafNode() {
        return isOperationalLevel();
    }

    /**
     * Helper method to get all ancestor units
     */
    @Transient
    public List<OrganizationalUnit> getAncestors() {
        List<OrganizationalUnit> ancestors = new ArrayList<>();
        OrganizationalUnit current = this.parentUnit;
        while (current != null) {
            ancestors.add(0, current); // Add at beginning to maintain order
            current = current.getParentUnit();
        }
        return ancestors;
    }

    /**
     * Helper method to get all descendant units (recursive)
     */
    @Transient
    public List<OrganizationalUnit> getAllDescendants() {
        List<OrganizationalUnit> descendants = new ArrayList<>();
        for (OrganizationalUnit child : childUnits) {
            descendants.add(child);
            descendants.addAll(child.getAllDescendants());
        }
        return descendants;
    }

    /**
     * REMOVED: Automatic BIA eligibility update
     *
     * NEW ARCHITECTURE: BIAs can be created for any unit, so we don't need
     * to automatically track "eligibility". The BiaRecord entity handles
     * the flexibility and reconciliation logic.
     */
}

