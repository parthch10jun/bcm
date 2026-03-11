package com.bcm.controller;

import com.bcm.entity.RiskAssessment;
import com.bcm.enums.RiskAssessmentStatus;
import com.bcm.enums.RiskCategoryCode;
import com.bcm.enums.RiskLevel;
import com.bcm.service.RiskAssessmentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST Controller for Risk Assessments
 */
@RestController
@RequestMapping("/api/risk-assessments")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class RiskAssessmentController {

    private final RiskAssessmentService riskAssessmentService;

    /**
     * Get all risk assessments
     */
    @GetMapping
    public ResponseEntity<List<RiskAssessment>> getAllRiskAssessments() {
        log.info("GET /api/risk-assessments - Fetching all risk assessments");
        List<RiskAssessment> assessments = riskAssessmentService.getAllRiskAssessments();
        return ResponseEntity.ok(assessments);
    }

    /**
     * Get risk assessment by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<RiskAssessment> getRiskAssessmentById(@PathVariable Long id) {
        log.info("GET /api/risk-assessments/{} - Fetching risk assessment", id);
        RiskAssessment assessment = riskAssessmentService.getRiskAssessmentById(id);
        return ResponseEntity.ok(assessment);
    }

    /**
     * Get risk assessments by status
     */
    @GetMapping("/by-status/{status}")
    public ResponseEntity<List<RiskAssessment>> getRiskAssessmentsByStatus(@PathVariable RiskAssessmentStatus status) {
        log.info("GET /api/risk-assessments/by-status/{} - Fetching risk assessments", status);
        List<RiskAssessment> assessments = riskAssessmentService.getRiskAssessmentsByStatus(status);
        return ResponseEntity.ok(assessments);
    }

    /**
     * Get risk assessments for a specific context
     */
    @GetMapping("/by-context")
    public ResponseEntity<List<RiskAssessment>> getRiskAssessmentsByContext(
            @RequestParam RiskCategoryCode contextType,
            @RequestParam Long contextId) {
        log.info("GET /api/risk-assessments/by-context - Context: {} ID: {}", contextType, contextId);
        List<RiskAssessment> assessments = riskAssessmentService.getRiskAssessmentsByContext(contextType, contextId);
        return ResponseEntity.ok(assessments);
    }

    /**
     * Get latest risk assessment for a specific context
     */
    @GetMapping("/latest")
    public ResponseEntity<RiskAssessment> getLatestRiskAssessment(
            @RequestParam RiskCategoryCode contextType,
            @RequestParam Long contextId) {
        log.info("GET /api/risk-assessments/latest - Context: {} ID: {}", contextType, contextId);
        RiskAssessment assessment = riskAssessmentService.getLatestRiskAssessment(contextType, contextId);
        if (assessment == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(assessment);
    }

    /**
     * Get risk distribution for a risk assessment
     */
    @GetMapping("/{id}/risk-distribution")
    public ResponseEntity<Map<RiskLevel, Long>> getRiskDistribution(@PathVariable Long id) {
        log.info("GET /api/risk-assessments/{}/risk-distribution - Getting risk distribution", id);
        Map<RiskLevel, Long> distribution = riskAssessmentService.getRiskDistribution(id);
        return ResponseEntity.ok(distribution);
    }

    /**
     * Get dashboard statistics
     */
    @GetMapping("/dashboard/statistics")
    public ResponseEntity<Map<String, Object>> getDashboardStatistics() {
        log.info("GET /api/risk-assessments/dashboard/statistics - Getting dashboard stats");
        Map<String, Object> stats = riskAssessmentService.getDashboardStatistics();
        return ResponseEntity.ok(stats);
    }

    /**
     * Search risk assessments by name
     */
    @GetMapping("/search")
    public ResponseEntity<List<RiskAssessment>> searchRiskAssessments(@RequestParam String query) {
        log.info("GET /api/risk-assessments/search?query={}", query);
        List<RiskAssessment> assessments = riskAssessmentService.searchRiskAssessments(query);
        return ResponseEntity.ok(assessments);
    }

    /**
     * Create a new risk assessment
     */
    @PostMapping
    public ResponseEntity<RiskAssessment> createRiskAssessment(@RequestBody RiskAssessment riskAssessment) {
        log.info("POST /api/risk-assessments - Creating new risk assessment: {}", riskAssessment.getAssessmentName());
        RiskAssessment created = riskAssessmentService.createRiskAssessment(riskAssessment);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * Update an existing risk assessment
     */
    @PutMapping("/{id}")
    public ResponseEntity<RiskAssessment> updateRiskAssessment(
            @PathVariable Long id,
            @RequestBody RiskAssessment riskAssessment) {
        log.info("PUT /api/risk-assessments/{} - Updating risk assessment", id);
        RiskAssessment updated = riskAssessmentService.updateRiskAssessment(id, riskAssessment);
        return ResponseEntity.ok(updated);
    }

    /**
     * Update risk assessment status
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<RiskAssessment> updateStatus(
            @PathVariable Long id,
            @RequestParam RiskAssessmentStatus status) {
        log.info("PUT /api/risk-assessments/{}/status - Updating status to: {}", id, status);
        RiskAssessment updated = riskAssessmentService.updateStatus(id, status);
        return ResponseEntity.ok(updated);
    }

    /**
     * Delete a risk assessment
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRiskAssessment(@PathVariable Long id) {
        log.info("DELETE /api/risk-assessments/{} - Deleting risk assessment", id);
        riskAssessmentService.deleteRiskAssessment(id);
        return ResponseEntity.noContent().build();
    }
}

