package com.bcm.controller;

import com.bcm.entity.ThreatType;
import com.bcm.service.ThreatTypeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for Threat Types
 */
@RestController
@RequestMapping("/api/threat-types")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class ThreatTypeController {

    private final ThreatTypeService threatTypeService;

    /**
     * Get all threat types
     */
    @GetMapping
    public ResponseEntity<List<ThreatType>> getAllThreatTypes() {
        log.info("GET /api/threat-types - Fetching all threat types");
        List<ThreatType> threatTypes = threatTypeService.getAllThreatTypes();
        return ResponseEntity.ok(threatTypes);
    }

    /**
     * Get threat type by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ThreatType> getThreatTypeById(@PathVariable Long id) {
        log.info("GET /api/threat-types/{} - Fetching threat type", id);
        ThreatType threatType = threatTypeService.getThreatTypeById(id);
        return ResponseEntity.ok(threatType);
    }

    /**
     * Create a new threat type
     */
    @PostMapping
    public ResponseEntity<ThreatType> createThreatType(@RequestBody ThreatType threatType) {
        log.info("POST /api/threat-types - Creating new threat type: {}", threatType.getName());
        ThreatType created = threatTypeService.createThreatType(threatType);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * Update an existing threat type
     */
    @PutMapping("/{id}")
    public ResponseEntity<ThreatType> updateThreatType(
            @PathVariable Long id,
            @RequestBody ThreatType threatType) {
        log.info("PUT /api/threat-types/{} - Updating threat type", id);
        ThreatType updated = threatTypeService.updateThreatType(id, threatType);
        return ResponseEntity.ok(updated);
    }

    /**
     * Delete a threat type
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteThreatType(@PathVariable Long id) {
        log.info("DELETE /api/threat-types/{} - Deleting threat type", id);
        threatTypeService.deleteThreatType(id);
        return ResponseEntity.noContent().build();
    }
}

