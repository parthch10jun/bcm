package com.bcm.controller;

import com.bcm.dto.ThreatAssessmentDTO;
import com.bcm.entity.ThreatAssessment;
import com.bcm.enums.RiskLevel;
import com.bcm.service.ThreatAssessmentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for Threat Assessments
 */
@RestController
@RequestMapping("/api/threat-assessments")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class ThreatAssessmentController {

    private final ThreatAssessmentService threatAssessmentService;

    /**
     * Get all threat assessments for a risk assessment
     */
    @GetMapping("/by-risk-assessment/{riskAssessmentId}")
    public ResponseEntity<List<ThreatAssessmentDTO>> getThreatAssessmentsByRiskAssessment(
            @PathVariable Long riskAssessmentId) {
        log.info("GET /api/threat-assessments/by-risk-assessment/{} - Fetching threat assessments", riskAssessmentId);
        List<ThreatAssessmentDTO> assessments = threatAssessmentService.getThreatAssessmentsByRiskAssessment(riskAssessmentId);
        return ResponseEntity.ok(assessments);
    }

    /**
     * Get threat assessment by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ThreatAssessment> getThreatAssessmentById(@PathVariable Long id) {
        log.info("GET /api/threat-assessments/{} - Fetching threat assessment", id);
        ThreatAssessment assessment = threatAssessmentService.getThreatAssessmentById(id);
        return ResponseEntity.ok(assessment);
    }

    /**
     * Get high-risk threat assessments for a risk assessment
     */
    @GetMapping("/high-risk/{riskAssessmentId}")
    public ResponseEntity<List<ThreatAssessment>> getHighRiskThreats(@PathVariable Long riskAssessmentId) {
        log.info("GET /api/threat-assessments/high-risk/{} - Fetching high-risk threats", riskAssessmentId);
        List<ThreatAssessment> assessments = threatAssessmentService.getHighRiskThreats(riskAssessmentId);
        return ResponseEntity.ok(assessments);
    }

    /**
     * Get threat assessments by risk level
     */
    @GetMapping("/by-risk-level/{riskLevel}")
    public ResponseEntity<List<ThreatAssessment>> getThreatAssessmentsByRiskLevel(@PathVariable RiskLevel riskLevel) {
        log.info("GET /api/threat-assessments/by-risk-level/{} - Fetching threat assessments", riskLevel);
        List<ThreatAssessment> assessments = threatAssessmentService.getThreatAssessmentsByRiskLevel(riskLevel);
        return ResponseEntity.ok(assessments);
    }

    /**
     * Update a threat assessment
     */
    @PutMapping("/{id}")
    public ResponseEntity<ThreatAssessment> updateThreatAssessment(
            @PathVariable Long id,
            @RequestBody ThreatAssessment threatAssessment) {
        log.info("PUT /api/threat-assessments/{} - Updating threat assessment", id);
        ThreatAssessment updated = threatAssessmentService.updateThreatAssessment(id, threatAssessment);
        return ResponseEntity.ok(updated);
    }

    /**
     * Bulk update threat assessments
     */
    @PutMapping("/bulk-update")
    public ResponseEntity<List<ThreatAssessment>> bulkUpdateThreatAssessments(
            @RequestBody List<ThreatAssessment> threatAssessments) {
        log.info("PUT /api/threat-assessments/bulk-update - Updating {} threat assessments", threatAssessments.size());
        List<ThreatAssessment> updated = threatAssessmentService.bulkUpdateThreatAssessments(threatAssessments);
        return ResponseEntity.ok(updated);
    }

    /**
     * Delete a threat assessment
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteThreatAssessment(@PathVariable Long id) {
        log.info("DELETE /api/threat-assessments/{} - Deleting threat assessment", id);
        threatAssessmentService.deleteThreatAssessment(id);
        return ResponseEntity.noContent().build();
    }
}

