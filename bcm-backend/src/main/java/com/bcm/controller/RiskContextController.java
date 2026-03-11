package com.bcm.controller;

import com.bcm.entity.Threat;
import com.bcm.enums.EnablerTypeCode;
import com.bcm.enums.RiskCategoryCode;
import com.bcm.service.RiskContextService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST Controller for Risk Context Resolution
 * 
 * This controller provides endpoints for resolving context objects
 * and determining applicable threats based on context
 */
@RestController
@RequestMapping("/api/risk-context")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class RiskContextController {

    private final RiskContextService riskContextService;

    /**
     * Get applicable threats for a specific context
     * 
     * This is the KEY endpoint that determines which threats apply
     * to a specific context object (Process, Location, Vendor, etc.)
     */
    @GetMapping("/applicable-threats")
    public ResponseEntity<List<Threat>> getApplicableThreats(
            @RequestParam Long riskCategoryId,
            @RequestParam RiskCategoryCode contextType,
            @RequestParam Long contextId) {
        log.info("GET /api/risk-context/applicable-threats - Category: {}, Context: {} ID: {}", 
                riskCategoryId, contextType, contextId);
        List<Threat> threats = riskContextService.getApplicableThreats(riskCategoryId, contextType, contextId);
        return ResponseEntity.ok(threats);
    }

    /**
     * Get enabler types for a specific context
     * 
     * This endpoint analyzes a context object and returns which BETH3V
     * enabler types are involved
     */
    @GetMapping("/enabler-types")
    public ResponseEntity<List<EnablerTypeCode>> getEnablerTypesForContext(
            @RequestParam RiskCategoryCode contextType,
            @RequestParam Long contextId) {
        log.info("GET /api/risk-context/enabler-types - Context: {} ID: {}", contextType, contextId);
        List<EnablerTypeCode> enablerTypes = riskContextService.getEnablerTypesForContext(contextType, contextId);
        return ResponseEntity.ok(enablerTypes);
    }

    /**
     * Get context object details
     * 
     * Returns information about the context object for display purposes
     */
    @GetMapping("/details")
    public ResponseEntity<Map<String, Object>> getContextDetails(
            @RequestParam RiskCategoryCode contextType,
            @RequestParam Long contextId) {
        log.info("GET /api/risk-context/details - Context: {} ID: {}", contextType, contextId);
        Map<String, Object> details = riskContextService.getContextDetails(contextType, contextId);
        return ResponseEntity.ok(details);
    }
}

