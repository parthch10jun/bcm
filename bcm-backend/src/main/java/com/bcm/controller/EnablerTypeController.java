package com.bcm.controller;

import com.bcm.entity.EnablerType;
import com.bcm.enums.EnablerTypeCode;
import com.bcm.service.EnablerTypeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for Enabler Types (BETH3V framework)
 */
@RestController
@RequestMapping("/api/enabler-types")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class EnablerTypeController {

    private final EnablerTypeService enablerTypeService;

    /**
     * Get all enabler types
     */
    @GetMapping
    public ResponseEntity<List<EnablerType>> getAllEnablerTypes() {
        log.info("GET /api/enabler-types - Fetching all enabler types");
        List<EnablerType> enablerTypes = enablerTypeService.getAllEnablerTypes();
        return ResponseEntity.ok(enablerTypes);
    }

    /**
     * Get enabler type by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<EnablerType> getEnablerTypeById(@PathVariable Long id) {
        log.info("GET /api/enabler-types/{} - Fetching enabler type", id);
        EnablerType enablerType = enablerTypeService.getEnablerTypeById(id);
        return ResponseEntity.ok(enablerType);
    }

    /**
     * Get enabler type by code
     */
    @GetMapping("/code/{code}")
    public ResponseEntity<EnablerType> getEnablerTypeByCode(@PathVariable EnablerTypeCode code) {
        log.info("GET /api/enabler-types/code/{} - Fetching enabler type", code);
        EnablerType enablerType = enablerTypeService.getEnablerTypeByCode(code);
        return ResponseEntity.ok(enablerType);
    }

    /**
     * Initialize BETH3V enabler types
     */
    @PostMapping("/initialize")
    public ResponseEntity<Void> initializeEnablerTypes() {
        log.info("POST /api/enabler-types/initialize - Initializing BETH3V enabler types");
        enablerTypeService.initializeEnablerTypes();
        return ResponseEntity.ok().build();
    }
}

