package com.bcm.service;

import com.bcm.entity.BiaAnswer;
import com.bcm.entity.BiaQuestion;
import com.bcm.entity.BiaRecord;
import com.bcm.enums.BiaCriticality;
import com.bcm.repository.BiaAnswerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * BIA Calculation Service
 * 
 * Processes questionnaire answers to calculate suggested RTO, RPO, and Criticality.
 * 
 * CALCULATION LOGIC:
 * 1. Impact Score = Sum of (Answer Score × Question Weight) for each timeframe
 * 2. Suggested RTO = Earliest timeframe where Impact Score ≥ threshold
 * 3. Suggested RPO = Based on data-related questions
 * 4. Suggested Criticality = Based on RTO and overall impact scores
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class BiaCalculationService {

    private final BiaAnswerRepository answerRepository;

    // Thresholds for determining RTO based on impact scores
    private static final int CRITICAL_THRESHOLD = 32;  // Score ≥ 32 = RTO ≤ 1 hour
    private static final int HIGH_THRESHOLD = 24;      // Score ≥ 24 = RTO ≤ 4 hours
    private static final int MEDIUM_THRESHOLD = 16;    // Score ≥ 16 = RTO ≤ 24 hours
    private static final int LOW_THRESHOLD = 8;        // Score ≥ 8 = RTO ≤ 3 days

    /**
     * Calculate suggested RTO based on questionnaire answers
     * 
     * Algorithm:
     * 1. Group answers by impact timeframe
     * 2. Calculate weighted score for each timeframe
     * 3. Find the earliest timeframe where score exceeds threshold
     * 4. Return that timeframe as suggested RTO
     */
    public Integer calculateSuggestedRto(Long biaId) {
        List<BiaAnswer> answers = answerRepository.findScoredAnswersByBiaId(biaId);
        
        if (answers.isEmpty()) {
            log.warn("No scored answers found for BIA {}", biaId);
            return null;
        }

        // Group answers by timeframe and calculate scores
        Map<String, Integer> timeframeScores = new HashMap<>();
        
        for (BiaAnswer answer : answers) {
            BiaQuestion question = answer.getQuestion();
            if (question.getImpactTimeframe() != null) {
                String timeframe = question.getImpactTimeframe();
                int weightedScore = answer.getWeightedScore();
                timeframeScores.merge(timeframe, weightedScore, Integer::sum);
            }
        }

        // Determine RTO based on timeframe scores
        // Check from shortest to longest timeframe
        if (timeframeScores.getOrDefault("1_HOUR", 0) >= CRITICAL_THRESHOLD) {
            return 1;  // 1 hour
        }
        if (timeframeScores.getOrDefault("4_HOURS", 0) >= HIGH_THRESHOLD) {
            return 4;  // 4 hours
        }
        if (timeframeScores.getOrDefault("24_HOURS", 0) >= MEDIUM_THRESHOLD) {
            return 24;  // 24 hours
        }
        if (timeframeScores.getOrDefault("3_DAYS", 0) >= LOW_THRESHOLD) {
            return 72;  // 3 days (72 hours)
        }
        if (timeframeScores.getOrDefault("1_WEEK", 0) > 0) {
            return 168;  // 1 week (168 hours)
        }

        // Default to 1 week if no significant impact
        return 168;
    }

    /**
     * Calculate suggested RPO based on data-related questions
     * 
     * For now, RPO is set to 50% of RTO as a conservative estimate.
     * This can be enhanced with specific data-related questions.
     */
    public Integer calculateSuggestedRpo(Long biaId) {
        Integer rto = calculateSuggestedRto(biaId);
        if (rto == null) {
            return null;
        }
        
        // Conservative approach: RPO = 50% of RTO
        // This ensures data is backed up more frequently than recovery time
        return Math.max(1, rto / 2);
    }

    /**
     * Calculate suggested criticality based on RTO and impact scores
     */
    public BiaCriticality calculateSuggestedCriticality(Long biaId) {
        Integer rto = calculateSuggestedRto(biaId);
        if (rto == null) {
            return BiaCriticality.LOW;
        }
        
        return BiaCriticality.fromRtoHours(rto);
    }

    /**
     * Calculate all metrics at once
     */
    public BiaCalculationResult calculateAllMetrics(Long biaId) {
        Integer rto = calculateSuggestedRto(biaId);
        Integer rpo = calculateSuggestedRpo(biaId);
        BiaCriticality criticality = calculateSuggestedCriticality(biaId);
        
        return BiaCalculationResult.builder()
            .suggestedRto(rto)
            .suggestedRpo(rpo)
            .suggestedCriticality(criticality)
            .build();
    }

    /**
     * Apply calculated metrics to a BIA record
     */
    public void applyCalculatedMetrics(BiaRecord biaRecord) {
        if (biaRecord.getId() == null) {
            log.warn("Cannot calculate metrics for unsaved BIA record");
            return;
        }

        BiaCalculationResult result = calculateAllMetrics(biaRecord.getId());
        
        // Only update if not already set by user
        if (biaRecord.getFinalRtoHours() == null) {
            biaRecord.setRtoHours(result.getSuggestedRto());
        }
        if (biaRecord.getFinalRpoHours() == null) {
            biaRecord.setRpoHours(result.getSuggestedRpo());
        }
        if (biaRecord.getFinalCriticality() == null && result.getSuggestedCriticality() != null) {
            // Store as string for now (can be enhanced to use enum in BiaRecord)
            // biaRecord.setFinalCriticality(result.getSuggestedCriticality());
        }
    }

    /**
     * Result object for calculation
     */
    @lombok.Data
    @lombok.Builder
    public static class BiaCalculationResult {
        private Integer suggestedRto;
        private Integer suggestedRpo;
        private BiaCriticality suggestedCriticality;
    }
}

