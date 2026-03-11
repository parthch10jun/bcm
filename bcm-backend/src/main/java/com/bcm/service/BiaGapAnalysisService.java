package com.bcm.service;

import com.bcm.dto.BiaGapAnalysisDTO;
import com.bcm.entity.*;
import com.bcm.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * BIA Gap Analysis Service
 * 
 * Compares BIA requirements (RTO/RPO) against dependency capabilities
 * to identify gaps that need to be addressed.
 * 
 * GAP ANALYSIS LOGIC:
 * 1. For each dependency, compare requirement vs capability
 * 2. Identify gaps where capability < requirement
 * 3. Classify gap severity based on difference
 * 4. Provide recommendations for closing gaps
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class BiaGapAnalysisService {

    private final BiaRecordRepository biaRecordRepository;
    private final BiaDependentAssetRepository assetRepository;
    private final BiaDependentVendorRepository vendorRepository;
    private final BiaDependentVitalRecordRepository vitalRecordRepository;
    private final BiaDependentPersonRepository personRepository;
    private final BiaDependentProcessRepository processRepository;

    /**
     * Perform complete gap analysis for a BIA
     */
    public BiaGapAnalysisDTO performGapAnalysis(Long biaId) {
        BiaRecord bia = biaRecordRepository.findById(biaId)
            .orElseThrow(() -> new RuntimeException("BIA not found: " + biaId));

        Integer requiredRto = bia.getEffectiveRto();
        Integer requiredRpo = bia.getEffectiveRpo();
        
        if (requiredRto == null) {
            log.warn("BIA {} has no RTO defined, cannot perform gap analysis", biaId);
            return createEmptyGapAnalysis(bia);
        }

        // Analyze each dependency category
        List<BiaGapAnalysisDTO.GapDetail> assetGaps = analyzeAssetGaps(biaId, requiredRto);
        List<BiaGapAnalysisDTO.GapDetail> vendorGaps = analyzeVendorGaps(biaId, requiredRto);
        List<BiaGapAnalysisDTO.GapDetail> vitalRecordGaps = analyzeVitalRecordGaps(biaId, requiredRpo);
        List<BiaGapAnalysisDTO.GapDetail> peopleGaps = analyzePeopleGaps(biaId);
        List<BiaGapAnalysisDTO.GapDetail> processGaps = analyzeProcessGaps(biaId, requiredRto);

        // Calculate totals
        int totalGaps = assetGaps.size() + vendorGaps.size() + vitalRecordGaps.size() + 
                        peopleGaps.size() + processGaps.size();
        
        int criticalGaps = (int) (assetGaps.stream().filter(g -> "CRITICAL".equals(g.getSeverity())).count() +
                                  vendorGaps.stream().filter(g -> "CRITICAL".equals(g.getSeverity())).count() +
                                  vitalRecordGaps.stream().filter(g -> "CRITICAL".equals(g.getSeverity())).count() +
                                  peopleGaps.stream().filter(g -> "CRITICAL".equals(g.getSeverity())).count() +
                                  processGaps.stream().filter(g -> "CRITICAL".equals(g.getSeverity())).count());

        return BiaGapAnalysisDTO.builder()
            .biaId(biaId)
            .biaName(bia.getBiaName())
            .requiredRto(requiredRto)
            .requiredRpo(requiredRpo)
            .requiredCriticality(bia.getFinalCriticality() != null ? bia.getFinalCriticality().name() : null)
            .hasGaps(totalGaps > 0)
            .totalGaps(totalGaps)
            .criticalGaps(criticalGaps)
            .assetGaps(assetGaps)
            .vendorGaps(vendorGaps)
            .vitalRecordGaps(vitalRecordGaps)
            .peopleGaps(peopleGaps)
            .processGaps(processGaps)
            .build();
    }

    /**
     * Analyze asset dependency gaps
     */
    private List<BiaGapAnalysisDTO.GapDetail> analyzeAssetGaps(Long biaId, Integer requiredRto) {
        List<BiaGapAnalysisDTO.GapDetail> gaps = new ArrayList<>();
        List<BiaDependentAsset> dependencies = assetRepository.findByBiaId(biaId);

        for (BiaDependentAsset dep : dependencies) {
            Asset asset = dep.getAsset();
            Integer assetRto = asset.getRecoveryTimeCapability();
            
            if (assetRto == null) {
                // Asset has no recovery time defined - this is a gap
                gaps.add(BiaGapAnalysisDTO.GapDetail.builder()
                    .dependencyName(asset.getAssetName())
                    .dependencyType("ASSET")
                    .gapType("CAPABILITY_GAP")
                    .severity("HIGH")
                    .requirement(requiredRto)
                    .capability(null)
                    .gap(null)
                    .description("Asset has no recovery time capability defined")
                    .recommendation("Define recovery time capability for this asset")
                    .build());
            } else if (assetRto > requiredRto) {
                // Asset recovery time exceeds requirement - this is a gap
                int gapHours = assetRto - requiredRto;
                gaps.add(BiaGapAnalysisDTO.GapDetail.builder()
                    .dependencyName(asset.getAssetName())
                    .dependencyType("ASSET")
                    .gapType("RTO_GAP")
                    .severity(calculateGapSeverity(gapHours, requiredRto))
                    .requirement(requiredRto)
                    .capability(assetRto)
                    .gap(gapHours)
                    .description(String.format("Asset recovery time (%d hrs) exceeds requirement (%d hrs) by %d hours", 
                                              assetRto, requiredRto, gapHours))
                    .recommendation("Improve asset recovery capability or implement redundancy")
                    .build());
            }
        }

        return gaps;
    }

    /**
     * Analyze vendor dependency gaps
     */
    private List<BiaGapAnalysisDTO.GapDetail> analyzeVendorGaps(Long biaId, Integer requiredRto) {
        List<BiaGapAnalysisDTO.GapDetail> gaps = new ArrayList<>();
        List<BiaDependentVendor> dependencies = vendorRepository.findByBiaId(biaId);

        for (BiaDependentVendor dep : dependencies) {
            Vendor vendor = dep.getVendor();
            Integer vendorSla = vendor.getRecoveryTimeCapability();
            
            if (vendorSla == null) {
                gaps.add(BiaGapAnalysisDTO.GapDetail.builder()
                    .dependencyName(vendor.getVendorName())
                    .dependencyType("VENDOR")
                    .gapType("CAPABILITY_GAP")
                    .severity("HIGH")
                    .requirement(requiredRto)
                    .capability(null)
                    .gap(null)
                    .description("Vendor has no SLA recovery time defined")
                    .recommendation("Negotiate SLA with vendor or find alternative supplier")
                    .build());
            } else if (vendorSla > requiredRto) {
                int gapHours = vendorSla - requiredRto;
                gaps.add(BiaGapAnalysisDTO.GapDetail.builder()
                    .dependencyName(vendor.getVendorName())
                    .dependencyType("VENDOR")
                    .gapType("RTO_GAP")
                    .severity(calculateGapSeverity(gapHours, requiredRto))
                    .requirement(requiredRto)
                    .capability(vendorSla)
                    .gap(gapHours)
                    .description(String.format("Vendor SLA (%d hrs) exceeds requirement (%d hrs) by %d hours", 
                                              vendorSla, requiredRto, gapHours))
                    .recommendation("Renegotiate SLA or implement backup vendor")
                    .build());
            }
        }

        return gaps;
    }

    /**
     * Analyze vital record dependency gaps
     */
    private List<BiaGapAnalysisDTO.GapDetail> analyzeVitalRecordGaps(Long biaId, Integer requiredRpo) {
        List<BiaGapAnalysisDTO.GapDetail> gaps = new ArrayList<>();
        
        if (requiredRpo == null) {
            return gaps;  // No RPO requirement, skip analysis
        }

        List<BiaDependentVitalRecord> dependencies = vitalRecordRepository.findByBiaId(biaId);

        for (BiaDependentVitalRecord dep : dependencies) {
            VitalRecord vr = dep.getVitalRecord();
            Integer vrRpo = vr.getRecoveryPointObjective();
            
            if (vrRpo == null) {
                gaps.add(BiaGapAnalysisDTO.GapDetail.builder()
                    .dependencyName(vr.getRecordName())
                    .dependencyType("VITAL_RECORD")
                    .gapType("CAPABILITY_GAP")
                    .severity("HIGH")
                    .requirement(requiredRpo)
                    .capability(null)
                    .gap(null)
                    .description("Vital record has no RPO defined")
                    .recommendation("Define backup and recovery strategy for this vital record")
                    .build());
            } else if (vrRpo > requiredRpo) {
                int gapHours = vrRpo - requiredRpo;
                gaps.add(BiaGapAnalysisDTO.GapDetail.builder()
                    .dependencyName(vr.getRecordName())
                    .dependencyType("VITAL_RECORD")
                    .gapType("RPO_GAP")
                    .severity(calculateGapSeverity(gapHours, requiredRpo))
                    .requirement(requiredRpo)
                    .capability(vrRpo)
                    .gap(gapHours)
                    .description(String.format("Vital record RPO (%d hrs) exceeds requirement (%d hrs) by %d hours", 
                                              vrRpo, requiredRpo, gapHours))
                    .recommendation("Increase backup frequency or implement real-time replication")
                    .build());
            }
        }

        return gaps;
    }

    /**
     * Analyze people dependency gaps
     */
    private List<BiaGapAnalysisDTO.GapDetail> analyzePeopleGaps(Long biaId) {
        List<BiaGapAnalysisDTO.GapDetail> gaps = new ArrayList<>();
        List<BiaDependentPerson> dependencies = personRepository.findByBiaId(biaId);

        // Check for critical people without backups
        List<BiaDependentPerson> criticalPeople = personRepository.findCriticalByBiaId(biaId);
        
        for (BiaDependentPerson dep : criticalPeople) {
            // For now, flag all critical people as potential gaps
            // This can be enhanced to check for backup resources
            gaps.add(BiaGapAnalysisDTO.GapDetail.builder()
                .dependencyName(dep.getUser().getFullName())
                .dependencyType("PERSON")
                .gapType("AVAILABILITY_GAP")
                .severity("MEDIUM")
                .requirement(null)
                .capability(null)
                .gap(null)
                .description("Critical personnel with no identified backup")
                .recommendation("Identify and train backup personnel for this role")
                .build());
        }

        return gaps;
    }

    /**
     * Analyze process dependency gaps
     */
    private List<BiaGapAnalysisDTO.GapDetail> analyzeProcessGaps(Long biaId, Integer requiredRto) {
        List<BiaGapAnalysisDTO.GapDetail> gaps = new ArrayList<>();
        List<BiaDependentProcess> dependencies = processRepository.findByBiaId(biaId);

        for (BiaDependentProcess dep : dependencies) {
            com.bcm.entity.Process process = dep.getProcess();
            Integer processRto = dep.getDependentProcessRto();
            
            if (processRto == null) {
                gaps.add(BiaGapAnalysisDTO.GapDetail.builder()
                    .dependencyName(process.getProcessName())
                    .dependencyType("PROCESS")
                    .gapType("CAPABILITY_GAP")
                    .severity("MEDIUM")
                    .requirement(requiredRto)
                    .capability(null)
                    .gap(null)
                    .description("Dependent process has no BIA/RTO defined")
                    .recommendation("Perform BIA for this dependent process")
                    .build());
            } else if (processRto > requiredRto) {
                int gapHours = processRto - requiredRto;
                gaps.add(BiaGapAnalysisDTO.GapDetail.builder()
                    .dependencyName(process.getProcessName())
                    .dependencyType("PROCESS")
                    .gapType("RTO_GAP")
                    .severity(calculateGapSeverity(gapHours, requiredRto))
                    .requirement(requiredRto)
                    .capability(processRto)
                    .gap(gapHours)
                    .description(String.format("Dependent process RTO (%d hrs) exceeds requirement (%d hrs) by %d hours", 
                                              processRto, requiredRto, gapHours))
                    .recommendation("Improve dependent process recovery capability")
                    .build());
            }
        }

        return gaps;
    }

    /**
     * Calculate gap severity based on gap size relative to requirement
     */
    private String calculateGapSeverity(int gapHours, int requiredRto) {
        double gapPercentage = (double) gapHours / requiredRto * 100;
        
        if (gapPercentage >= 100) {
            return "CRITICAL";  // Gap is 100% or more of requirement
        } else if (gapPercentage >= 50) {
            return "HIGH";  // Gap is 50-99% of requirement
        } else if (gapPercentage >= 25) {
            return "MEDIUM";  // Gap is 25-49% of requirement
        } else {
            return "LOW";  // Gap is less than 25% of requirement
        }
    }

    /**
     * Create empty gap analysis result
     */
    private BiaGapAnalysisDTO createEmptyGapAnalysis(BiaRecord bia) {
        return BiaGapAnalysisDTO.builder()
            .biaId(bia.getId())
            .biaName(bia.getBiaName())
            .requiredRto(bia.getEffectiveRto())
            .requiredRpo(bia.getEffectiveRpo())
            .hasGaps(false)
            .totalGaps(0)
            .criticalGaps(0)
            .assetGaps(new ArrayList<>())
            .vendorGaps(new ArrayList<>())
            .vitalRecordGaps(new ArrayList<>())
            .peopleGaps(new ArrayList<>())
            .processGaps(new ArrayList<>())
            .build();
    }
}

