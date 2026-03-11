package com.bcm.controller;

import com.bcm.dto.*;
import com.bcm.entity.*;
import com.bcm.enums.BiaStatus;
import com.bcm.enums.BiaTargetType;
import com.bcm.enums.BiaCriticality;
import com.bcm.enums.BiaCreationType;
import com.bcm.repository.*;
import com.bcm.service.BiaCalculationService;
import com.bcm.service.BiaGapAnalysisService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * REST API Controller for BIA (Business Impact Analysis) operations
 *
 * This controller powers the 12-step BIA wizard workflow:
 * Steps 1-3: Basic Info & Target Selection
 * Step 4: Impact Analysis Questionnaire
 * Step 5: MTPD Calculation
 * Steps 6-11: BETH3V Dependencies
 * Step 12: Gap Analysis & Summary
 */
@RestController
@RequestMapping("/api/bias")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BiaController {

    private final BiaRecordRepository biaRepository;
    private final BiaAnswerRepository answerRepository;
    private final BiaDependentAssetRepository assetDepRepository;
    private final BiaDependentPersonRepository personDepRepository;
    private final BiaDependentVendorRepository vendorDepRepository;
    private final BiaDependentVitalRecordRepository vitalRecordDepRepository;
    private final BiaDependentProcessRepository processDepRepository;
    private final BiaTargetProcessRepository targetProcessRepository;  // NEW: For multi-process BIA support
    private final BiaCalculationService calculationService;
    private final BiaGapAnalysisService gapAnalysisService;
    private final com.bcm.service.BiaPeakTimeService peakTimeService;  // NEW: For peak times support

    // Entity repositories for fetching dependencies
    private final AssetRepository assetRepository;
    private final UserRepository userRepository;
    private final VendorRepository vendorRepository;
    private final VitalRecordRepository vitalRecordRepository;
    private final ProcessRepository processRepository;

    // ============================================================================
    // STEP 1-3: BIA CRUD Operations (Basic Info & Target Selection)
    // ============================================================================

    /**
     * Create a new BIA record
     * POST /api/bias
     */
    @PostMapping
    public ResponseEntity<BiaRecord> createBia(@RequestBody BiaRecordDTO dto) {
        BiaRecord bia = BiaRecord.builder()
                .biaName(dto.getBiaName())
                .biaTargetId(dto.getBiaTargetId())
                .biaTargetType(dto.getBiaTargetType())
                .biaType(dto.getBiaType())
                .status(BiaStatus.DRAFT)
                .creationType(BiaCreationType.DIRECT)
                .biaCoordinator(dto.getBiaCoordinator())
                .analysisDate(dto.getAnalysisDate())
                .templateUsed(dto.getTemplateUsed())
                .build();

        BiaRecord saved = biaRepository.save(bia);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    /**
     * Get all BIAs with optional filtering
     * GET /api/bias?status=DRAFT&targetType=Process&criticality=CRITICAL
     */
    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<List<BiaRecord>> getAllBias(
            @RequestParam(required = false) BiaStatus status,
            @RequestParam(required = false) BiaTargetType targetType,
            @RequestParam(required = false) BiaCriticality criticality) {

        List<BiaRecord> bias;

        if (status != null) {
            bias = biaRepository.findByStatus(status);
        } else if (targetType != null) {
            bias = biaRepository.findByTargetType(targetType);
        } else {
            bias = biaRepository.findAllActive();
        }

        // Filter by criticality if specified
        if (criticality != null) {
            bias = bias.stream()
                    .filter(b -> criticality.equals(b.getFinalCriticality()))
                    .collect(Collectors.toList());
        }

        // Initialize lazy collections to avoid LazyInitializationException
        bias.forEach(bia -> {
            // Initialize all OneToMany collections
            bia.getTargetProcesses().size();
            bia.getAnswers().size();
            bia.getDependentAssets().size();
            bia.getDependentPeople().size();
            bia.getDependentVendors().size();
            bia.getDependentVitalRecords().size();
            bia.getDependentProcesses().size();

            // Initialize nested relationships within targetProcesses
            bia.getTargetProcesses().forEach(targetProcess -> {
                if (targetProcess.getProcess() != null) {
                    com.bcm.entity.Process process = targetProcess.getProcess();
                    process.getId(); // Force initialization
                    process.getProcessName(); // Force full initialization
                    // Initialize the process's organizational unit if present
                    if (process.getOrganizationalUnit() != null) {
                        process.getOrganizationalUnit().getId();
                        process.getOrganizationalUnit().getUnitName();
                    }
                }
            });

            // Initialize lazy ManyToOne relationships
            if (bia.getOrganizationalUnit() != null) {
                OrganizationalUnit unit = bia.getOrganizationalUnit();
                unit.getId();
                unit.getUnitName();
                if (unit.getParentUnit() != null) {
                    unit.getParentUnit().getId();
                    unit.getParentUnit().getUnitName();
                }
            }
            if (bia.getProcess() != null) {
                com.bcm.entity.Process process = bia.getProcess();
                process.getId();
                process.getProcessName();
                if (process.getOrganizationalUnit() != null) {
                    process.getOrganizationalUnit().getId();
                    process.getOrganizationalUnit().getUnitName();
                }
            }
            if (bia.getConflictingBia() != null) {
                bia.getConflictingBia().getId();
            }
        });

        return ResponseEntity.ok(bias);
    }

    /**
     * Get BIA by ID
     * GET /api/bias/{id}
     */
    @GetMapping("/{id}")
    @Transactional(readOnly = true)
    public ResponseEntity<BiaRecord> getBiaById(@PathVariable Long id) {
        return biaRepository.findById(id)
                .map(bia -> {
                    // Initialize all lazy collections to avoid LazyInitializationException
                    bia.getTargetProcesses().size();
                    bia.getAnswers().size();
                    bia.getDependentAssets().size();
                    bia.getDependentPeople().size();
                    bia.getDependentVendors().size();
                    bia.getDependentVitalRecords().size();
                    bia.getDependentProcesses().size();

                    // Initialize lazy ManyToOne relationships and their nested collections
                    if (bia.getOrganizationalUnit() != null) {
                        OrganizationalUnit unit = bia.getOrganizationalUnit();
                        unit.getId(); // Force initialization of the proxy
                        unit.getUnitName(); // Force full initialization
                        // Initialize nested collections to prevent lazy loading during serialization
                        if (unit.getParentUnit() != null) {
                            unit.getParentUnit().getId();
                            unit.getParentUnit().getUnitName();
                        }
                        // Don't initialize childUnits, processes, or biaRecords to avoid circular references
                    }
                    if (bia.getProcess() != null) {
                        com.bcm.entity.Process process = bia.getProcess();
                        process.getId(); // Force initialization
                        process.getProcessName(); // Force full initialization
                        // Initialize the process's organizational unit if present
                        if (process.getOrganizationalUnit() != null) {
                            process.getOrganizationalUnit().getId();
                            process.getOrganizationalUnit().getUnitName();
                        }
                    }
                    if (bia.getConflictingBia() != null) {
                        bia.getConflictingBia().getId(); // Force initialization
                    }

                    return ResponseEntity.ok(bia);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Update BIA record
     * PUT /api/bias/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<BiaRecord> updateBia(@PathVariable Long id, @RequestBody BiaRecordDTO dto) {
        return biaRepository.findById(id)
                .map(bia -> {
                    bia.setBiaName(dto.getBiaName());
                    bia.setBiaCoordinator(dto.getBiaCoordinator());
                    bia.setAnalysisDate(dto.getAnalysisDate());
                    bia.setTemplateUsed(dto.getTemplateUsed());
                    bia.setFinalRtoHours(dto.getFinalRtoHours());
                    bia.setFinalRpoHours(dto.getFinalRpoHours());
                    if (dto.getFinalCriticality() != null) {
                        bia.setFinalCriticality(BiaCriticality.valueOf(dto.getFinalCriticality()));
                    }
                    if (dto.getStatus() != null) {
                        bia.setStatus(dto.getStatus());
                    }
                    return ResponseEntity.ok(biaRepository.save(bia));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Delete BIA (soft delete)
     * DELETE /api/bias/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBia(@PathVariable Long id) {
        return biaRepository.findById(id)
                .map(bia -> {
                    bia.setIsDeleted(true);
                    biaRepository.save(bia);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // ============================================================================
    // MULTI-PROCESS BIA SUPPORT: Target Process Management
    // ============================================================================

    /**
     * Add target processes to a BIA (for multi-process BIA analysis)
     * POST /api/bias/{id}/target-processes
     *
     * Body: List of { processId, isPrimary, selectionReason }
     */
    @PostMapping("/{id}/target-processes")
    @Transactional
    public ResponseEntity<List<BiaTargetProcess>> addTargetProcesses(
            @PathVariable Long id,
            @RequestBody List<Map<String, Object>> targetProcessDTOs) {

        BiaRecord bia = biaRepository.findById(id)
                .orElse(null);

        if (bia == null) {
            return ResponseEntity.notFound().build();
        }

        List<BiaTargetProcess> targetProcesses = targetProcessDTOs.stream()
                .<BiaTargetProcess>map(dto -> {
                    Long processId = Long.valueOf(dto.get("processId").toString());
                    Boolean isPrimary = dto.containsKey("isPrimary") ?
                        Boolean.valueOf(dto.get("isPrimary").toString()) : false;
                    String selectionReason = dto.containsKey("selectionReason") ?
                        dto.get("selectionReason").toString() : null;

                    com.bcm.entity.Process process = processRepository.findById(processId).orElse(null);
                    if (process == null) {
                        return null;
                    }

                    // Check if already exists
                    if (targetProcessRepository.existsByBiaRecordIdAndProcessId(id, processId)) {
                        return null;
                    }

                    return BiaTargetProcess.builder()
                            .biaRecord(bia)
                            .process(process)
                            .isPrimary(isPrimary)
                            .selectionReason(selectionReason)
                            .build();
                })
                .filter(tp -> tp != null)
                .collect(Collectors.toList());

        List<BiaTargetProcess> saved = targetProcessRepository.saveAll(targetProcesses);
        return ResponseEntity.ok(saved);
    }

    /**
     * Get all target processes for a BIA
     * GET /api/bias/{id}/target-processes
     */
    @GetMapping("/{id}/target-processes")
    @Transactional(readOnly = true)
    public ResponseEntity<List<Map<String, Object>>> getTargetProcesses(@PathVariable Long id) {
        List<BiaTargetProcess> targetProcesses = targetProcessRepository.findActiveBiaTargetProcesses(id);

        List<Map<String, Object>> result = targetProcesses.stream()
                .map(tp -> {
                    Map<String, Object> map = new java.util.HashMap<>();
                    map.put("id", tp.getId());
                    map.put("processId", tp.getProcess().getId());
                    map.put("processName", tp.getProcess().getProcessName());
                    map.put("processCode", tp.getProcess().getProcessCode() != null ? tp.getProcess().getProcessCode() : "");
                    map.put("processOwner", tp.getProcess().getProcessOwner() != null ? tp.getProcess().getProcessOwner() : "");
                    map.put("isPrimary", tp.getIsPrimary());
                    map.put("selectionReason", tp.getSelectionReason() != null ? tp.getSelectionReason() : "");
                    return map;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }

    /**
     * Remove a target process from a BIA
     * DELETE /api/bias/{id}/target-processes/{processId}
     */
    @DeleteMapping("/{id}/target-processes/{processId}")
    @Transactional
    public ResponseEntity<Void> removeTargetProcess(
            @PathVariable Long id,
            @PathVariable Long processId) {

        List<BiaTargetProcess> targetProcesses = targetProcessRepository.findByBiaRecordId(id);
        targetProcesses.stream()
                .filter(tp -> tp.getProcess().getId().equals(processId))
                .forEach(tp -> tp.setIsDeleted(true));

        targetProcessRepository.saveAll(targetProcesses);
        return ResponseEntity.ok().build();
    }

    // ============================================================================
    // STEP 4-5: Impact Analysis Questionnaire & MTPD Calculation
    // ============================================================================

    /**
     * Submit questionnaire answers for a BIA
     * POST /api/bias/{id}/answers
     *
     * Body: List of { questionId, answerValue, answerScore, answerNotes }
     */
    @PostMapping("/{id}/answers")
    public ResponseEntity<Map<String, Object>> submitAnswers(
            @PathVariable Long id,
            @RequestBody List<BiaAnswerDTO> answerDTOs) {

        if (!biaRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        BiaRecord bia = biaRepository.findById(id).get();

        // Delete existing answers (soft delete)
        List<BiaAnswer> existingAnswers = answerRepository.findByBiaId(id);
        existingAnswers.forEach(answer -> answer.setIsDeleted(true));
        answerRepository.saveAll(existingAnswers);

        // Save new answers
        List<BiaAnswer> answers = answerDTOs.stream()
                .map(dto -> {
                    BiaQuestion question = new BiaQuestion();
                    question.setId(dto.getQuestionId());

                    return BiaAnswer.builder()
                            .biaRecord(bia)
                            .question(question)
                            .answerValue(dto.getAnswerValue())
                            .answerScore(dto.getAnswerScore())
                            .answerNotes(dto.getAnswerNotes())
                            .build();
                })
                .collect(Collectors.toList());

        answerRepository.saveAll(answers);

        // Calculate suggested metrics
        BiaCalculationService.BiaCalculationResult result =
                calculationService.calculateAllMetrics(id);

        return ResponseEntity.ok(Map.of(
                "message", "Answers submitted successfully",
                "suggestedRto", result.getSuggestedRto(),
                "suggestedRpo", result.getSuggestedRpo(),
                "suggestedCriticality", result.getSuggestedCriticality()
        ));
    }

    /**
     * Get questionnaire answers for a BIA
     * GET /api/bias/{id}/answers
     */
    @GetMapping("/{id}/answers")
    public ResponseEntity<List<BiaAnswer>> getAnswers(@PathVariable Long id) {
        List<BiaAnswer> answers = answerRepository.findByBiaId(id);
        return ResponseEntity.ok(answers);
    }

    /**
     * Calculate suggested RTO/RPO/Criticality from questionnaire answers
     * GET /api/bias/{id}/calculate
     */
    @GetMapping("/{id}/calculate")
    public ResponseEntity<BiaCalculationService.BiaCalculationResult> calculateMetrics(@PathVariable Long id) {
        if (!biaRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        BiaCalculationService.BiaCalculationResult result = calculationService.calculateAllMetrics(id);
        return ResponseEntity.ok(result);
    }

    /**
     * Apply calculated metrics to BIA record
     * POST /api/bias/{id}/apply-calculation
     */
    @PostMapping("/{id}/apply-calculation")
    public ResponseEntity<BiaRecord> applyCalculation(@PathVariable Long id) {
        return biaRepository.findById(id)
                .map(bia -> {
                    calculationService.applyCalculatedMetrics(bia);
                    return ResponseEntity.ok(biaRepository.save(bia));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // ============================================================================
    // STEPS 6-11: BETH3V Dependencies (Stitching the Spokes)
    // ============================================================================

    /**
     * Link Assets to BIA
     * POST /api/bias/{id}/dependencies/assets
     */
    @PostMapping("/{id}/dependencies/assets")
    public ResponseEntity<List<BiaDependentAsset>> linkAssets(
            @PathVariable Long id,
            @RequestBody List<BiaDependencyDTO> dependencies) {

        return biaRepository.findById(id)
                .map(bia -> {
                    List<BiaDependentAsset> deps = dependencies.stream()
                            .map(dto -> {
                                Asset asset = assetRepository.findById(dto.getDependencyId())
                                        .orElseThrow(() -> new RuntimeException("Asset not found: " + dto.getDependencyId()));

                                return BiaDependentAsset.builder()
                                        .biaRecord(bia)
                                        .asset(asset)
                                        .dependencyType(dto.getDependencyType())
                                        .notes(dto.getNotes())
                                        .build();
                            })
                            .collect(Collectors.toList());

                    return ResponseEntity.ok(assetDepRepository.saveAll(deps));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Link People to BIA
     * POST /api/bias/{id}/dependencies/people
     */
    @PostMapping("/{id}/dependencies/people")
    public ResponseEntity<List<BiaDependentPerson>> linkPeople(
            @PathVariable Long id,
            @RequestBody List<BiaDependencyDTO> dependencies) {

        return biaRepository.findById(id)
                .map(bia -> {
                    List<BiaDependentPerson> deps = dependencies.stream()
                            .map(dto -> {
                                User user = userRepository.findById(dto.getDependencyId())
                                        .orElseThrow(() -> new RuntimeException("User not found: " + dto.getDependencyId()));

                                return BiaDependentPerson.builder()
                                        .biaRecord(bia)
                                        .user(user)
                                        .roleInBia(dto.getRoleInBia())
                                        .isCritical(dto.getIsCritical())
                                        .notes(dto.getNotes())
                                        .build();
                            })
                            .collect(Collectors.toList());

                    return ResponseEntity.ok(personDepRepository.saveAll(deps));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Link Vendors to BIA
     * POST /api/bias/{id}/dependencies/vendors
     */
    @PostMapping("/{id}/dependencies/vendors")
    public ResponseEntity<List<BiaDependentVendor>> linkVendors(
            @PathVariable Long id,
            @RequestBody List<BiaDependencyDTO> dependencies) {

        return biaRepository.findById(id)
                .map(bia -> {
                    List<BiaDependentVendor> deps = dependencies.stream()
                            .map(dto -> {
                                Vendor vendor = vendorRepository.findById(dto.getDependencyId())
                                        .orElseThrow(() -> new RuntimeException("Vendor not found: " + dto.getDependencyId()));

                                return BiaDependentVendor.builder()
                                        .biaRecord(bia)
                                        .vendor(vendor)
                                        .serviceProvided(dto.getServiceProvided())
                                        .dependencyType(dto.getDependencyType())
                                        .notes(dto.getNotes())
                                        .build();
                            })
                            .collect(Collectors.toList());

                    return ResponseEntity.ok(vendorDepRepository.saveAll(deps));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Link Vital Records to BIA
     * POST /api/bias/{id}/dependencies/vital-records
     */
    @PostMapping("/{id}/dependencies/vital-records")
    public ResponseEntity<List<BiaDependentVitalRecord>> linkVitalRecords(
            @PathVariable Long id,
            @RequestBody List<BiaDependencyDTO> dependencies) {

        return biaRepository.findById(id)
                .map(bia -> {
                    List<BiaDependentVitalRecord> deps = dependencies.stream()
                            .map(dto -> {
                                VitalRecord vitalRecord = vitalRecordRepository.findById(dto.getDependencyId())
                                        .orElseThrow(() -> new RuntimeException("Vital Record not found: " + dto.getDependencyId()));

                                return BiaDependentVitalRecord.builder()
                                        .biaRecord(bia)
                                        .vitalRecord(vitalRecord)
                                        .dependencyType(dto.getDependencyType())
                                        .notes(dto.getNotes())
                                        .build();
                            })
                            .collect(Collectors.toList());

                    return ResponseEntity.ok(vitalRecordDepRepository.saveAll(deps));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Link Processes to BIA (for roll-ups)
     * POST /api/bias/{id}/dependencies/processes
     */
    @PostMapping("/{id}/dependencies/processes")
    public ResponseEntity<List<BiaDependentProcess>> linkProcesses(
            @PathVariable Long id,
            @RequestBody List<BiaDependencyDTO> dependencies) {

        return biaRepository.findById(id)
                .map(bia -> {
                    List<BiaDependentProcess> deps = dependencies.stream()
                            .map(dto -> {
                                com.bcm.entity.Process process = processRepository.findById(dto.getDependencyId())
                                        .orElseThrow(() -> new RuntimeException("Process not found: " + dto.getDependencyId()));

                                return BiaDependentProcess.builder()
                                        .biaRecord(bia)
                                        .process(process)
                                        .dependencyType(dto.getDependencyType())
                                        .notes(dto.getNotes())
                                        .build();
                            })
                            .collect(Collectors.toList());

                    return ResponseEntity.ok(processDepRepository.saveAll(deps));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get all dependencies for a BIA
     * GET /api/bias/{id}/dependencies
     */
    @GetMapping("/{id}/dependencies")
    public ResponseEntity<Map<String, Object>> getAllDependencies(@PathVariable Long id) {
        if (!biaRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        Map<String, Object> dependencies = Map.of(
                "assets", assetDepRepository.findByBiaId(id),
                "people", personDepRepository.findByBiaId(id),
                "vendors", vendorDepRepository.findByBiaId(id),
                "vitalRecords", vitalRecordDepRepository.findByBiaId(id),
                "processes", processDepRepository.findByBiaId(id)
        );

        return ResponseEntity.ok(dependencies);
    }

    // ============================================================================
    // STEP 12: Gap Analysis & Summary
    // ============================================================================

    /**
     * Perform gap analysis for a BIA
     * GET /api/bias/{id}/gap-analysis
     *
     * This is the "payoff" step that shows:
     * - Requirements (from BIA analysis)
     * - Capabilities (from linked dependencies)
     * - Gaps (where capabilities don't meet requirements)
     */
    @GetMapping("/{id}/gap-analysis")
    public ResponseEntity<BiaGapAnalysisDTO> performGapAnalysis(@PathVariable Long id) {
        if (!biaRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        BiaGapAnalysisDTO gapAnalysis = gapAnalysisService.performGapAnalysis(id);
        return ResponseEntity.ok(gapAnalysis);
    }

    /**
     * Finalize BIA (change status to APPROVED)
     * POST /api/bias/{id}/finalize
     */
    @PostMapping("/{id}/finalize")
    public ResponseEntity<BiaRecord> finalizeBia(@PathVariable Long id) {
        return biaRepository.findById(id)
                .map(bia -> {
                    bia.setStatus(BiaStatus.APPROVED);
                    return ResponseEntity.ok(biaRepository.save(bia));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get BIA summary with all related data
     * GET /api/bias/{id}/summary
     */
    @GetMapping("/{id}/summary")
    public ResponseEntity<Map<String, Object>> getBiaSummary(@PathVariable Long id) {
        return biaRepository.findById(id)
                .map(bia -> {
                    Map<String, Object> summary = Map.of(
                            "bia", bia,
                            "answers", answerRepository.findByBiaId(id),
                            "dependencies", Map.of(
                                    "assets", assetDepRepository.findByBiaId(id),
                                    "people", personDepRepository.findByBiaId(id),
                                    "vendors", vendorDepRepository.findByBiaId(id),
                                    "vitalRecords", vitalRecordDepRepository.findByBiaId(id),
                                    "processes", processDepRepository.findByBiaId(id)
                            ),
                            "gapAnalysis", gapAnalysisService.performGapAnalysis(id)
                    );
                    return ResponseEntity.ok(summary);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // ============================================================================
    // PEAK TIMES & CRITICAL DEADLINES ENDPOINTS (Step 4)
    // ============================================================================

    /**
     * Create a new peak time for a BIA record
     * POST /api/bias/{id}/peak-times
     */
    @PostMapping("/{id}/peak-times")
    public ResponseEntity<BiaPeakTimeDTO> createPeakTime(
            @PathVariable Long id,
            @RequestBody BiaPeakTimeDTO peakTimeDTO) {

        if (!biaRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        BiaPeakTime peakTime = peakTimeDTO.toEntity();
        BiaPeakTime savedPeakTime = peakTimeService.createPeakTime(id, peakTime);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(BiaPeakTimeDTO.fromEntity(savedPeakTime));
    }

    /**
     * Get all peak times for a BIA record
     * GET /api/bias/{id}/peak-times
     */
    @GetMapping("/{id}/peak-times")
    public ResponseEntity<List<BiaPeakTimeDTO>> getPeakTimes(@PathVariable Long id) {
        if (!biaRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        List<BiaPeakTime> peakTimes = peakTimeService.getPeakTimesByBiaId(id);
        List<BiaPeakTimeDTO> peakTimeDTOs = peakTimes.stream()
                .map(BiaPeakTimeDTO::fromEntity)
                .collect(Collectors.toList());

        return ResponseEntity.ok(peakTimeDTOs);
    }

    /**
     * Get a specific peak time by ID
     * GET /api/bias/{id}/peak-times/{peakTimeId}
     */
    @GetMapping("/{id}/peak-times/{peakTimeId}")
    public ResponseEntity<BiaPeakTimeDTO> getPeakTimeById(
            @PathVariable Long id,
            @PathVariable Long peakTimeId) {

        if (!biaRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        try {
            BiaPeakTime peakTime = peakTimeService.getPeakTimeById(id, peakTimeId);
            return ResponseEntity.ok(BiaPeakTimeDTO.fromEntity(peakTime));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Update an existing peak time
     * PUT /api/bias/{id}/peak-times/{peakTimeId}
     */
    @PutMapping("/{id}/peak-times/{peakTimeId}")
    public ResponseEntity<BiaPeakTimeDTO> updatePeakTime(
            @PathVariable Long id,
            @PathVariable Long peakTimeId,
            @RequestBody BiaPeakTimeDTO peakTimeDTO) {

        if (!biaRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        try {
            BiaPeakTime updatedPeakTime = peakTimeService.updatePeakTime(id, peakTimeId, peakTimeDTO.toEntity());
            return ResponseEntity.ok(BiaPeakTimeDTO.fromEntity(updatedPeakTime));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Delete a peak time
     * DELETE /api/bias/{id}/peak-times/{peakTimeId}
     */
    @DeleteMapping("/{id}/peak-times/{peakTimeId}")
    public ResponseEntity<Void> deletePeakTime(
            @PathVariable Long id,
            @PathVariable Long peakTimeId) {

        if (!biaRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        try {
            peakTimeService.deletePeakTime(id, peakTimeId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Get the most aggressive (lowest) peak RTO for a BIA record
     * GET /api/bias/{id}/peak-times/most-aggressive-rto
     */
    @GetMapping("/{id}/peak-times/most-aggressive-rto")
    public ResponseEntity<Map<String, Integer>> getMostAggressivePeakRto(@PathVariable Long id) {
        if (!biaRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        Integer mostAggressiveRto = peakTimeService.getMostAggressivePeakRto(id);
        return ResponseEntity.ok(Map.of("mostAggressivePeakRtoHours", mostAggressiveRto != null ? mostAggressiveRto : 0));
    }

    /**
     * Get all critical deadlines for a BIA record
     * GET /api/bias/{id}/peak-times/critical-deadlines
     */
    @GetMapping("/{id}/peak-times/critical-deadlines")
    public ResponseEntity<List<BiaPeakTimeDTO>> getCriticalDeadlines(@PathVariable Long id) {
        if (!biaRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        List<BiaPeakTime> criticalDeadlines = peakTimeService.getCriticalDeadlinesByBiaId(id);
        List<BiaPeakTimeDTO> deadlineDTOs = criticalDeadlines.stream()
                .map(BiaPeakTimeDTO::fromEntity)
                .collect(Collectors.toList());

        return ResponseEntity.ok(deadlineDTOs);
    }
}

