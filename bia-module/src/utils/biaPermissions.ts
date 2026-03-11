import { UserRole } from '@/contexts/UserProfileContext';

export type WorkflowStage = 'INITIATE' | 'COMPLETE' | 'REVIEW' | 'VERIFICATION' | 'APPROVAL' | 'APPROVED';
export type WorkflowStatus = 'DRAFT' | 'SUBMITTED' | 'IN_REVIEW' | 'CHANGES_REQUESTED' | 'IN_VERIFICATION' | 'VERIFIED' | 'APPROVED' | 'REJECTED';

export interface BIAPermissions {
  canView: boolean;
  canEdit: boolean;
  canCreate: boolean;
  canAssign: boolean;
  canSubmit: boolean;
  canReview: boolean;
  canRequestChanges: boolean;
  canVerify: boolean;
  canApprove: boolean;
  canReject: boolean;
  canAddComments: boolean;
  canViewComments: boolean;
  canAddressChangeRequests: boolean;
}

/**
 * Get permissions for a user role at a specific workflow stage
 */
export function getBIAPermissions(
  userRole: UserRole,
  workflowStage: WorkflowStage,
  workflowStatus: WorkflowStatus,
  isAssignedToUser: boolean = false
): BIAPermissions {
  const permissions: BIAPermissions = {
    canView: false,
    canEdit: false,
    canCreate: false,
    canAssign: false,
    canSubmit: false,
    canReview: false,
    canRequestChanges: false,
    canVerify: false,
    canApprove: false,
    canReject: false,
    canAddComments: false,
    canViewComments: false,
    canAddressChangeRequests: false,
  };

  // CHAMPION permissions
  if (userRole === 'CHAMPION') {
    permissions.canView = true;
    permissions.canCreate = true;
    permissions.canViewComments = true;

    if (workflowStage === 'INITIATE' && workflowStatus === 'DRAFT') {
      permissions.canEdit = true;
      permissions.canAssign = true;
      permissions.canSubmit = true;
    }

    if (workflowStage === 'COMPLETE' && workflowStatus === 'SUBMITTED') {
      permissions.canEdit = true;
      permissions.canSubmit = true;
    }

    if (workflowStatus === 'CHANGES_REQUESTED') {
      permissions.canEdit = true;
      permissions.canAddressChangeRequests = true;
      permissions.canSubmit = true;
    }
  }

  // SME permissions
  if (userRole === 'SME') {
    permissions.canView = isAssignedToUser;
    permissions.canViewComments = isAssignedToUser;

    if (isAssignedToUser && workflowStage === 'COMPLETE' && workflowStatus === 'SUBMITTED') {
      permissions.canEdit = true;
      permissions.canSubmit = true;
    }

    if (isAssignedToUser && workflowStatus === 'CHANGES_REQUESTED') {
      permissions.canEdit = true;
      permissions.canAddressChangeRequests = true;
      permissions.canSubmit = true;
    }
  }

  // DIVISION_HEAD permissions
  if (userRole === 'DIVISION_HEAD') {
    permissions.canView = true;
    permissions.canViewComments = true;

    if (workflowStage === 'REVIEW' && workflowStatus === 'IN_REVIEW') {
      permissions.canReview = true;
      permissions.canRequestChanges = true;
      permissions.canAddComments = true;
      permissions.canSubmit = true; // Submit for verification
    }
  }

  // BCM_VERIFIER permissions
  if (userRole === 'BCM_VERIFIER') {
    permissions.canView = true;
    permissions.canViewComments = true;

    if (workflowStage === 'VERIFICATION' && workflowStatus === 'IN_VERIFICATION') {
      permissions.canVerify = true;
      permissions.canRequestChanges = true;
      permissions.canAddComments = true;
      permissions.canSubmit = true; // Submit for approval
    }
  }

  // APPROVER permissions
  if (userRole === 'APPROVER') {
    permissions.canView = true;
    permissions.canViewComments = true;

    if (workflowStage === 'APPROVAL' && workflowStatus === 'VERIFIED') {
      permissions.canApprove = true;
      permissions.canReject = true;
      permissions.canAddComments = true;
    }
  }

  // Everyone can view approved BIAs
  if (workflowStage === 'APPROVED' && workflowStatus === 'APPROVED') {
    permissions.canView = true;
    permissions.canViewComments = true;
  }

  return permissions;
}

/**
 * Get the next workflow stage and status based on current role and action
 */
export function getNextWorkflowState(
  currentStage: WorkflowStage,
  currentStatus: WorkflowStatus,
  userRole: UserRole,
  action: 'SUBMIT' | 'APPROVE' | 'REJECT' | 'REQUEST_CHANGES'
): { stage: WorkflowStage; status: WorkflowStatus } | null {
  // Champion submits from INITIATE
  if (userRole === 'CHAMPION' && currentStage === 'INITIATE' && action === 'SUBMIT') {
    return { stage: 'COMPLETE', status: 'SUBMITTED' };
  }

  // Champion/SME submits from COMPLETE
  if ((userRole === 'CHAMPION' || userRole === 'SME') && currentStage === 'COMPLETE' && action === 'SUBMIT') {
    return { stage: 'REVIEW', status: 'IN_REVIEW' };
  }

  // Division Head approves for verification
  if (userRole === 'DIVISION_HEAD' && currentStage === 'REVIEW' && action === 'APPROVE') {
    return { stage: 'VERIFICATION', status: 'IN_VERIFICATION' };
  }

  // Division Head requests changes
  if (userRole === 'DIVISION_HEAD' && currentStage === 'REVIEW' && action === 'REQUEST_CHANGES') {
    return { stage: 'COMPLETE', status: 'CHANGES_REQUESTED' };
  }

  // BCM Verifier approves for final approval
  if (userRole === 'BCM_VERIFIER' && currentStage === 'VERIFICATION' && action === 'APPROVE') {
    return { stage: 'APPROVAL', status: 'VERIFIED' };
  }

  // BCM Verifier requests corrections
  if (userRole === 'BCM_VERIFIER' && currentStage === 'VERIFICATION' && action === 'REQUEST_CHANGES') {
    return { stage: 'COMPLETE', status: 'CHANGES_REQUESTED' };
  }

  // Chief Approver approves
  if (userRole === 'APPROVER' && currentStage === 'APPROVAL' && action === 'APPROVE') {
    return { stage: 'APPROVED', status: 'APPROVED' };
  }

  // Chief Approver rejects
  if (userRole === 'APPROVER' && currentStage === 'APPROVAL' && action === 'REJECT') {
    return { stage: 'APPROVAL', status: 'REJECTED' };
  }

  return null;
}

/**
 * Get user-friendly description of what the user can do at this stage
 */
export function getActionDescription(userRole: UserRole, workflowStage: WorkflowStage, workflowStatus: WorkflowStatus): string {
  if (userRole === 'CHAMPION') {
    if (workflowStage === 'INITIATE') {
      return 'Complete department profile and assign processes to SMEs';
    }
    if (workflowStage === 'COMPLETE') {
      return 'Complete process-level information or wait for SMEs';
    }
    if (workflowStatus === 'CHANGES_REQUESTED') {
      return 'Address change requests and resubmit';
    }
    return 'View BIA status';
  }

  if (userRole === 'SME') {
    if (workflowStage === 'COMPLETE') {
      return 'Complete assigned process-level impact analysis';
    }
    if (workflowStatus === 'CHANGES_REQUESTED') {
      return 'Address change requests for your assigned processes';
    }
    return 'No action required';
  }

  if (userRole === 'DIVISION_HEAD') {
    if (workflowStage === 'REVIEW') {
      return 'Review BIA and approve or request changes';
    }
    return 'No action required';
  }

  if (userRole === 'BCM_VERIFIER') {
    if (workflowStage === 'VERIFICATION') {
      return 'Verify completeness and compliance with BCM methodology';
    }
    return 'No action required';
  }

  if (userRole === 'APPROVER') {
    if (workflowStage === 'APPROVAL') {
      return 'Provide final approval or rejection';
    }
    return 'No action required';
  }

  return 'View only';
}

/**
 * Check if user should see the BIA wizard at all
 */
export function canAccessBIAWizard(userRole: UserRole, workflowStage: WorkflowStage, isAssignedToUser: boolean = false): boolean {
  // Champions can always access to create new BIAs
  if (userRole === 'CHAMPION') return true;

  // SMEs can only access if assigned
  if (userRole === 'SME') return isAssignedToUser;

  // Checkers can access when it reaches their stage
  if (userRole === 'DIVISION_HEAD') return workflowStage === 'REVIEW' || workflowStage === 'VERIFICATION' || workflowStage === 'APPROVAL' || workflowStage === 'APPROVED';
  if (userRole === 'BCM_VERIFIER') return workflowStage === 'VERIFICATION' || workflowStage === 'APPROVAL' || workflowStage === 'APPROVED';
  if (userRole === 'APPROVER') return workflowStage === 'APPROVAL' || workflowStage === 'APPROVED';

  return false;
}

