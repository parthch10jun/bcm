package com.bcm.controller;

import com.bcm.entity.Threat;
import com.bcm.enums.EnablerTypeCode;
import com.bcm.service.ThreatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

/**
 * REST Controller for Threats
 */
@RestController
@RequestMapping("/api/threats")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class ThreatController {

    private final ThreatService threatService;

    /**
     * Get all threats
     */
    @GetMapping
    public ResponseEntity<List<Threat>> getAllThreats() {
        log.info("GET /api/threats - Fetching all threats");
        List<Threat> threats = threatService.getAllThreats();
        return ResponseEntity.ok(threats);
    }

    /**
     * Get threat by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Threat> getThreatById(@PathVariable Long id) {
        log.info("GET /api/threats/{} - Fetching threat", id);
        Threat threat = threatService.getThreatById(id);
        return ResponseEntity.ok(threat);
    }

    /**
     * Get threats by threat type
     */
    @GetMapping("/by-threat-type/{threatTypeId}")
    public ResponseEntity<List<Threat>> getThreatsByThreatType(@PathVariable Long threatTypeId) {
        log.info("GET /api/threats/by-threat-type/{} - Fetching threats", threatTypeId);
        List<Threat> threats = threatService.getThreatsByThreatType(threatTypeId);
        return ResponseEntity.ok(threats);
    }

    /**
     * Get threats by enabler type
     */
    @GetMapping("/by-enabler-type/{enablerTypeCode}")
    public ResponseEntity<List<Threat>> getThreatsByEnablerType(@PathVariable EnablerTypeCode enablerTypeCode) {
        log.info("GET /api/threats/by-enabler-type/{} - Fetching threats", enablerTypeCode);
        List<Threat> threats = threatService.getThreatsByEnablerType(enablerTypeCode);
        return ResponseEntity.ok(threats);
    }

    /**
     * Get threats by risk category
     */
    @GetMapping("/by-risk-category/{riskCategoryId}")
    public ResponseEntity<List<Threat>> getThreatsByRiskCategory(@PathVariable Long riskCategoryId) {
        log.info("GET /api/threats/by-risk-category/{} - Fetching threats", riskCategoryId);
        List<Threat> threats = threatService.getThreatsByRiskCategory(riskCategoryId);
        return ResponseEntity.ok(threats);
    }

    /**
     * Get applicable threats for a specific context
     * This is the KEY endpoint for risk assessment creation
     */
    @GetMapping("/applicable")
    public ResponseEntity<List<Threat>> getApplicableThreats(
            @RequestParam Long riskCategoryId,
            @RequestParam List<EnablerTypeCode> enablerTypeCodes) {
        log.info("GET /api/threats/applicable - Risk Category: {}, Enabler Types: {}", 
                riskCategoryId, enablerTypeCodes);
        List<Threat> threats = threatService.getApplicableThreats(riskCategoryId, enablerTypeCodes);
        return ResponseEntity.ok(threats);
    }

    /**
     * Search threats by name
     */
    @GetMapping("/search")
    public ResponseEntity<List<Threat>> searchThreats(@RequestParam String query) {
        log.info("GET /api/threats/search?query={}", query);
        List<Threat> threats = threatService.searchThreats(query);
        return ResponseEntity.ok(threats);
    }

    /**
     * Create a new threat
     */
    @PostMapping
    public ResponseEntity<Threat> createThreat(@RequestBody CreateThreatRequest request) {
        log.info("POST /api/threats - Creating new threat: {}", request.getName());
        Threat created = threatService.createThreatWithEnablers(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * Update an existing threat
     */
    @PutMapping("/{id}")
    public ResponseEntity<Threat> updateThreat(
            @PathVariable Long id,
            @RequestBody UpdateThreatRequest request) {
        log.info("PUT /api/threats/{} - Updating threat", id);
        Threat updated = threatService.updateThreatWithEnablers(id, request);
        return ResponseEntity.ok(updated);
    }

    /**
     * Assign enabler types to a threat
     */
    @PutMapping("/{id}/enabler-types")
    public ResponseEntity<Void> assignEnablerTypes(
            @PathVariable Long id,
            @RequestBody Set<Long> enablerTypeIds) {
        log.info("PUT /api/threats/{}/enabler-types - Assigning {} enabler types", id, enablerTypeIds.size());
        threatService.assignEnablerTypes(id, enablerTypeIds);
        return ResponseEntity.ok().build();
    }

    /**
     * Delete a threat
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteThreat(@PathVariable Long id) {
        log.info("DELETE /api/threats/{} - Deleting threat", id);
        threatService.deleteThreat(id);
        return ResponseEntity.noContent().build();
    }

    // DTO Classes
    @lombok.Data
    public static class CreateThreatRequest {
        private String name;
        private String description;
        private Long threatTypeId;
        private Integer displayOrder;
        private Boolean isActive;
        private List<Long> enablerTypeIds;
    }

    @lombok.Data
    public static class UpdateThreatRequest {
        private String name;
        private String description;
        private Long threatTypeId;
        private Integer displayOrder;
        private Boolean isActive;
        private List<Long> enablerTypeIds;
    }
}

