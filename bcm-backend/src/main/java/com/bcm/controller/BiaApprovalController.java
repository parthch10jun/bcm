package com.bcm.controller;

import com.bcm.dto.ApprovalActionDTO;
import com.bcm.entity.BiaApprovalWorkflow;
import com.bcm.entity.BiaComment;
import com.bcm.service.BiaApprovalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for BIA Approval Workflow
 * Handles the 3-stage approval process (Reviewer -> Verifier -> Approver)
 */
@RestController
@RequestMapping("/api/bia-approval")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BiaApprovalController {

    private final BiaApprovalService approvalService;

    /**
     * Approve a BIA at a specific stage
     * POST /api/bia-approval/approve
     */
    @PostMapping("/approve")
    public ResponseEntity<BiaApprovalWorkflow> approveBia(@RequestBody ApprovalActionDTO actionDTO) {
        BiaApprovalWorkflow workflow = approvalService.approveBia(
            actionDTO.getBiaId(),
            actionDTO.getApprovedById(),
            actionDTO.getStageNumber(),
            actionDTO.getComments()
        );
        return ResponseEntity.ok(workflow);
    }

    /**
     * Reject a BIA at a specific stage
     * POST /api/bia-approval/reject
     */
    @PostMapping("/reject")
    public ResponseEntity<BiaApprovalWorkflow> rejectBia(@RequestBody ApprovalActionDTO actionDTO) {
        BiaApprovalWorkflow workflow = approvalService.rejectBia(
            actionDTO.getBiaId(),
            actionDTO.getApprovedById(),
            actionDTO.getStageNumber(),
            actionDTO.getComments()
        );
        return ResponseEntity.ok(workflow);
    }

    /**
     * Request changes for a BIA at a specific stage
     * POST /api/bia-approval/request-changes
     */
    @PostMapping("/request-changes")
    public ResponseEntity<BiaApprovalWorkflow> requestChanges(@RequestBody ApprovalActionDTO actionDTO) {
        BiaApprovalWorkflow workflow = approvalService.requestChanges(
            actionDTO.getBiaId(),
            actionDTO.getApprovedById(),
            actionDTO.getStageNumber(),
            actionDTO.getComments()
        );
        return ResponseEntity.ok(workflow);
    }

    /**
     * Get approval workflow for a BIA
     * GET /api/bia-approval/workflow/{biaId}
     */
    @GetMapping("/workflow/{biaId}")
    public ResponseEntity<List<BiaApprovalWorkflow>> getApprovalWorkflow(@PathVariable Long biaId) {
        List<BiaApprovalWorkflow> workflow = approvalService.getApprovalWorkflow(biaId);
        return ResponseEntity.ok(workflow);
    }

    /**
     * Get current approval stage for a BIA
     * GET /api/bia-approval/current-stage/{biaId}
     */
    @GetMapping("/current-stage/{biaId}")
    public ResponseEntity<BiaApprovalWorkflow> getCurrentStage(@PathVariable Long biaId) {
        BiaApprovalWorkflow currentStage = approvalService.getCurrentApprovalStage(biaId);
        return ResponseEntity.ok(currentStage);
    }

    /**
     * Get all BIAs pending approval for a user
     * GET /api/bia-approval/pending/{userId}
     */
    @GetMapping("/pending/{userId}")
    public ResponseEntity<List<BiaApprovalWorkflow>> getPendingApprovals(@PathVariable Long userId) {
        List<BiaApprovalWorkflow> pending = approvalService.getPendingApprovalsForUser(userId);
        return ResponseEntity.ok(pending);
    }

    /**
     * Add a comment to a BIA
     * POST /api/bia-approval/comment
     */
    @PostMapping("/comment")
    public ResponseEntity<BiaComment> addComment(@RequestBody ApprovalActionDTO actionDTO) {
        BiaComment comment = approvalService.addComment(
            actionDTO.getBiaId(),
            actionDTO.getApprovedById(),
            actionDTO.getComments(),
            actionDTO.getIsChangeRequest()
        );
        return ResponseEntity.ok(comment);
    }

    /**
     * Get all comments for a BIA
     * GET /api/bia-approval/comments/{biaId}
     */
    @GetMapping("/comments/{biaId}")
    public ResponseEntity<List<BiaComment>> getComments(@PathVariable Long biaId) {
        List<BiaComment> comments = approvalService.getCommentsForBia(biaId);
        return ResponseEntity.ok(comments);
    }

    /**
     * Address a change request comment
     * POST /api/bia-approval/address-comment/{commentId}
     */
    @PostMapping("/address-comment/{commentId}")
    public ResponseEntity<BiaComment> addressComment(
        @PathVariable Long commentId,
        @RequestParam Long addressedById
    ) {
        BiaComment comment = approvalService.addressComment(commentId, addressedById);
        return ResponseEntity.ok(comment);
    }
}

