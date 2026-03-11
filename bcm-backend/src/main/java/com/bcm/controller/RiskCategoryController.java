package com.bcm.controller;

import com.bcm.entity.RiskCategory;
import com.bcm.enums.RiskCategoryCode;
import com.bcm.service.RiskCategoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

/**
 * REST Controller for Risk Categories
 */
@RestController
@RequestMapping("/api/risk-categories")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class RiskCategoryController {

    private final RiskCategoryService riskCategoryService;

    /**
     * Get all risk categories
     */
    @GetMapping
    public ResponseEntity<List<RiskCategory>> getAllRiskCategories() {
        log.info("GET /api/risk-categories - Fetching all risk categories");
        List<RiskCategory> categories = riskCategoryService.getAllRiskCategories();
        return ResponseEntity.ok(categories);
    }

    /**
     * Get active risk categories only
     */
    @GetMapping("/active")
    public ResponseEntity<List<RiskCategory>> getActiveRiskCategories() {
        log.info("GET /api/risk-categories/active - Fetching active risk categories");
        List<RiskCategory> categories = riskCategoryService.getActiveRiskCategories();
        return ResponseEntity.ok(categories);
    }

    /**
     * Get risk category by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<RiskCategory> getRiskCategoryById(@PathVariable Long id) {
        log.info("GET /api/risk-categories/{} - Fetching risk category", id);
        RiskCategory category = riskCategoryService.getRiskCategoryById(id);
        return ResponseEntity.ok(category);
    }

    /**
     * Get risk category by code
     */
    @GetMapping("/code/{code}")
    public ResponseEntity<RiskCategory> getRiskCategoryByCode(@PathVariable RiskCategoryCode code) {
        log.info("GET /api/risk-categories/code/{} - Fetching risk category", code);
        RiskCategory category = riskCategoryService.getRiskCategoryByCode(code);
        return ResponseEntity.ok(category);
    }

    /**
     * Search risk categories by name
     */
    @GetMapping("/search")
    public ResponseEntity<List<RiskCategory>> searchRiskCategories(@RequestParam String query) {
        log.info("GET /api/risk-categories/search?query={}", query);
        List<RiskCategory> categories = riskCategoryService.searchRiskCategories(query);
        return ResponseEntity.ok(categories);
    }

    /**
     * Create a new risk category
     */
    @PostMapping
    public ResponseEntity<RiskCategory> createRiskCategory(@RequestBody RiskCategory riskCategory) {
        log.info("POST /api/risk-categories - Creating new risk category: {}", riskCategory.getName());
        RiskCategory created = riskCategoryService.createRiskCategory(riskCategory);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * Update an existing risk category
     */
    @PutMapping("/{id}")
    public ResponseEntity<RiskCategory> updateRiskCategory(
            @PathVariable Long id,
            @RequestBody RiskCategory riskCategory) {
        log.info("PUT /api/risk-categories/{} - Updating risk category", id);
        RiskCategory updated = riskCategoryService.updateRiskCategory(id, riskCategory);
        return ResponseEntity.ok(updated);
    }

    /**
     * Assign threats to a risk category
     */
    @PutMapping("/{id}/threats")
    public ResponseEntity<Void> assignThreats(
            @PathVariable Long id,
            @RequestBody Set<Long> threatIds) {
        log.info("PUT /api/risk-categories/{}/threats - Assigning {} threats", id, threatIds.size());
        riskCategoryService.assignThreats(id, threatIds);
        return ResponseEntity.ok().build();
    }

    /**
     * Delete a risk category
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRiskCategory(@PathVariable Long id) {
        log.info("DELETE /api/risk-categories/{} - Deleting risk category", id);
        riskCategoryService.deleteRiskCategory(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Initialize default risk categories
     */
    @PostMapping("/initialize")
    public ResponseEntity<Void> initializeRiskCategories() {
        log.info("POST /api/risk-categories/initialize - Initializing default risk categories");
        riskCategoryService.initializeRiskCategories();
        return ResponseEntity.ok().build();
    }
}

