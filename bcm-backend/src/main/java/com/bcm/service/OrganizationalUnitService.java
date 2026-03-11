package com.bcm.service;

import com.bcm.dto.CreateOrganizationalUnitRequest;
import com.bcm.dto.OrganizationalUnitDTO;
import com.bcm.dto.UpdateOrganizationalUnitRequest;
import com.bcm.entity.OrganizationalUnit;
import com.bcm.enums.UnitType;
import com.bcm.repository.OrganizationalUnitRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service class for OrganizationalUnit business logic
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class OrganizationalUnitService {

    private final OrganizationalUnitRepository organizationalUnitRepository;

    /**
     * Get all organizational units
     */
    @Transactional(readOnly = true)
    public List<OrganizationalUnitDTO> getAllUnits() {
        log.info("Fetching all organizational units");
        return organizationalUnitRepository.findByIsDeletedFalse()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get organizational unit by ID
     */
    @Transactional(readOnly = true)
    public OrganizationalUnitDTO getUnitById(Long id) {
        log.info("Fetching organizational unit with ID: {}", id);
        OrganizationalUnit unit = organizationalUnitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Organizational unit not found with ID: " + id));
        return convertToDTO(unit);
    }

    /**
     * Get all top-level units (no parent)
     */
    @Transactional(readOnly = true)
    public List<OrganizationalUnitDTO> getTopLevelUnits() {
        log.info("Fetching top-level organizational units");
        return organizationalUnitRepository.findByParentUnitIsNullAndIsDeletedFalse()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get all child units of a parent
     */
    @Transactional(readOnly = true)
    public List<OrganizationalUnitDTO> getChildUnits(Long parentId) {
        log.info("Fetching child units for parent ID: {}", parentId);
        return organizationalUnitRepository.findByParentUnitId(parentId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get all units (BIAs can now be created for ANY unit)
     *
     * DEPRECATED: The concept of "BIA-eligible" units has been removed.
     * BIAs can now be created at any level of the organizational hierarchy.
     * This method is kept for backward compatibility but now returns all units.
     */
    @Transactional(readOnly = true)
    @Deprecated
    public List<OrganizationalUnitDTO> getBiaEligibleUnits() {
        log.info("Fetching all units (BIAs can be created at any level)");
        return getAllUnits();
    }

    /**
     * Get units by type
     */
    @Transactional(readOnly = true)
    public List<OrganizationalUnitDTO> getUnitsByType(UnitType unitType) {
        log.info("Fetching units of type: {}", unitType);
        return organizationalUnitRepository.findByUnitType(unitType)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Search units by name
     */
    @Transactional(readOnly = true)
    public List<OrganizationalUnitDTO> searchUnitsByName(String name) {
        log.info("Searching units by name: {}", name);
        return organizationalUnitRepository.searchByName(name)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Create a new organizational unit
     */
    public OrganizationalUnitDTO createUnit(CreateOrganizationalUnitRequest request) {
        log.info("Creating new organizational unit: {}", request.getUnitName());

        // Validation 1: Prevent multiple top-level units
        if (request.getParentUnitId() == null) {
            List<OrganizationalUnit> topLevelUnits = organizationalUnitRepository.findTopLevelUnits();
            if (!topLevelUnits.isEmpty()) {
                throw new RuntimeException("A top-level organization already exists. Only one root unit is allowed.");
            }
        }

        // Validation 2: Prevent ORGANIZATION under ORGANIZATION
        if (request.getUnitType() == UnitType.ORGANIZATION && request.getParentUnitId() != null) {
            throw new RuntimeException("An ORGANIZATION cannot be created under another unit. Organizations must be top-level.");
        }

        // Validation 3: Prevent creating units under ORGANIZATION (only DIVISION allowed)
        if (request.getParentUnitId() != null) {
            OrganizationalUnit parent = organizationalUnitRepository.findById(request.getParentUnitId())
                .orElseThrow(() -> new RuntimeException("Parent unit not found with ID: " + request.getParentUnitId()));

            if (parent.getUnitType() == UnitType.ORGANIZATION && request.getUnitType() != UnitType.DIVISION) {
                throw new RuntimeException("Only DIVISION units can be created directly under an ORGANIZATION. Please create a DIVISION first.");
            }
        }

        // Validation 4: Unit code global uniqueness
        if (request.getUnitCode() != null && organizationalUnitRepository.existsByUnitCode(request.getUnitCode())) {
            throw new RuntimeException("Unit code already exists: " + request.getUnitCode());
        }

        // Validation 5: Unit name uniqueness within parent
        if (organizationalUnitRepository.existsByUnitNameAndParentUnitId(
                request.getUnitName(),
                request.getParentUnitId())) {
            String parentName = request.getParentUnitId() != null
                ? organizationalUnitRepository.findById(request.getParentUnitId())
                    .map(OrganizationalUnit::getUnitName)
                    .orElse("Unknown")
                : "top level";
            throw new RuntimeException(String.format(
                "A unit named '%s' already exists under %s",
                request.getUnitName(),
                parentName));
        }

        // Build the entity
        OrganizationalUnit.OrganizationalUnitBuilder builder = OrganizationalUnit.builder()
                .unitCode(request.getUnitCode())
                .unitName(request.getUnitName())
                .description(request.getDescription())
                .unitType(request.getUnitType())
                .unitHead(request.getUnitHead())
                .unitHeadEmail(request.getUnitHeadEmail())
                .unitHeadPhone(request.getUnitHeadPhone())
                // .location(request.getLocation())  // TODO: Uncomment when Location entity is created
                .employeeCount(request.getEmployeeCount())
                .annualBudget(request.getAnnualBudget());

        // Set parent unit if provided
        OrganizationalUnit parentUnit = null;
        if (request.getParentUnitId() != null) {
            parentUnit = organizationalUnitRepository.findById(request.getParentUnitId())
                    .orElseThrow(() -> new RuntimeException("Parent unit not found with ID: " + request.getParentUnitId()));
            builder.parentUnit(parentUnit);
        }

        OrganizationalUnit unit = builder.build();

        // NEW ARCHITECTURE: No need to set BIA eligibility
        // BIAs can now be created for ANY unit at any level

        OrganizationalUnit savedUnit = organizationalUnitRepository.save(unit);
        log.info("Created organizational unit with ID: {}", savedUnit.getId());

        return convertToDTO(savedUnit);
    }

    /**
     * Update an existing organizational unit
     */
    public OrganizationalUnitDTO updateUnit(Long id, UpdateOrganizationalUnitRequest request) {
        log.info("Updating organizational unit with ID: {}", id);

        OrganizationalUnit unit = organizationalUnitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Organizational unit not found with ID: " + id));

        // Validation 1: Unit code global uniqueness
        if (request.getUnitCode() != null) {
            if (!request.getUnitCode().equals(unit.getUnitCode()) &&
                organizationalUnitRepository.existsByUnitCode(request.getUnitCode())) {
                throw new RuntimeException("Unit code already exists: " + request.getUnitCode());
            }
            unit.setUnitCode(request.getUnitCode());
        }

        // Validation 2: Unit name uniqueness within parent
        if (request.getUnitName() != null) {
            Long currentParentId = unit.getParentUnit() != null ? unit.getParentUnit().getId() : null;
            if (!request.getUnitName().equals(unit.getUnitName()) &&
                organizationalUnitRepository.existsByUnitNameAndParentUnitIdExcludingId(
                    request.getUnitName(), currentParentId, id)) {
                String parentName = currentParentId != null
                    ? organizationalUnitRepository.findById(currentParentId)
                        .map(OrganizationalUnit::getUnitName)
                        .orElse("Unknown")
                    : "top level";
                throw new RuntimeException(String.format(
                    "A unit named '%s' already exists under %s",
                    request.getUnitName(),
                    parentName));
            }
            unit.setUnitName(request.getUnitName());
        }

        if (request.getDescription() != null) {
            unit.setDescription(request.getDescription());
        }

        // Validation 3: Prevent changing to ORGANIZATION type if unit has a parent
        if (request.getUnitType() != null) {
            if (request.getUnitType() == UnitType.ORGANIZATION && unit.getParentUnit() != null) {
                throw new RuntimeException("Cannot change unit type to ORGANIZATION while it has a parent. Organizations must be top-level.");
            }
            unit.setUnitType(request.getUnitType());
        }

        if (request.getUnitHead() != null) {
            unit.setUnitHead(request.getUnitHead());
        }

        if (request.getUnitHeadEmail() != null) {
            unit.setUnitHeadEmail(request.getUnitHeadEmail());
        }

        if (request.getUnitHeadPhone() != null) {
            unit.setUnitHeadPhone(request.getUnitHeadPhone());
        }

        // TODO: Uncomment when Location entity is created
        // if (request.getLocation() != null) {
        //     unit.setLocation(request.getLocation());
        // }

        if (request.getEmployeeCount() != null) {
            unit.setEmployeeCount(request.getEmployeeCount());
        }

        if (request.getAnnualBudget() != null) {
            unit.setAnnualBudget(request.getAnnualBudget());
        }

        // Validation 4: Handle parent unit change with circular dependency check
        if (request.getParentUnitId() != null) {
            // Validation 4a: Prevent ORGANIZATION from having a parent
            if (unit.getUnitType() == UnitType.ORGANIZATION) {
                throw new RuntimeException("An ORGANIZATION cannot have a parent. Organizations must be top-level.");
            }

            // Validation 4b: Prevent setting unit as its own parent
            if (request.getParentUnitId().equals(id)) {
                throw new RuntimeException("A unit cannot be its own parent");
            }

            // Validation 4c: Prevent circular dependencies (unit cannot be parent of its ancestor)
            List<Long> descendantIds = organizationalUnitRepository.findAllDescendantIds(id);
            if (descendantIds.contains(request.getParentUnitId())) {
                OrganizationalUnit wouldBeParent = organizationalUnitRepository.findById(request.getParentUnitId())
                    .orElse(null);
                String parentName = wouldBeParent != null ? wouldBeParent.getUnitName() : "Unknown";
                throw new RuntimeException(String.format(
                    "Cannot set '%s' as parent: it is a descendant of this unit. This would create a circular reference.",
                    parentName));
            }

            OrganizationalUnit newParent = organizationalUnitRepository.findById(request.getParentUnitId())
                    .orElseThrow(() -> new RuntimeException("Parent unit not found with ID: " + request.getParentUnitId()));

            // Validation 4d: Prevent creating non-DIVISION units under ORGANIZATION
            if (newParent.getUnitType() == UnitType.ORGANIZATION && unit.getUnitType() != UnitType.DIVISION) {
                throw new RuntimeException("Only DIVISION units can be placed directly under an ORGANIZATION.");
            }

            unit.setParentUnit(newParent);

            // NEW ARCHITECTURE: No need to update BIA eligibility
            // BIAs can be created at any level
        }

        OrganizationalUnit updatedUnit = organizationalUnitRepository.save(unit);
        log.info("Updated organizational unit with ID: {}", id);

        return convertToDTO(updatedUnit);
    }

    /**
     * Delete an organizational unit (soft delete)
     */
    public void deleteUnit(Long id) {
        log.info("Deleting organizational unit with ID: {}", id);

        OrganizationalUnit unit = organizationalUnitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Organizational unit not found with ID: " + id));

        // Check if unit has children
        if (!unit.getChildUnits().isEmpty()) {
            throw new RuntimeException("Cannot delete unit with children. Delete or reassign children first.");
        }

        // Soft delete
        unit.setIsDeleted(true);
        organizationalUnitRepository.save(unit);

        // NEW ARCHITECTURE: No need to update parent's BIA eligibility

        log.info("Deleted organizational unit with ID: {}", id);
    }

    /**
     * REMOVED: updateBiaEligibility method
     *
     * NEW ARCHITECTURE: BIA eligibility is no longer tracked.
     * BIAs can be created for any unit at any level.
     */

    /**
     * Convert entity to DTO
     */
    private OrganizationalUnitDTO convertToDTO(OrganizationalUnit unit) {
        return OrganizationalUnitDTO.builder()
                .id(unit.getId())
                .unitCode(unit.getUnitCode())
                .unitName(unit.getUnitName())
                .description(unit.getDescription())
                .parentUnitId(unit.getParentUnit() != null ? unit.getParentUnit().getId() : null)
                .parentUnitName(unit.getParentUnit() != null ? unit.getParentUnit().getUnitName() : null)
                .unitType(unit.getUnitType())
                .isBiaEligible(true)  // NEW: Always true - BIAs can be created for any unit
                .isLeafNode(unit.isOperationalLevel())  // Keep for backward compatibility
                .unitHead(unit.getUnitHead())
                .unitHeadEmail(unit.getUnitHeadEmail())
                .unitHeadPhone(unit.getUnitHeadPhone())
                // .location(unit.getLocation())  // TODO: Uncomment when Location entity is created
                .employeeCount(unit.getEmployeeCount())
                .annualBudget(unit.getAnnualBudget())
                .criticalityTier(unit.getCriticalityTier() != null ? unit.getCriticalityTier().name() : null)
                .criticalityScore(unit.getCriticalityScore())
                .fullPath(unit.getFullPath())
                .level(unit.getLevel())
                .childUnitIds(unit.getChildUnits().stream().map(OrganizationalUnit::getId).collect(Collectors.toList()))
                .childCount(unit.getChildUnits().size())
                .createdAt(unit.getCreatedAt())
                .createdBy(unit.getCreatedBy())
                .updatedAt(unit.getUpdatedAt())
                .updatedBy(unit.getUpdatedBy())
                .isDeleted(unit.getIsDeleted())
                .version(unit.getVersion())
                .build();
    }
}

