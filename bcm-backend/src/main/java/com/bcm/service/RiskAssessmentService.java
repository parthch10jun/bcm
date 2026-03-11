package com.bcm.service;

import com.bcm.entity.RiskAssessment;
import com.bcm.entity.RiskCategory;
import com.bcm.entity.Threat;
import com.bcm.entity.ThreatAssessment;
import com.bcm.enums.RiskAssessmentStatus;
import com.bcm.enums.RiskCategoryCode;
import com.bcm.enums.RiskLevel;
import com.bcm.repository.RiskAssessmentRepository;
import com.bcm.repository.ThreatAssessmentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Service for RiskAssessment management
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class RiskAssessmentService {

    private final RiskAssessmentRepository riskAssessmentRepository;
    private final ThreatAssessmentRepository threatAssessmentRepository;
    private final RiskCategoryService riskCategoryService;
    private final RiskContextService riskContextService;
    private final ThreatService threatService;

    /**
     * Get all risk assessments
     */
    @Transactional(readOnly = true)
    public List<RiskAssessment> getAllRiskAssessments() {
        log.info("Fetching all risk assessments");
        List<RiskAssessment> assessments = riskAssessmentRepository.findByIsDeletedFalseOrderByCreatedAtDesc();

        // Initialize lazy collections to avoid LazyInitializationException
        assessments.forEach(ra -> {
            ra.getThreatAssessments().size();
            // Initialize RiskCategory lazy collections
            if (ra.getRiskCategory() != null) {
                ra.getRiskCategory().getRiskCategoryThreats().size();
            }
        });

        return assessments;
    }

    /**
     * Get risk assessment by ID
     */
    @Transactional(readOnly = true)
    public RiskAssessment getRiskAssessmentById(Long id) {
        log.info("Fetching risk assessment with ID: {}", id);
        RiskAssessment assessment = riskAssessmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Risk assessment not found with id: " + id));
        
        if (assessment.getIsDeleted()) {
            throw new RuntimeException("Risk assessment has been deleted");
        }
        
        // Initialize lazy collections
        assessment.getThreatAssessments().size();
        
        return assessment;
    }

    /**
     * Get risk assessments by status
     */
    @Transactional(readOnly = true)
    public List<RiskAssessment> getRiskAssessmentsByStatus(RiskAssessmentStatus status) {
        log.info("Fetching risk assessments with status: {}", status);
        List<RiskAssessment> assessments = riskAssessmentRepository.findByStatusAndIsDeletedFalseOrderByCreatedAtDesc(status);
        
        // Initialize lazy collections
        assessments.forEach(ra -> ra.getThreatAssessments().size());
        
        return assessments;
    }

    /**
     * Get risk assessments for a specific context
     */
    @Transactional(readOnly = true)
    public List<RiskAssessment> getRiskAssessmentsByContext(RiskCategoryCode contextType, Long contextId) {
        log.info("Fetching risk assessments for context: {} ID: {}", contextType, contextId);
        List<RiskAssessment> assessments = riskAssessmentRepository.findByContext(contextType, contextId);
        
        // Initialize lazy collections
        assessments.forEach(ra -> ra.getThreatAssessments().size());
        
        return assessments;
    }

    /**
     * Get latest risk assessment for a specific context
     */
    @Transactional(readOnly = true)
    public RiskAssessment getLatestRiskAssessment(RiskCategoryCode contextType, Long contextId) {
        log.info("Fetching latest risk assessment for context: {} ID: {}", contextType, contextId);
        RiskAssessment assessment = riskAssessmentRepository.findLatestByContext(contextType, contextId);
        
        if (assessment != null) {
            // Initialize lazy collections
            assessment.getThreatAssessments().size();
        }
        
        return assessment;
    }

    /**
     * Create a new risk assessment
     */
    @Transactional
    public RiskAssessment createRiskAssessment(RiskAssessment riskAssessment) {
        log.info("Creating new risk assessment: {}", riskAssessment.getAssessmentName());
        
        // Validate risk category
        RiskCategory category = riskCategoryService.getRiskCategoryById(riskAssessment.getRiskCategory().getId());
        riskAssessment.setRiskCategory(category);
        
        // Get context details
        Map<String, Object> contextDetails = riskContextService.getContextDetails(
                riskAssessment.getContextType(), 
                riskAssessment.getContextId()
        );
        riskAssessment.setContextName((String) contextDetails.get("name"));
        
        // Set default values
        if (riskAssessment.getStatus() == null) {
            riskAssessment.setStatus(RiskAssessmentStatus.DRAFT);
        }
        if (riskAssessment.getAssessmentDate() == null) {
            riskAssessment.setAssessmentDate(LocalDate.now());
        }
        
        RiskAssessment saved = riskAssessmentRepository.save(riskAssessment);
        log.info("Risk assessment created successfully with ID: {}", saved.getId());
        
        // Auto-create threat assessments for applicable threats
        createThreatAssessmentsForRA(saved);
        
        return saved;
    }

    /**
     * Auto-create threat assessments for a risk assessment
     */
    @Transactional
    public void createThreatAssessmentsForRA(RiskAssessment riskAssessment) {
        log.info("Creating threat assessments for RA ID: {}", riskAssessment.getId());
        
        // Get applicable threats
        List<Threat> applicableThreats = riskContextService.getApplicableThreats(
                riskAssessment.getRiskCategory().getId(),
                riskAssessment.getContextType(),
                riskAssessment.getContextId()
        );
        
        log.info("Found {} applicable threats", applicableThreats.size());
        
        // Create a ThreatAssessment for each applicable threat
        for (Threat threat : applicableThreats) {
            ThreatAssessment ta = ThreatAssessment.builder()
                    .riskAssessment(riskAssessment)
                    .threat(threat)
                    .likelihood(threat.getDefaultLikelihood())
                    .impact(threat.getDefaultImpact())
                    .build();
            
            riskAssessment.getThreatAssessments().add(ta);
        }
        
        riskAssessmentRepository.save(riskAssessment);
        log.info("Created {} threat assessments", applicableThreats.size());
    }

    /**
     * Update an existing risk assessment
     */
    @Transactional
    public RiskAssessment updateRiskAssessment(Long id, RiskAssessment assessmentDetails) {
        log.info("Updating risk assessment with ID: {}", id);
        
        RiskAssessment assessment = getRiskAssessmentById(id);
        
        assessment.setAssessmentName(assessmentDetails.getAssessmentName());
        assessment.setDescription(assessmentDetails.getDescription());
        assessment.setAssessmentDate(assessmentDetails.getAssessmentDate());
        assessment.setReviewDate(assessmentDetails.getReviewDate());
        assessment.setNextReviewDate(assessmentDetails.getNextReviewDate());
        assessment.setAssessorName(assessmentDetails.getAssessorName());
        assessment.setAssessorEmail(assessmentDetails.getAssessorEmail());
        assessment.setReviewerName(assessmentDetails.getReviewerName());
        assessment.setReviewerEmail(assessmentDetails.getReviewerEmail());
        assessment.setExecutiveSummary(assessmentDetails.getExecutiveSummary());
        assessment.setRecommendations(assessmentDetails.getRecommendations());
        
        RiskAssessment updated = riskAssessmentRepository.save(assessment);
        log.info("Risk assessment updated successfully");
        return updated;
    }

    /**
     * Update risk assessment status
     */
    @Transactional
    public RiskAssessment updateStatus(Long id, RiskAssessmentStatus newStatus) {
        log.info("Updating risk assessment {} status to: {}", id, newStatus);
        
        RiskAssessment assessment = getRiskAssessmentById(id);
        
        // Validate status transition
        validateStatusTransition(assessment.getStatus(), newStatus);
        
        assessment.setStatus(newStatus);
        
        // Set review date when approved
        if (newStatus == RiskAssessmentStatus.APPROVED) {
            assessment.setReviewDate(LocalDate.now());
            // Set next review date to 1 year from now
            assessment.setNextReviewDate(LocalDate.now().plusYears(1));
        }
        
        RiskAssessment updated = riskAssessmentRepository.save(assessment);
        log.info("Risk assessment status updated successfully");
        return updated;
    }

    /**
     * Validate status transition
     */
    private void validateStatusTransition(RiskAssessmentStatus currentStatus, RiskAssessmentStatus newStatus) {
        // Add business rules for status transitions
        if (currentStatus == RiskAssessmentStatus.APPROVED && newStatus == RiskAssessmentStatus.DRAFT) {
            throw new RuntimeException("Cannot move approved assessment back to draft");
        }
        if (currentStatus == RiskAssessmentStatus.ARCHIVED) {
            throw new RuntimeException("Cannot modify archived assessment");
        }
    }

    /**
     * Get risk distribution for a risk assessment
     */
    @Transactional(readOnly = true)
    public Map<RiskLevel, Long> getRiskDistribution(Long riskAssessmentId) {
        log.info("Getting risk distribution for RA ID: {}", riskAssessmentId);
        
        Map<RiskLevel, Long> distribution = new HashMap<>();
        distribution.put(RiskLevel.LOW, threatAssessmentRepository.countByRiskAssessmentIdAndRiskLevel(riskAssessmentId, RiskLevel.LOW));
        distribution.put(RiskLevel.MEDIUM, threatAssessmentRepository.countByRiskAssessmentIdAndRiskLevel(riskAssessmentId, RiskLevel.MEDIUM));
        distribution.put(RiskLevel.HIGH, threatAssessmentRepository.countByRiskAssessmentIdAndRiskLevel(riskAssessmentId, RiskLevel.HIGH));
        
        log.info("Risk distribution: {}", distribution);
        return distribution;
    }

    /**
     * Get dashboard statistics
     */
    @Transactional(readOnly = true)
    public Map<String, Object> getDashboardStatistics() {
        log.info("Getting dashboard statistics");
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalAssessments", riskAssessmentRepository.countTotal());
        stats.put("draftAssessments", riskAssessmentRepository.countByStatus(RiskAssessmentStatus.DRAFT));
        stats.put("inProgressAssessments", riskAssessmentRepository.countByStatus(RiskAssessmentStatus.IN_PROGRESS));
        stats.put("underReviewAssessments", riskAssessmentRepository.countByStatus(RiskAssessmentStatus.UNDER_REVIEW));
        stats.put("approvedAssessments", riskAssessmentRepository.countByStatus(RiskAssessmentStatus.APPROVED));
        
        return stats;
    }

    /**
     * Delete a risk assessment (soft delete)
     */
    @Transactional
    public void deleteRiskAssessment(Long id) {
        log.info("Deleting risk assessment with ID: {}", id);
        
        RiskAssessment assessment = getRiskAssessmentById(id);
        
        // Only allow deletion of draft assessments
        if (assessment.getStatus() != RiskAssessmentStatus.DRAFT) {
            throw new RuntimeException("Only draft assessments can be deleted");
        }
        
        assessment.setIsDeleted(true);
        riskAssessmentRepository.save(assessment);
        log.info("Risk assessment deleted successfully");
    }

    /**
     * Search risk assessments by name
     */
    @Transactional(readOnly = true)
    public List<RiskAssessment> searchRiskAssessments(String searchTerm) {
        log.info("Searching risk assessments with term: {}", searchTerm);
        List<RiskAssessment> assessments = riskAssessmentRepository.searchByName(searchTerm);
        
        // Initialize lazy collections
        assessments.forEach(ra -> ra.getThreatAssessments().size());
        
        return assessments;
    }
}

