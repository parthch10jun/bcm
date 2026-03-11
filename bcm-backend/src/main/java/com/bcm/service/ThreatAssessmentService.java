package com.bcm.service;

import com.bcm.dto.ThreatAssessmentDTO;
import com.bcm.entity.ThreatAssessment;
import com.bcm.enums.RiskLevel;
import com.bcm.repository.ThreatAssessmentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for ThreatAssessment management
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ThreatAssessmentService {

    private final ThreatAssessmentRepository threatAssessmentRepository;

    /**
     * Get all threat assessments for a risk assessment (as DTOs to avoid lazy loading)
     */
    @Transactional(readOnly = true)
    public List<ThreatAssessmentDTO> getThreatAssessmentsByRiskAssessment(Long riskAssessmentId) {
        log.info("Fetching threat assessments for RA ID: {}", riskAssessmentId);
        List<ThreatAssessment> assessments = threatAssessmentRepository.findByRiskAssessmentId(riskAssessmentId);
        return assessments.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Convert ThreatAssessment entity to DTO
     */
    private ThreatAssessmentDTO convertToDTO(ThreatAssessment ta) {
        return ThreatAssessmentDTO.builder()
                .id(ta.getId())
                .riskAssessmentId(ta.getRiskAssessment() != null ? ta.getRiskAssessment().getId() : null)
                .threatId(ta.getThreat() != null ? ta.getThreat().getId() : null)
                .threatName(ta.getThreat() != null ? ta.getThreat().getName() : null)
                .threatDescription(ta.getThreat() != null ? ta.getThreat().getDescription() : null)
                .likelihood(ta.getLikelihood())
                .impact(ta.getImpact())
                .riskScore(ta.getRiskScore())
                .riskLevel(ta.getRiskLevel())
                .existingControls(ta.getExistingControls())
                .controlEffectiveness(ta.getControlEffectiveness())
                .residualLikelihood(ta.getResidualLikelihood())
                .residualImpact(ta.getResidualImpact())
                .residualRiskScore(ta.getResidualRiskScore())
                .residualRiskLevel(ta.getResidualRiskLevel())
                .isSelected(ta.getIsSelected())
                .velocity(ta.getVelocity())
                .vulnerability(ta.getVulnerability())
                .treatmentOption(ta.getTreatmentOption() != null ? ta.getTreatmentOption().name() : null)
                .build();
    }

    /**
     * Get threat assessment by ID
     */
    @Transactional(readOnly = true)
    public ThreatAssessment getThreatAssessmentById(Long id) {
        log.info("Fetching threat assessment with ID: {}", id);
        ThreatAssessment assessment = threatAssessmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Threat assessment not found with id: " + id));
        
        if (assessment.getIsDeleted()) {
            throw new RuntimeException("Threat assessment has been deleted");
        }
        
        return assessment;
    }

    /**
     * Get high-risk threat assessments for a risk assessment
     */
    @Transactional(readOnly = true)
    public List<ThreatAssessment> getHighRiskThreats(Long riskAssessmentId) {
        log.info("Fetching high-risk threats for RA ID: {}", riskAssessmentId);
        return threatAssessmentRepository.findHighRiskByRiskAssessmentId(riskAssessmentId);
    }

    /**
     * Get threat assessments by risk level
     */
    @Transactional(readOnly = true)
    public List<ThreatAssessment> getThreatAssessmentsByRiskLevel(RiskLevel riskLevel) {
        log.info("Fetching threat assessments with risk level: {}", riskLevel);
        return threatAssessmentRepository.findByRiskLevel(riskLevel);
    }

    /**
     * Update a threat assessment
     */
    @Transactional
    public ThreatAssessment updateThreatAssessment(Long id, ThreatAssessment assessmentDetails) {
        log.info("Updating threat assessment with ID: {}", id);
        
        ThreatAssessment assessment = getThreatAssessmentById(id);
        
        assessment.setLikelihood(assessmentDetails.getLikelihood());
        assessment.setImpact(assessmentDetails.getImpact());
        assessment.setExistingControls(assessmentDetails.getExistingControls());
        assessment.setControlEffectiveness(assessmentDetails.getControlEffectiveness());
        assessment.setResidualLikelihood(assessmentDetails.getResidualLikelihood());
        assessment.setResidualImpact(assessmentDetails.getResidualImpact());
        assessment.setResidualRiskLevel(assessmentDetails.getResidualRiskLevel());
        assessment.setMitigationActions(assessmentDetails.getMitigationActions());
        assessment.setMitigationOwner(assessmentDetails.getMitigationOwner());
        assessment.setMitigationDeadline(assessmentDetails.getMitigationDeadline());
        assessment.setMitigationStatus(assessmentDetails.getMitigationStatus());
        assessment.setNotes(assessmentDetails.getNotes());
        
        // Risk level and score are calculated automatically via @PreUpdate
        
        ThreatAssessment updated = threatAssessmentRepository.save(assessment);
        log.info("Threat assessment updated successfully. Risk Level: {}, Risk Score: {}", 
                updated.getRiskLevel(), updated.getRiskScore());
        return updated;
    }

    /**
     * Bulk update threat assessments
     */
    @Transactional
    public List<ThreatAssessment> bulkUpdateThreatAssessments(List<ThreatAssessment> assessments) {
        log.info("Bulk updating {} threat assessments", assessments.size());
        
        for (ThreatAssessment assessment : assessments) {
            if (assessment.getId() != null) {
                updateThreatAssessment(assessment.getId(), assessment);
            }
        }
        
        log.info("Bulk update completed");
        return assessments;
    }

    /**
     * Delete a threat assessment (soft delete)
     */
    @Transactional
    public void deleteThreatAssessment(Long id) {
        log.info("Deleting threat assessment with ID: {}", id);
        
        ThreatAssessment assessment = getThreatAssessmentById(id);
        assessment.setIsDeleted(true);
        threatAssessmentRepository.save(assessment);
        
        log.info("Threat assessment deleted successfully");
    }
}

