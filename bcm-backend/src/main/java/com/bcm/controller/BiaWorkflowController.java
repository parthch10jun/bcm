package com.bcm.controller;

import com.bcm.dto.BiaAssignmentDTO;
import com.bcm.entity.BiaAssignment;
import com.bcm.service.BiaWorkflowService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST Controller for BIA Workflow Operations
 * Handles delegation, assignment, and workflow state transitions
 */
@RestController
@RequestMapping("/api/bia-workflow")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BiaWorkflowController {

    private final BiaWorkflowService workflowService;

    /**
     * Delegate BIA to SME
     * POST /api/bia-workflow/delegate
     */
    @PostMapping("/delegate")
    public ResponseEntity<BiaAssignment> delegateBia(@RequestBody BiaAssignmentDTO assignmentDTO) {
        BiaAssignment assignment = workflowService.delegateBiaToSME(
            assignmentDTO.getBiaId(),
            assignmentDTO.getAssignedById(),
            assignmentDTO.getAssignedToId(),
            assignmentDTO.getAssignmentReason()
        );
        return ResponseEntity.ok(assignment);
    }

    /**
     * Accept BIA assignment
     * POST /api/bia-workflow/accept/{assignmentId}
     */
    @PostMapping("/accept/{assignmentId}")
    public ResponseEntity<BiaAssignment> acceptAssignment(@PathVariable Long assignmentId) {
        BiaAssignment assignment = workflowService.acceptAssignment(assignmentId);
        return ResponseEntity.ok(assignment);
    }

    /**
     * Reject BIA assignment
     * POST /api/bia-workflow/reject/{assignmentId}
     */
    @PostMapping("/reject/{assignmentId}")
    public ResponseEntity<BiaAssignment> rejectAssignment(
        @PathVariable Long assignmentId,
        @RequestBody Map<String, String> payload
    ) {
        String reason = payload.get("reason");
        BiaAssignment assignment = workflowService.rejectAssignment(assignmentId, reason);
        return ResponseEntity.ok(assignment);
    }

    /**
     * Submit BIA to Champion for review (after SME completes)
     * POST /api/bia-workflow/submit-to-champion/{biaId}
     */
    @PostMapping("/submit-to-champion/{biaId}")
    public ResponseEntity<Void> submitToChampion(
        @PathVariable Long biaId,
        @RequestBody Map<String, Long> payload
    ) {
        Long submittedById = payload.get("submittedById");
        workflowService.submitToChampion(biaId, submittedById);
        return ResponseEntity.ok().build();
    }

    /**
     * Submit BIA for official approval (Champion submits to Division Head)
     * POST /api/bia-workflow/submit-for-approval/{biaId}
     */
    @PostMapping("/submit-for-approval/{biaId}")
    public ResponseEntity<Void> submitForApproval(
        @PathVariable Long biaId,
        @RequestBody Map<String, Long> payload
    ) {
        Long submittedById = payload.get("submittedById");
        workflowService.submitForApproval(biaId, submittedById);
        return ResponseEntity.ok().build();
    }

    /**
     * Get all assignments for a user
     * GET /api/bia-workflow/assignments/user/{userId}
     */
    @GetMapping("/assignments/user/{userId}")
    public ResponseEntity<List<BiaAssignment>> getUserAssignments(@PathVariable Long userId) {
        List<BiaAssignment> assignments = workflowService.getAssignmentsForUser(userId);
        return ResponseEntity.ok(assignments);
    }

    /**
     * Get all assignments for a BIA
     * GET /api/bia-workflow/assignments/bia/{biaId}
     */
    @GetMapping("/assignments/bia/{biaId}")
    public ResponseEntity<List<BiaAssignment>> getBiaAssignments(@PathVariable Long biaId) {
        List<BiaAssignment> assignments = workflowService.getAssignmentsForBia(biaId);
        return ResponseEntity.ok(assignments);
    }

    /**
     * Get pending assignments for a user
     * GET /api/bia-workflow/assignments/pending/{userId}
     */
    @GetMapping("/assignments/pending/{userId}")
    public ResponseEntity<List<BiaAssignment>> getPendingAssignments(@PathVariable Long userId) {
        List<BiaAssignment> assignments = workflowService.getPendingAssignmentsForUser(userId);
        return ResponseEntity.ok(assignments);
    }

    /**
     * Get workflow history for a BIA
     * GET /api/bia-workflow/history/{biaId}
     */
    @GetMapping("/history/{biaId}")
    public ResponseEntity<?> getWorkflowHistory(@PathVariable Long biaId) {
        var history = workflowService.getWorkflowHistory(biaId);
        return ResponseEntity.ok(history);
    }
}

