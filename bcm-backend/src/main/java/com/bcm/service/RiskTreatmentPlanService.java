package com.bcm.service;

import com.bcm.dto.wizard.TreatmentPlanRequest;
import com.bcm.dto.wizard.TreatmentPlanResponse;
import com.bcm.entity.RiskTreatmentPlan;
import com.bcm.entity.ThreatAssessment;
import com.bcm.enums.TreatmentOption;
import com.bcm.enums.TreatmentPlanStatus;
import com.bcm.repository.RiskTreatmentPlanRepository;
import com.bcm.repository.ThreatAssessmentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for managing Risk Treatment Plans
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class RiskTreatmentPlanService {

    private final RiskTreatmentPlanRepository treatmentPlanRepository;
    private final ThreatAssessmentRepository threatAssessmentRepository;

    /**
     * Get all treatment plans for a risk assessment
     */
    @Transactional(readOnly = true)
    public List<TreatmentPlanResponse> getTreatmentPlansByRiskAssessment(Long riskAssessmentId) {
        log.info("Getting treatment plans for risk assessment: {}", riskAssessmentId);
        
        List<RiskTreatmentPlan> plans = treatmentPlanRepository.findByRiskAssessmentId(riskAssessmentId);
        return plans.stream()
            .map(this::toDto)
            .collect(Collectors.toList());
    }

    /**
     * Get treatment plans for a specific threat assessment
     */
    @Transactional(readOnly = true)
    public List<TreatmentPlanResponse> getTreatmentPlansByThreatAssessment(Long threatAssessmentId) {
        log.info("Getting treatment plans for threat assessment: {}", threatAssessmentId);
        
        List<RiskTreatmentPlan> plans = treatmentPlanRepository.findByThreatAssessmentIdAndIsDeletedFalse(threatAssessmentId);
        return plans.stream()
            .map(this::toDto)
            .collect(Collectors.toList());
    }

    /**
     * Create a new treatment plan
     */
    @Transactional
    public TreatmentPlanResponse createTreatmentPlan(TreatmentPlanRequest request) {
        log.info("Creating treatment plan for threat assessment: {}", request.getThreatAssessmentId());

        ThreatAssessment threatAssessment = threatAssessmentRepository.findById(request.getThreatAssessmentId())
            .orElseThrow(() -> new RuntimeException("Threat assessment not found: " + request.getThreatAssessmentId()));

        RiskTreatmentPlan plan = RiskTreatmentPlan.builder()
            .threatAssessment(threatAssessment)
            .treatmentOption(TreatmentOption.valueOf(request.getTreatmentOption()))
            .actionDescription(request.getActionDescription())
            .actionOwner(request.getActionOwner())
            .targetDate(request.getTargetDate())
            .status(request.getStatus() != null ? TreatmentPlanStatus.valueOf(request.getStatus()) : TreatmentPlanStatus.PLANNED)
            .build();

        RiskTreatmentPlan saved = treatmentPlanRepository.save(plan);
        log.info("Created treatment plan with ID: {}", saved.getId());

        return toDto(saved);
    }

    /**
     * Update an existing treatment plan
     */
    @Transactional
    public TreatmentPlanResponse updateTreatmentPlan(Long id, TreatmentPlanRequest request) {
        log.info("Updating treatment plan: {}", id);

        RiskTreatmentPlan plan = treatmentPlanRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Treatment plan not found: " + id));

        if (request.getTreatmentOption() != null) {
            plan.setTreatmentOption(TreatmentOption.valueOf(request.getTreatmentOption()));
        }
        if (request.getActionDescription() != null) {
            plan.setActionDescription(request.getActionDescription());
        }
        if (request.getActionOwner() != null) {
            plan.setActionOwner(request.getActionOwner());
        }
        if (request.getTargetDate() != null) {
            plan.setTargetDate(request.getTargetDate());
        }
        if (request.getStatus() != null) {
            plan.setStatus(TreatmentPlanStatus.valueOf(request.getStatus()));
        }

        RiskTreatmentPlan updated = treatmentPlanRepository.save(plan);
        return toDto(updated);
    }

    /**
     * Delete a treatment plan
     */
    @Transactional
    public void deleteTreatmentPlan(Long id) {
        log.info("Deleting treatment plan: {}", id);

        RiskTreatmentPlan plan = treatmentPlanRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Treatment plan not found: " + id));

        plan.setIsDeleted(true);
        treatmentPlanRepository.save(plan);
    }

    /**
     * Convert entity to DTO
     */
    private TreatmentPlanResponse toDto(RiskTreatmentPlan plan) {
        return TreatmentPlanResponse.builder()
            .id(plan.getId())
            .threatAssessmentId(plan.getThreatAssessment().getId())
            .threatId(plan.getThreatAssessment().getThreat().getId())
            .threatName(plan.getThreatAssessment().getThreat().getName())
            .treatmentOption(plan.getTreatmentOption() != null ? plan.getTreatmentOption().name() : null)
            .actionDescription(plan.getActionDescription())
            .actionOwner(plan.getActionOwner())
            .targetDate(plan.getTargetDate())
            .status(plan.getStatus() != null ? plan.getStatus().name() : null)
            .completionDate(plan.getCompletionDate())
            .effectivenessReview(plan.getEffectivenessReview())
            .createdAt(plan.getCreatedAt())
            .updatedAt(plan.getUpdatedAt())
            .build();
    }
}

