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
 * Service for managing BIA approval workflow
 * Handles sequential approval chain: Reviewer -> Verifier -> Approver
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class BiaApprovalService {

    private final BiaRecordRepository biaRecordRepository;
    private final BiaApprovalWorkflowRepository approvalWorkflowRepository;
    private final BiaWorkflowHistoryRepository workflowHistoryRepository;
    private final BiaCommentRepository commentRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    /**
     * Approve BIA at current stage
     */
    public BiaApprovalWorkflow approveBia(Long biaId, Long approverId, Integer stageNumber, String comments) {
        log.info("Approving BIA {} at stage {} by approver {}", biaId, stageNumber, approverId);

        BiaRecord bia = biaRecordRepository.findById(biaId)
                .orElseThrow(() -> new RuntimeException("BIA not found: " + biaId));

        BiaApprovalWorkflow stage = approvalWorkflowRepository.findByBiaIdAndStageNumber(biaId, stageNumber)
                .orElseThrow(() -> new RuntimeException("Approval stage not found"));

        User approver = userRepository.findById(approverId)
                .orElseThrow(() -> new RuntimeException("Approver not found: " + approverId));

        // Verify approver
        if (stage.getApprover() != null && !stage.getApprover().getId().equals(approverId)) {
            throw new RuntimeException("User is not authorized to approve this stage");
        }

        // Update stage
        stage.setStatus(BiaApprovalWorkflow.ApprovalStatus.APPROVED);
        stage.setDecision(BiaApprovalWorkflow.ApprovalDecision.APPROVE);
        stage.setComments(comments);
        stage.setDecisionDate(LocalDateTime.now());
        stage.setRespondedAt(LocalDateTime.now());
        approvalWorkflowRepository.save(stage);

        // Add comment if provided
        if (comments != null && !comments.isEmpty()) {
            addComment(bia, approver, BiaComment.CommentType.APPROVAL, comments, stage);
        }

        // Record workflow history
        recordApprovalHistory(bia, approver, stage.getStageName().toString(), 
                BiaWorkflowHistory.WorkflowAction.APPROVED, comments);

        // Check if this is the last stage
        Optional<Integer> maxStage = approvalWorkflowRepository.findMaxStageNumberByBiaId(biaId);
        if (maxStage.isPresent() && stageNumber.equals(maxStage.get())) {
            // Final approval - mark BIA as approved
            finalizeBiaApproval(bia, approver);
        } else {
            // Move to next stage
            moveToNextStage(bia, stageNumber);
        }

        log.info("BIA {} approved at stage {} by approver {}", biaId, stageNumber, approverId);
        return stage;
    }

    /**
     * Reject BIA at current stage
     */
    public BiaApprovalWorkflow rejectBia(Long biaId, Long approverId, Integer stageNumber, String reason) {
        log.info("Rejecting BIA {} at stage {} by approver {}", biaId, stageNumber, approverId);

        BiaRecord bia = biaRecordRepository.findById(biaId)
                .orElseThrow(() -> new RuntimeException("BIA not found: " + biaId));

        BiaApprovalWorkflow stage = approvalWorkflowRepository.findByBiaIdAndStageNumber(biaId, stageNumber)
                .orElseThrow(() -> new RuntimeException("Approval stage not found"));

        User approver = userRepository.findById(approverId)
                .orElseThrow(() -> new RuntimeException("Approver not found: " + approverId));

        // Update stage
        stage.setStatus(BiaApprovalWorkflow.ApprovalStatus.REJECTED);
        stage.setDecision(BiaApprovalWorkflow.ApprovalDecision.REJECT);
        stage.setComments(reason);
        stage.setDecisionDate(LocalDateTime.now());
        stage.setRespondedAt(LocalDateTime.now());
        approvalWorkflowRepository.save(stage);

        // Add comment
        addComment(bia, approver, BiaComment.CommentType.APPROVAL, reason, stage);

        // Update BIA status
        bia.setWorkflowStatus("REJECTED");
        biaRecordRepository.save(bia);

        // Record workflow history
        recordApprovalHistory(bia, approver, stage.getStageName().toString(),
                BiaWorkflowHistory.WorkflowAction.REJECTED, reason);

        // Notify Champion
        if (bia.getChampionId() != null) {
            User champion = userRepository.findById(bia.getChampionId()).orElse(null);
            if (champion != null) {
                notificationService.notifyBiaRejected(champion, bia, approver.getFullName(), reason);
            }
        }

        log.info("BIA {} rejected at stage {} by approver {}", biaId, stageNumber, approverId);
        return stage;
    }

    /**
     * Request changes for BIA
     */
    public BiaApprovalWorkflow requestChanges(Long biaId, Long approverId, Integer stageNumber, String comments) {
        log.info("Requesting changes for BIA {} at stage {} by approver {}", biaId, stageNumber, approverId);

        BiaRecord bia = biaRecordRepository.findById(biaId)
                .orElseThrow(() -> new RuntimeException("BIA not found: " + biaId));

        BiaApprovalWorkflow stage = approvalWorkflowRepository.findByBiaIdAndStageNumber(biaId, stageNumber)
                .orElseThrow(() -> new RuntimeException("Approval stage not found"));

        User approver = userRepository.findById(approverId)
                .orElseThrow(() -> new RuntimeException("Approver not found: " + approverId));

        // Update stage
        stage.setStatus(BiaApprovalWorkflow.ApprovalStatus.CHANGES_REQUESTED);
        stage.setDecision(BiaApprovalWorkflow.ApprovalDecision.REQUEST_CHANGES);
        stage.setComments(comments);
        stage.setDecisionDate(LocalDateTime.now());
        stage.setRespondedAt(LocalDateTime.now());
        approvalWorkflowRepository.save(stage);

        // Add comment
        addComment(bia, approver, BiaComment.CommentType.CHANGE_REQUEST, comments, stage);

        // Update BIA status
        bia.setWorkflowStatus("CHANGES_REQUESTED");
        biaRecordRepository.save(bia);

        // Record workflow history
        recordApprovalHistory(bia, approver, stage.getStageName().toString(),
                BiaWorkflowHistory.WorkflowAction.CHANGES_REQUESTED, comments);

        // Notify Champion
        if (bia.getChampionId() != null) {
            User champion = userRepository.findById(bia.getChampionId()).orElse(null);
            if (champion != null) {
                notificationService.notifyChangesRequested(champion, bia, approver.getFullName(), comments);
            }
        }

        log.info("Changes requested for BIA {} at stage {} by approver {}", biaId, stageNumber, approverId);
        return stage;
    }

    /**
     * Move to next approval stage
     */
    private void moveToNextStage(BiaRecord bia, Integer currentStage) {
        Integer nextStageNumber = currentStage + 1;
        Optional<BiaApprovalWorkflow> nextStage = approvalWorkflowRepository.findByBiaIdAndStageNumber(bia.getId(), nextStageNumber);

        if (nextStage.isPresent()) {
            BiaApprovalWorkflow stage = nextStage.get();
            stage.setNotifiedAt(LocalDateTime.now());
            approvalWorkflowRepository.save(stage);

            // Update BIA workflow stage
            String newStage = switch (nextStageNumber) {
                case 2 -> "VERIFICATION";
                case 3 -> "APPROVAL";
                default -> bia.getWorkflowStage();
            };
            bia.setWorkflowStage(newStage);
            bia.setWorkflowStatus("IN_" + newStage);
            biaRecordRepository.save(bia);

            // Notify next approver
            if (stage.getApprover() != null) {
                notificationService.notifyApprovalRequired(stage.getApprover(), bia, stage.getStageName().toString());
            }
        }
    }

    /**
     * Finalize BIA approval (all stages approved)
     */
    private void finalizeBiaApproval(BiaRecord bia, User finalApprover) {
        log.info("Finalizing approval for BIA {}", bia.getId());

        bia.setWorkflowStage("APPROVED");
        bia.setWorkflowStatus("APPROVED");
        bia.setApprovedAt(LocalDateTime.now());
        biaRecordRepository.save(bia);

        // Notify Champion
        if (bia.getChampionId() != null) {
            User champion = userRepository.findById(bia.getChampionId()).orElse(null);
            if (champion != null) {
                notificationService.notifyBiaApproved(champion, bia, finalApprover.getFullName());
            }
        }

        log.info("BIA {} fully approved", bia.getId());
    }

    /**
     * Add comment to BIA
     */
    private void addComment(BiaRecord bia, User commenter, BiaComment.CommentType type,
                           String commentText, BiaApprovalWorkflow stage) {
        BiaComment comment = BiaComment.builder()
                .bia(bia)
                .commentType(type)
                .commentText(commentText)
                .creator(commenter)
                .workflowStage(bia.getWorkflowStage())
                .isChangeRequest(type == BiaComment.CommentType.CHANGE_REQUEST)
                .changeRequestStatus(type == BiaComment.CommentType.CHANGE_REQUEST ?
                    BiaComment.ChangeRequestStatus.PENDING : null)
                .build();

        // Set audit fields (inherited from BaseEntity)
        comment.setCreatedBy(commenter.getFullName());
        comment.setCreatedAt(LocalDateTime.now());

        commentRepository.save(comment);
    }

    /**
     * Record approval history
     */
    private void recordApprovalHistory(BiaRecord bia, User approver, String stageName,
                                       BiaWorkflowHistory.WorkflowAction action, String comments) {
        BiaWorkflowHistory history = BiaWorkflowHistory.builder()
                .bia(bia)
                .fromStage(bia.getWorkflowStage())
                .toStage(bia.getWorkflowStage())
                .fromStatus(bia.getWorkflowStatus())
                .toStatus(bia.getWorkflowStatus())
                .action(action)
                .performedBy(approver)
                .performedByName(approver.getFullName())
                .performedByRole(stageName)
                .comments(comments)
                .performedAt(LocalDateTime.now())
                .build();

        workflowHistoryRepository.save(history);
    }

    /**
     * Get pending approvals for a user
     */
    public List<BiaApprovalWorkflow> getPendingApprovalsForUser(Long userId) {
        return approvalWorkflowRepository.findPendingApprovalsByApproverId(userId);
    }

    /**
     * Get approval workflow for a BIA
     */
    public List<BiaApprovalWorkflow> getApprovalWorkflow(Long biaId) {
        return approvalWorkflowRepository.findByBiaId(biaId);
    }

    /**
     * Get comments for a BIA
     */
    public List<BiaComment> getComments(Long biaId) {
        return commentRepository.findByBiaIdChronological(biaId);
    }

    /**
     * Get current approval stage for a BIA
     */
    public BiaApprovalWorkflow getCurrentApprovalStage(Long biaId) {
        List<BiaApprovalWorkflow> workflow = approvalWorkflowRepository.findByBiaId(biaId);
        return workflow.stream()
                .filter(stage -> stage.getStatus() == BiaApprovalWorkflow.ApprovalStatus.PENDING)
                .findFirst()
                .orElse(null);
    }

    /**
     * Add comment (wrapper for controller)
     */
    public BiaComment addComment(Long biaId, Long userId, String commentText, Boolean isChangeRequest) {
        BiaRecord bia = biaRecordRepository.findById(biaId)
                .orElseThrow(() -> new RuntimeException("BIA not found: " + biaId));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        BiaComment.CommentType type = Boolean.TRUE.equals(isChangeRequest)
                ? BiaComment.CommentType.CHANGE_REQUEST
                : BiaComment.CommentType.GENERAL;

        BiaComment comment = BiaComment.builder()
                .bia(bia)
                .commentType(type)
                .commentText(commentText)
                .creator(user)
                .workflowStage(bia.getWorkflowStage())
                .isChangeRequest(Boolean.TRUE.equals(isChangeRequest))
                .changeRequestStatus(Boolean.TRUE.equals(isChangeRequest) ?
                    BiaComment.ChangeRequestStatus.PENDING : null)
                .build();

        comment.setCreatedBy(user.getFullName());
        comment.setCreatedAt(LocalDateTime.now());

        return commentRepository.save(comment);
    }

    /**
     * Get comments for BIA (wrapper for controller)
     */
    public List<BiaComment> getCommentsForBia(Long biaId) {
        return getComments(biaId);
    }

    /**
     * Address a comment
     */
    public BiaComment addressComment(Long commentId, Long addressedById) {
        BiaComment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found: " + commentId));

        User addressedByUser = userRepository.findById(addressedById)
                .orElseThrow(() -> new RuntimeException("User not found: " + addressedById));

        comment.setChangeRequestStatus(BiaComment.ChangeRequestStatus.ADDRESSED);
        comment.setAddressedAt(LocalDateTime.now());
        comment.setAddressedBy(addressedByUser.getFullName());

        return commentRepository.save(comment);
    }
}

