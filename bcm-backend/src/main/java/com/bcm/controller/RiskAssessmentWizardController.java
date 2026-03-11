package com.bcm.controller;

import com.bcm.dto.wizard.ContextOverviewResponse;
import com.bcm.dto.wizard.CreateRiskAssessmentRequest;
import com.bcm.dto.wizard.RiskAssessmentResponse;
import com.bcm.dto.wizard.RiskSummaryResponse;
import com.bcm.dto.wizard.TreatmentPlanRequest;
import com.bcm.dto.wizard.TreatmentPlanResponse;
import com.bcm.entity.ThreatAssessment;
import com.bcm.service.RiskAssessmentWizardService;
import com.bcm.service.RiskTreatmentPlanService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST Controller for Risk Assessment Wizard
 * Handles the 7-step wizard workflow
 */
@RestController
@RequestMapping("/api/risk-assessments/wizard")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "http://localhost:3001")
public class RiskAssessmentWizardController {

    private final RiskAssessmentWizardService wizardService;
    private final RiskTreatmentPlanService treatmentPlanService;

    /**
     * Step 1: Create a new draft risk assessment
     * POST /api/risk-assessments/wizard/create
     */
    @PostMapping("/create")
    public ResponseEntity<RiskAssessmentResponse> createDraftAssessment(
            @RequestBody CreateRiskAssessmentRequest request) {
        log.info("POST /api/risk-assessments/wizard/create - Creating draft assessment");
        RiskAssessmentResponse assessment = wizardService.createDraftAssessment(request);
        return ResponseEntity.ok(assessment);
    }

    /**
     * Step 2: Get context overview with BIA summary and linked enablers
     * GET /api/risk-assessments/wizard/{id}/context-overview
     */
    @GetMapping("/{id}/context-overview")
    public ResponseEntity<ContextOverviewResponse> getContextOverview(@PathVariable Long id) {
        log.info("GET /api/risk-assessments/wizard/{}/context-overview", id);
        ContextOverviewResponse overview = wizardService.getContextOverview(id);
        return ResponseEntity.ok(overview);
    }

    /**
     * Step 3: Initialize threat assessments with applicable threats
     * POST /api/risk-assessments/wizard/{id}/initialize-threats
     */
    @PostMapping("/{id}/initialize-threats")
    public ResponseEntity<Integer> initializeThreats(@PathVariable Long id) {
        log.info("POST /api/risk-assessments/wizard/{}/initialize-threats", id);
        List<ThreatAssessment> threatAssessments = wizardService.initializeThreats(id);
        return ResponseEntity.ok(threatAssessments.size());
    }

    /**
     * Step 4: Assess a specific threat
     * PUT /api/risk-assessments/wizard/threat-assessments/{id}
     */
    @PutMapping("/threat-assessments/{id}")
    public ResponseEntity<Void> assessThreat(
            @PathVariable Long id,
            @RequestBody Map<String, String> assessmentDetails) {
        log.info("PUT /api/risk-assessments/wizard/threat-assessments/{}", id);
        wizardService.assessThreat(
            id,
            assessmentDetails.get("likelihood"),
            assessmentDetails.get("impact"),
            assessmentDetails.get("existingControls"),
            assessmentDetails.get("controlEffectiveness")
        );
        return ResponseEntity.ok().build();
    }

    /**
     * Step 4b: Update assessment progress
     * PUT /api/risk-assessments/wizard/{id}/progress
     */
    @PutMapping("/{id}/progress")
    public ResponseEntity<Void> updateProgress(
            @PathVariable Long id,
            @RequestBody Map<String, Integer> progress) {
        log.info("PUT /api/risk-assessments/wizard/{}/progress", id);
        wizardService.updateAssessmentProgress(
            id,
            progress.get("step"),
            progress.get("percentage")
        );
        return ResponseEntity.ok().build();
    }

    /**
     * Step 5: Get risk summary with heatmap and threshold analysis
     * GET /api/risk-assessments/wizard/{id}/summary
     */
    @GetMapping("/{id}/summary")
    public ResponseEntity<RiskSummaryResponse> getRiskSummary(@PathVariable Long id) {
        log.info("GET /api/risk-assessments/wizard/{}/summary", id);
        RiskSummaryResponse summary = wizardService.getRiskSummary(id);
        return ResponseEntity.ok(summary);
    }

    /**
     * Step 6: Get treatment plans for a risk assessment
     * GET /api/risk-assessments/wizard/{id}/treatment-plans
     */
    @GetMapping("/{id}/treatment-plans")
    public ResponseEntity<List<TreatmentPlanResponse>> getTreatmentPlans(@PathVariable Long id) {
        log.info("GET /api/risk-assessments/wizard/{}/treatment-plans", id);
        List<TreatmentPlanResponse> plans = treatmentPlanService.getTreatmentPlansByRiskAssessment(id);
        return ResponseEntity.ok(plans);
    }

    /**
     * Step 6: Create a treatment plan
     * POST /api/risk-assessments/wizard/treatment-plans
     */
    @PostMapping("/treatment-plans")
    public ResponseEntity<TreatmentPlanResponse> createTreatmentPlan(
            @RequestBody TreatmentPlanRequest request) {
        log.info("POST /api/risk-assessments/wizard/treatment-plans");
        TreatmentPlanResponse plan = treatmentPlanService.createTreatmentPlan(request);
        return ResponseEntity.ok(plan);
    }

    /**
     * Step 6: Update a treatment plan
     * PUT /api/risk-assessments/wizard/treatment-plans/{id}
     */
    @PutMapping("/treatment-plans/{id}")
    public ResponseEntity<TreatmentPlanResponse> updateTreatmentPlan(
            @PathVariable Long id,
            @RequestBody TreatmentPlanRequest request) {
        log.info("PUT /api/risk-assessments/wizard/treatment-plans/{}", id);
        TreatmentPlanResponse plan = treatmentPlanService.updateTreatmentPlan(id, request);
        return ResponseEntity.ok(plan);
    }

    /**
     * Step 6: Delete a treatment plan
     * DELETE /api/risk-assessments/wizard/treatment-plans/{id}
     */
    @DeleteMapping("/treatment-plans/{id}")
    public ResponseEntity<Void> deleteTreatmentPlan(@PathVariable Long id) {
        log.info("DELETE /api/risk-assessments/wizard/treatment-plans/{}", id);
        treatmentPlanService.deleteTreatmentPlan(id);
        return ResponseEntity.ok().build();
    }

    /**
     * Step 7: Submit assessment for review
     * POST /api/risk-assessments/wizard/{id}/submit
     */
    @PostMapping("/{id}/submit")
    public ResponseEntity<RiskAssessmentResponse> submitForReview(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        log.info("POST /api/risk-assessments/wizard/{}/submit", id);
        RiskAssessmentResponse assessment = wizardService.submitForReview(
            id,
            request.get("executiveSummary"),
            request.get("recommendations")
        );
        return ResponseEntity.ok(assessment);
    }

    /**
     * Approve assessment
     * POST /api/risk-assessments/wizard/{id}/approve
     */
    @PostMapping("/{id}/approve")
    public ResponseEntity<RiskAssessmentResponse> approveAssessment(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        log.info("POST /api/risk-assessments/wizard/{}/approve", id);
        RiskAssessmentResponse assessment = wizardService.approveAssessment(
            id,
            request.get("reviewerName"),
            request.get("reviewerEmail")
        );
        return ResponseEntity.ok(assessment);
    }
}

