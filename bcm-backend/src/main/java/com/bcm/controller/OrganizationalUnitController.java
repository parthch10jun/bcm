package com.bcm.controller;

import com.bcm.dto.CreateOrganizationalUnitRequest;
import com.bcm.dto.OrganizationalUnitDTO;
import com.bcm.dto.UpdateOrganizationalUnitRequest;
import com.bcm.enums.UnitType;
import com.bcm.service.OrganizationalUnitService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for Organizational Unit operations
 * Base path: /api/organizational-units
 */
@RestController
@RequestMapping("/api/organizational-units")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*") // Configure appropriately for production
public class OrganizationalUnitController {

    private final OrganizationalUnitService organizationalUnitService;

    /**
     * Get all organizational units
     * GET /api/organizational-units
     */
    @GetMapping
    public ResponseEntity<List<OrganizationalUnitDTO>> getAllUnits() {
        log.info("GET /api/organizational-units - Fetching all units");
        List<OrganizationalUnitDTO> units = organizationalUnitService.getAllUnits();
        return ResponseEntity.ok(units);
    }

    /**
     * Get organizational unit by ID
     * GET /api/organizational-units/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<OrganizationalUnitDTO> getUnitById(@PathVariable Long id) {
        log.info("GET /api/organizational-units/{} - Fetching unit by ID", id);
        OrganizationalUnitDTO unit = organizationalUnitService.getUnitById(id);
        return ResponseEntity.ok(unit);
    }

    /**
     * Get all top-level units (no parent)
     * GET /api/organizational-units/top-level
     */
    @GetMapping("/top-level")
    public ResponseEntity<List<OrganizationalUnitDTO>> getTopLevelUnits() {
        log.info("GET /api/organizational-units/top-level - Fetching top-level units");
        List<OrganizationalUnitDTO> units = organizationalUnitService.getTopLevelUnits();
        return ResponseEntity.ok(units);
    }

    /**
     * Get all child units of a parent
     * GET /api/organizational-units/{parentId}/children
     */
    @GetMapping("/{parentId}/children")
    public ResponseEntity<List<OrganizationalUnitDTO>> getChildUnits(@PathVariable Long parentId) {
        log.info("GET /api/organizational-units/{}/children - Fetching child units", parentId);
        List<OrganizationalUnitDTO> units = organizationalUnitService.getChildUnits(parentId);
        return ResponseEntity.ok(units);
    }

    /**
     * Get all BIA-eligible units (operational-level units with no subordinates)
     * GET /api/organizational-units/bia-eligible
     */
    @GetMapping("/bia-eligible")
    public ResponseEntity<List<OrganizationalUnitDTO>> getBiaEligibleUnits() {
        log.info("GET /api/organizational-units/bia-eligible - Fetching BIA-eligible units");
        List<OrganizationalUnitDTO> units = organizationalUnitService.getBiaEligibleUnits();
        return ResponseEntity.ok(units);
    }

    /**
     * Get units by type
     * GET /api/organizational-units/by-type/{unitType}
     */
    @GetMapping("/by-type/{unitType}")
    public ResponseEntity<List<OrganizationalUnitDTO>> getUnitsByType(@PathVariable UnitType unitType) {
        log.info("GET /api/organizational-units/by-type/{} - Fetching units by type", unitType);
        List<OrganizationalUnitDTO> units = organizationalUnitService.getUnitsByType(unitType);
        return ResponseEntity.ok(units);
    }

    /**
     * Search units by name
     * GET /api/organizational-units/search?name={name}
     */
    @GetMapping("/search")
    public ResponseEntity<List<OrganizationalUnitDTO>> searchUnitsByName(@RequestParam String name) {
        log.info("GET /api/organizational-units/search?name={} - Searching units by name", name);
        List<OrganizationalUnitDTO> units = organizationalUnitService.searchUnitsByName(name);
        return ResponseEntity.ok(units);
    }

    /**
     * Create a new organizational unit
     * POST /api/organizational-units
     */
    @PostMapping
    public ResponseEntity<OrganizationalUnitDTO> createUnit(@Valid @RequestBody CreateOrganizationalUnitRequest request) {
        log.info("POST /api/organizational-units - Creating new unit: {}", request.getUnitName());
        OrganizationalUnitDTO createdUnit = organizationalUnitService.createUnit(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdUnit);
    }

    /**
     * Update an existing organizational unit
     * PUT /api/organizational-units/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<OrganizationalUnitDTO> updateUnit(
            @PathVariable Long id,
            @Valid @RequestBody UpdateOrganizationalUnitRequest request) {
        log.info("PUT /api/organizational-units/{} - Updating unit", id);
        OrganizationalUnitDTO updatedUnit = organizationalUnitService.updateUnit(id, request);
        return ResponseEntity.ok(updatedUnit);
    }

    /**
     * Delete an organizational unit (soft delete)
     * DELETE /api/organizational-units/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUnit(@PathVariable Long id) {
        log.info("DELETE /api/organizational-units/{} - Deleting unit", id);
        organizationalUnitService.deleteUnit(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Health check endpoint
     * GET /api/organizational-units/health
     */
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Organizational Units API is running");
    }
}

