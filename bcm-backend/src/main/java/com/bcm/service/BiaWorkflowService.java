package com.bcm.service;

import com.bcm.entity.*;
import com.bcm.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Service for managing BIA workflow operations
 * Handles delegation, approval workflow, and state transitions
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class BiaWorkflowService {

    private final BiaRecordRepository biaRecordRepository;
    private final BiaAssignmentRepository assignmentRepository;
    private final BiaApprovalWorkflowRepository approvalWorkflowRepository;
    private final BiaWorkflowHistoryRepository workflowHistoryRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    /**
     * Delegate BIA to SME
     */
    public BiaAssignment delegateBiaToSme(Long biaId, Long championId, Long smeId, String reason, String notes) {
        log.info("Delegating BIA {} from Champion {} to SME {}", biaId, championId, smeId);

        BiaRecord bia = biaRecordRepository.findById(biaId)
                .orElseThrow(() -> new RuntimeException("BIA not found: " + biaId));

        User champion = userRepository.findById(championId)
                .orElseThrow(() -> new RuntimeException("Champion not found: " + championId));

        User sme = userRepository.findById(smeId)
                .orElseThrow(() -> new RuntimeException("SME not found: " + smeId));

        // Create assignment
        BiaAssignment assignment = BiaAssignment.builder()
                .bia(bia)
                .assignedBy(champion)
                .assignedByName(champion.getFullName())
                .assignedTo(sme)
                .assignedToName(sme.getFullName())
                .assignmentType(BiaAssignment.AssignmentType.DELEGATION)
                .assignmentReason(reason)
                .assignmentNotes(notes)
                .status(BiaAssignment.AssignmentStatus.PENDING)
                .assignedAt(LocalDateTime.now())
                .build();

        assignment = assignmentRepository.save(assignment);

        // Update BIA record
        bia.setSmeId(smeId);
        bia.setSmeName(sme.getFullName());
        biaRecordRepository.save(bia);

        // Record workflow history
        recordWorkflowHistory(bia, null, "COMPLETE", null, "DRAFT",
                BiaWorkflowHistory.WorkflowAction.DELEGATED, championId, champion.getFullName(),
                "Champion", "Delegated to SME: " + sme.getFullName());

        // Send notification to SME
        notificationService.notifyBiaAssigned(sme, bia, champion);

        log.info("BIA {} successfully delegated to SME {}", biaId, smeId);
        return assignment;
    }

    /**
     * SME accepts assignment
     */
    public BiaAssignment acceptAssignment(Long assignmentId, Long smeId) {
        log.info("SME {} accepting assignment {}", smeId, assignmentId);

        BiaAssignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found: " + assignmentId));

        if (!assignment.getAssignedTo().getId().equals(smeId)) {
            throw new RuntimeException("Assignment not assigned to this SME");
        }

        assignment.setStatus(BiaAssignment.AssignmentStatus.ACCEPTED);
        assignment.setAcceptedAt(LocalDateTime.now());
        assignment = assignmentRepository.save(assignment);

        // Record workflow history
        User sme = assignment.getAssignedTo();
        recordWorkflowHistory(assignment.getBia(), "COMPLETE", "COMPLETE", "DRAFT", "IN_PROGRESS",
                BiaWorkflowHistory.WorkflowAction.ACCEPTED, smeId, sme.getFullName(),
                "SME", "SME accepted assignment");

        log.info("Assignment {} accepted by SME {}", assignmentId, smeId);
        return assignment;
    }

    /**
     * SME submits BIA to Champion for review
     */
    public BiaAssignment submitToChampion(Long biaId, Long smeId) {
        log.info("SME {} submitting BIA {} to Champion", smeId, biaId);

        BiaRecord bia = biaRecordRepository.findById(biaId)
                .orElseThrow(() -> new RuntimeException("BIA not found: " + biaId));

        BiaAssignment assignment = assignmentRepository.findActiveAssignmentByBiaId(biaId)
                .orElseThrow(() -> new RuntimeException("No active assignment found for BIA: " + biaId));

        if (!assignment.getAssignedTo().getId().equals(smeId)) {
            throw new RuntimeException("BIA not assigned to this SME");
        }

        // Update assignment status
        assignment.setStatus(BiaAssignment.AssignmentStatus.COMPLETED);
        assignment.setCompletedAt(LocalDateTime.now());
        assignmentRepository.save(assignment);

        // Update BIA workflow stage
        bia.setWorkflowStage("REVIEW");
        bia.setWorkflowStatus("SUBMITTED");
        bia.setCompletedAt(LocalDateTime.now());
        biaRecordRepository.save(bia);

        // Record workflow history
        User sme = assignment.getAssignedTo();
        recordWorkflowHistory(bia, "COMPLETE", "REVIEW", "IN_PROGRESS", "SUBMITTED",
                BiaWorkflowHistory.WorkflowAction.SUBMITTED, smeId, sme.getFullName(),
                "SME", "SME submitted BIA to Champion for review");

        // Send notification to Champion
        User champion = assignment.getAssignedBy();
        notificationService.notifyBiaSubmitted(champion, bia, sme);

        log.info("BIA {} submitted to Champion by SME {}", biaId, smeId);
        return assignment;
    }

    /**
     * Champion submits BIA for official approval
     */
    public void submitForApproval(Long biaId, Long championId) {
        log.info("Champion {} submitting BIA {} for official approval", championId, biaId);

        BiaRecord bia = biaRecordRepository.findById(biaId)
                .orElseThrow(() -> new RuntimeException("BIA not found: " + biaId));

        User champion = userRepository.findById(championId)
                .orElseThrow(() -> new RuntimeException("Champion not found: " + championId));

        // Update BIA workflow stage
        bia.setWorkflowStage("REVIEW");
        bia.setWorkflowStatus("IN_REVIEW");
        bia.setReviewedAt(LocalDateTime.now());
        biaRecordRepository.save(bia);

        // Create approval workflow stages
        createApprovalWorkflow(bia);

        // Record workflow history
        recordWorkflowHistory(bia, "REVIEW", "REVIEW", "SUBMITTED", "IN_REVIEW",
                BiaWorkflowHistory.WorkflowAction.REVIEWED, championId, champion.getFullName(),
                "Champion", "Champion submitted BIA for official approval");

        // Notify first approver (Division Head / Reviewer)
        Optional<BiaApprovalWorkflow> firstStage = approvalWorkflowRepository.findByBiaIdAndStageNumber(biaId, 1);
        firstStage.ifPresent(stage -> {
            if (stage.getApprover() != null) {
                notificationService.notifyApprovalRequired(stage.getApprover(), bia, stage.getStageName().toString());
            }
        });

        log.info("BIA {} submitted for official approval by Champion {}", biaId, championId);
    }

    /**
     * Create approval workflow stages for a BIA
     */
    private void createApprovalWorkflow(BiaRecord bia) {
        log.info("Creating approval workflow for BIA {}", bia.getId());

        // Stage 1: Reviewer (Division Head)
        BiaApprovalWorkflow stage1 = BiaApprovalWorkflow.builder()
                .bia(bia)
                .stageNumber(1)
                .stageName(BiaApprovalWorkflow.StageName.REVIEWER)
                .roleName("Division Head")
                .approver(bia.getDivisionHeadId() != null ? userRepository.findById(bia.getDivisionHeadId()).orElse(null) : null)
                .approverName(bia.getDivisionHeadName())
                .status(BiaApprovalWorkflow.ApprovalStatus.PENDING)
                .notifiedAt(LocalDateTime.now())
                .build();

        // Stage 2: Verifier (BCM Department)
        BiaApprovalWorkflow stage2 = BiaApprovalWorkflow.builder()
                .bia(bia)
                .stageNumber(2)
                .stageName(BiaApprovalWorkflow.StageName.VERIFIER)
                .roleName("BCM Department")
                .approver(bia.getBcmVerifierId() != null ? userRepository.findById(bia.getBcmVerifierId()).orElse(null) : null)
                .approverName(bia.getBcmVerifierName())
                .status(BiaApprovalWorkflow.ApprovalStatus.PENDING)
                .build();

        // Stage 3: Approver (Chief of Department)
        BiaApprovalWorkflow stage3 = BiaApprovalWorkflow.builder()
                .bia(bia)
                .stageNumber(3)
                .stageName(BiaApprovalWorkflow.StageName.APPROVER)
                .roleName("Chief of Department")
                .approver(bia.getApproverId() != null ? userRepository.findById(bia.getApproverId()).orElse(null) : null)
                .approverName(bia.getApproverName())
                .status(BiaApprovalWorkflow.ApprovalStatus.PENDING)
                .build();

        approvalWorkflowRepository.save(stage1);
        approvalWorkflowRepository.save(stage2);
        approvalWorkflowRepository.save(stage3);

        log.info("Approval workflow created for BIA {} with 3 stages", bia.getId());
    }

    /**
     * Record workflow history
     */
    private void recordWorkflowHistory(BiaRecord bia, String fromStage, String toStage,
                                       String fromStatus, String toStatus,
                                       BiaWorkflowHistory.WorkflowAction action,
                                       Long actionById, String actionByName, String actionByRole,
                                       String comments) {
        User actionBy = actionById != null ? userRepository.findById(actionById).orElse(null) : null;

        BiaWorkflowHistory history = BiaWorkflowHistory.builder()
                .bia(bia)
                .fromStage(fromStage)
                .toStage(toStage)
                .fromStatus(fromStatus)
                .toStatus(toStatus)
                .action(action)
                .performedBy(actionBy)
                .performedByName(actionByName)
                .performedByRole(actionByRole)
                .comments(comments)
                .performedAt(LocalDateTime.now())
                .build();

        workflowHistoryRepository.save(history);
    }

    /**
     * Get BIA assignments for a user
     */
    public List<BiaAssignment> getAssignmentsForUser(Long userId) {
        return assignmentRepository.findByAssignedToId(userId);
    }

    /**
     * Get pending assignments for a user
     */
    public List<BiaAssignment> getPendingAssignmentsForUser(Long userId) {
        return assignmentRepository.findPendingAssignmentsByUserId(userId);
    }

    /**
     * Get workflow history for a BIA
     */
    public List<BiaWorkflowHistory> getWorkflowHistory(Long biaId) {
        return workflowHistoryRepository.findByBiaIdChronological(biaId);
    }

    /**
     * Delegate BIA to SME (wrapper for controller)
     */
    public BiaAssignment delegateBiaToSME(Long biaId, Long championId, Long smeId, String reason) {
        return delegateBiaToSme(biaId, championId, smeId, reason, null);
    }

    /**
     * Accept assignment (wrapper for controller)
     */
    public BiaAssignment acceptAssignment(Long assignmentId) {
        BiaAssignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found: " + assignmentId));
        return acceptAssignment(assignmentId, assignment.getAssignedTo().getId());
    }

    /**
     * Reject assignment
     */
    public BiaAssignment rejectAssignment(Long assignmentId, String reason) {
        log.info("Rejecting assignment {}", assignmentId);

        BiaAssignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found: " + assignmentId));

        assignment.setStatus(BiaAssignment.AssignmentStatus.REJECTED);
        assignment.setAssignmentNotes("Rejected: " + reason);
        assignment = assignmentRepository.save(assignment);

        // TODO: Notify the assigner
        // notificationService.notifyAssignmentRejected(assignment.getAssignedBy(), assignment.getBia(), assignment.getAssignedTo(), reason);

        log.info("Assignment {} rejected", assignmentId);
        return assignment;
    }

    /**
     * Get assignments for a BIA
     */
    public List<BiaAssignment> getAssignmentsForBia(Long biaId) {
        return assignmentRepository.findByBiaId(biaId);
    }
}

