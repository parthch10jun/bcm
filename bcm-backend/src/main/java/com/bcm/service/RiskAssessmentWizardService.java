package com.bcm.service;

import com.bcm.dto.wizard.ContextOverviewResponse;
import com.bcm.dto.wizard.CreateRiskAssessmentRequest;
import com.bcm.dto.wizard.RiskAssessmentResponse;
import com.bcm.dto.wizard.RiskSummaryResponse;
import com.bcm.entity.*;
import com.bcm.enums.RiskAssessmentStatus;
import com.bcm.enums.RiskCategoryCode;
import com.bcm.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Service for Risk Assessment Wizard operations
 * Handles the 7-step wizard workflow
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class RiskAssessmentWizardService {

    private final RiskAssessmentRepository riskAssessmentRepository;
    private final RiskCategoryRepository riskCategoryRepository;
    private final ThreatAssessmentRepository threatAssessmentRepository;
    private final ThreatRepository threatRepository;
    private final RiskContextService riskContextService;
    private final ProcessRepository processRepository;
    private final BiaRecordRepository biaRecordRepository;
    private final ProcessAssetRepository processAssetRepository;
    private final ProcessVendorRepository processVendorRepository;
    private final ProcessVitalRecordRepository processVitalRecordRepository;

    /**
     * Step 1: Create a new Risk Assessment in DRAFT status
     */
    @Transactional
    public RiskAssessmentResponse createDraftAssessment(CreateRiskAssessmentRequest request) {
        log.info("Creating draft risk assessment for context: {} - {}",
                 request.getContextType(), request.getContextId());

        RiskCategory riskCategory = riskCategoryRepository.findById(request.getRiskCategoryId())
            .orElseThrow(() -> new RuntimeException("Risk category not found: " + request.getRiskCategoryId()));

        RiskAssessment assessment = RiskAssessment.builder()
            .assessmentName(request.getAssessmentName())
            .description(request.getDescription())
            .riskCategory(riskCategory)
            .contextType(request.getContextType())
            .contextId(request.getContextId())
            .contextName(request.getContextName())
            .status(RiskAssessmentStatus.DRAFT)
            .assessmentDate(request.getAssessmentDate() != null ? request.getAssessmentDate() : LocalDate.now())
            .assessorName(request.getAssessorName())
            .assessorEmail(request.getAssessorEmail())
            .riskThreshold(request.getRiskThreshold() != null ? request.getRiskThreshold() : 12)
            .completionPercentage(0)
            .currentStep(1)
            .build();

        assessment.setCreatedBy(request.getAssessorEmail() != null ? request.getAssessorEmail() : "system");

        RiskAssessment saved = riskAssessmentRepository.save(assessment);
        log.info("Created draft risk assessment with ID: {}", saved.getId());

        return toDto(saved);
    }

    /**
     * Step 2: Get context overview with BIA summary and linked enablers
     */
    @Transactional(readOnly = true)
    public ContextOverviewResponse getContextOverview(Long riskAssessmentId) {
        log.info("Getting context overview for risk assessment: {}", riskAssessmentId);

        RiskAssessment assessment = riskAssessmentRepository.findById(riskAssessmentId)
            .orElseThrow(() -> new RuntimeException("Risk assessment not found: " + riskAssessmentId));

        ContextOverviewResponse.ContextOverviewResponseBuilder builder = ContextOverviewResponse.builder()
            .contextId(assessment.getContextId())
            .contextType(assessment.getContextType().name())
            .contextName(assessment.getContextName());

        // Get context-specific details based on type
        if (assessment.getContextType() == RiskCategoryCode.PROCESS) {
            return getProcessContextOverview(assessment, builder);
        }
        
        // For other context types, return basic info for now
        return builder
            .linkedEnabers(new ArrayList<>())
            .dependentProcesses(new ArrayList<>())
            .build();
    }

    private ContextOverviewResponse getProcessContextOverview(
            RiskAssessment assessment,
            ContextOverviewResponse.ContextOverviewResponseBuilder builder) {

        Optional<com.bcm.entity.Process> processOpt = processRepository.findById(assessment.getContextId());
        if (processOpt.isEmpty()) {
            return builder.build();
        }

        com.bcm.entity.Process process = processOpt.get();
        builder.contextDescription(process.getDescription());

        // Get BIA summary if exists
        Optional<BiaRecord> biaOpt = biaRecordRepository.findByTarget(
            process.getId(), com.bcm.enums.BiaTargetType.PROCESS
        ).stream().findFirst();

        if (biaOpt.isPresent()) {
            BiaRecord bia = biaOpt.get();

            // Convert hours to readable format
            String mtpd = bia.getMtpdHours() != null ? bia.getMtpdHours() + " hours" : null;
            String rto = bia.getEffectiveRto() != null ? bia.getEffectiveRto() + " hours" : null;

            builder.biaSummary(ContextOverviewResponse.BiaSummary.builder()
                .biaId(bia.getId())
                .mtpd(mtpd)
                .rto(rto)
                .criticality(bia.getFinalCriticality() != null ? bia.getFinalCriticality().name() : null)
                .owner(bia.getBiaCoordinator())
                .build());
        }

        // Get linked enablers
        List<ContextOverviewResponse.EnablerInfo> enablers = new ArrayList<>();

        // Technology/Applications (Assets)
        List<ProcessAsset> processAssets = processAssetRepository.findByProcessId(process.getId());
        for (ProcessAsset pa : processAssets) {
            enablers.add(ContextOverviewResponse.EnablerInfo.builder()
                .enablerType("TECHNOLOGY")
                .enablerId(pa.getAsset().getId())
                .enablerName(pa.getAsset().getAssetName())
                .status(pa.getAsset().getStatus() != null ? pa.getAsset().getStatus().name() : null)
                .build());
        }

        // Vendors
        List<ProcessVendor> processVendors = processVendorRepository.findByProcessIdAndIsDeletedFalse(process.getId());
        for (ProcessVendor pv : processVendors) {
            enablers.add(ContextOverviewResponse.EnablerInfo.builder()
                .enablerType("VENDOR")
                .enablerId(pv.getVendor().getId())
                .enablerName(pv.getVendor().getVendorName())
                .status(pv.getVendor().getStatus() != null ? pv.getVendor().getStatus().name() : null)
                .build());
        }

        // Vital Records
        List<ProcessVitalRecord> processRecords = processVitalRecordRepository.findByProcessId(process.getId());
        for (ProcessVitalRecord pvr : processRecords) {
            enablers.add(ContextOverviewResponse.EnablerInfo.builder()
                .enablerType("VITAL_RECORD")
                .enablerId(pvr.getVitalRecord().getId())
                .enablerName(pvr.getVitalRecord().getRecordName())
                .status(pvr.getVitalRecord().getStatus() != null ? pvr.getVitalRecord().getStatus().name() : null)
                .build());
        }

        builder.linkedEnabers(enablers);
        builder.dependentProcesses(new ArrayList<>());  // TODO: Add upstream/downstream processes

        return builder.build();
    }

    /**
     * Step 3: Initialize threat assessments with applicable threats
     */
    @Transactional
    public List<ThreatAssessment> initializeThreats(Long riskAssessmentId) {
        log.info("Initializing threats for risk assessment: {}", riskAssessmentId);

        RiskAssessment assessment = riskAssessmentRepository.findById(riskAssessmentId)
            .orElseThrow(() -> new RuntimeException("Risk assessment not found: " + riskAssessmentId));

        // Check if threats are already initialized
        List<ThreatAssessment> existingAssessments = threatAssessmentRepository.findByRiskAssessmentId(riskAssessmentId);
        if (!existingAssessments.isEmpty()) {
            log.info("Threats already initialized for risk assessment: {}", riskAssessmentId);
            return existingAssessments;
        }

        // Get applicable threats using RiskContextService
        List<Threat> applicableThreats = riskContextService.getApplicableThreats(
            assessment.getRiskCategory().getId(),
            assessment.getContextType(),
            assessment.getContextId()
        );

        log.info("Found {} applicable threats", applicableThreats.size());

        // Create ThreatAssessment for each applicable threat
        List<ThreatAssessment> threatAssessments = new ArrayList<>();
        for (Threat threat : applicableThreats) {
            ThreatAssessment ta = ThreatAssessment.builder()
                .riskAssessment(assessment)
                .threat(threat)
                .isSelected(true)
                .build();

            threatAssessments.add(ta);
        }

        List<ThreatAssessment> saved = threatAssessmentRepository.saveAll(threatAssessments);
        
        // Update assessment progress
        assessment.setCurrentStep(3);
        assessment.setCompletionPercentage(30);
        riskAssessmentRepository.save(assessment);

        log.info("Created {} threat assessments", saved.size());
        return saved;
    }

    /**
     * Step 4: Assess a specific threat with likelihood and impact
     */
    @Transactional
    public void assessThreat(Long threatAssessmentId, String likelihood, String impact,
                            String existingControls, String controlEffectiveness) {
        log.info("Assessing threat: {} with likelihood={}, impact={}", threatAssessmentId, likelihood, impact);

        ThreatAssessment assessment = threatAssessmentRepository.findById(threatAssessmentId)
            .orElseThrow(() -> new RuntimeException("Threat assessment not found: " + threatAssessmentId));

        // Convert strings to enums
        com.bcm.enums.LikelihoodLevel likelihoodEnum = com.bcm.enums.LikelihoodLevel.valueOf(likelihood);
        com.bcm.enums.RiskImpactLevel impactEnum = com.bcm.enums.RiskImpactLevel.valueOf(impact);

        // Update assessment details
        assessment.setLikelihood(likelihoodEnum);
        assessment.setImpact(impactEnum);
        assessment.setExistingControls(existingControls);
        assessment.setControlEffectiveness(controlEffectiveness);

        // Calculate risk score (Likelihood × Impact)
        int likelihoodScore = getLikelihoodScore(likelihoodEnum);
        int impactScore = getImpactScore(impactEnum);
        int riskScore = likelihoodScore * impactScore;

        assessment.setRiskScore(riskScore);
        assessment.setRiskLevel(getRiskLevel(riskScore));

        threatAssessmentRepository.save(assessment);
        log.info("Threat assessment updated with risk score: {}", riskScore);
    }

    /**
     * Helper: Convert likelihood enum to numeric score
     */
    private int getLikelihoodScore(com.bcm.enums.LikelihoodLevel likelihood) {
        if (likelihood == null) return 0;
        return likelihood.getScore();
    }

    /**
     * Helper: Convert impact enum to numeric score
     */
    private int getImpactScore(com.bcm.enums.RiskImpactLevel impact) {
        if (impact == null) return 0;
        return impact.getScore();
    }

    /**
     * Helper: Determine risk level based on score
     */
    private com.bcm.enums.RiskLevel getRiskLevel(int riskScore) {
        if (riskScore <= 6) return com.bcm.enums.RiskLevel.LOW;
        if (riskScore <= 14) return com.bcm.enums.RiskLevel.MEDIUM;
        return com.bcm.enums.RiskLevel.HIGH;
    }

    /**
     * Step 4b: Update threat assessment with evaluation scores
     * (Individual updates handled by ThreatAssessmentService)
     */
    @Transactional
    public void updateAssessmentProgress(Long riskAssessmentId, Integer step, Integer percentage) {
        RiskAssessment assessment = riskAssessmentRepository.findById(riskAssessmentId)
            .orElseThrow(() -> new RuntimeException("Risk assessment not found: " + riskAssessmentId));

        assessment.setCurrentStep(step);
        assessment.setCompletionPercentage(percentage);
        riskAssessmentRepository.save(assessment);
    }

    /**
     * Step 5: Get risk summary with heatmap and threshold analysis
     */
    @Transactional(readOnly = true)
    public RiskSummaryResponse getRiskSummary(Long riskAssessmentId) {
        log.info("Generating risk summary for assessment: {}", riskAssessmentId);

        RiskAssessment assessment = riskAssessmentRepository.findById(riskAssessmentId)
            .orElseThrow(() -> new RuntimeException("Risk assessment not found: " + riskAssessmentId));

        List<ThreatAssessment> threatAssessments = assessment.getThreatAssessments().stream()
            .filter(ta -> !ta.getIsDeleted() && ta.getIsSelected())
            .collect(Collectors.toList());

        // Build heatmap data
        RiskSummaryResponse.HeatmapData inherentHeatmap = buildHeatmapData(threatAssessments, false);
        RiskSummaryResponse.HeatmapData residualHeatmap = buildHeatmapData(threatAssessments, true);

        // Build threshold analysis
        RiskSummaryResponse.ThresholdAnalysis thresholdAnalysis = buildThresholdAnalysis(
            threatAssessments, assessment.getRiskThreshold()
        );

        // Group threats by risk level
        Map<String, List<RiskSummaryResponse.ThreatSummary>> threatsByRiskLevel = groupThreatsByRiskLevel(threatAssessments);

        // Calculate statistics
        long threatsAssessed = threatAssessments.stream()
            .filter(ta -> ta.getLikelihood() != null && ta.getImpact() != null)
            .count();

        long threatsWithPlans = threatAssessments.stream()
            .filter(ta -> !ta.getTreatmentPlans().isEmpty())
            .count();

        // Count threats by risk level
        long highRiskCount = threatAssessments.stream()
            .filter(ta -> ta.getRiskLevel() == com.bcm.enums.RiskLevel.HIGH)
            .count();

        long mediumRiskCount = threatAssessments.stream()
            .filter(ta -> ta.getRiskLevel() == com.bcm.enums.RiskLevel.MEDIUM)
            .count();

        long lowRiskCount = threatAssessments.stream()
            .filter(ta -> ta.getRiskLevel() == com.bcm.enums.RiskLevel.LOW)
            .count();

        return RiskSummaryResponse.builder()
            .inherentRiskHeatmap(inherentHeatmap)
            .residualRiskHeatmap(residualHeatmap)
            .thresholdAnalysis(thresholdAnalysis)
            .threatsByRiskLevel(threatsByRiskLevel)
            .totalThreats(threatAssessments.size())
            .threatsAssessed((int) threatsAssessed)
            .assessedThreats((int) threatsAssessed)
            .threatsWithTreatmentPlans((int) threatsWithPlans)
            .highRiskCount((int) highRiskCount)
            .mediumRiskCount((int) mediumRiskCount)
            .lowRiskCount((int) lowRiskCount)
            .build();
    }

    /**
     * Step 7: Submit assessment for review
     */
    @Transactional
    public RiskAssessmentResponse submitForReview(Long riskAssessmentId, String executiveSummary, String recommendations) {
        log.info("Submitting risk assessment for review: {}", riskAssessmentId);

        RiskAssessment assessment = riskAssessmentRepository.findById(riskAssessmentId)
            .orElseThrow(() -> new RuntimeException("Risk assessment not found: " + riskAssessmentId));

        assessment.setStatus(RiskAssessmentStatus.UNDER_REVIEW);
        assessment.setExecutiveSummary(executiveSummary);
        assessment.setRecommendations(recommendations);
        assessment.setCurrentStep(7);
        assessment.setCompletionPercentage(100);
        assessment.setReviewDate(LocalDate.now());

        RiskAssessment saved = riskAssessmentRepository.save(assessment);
        return toDto(saved);
    }

    /**
     * Approve assessment
     */
    @Transactional
    public RiskAssessmentResponse approveAssessment(Long riskAssessmentId, String reviewerName, String reviewerEmail) {
        RiskAssessment assessment = riskAssessmentRepository.findById(riskAssessmentId)
            .orElseThrow(() -> new RuntimeException("Risk assessment not found: " + riskAssessmentId));

        assessment.setStatus(RiskAssessmentStatus.APPROVED);
        assessment.setReviewerName(reviewerName);
        assessment.setReviewerEmail(reviewerEmail);
        assessment.setReviewDate(LocalDate.now());

        RiskAssessment saved = riskAssessmentRepository.save(assessment);
        return toDto(saved);
    }

    // ========== HELPER METHODS ==========

    private RiskSummaryResponse.HeatmapData buildHeatmapData(List<ThreatAssessment> threatAssessments, boolean useResidual) {
        Map<String, RiskSummaryResponse.HeatmapData.HeatmapCell> cellMap = new HashMap<>();

        for (ThreatAssessment ta : threatAssessments) {
            Integer likelihood = null;
            Integer impact = null;
            String riskLevel = null;

            if (useResidual && ta.getResidualLikelihood() != null && ta.getResidualImpact() != null) {
                try {
                    likelihood = com.bcm.enums.LikelihoodLevel.valueOf(ta.getResidualLikelihood()).getScore();
                    impact = com.bcm.enums.RiskImpactLevel.valueOf(ta.getResidualImpact()).getScore();
                    riskLevel = ta.getResidualRiskLevel();
                } catch (Exception e) {
                    continue;
                }
            } else if (!useResidual && ta.getLikelihood() != null && ta.getImpact() != null) {
                likelihood = ta.getLikelihood().getScore();
                impact = ta.getImpact().getScore();
                riskLevel = ta.getRiskLevel() != null ? ta.getRiskLevel().name() : null;
            } else {
                continue;
            }

            String key = likelihood + "-" + impact;
            RiskSummaryResponse.HeatmapData.HeatmapCell cell = cellMap.getOrDefault(key,
                RiskSummaryResponse.HeatmapData.HeatmapCell.builder()
                    .likelihood(likelihood)
                    .impact(impact)
                    .count(0)
                    .riskLevel(riskLevel)
                    .threatNames(new ArrayList<>())
                    .build()
            );

            cell.setCount(cell.getCount() + 1);
            cell.getThreatNames().add(ta.getThreat().getName());
            cellMap.put(key, cell);
        }

        return RiskSummaryResponse.HeatmapData.builder()
            .cells(new ArrayList<>(cellMap.values()))
            .build();
    }

    private RiskSummaryResponse.ThresholdAnalysis buildThresholdAnalysis(
            List<ThreatAssessment> threatAssessments, Integer threshold) {

        int withinInherent = 0;
        int beyondInherent = 0;
        int withinResidual = 0;
        int beyondResidual = 0;

        for (ThreatAssessment ta : threatAssessments) {
            // Inherent risk
            if (ta.getRiskScore() != null) {
                if (ta.getRiskScore() < threshold) {
                    withinInherent++;
                } else {
                    beyondInherent++;
                }
            }

            // Residual risk
            if (ta.getResidualRiskScore() != null) {
                if (ta.getResidualRiskScore() < threshold) {
                    withinResidual++;
                } else {
                    beyondResidual++;
                }
            }
        }

        double reductionPercentage = 0.0;
        if (beyondInherent > 0) {
            reductionPercentage = ((double) (beyondInherent - beyondResidual) / beyondInherent) * 100;
        }

        return RiskSummaryResponse.ThresholdAnalysis.builder()
            .threshold(threshold)
            .withinThresholdInherent(withinInherent)
            .beyondThresholdInherent(beyondInherent)
            .withinThresholdResidual(withinResidual)
            .beyondThresholdResidual(beyondResidual)
            .riskReductionPercentage(reductionPercentage)
            .build();
    }

    private Map<String, List<RiskSummaryResponse.ThreatSummary>> groupThreatsByRiskLevel(
            List<ThreatAssessment> threatAssessments) {

        Map<String, List<RiskSummaryResponse.ThreatSummary>> grouped = new HashMap<>();
        grouped.put("HIGH", new ArrayList<>());
        grouped.put("MEDIUM", new ArrayList<>());
        grouped.put("LOW", new ArrayList<>());
        grouped.put("UNASSESSED", new ArrayList<>());

        for (ThreatAssessment ta : threatAssessments) {
            RiskSummaryResponse.ThreatSummary summary = RiskSummaryResponse.ThreatSummary.builder()
                .threatAssessmentId(ta.getId())
                .threatId(ta.getThreat().getId())
                .threatName(ta.getThreat().getName())
                .threatType(ta.getThreat().getThreatType().getName())
                .inherentScore(ta.getRiskScore())
                .inherentRiskLevel(ta.getRiskLevel() != null ? ta.getRiskLevel().name() : null)
                .residualScore(ta.getResidualRiskScore())
                .residualRiskLevel(ta.getResidualRiskLevel())
                .treatmentOption(ta.getTreatmentOption() != null ? ta.getTreatmentOption().name() : null)
                .hasTreatmentPlan(!ta.getTreatmentPlans().isEmpty())
                .build();

            String riskLevel = ta.getRiskLevel() != null ? ta.getRiskLevel().name() : "UNASSESSED";
            grouped.get(riskLevel).add(summary);
        }

        return grouped;
    }

    /**
     * Convert RiskAssessment entity to DTO
     */
    private RiskAssessmentResponse toDto(RiskAssessment assessment) {
        return RiskAssessmentResponse.builder()
            .id(assessment.getId())
            .assessmentName(assessment.getAssessmentName())
            .description(assessment.getDescription())
            .status(assessment.getStatus())
            .contextType(assessment.getContextType())
            .contextId(assessment.getContextId())
            .contextName(assessment.getContextName())
            .assessorName(assessment.getAssessorName())
            .assessorEmail(assessment.getAssessorEmail())
            .assessmentDate(assessment.getAssessmentDate())
            .riskThreshold(assessment.getRiskThreshold())
            .completionPercentage(assessment.getCompletionPercentage())
            .currentStep(assessment.getCurrentStep())
            .executiveSummary(assessment.getExecutiveSummary())
            .recommendations(assessment.getRecommendations())
            .createdAt(assessment.getCreatedAt())
            .updatedAt(assessment.getUpdatedAt())
            .build();
    }
}

