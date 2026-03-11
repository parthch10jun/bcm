# Role-Based Dashboard Implementation

## Overview

This document describes the implementation of role-based dashboards for the BIA workflow system. Each role (Champion, SME, Division Head, BCM Verifier, Chief Approver) now has a dedicated dashboard showing role-specific tasks, BIAs, and actions.

## Architecture

### Dashboard Router
**File:** `src/app/dashboard/page.tsx`

The main dashboard page acts as a router that directs users to their role-specific dashboard based on their current role from the UserProfileContext.

```typescript
switch (currentUser.role) {
  case 'CHAMPION': return <ChampionDashboard />;
  case 'SME': return <SMEDashboard />;
  case 'DIVISION_HEAD': return <ReviewerDashboard />;
  case 'BCM_VERIFIER': return <VerifierDashboard />;
  case 'APPROVER': return <ApproverDashboard />;
}
```

## Role-Specific Dashboards

### 1. Champion Dashboard
**File:** `src/app/dashboard/components/ChampionDashboard.tsx`

**Purpose:** Manage department's BIAs, initiate new BIAs, assign to SMEs, review submissions

**Features:**
- **KPI Cards:**
  - Total BIAs
  - Draft
  - In Progress
  - Pending Review
  - Approved

- **BIA Records Table:**
  - Process Name
  - BIA Status
  - Assigned To (Champion or SME name)
  - Last Updated
  - Actions

- **Actions Available:**
  - **For Draft BIAs (not assigned):**
    - [Start BIA] - Navigate to wizard
    - [Assign to SME] - Open delegation modal
  
  - **For Submitted BIAs (from SME):**
    - [Review] - Navigate to review page
    - [Submit for Approval] - Submit to official approval workflow

**API Endpoints Used:**
- `GET /api/bias?championId={id}` - Fetch BIAs assigned to this Champion
- `POST /api/bia-workflow/submit-for-approval` - Submit BIA for official approval

---

### 2. SME Dashboard
**File:** `src/app/dashboard/components/SMEDashboard.tsx`

**Purpose:** View assigned BIAs, complete BIA wizard, submit to Champion

**Features:**
- **KPI Cards:**
  - Total Assigned
  - Pending
  - Completed
  - High Priority

- **Assignments Table:**
  - BIA Name
  - Assigned By (Champion name)
  - Priority (High/Medium/Low)
  - Status (Pending/In Progress/Completed)
  - Due Date (with days remaining)
  - Actions

- **Actions Available:**
  - **For Pending/In Progress:**
    - [Start BIA] / [Continue] - Navigate to wizard
    - [Submit to Champion] - Submit completed BIA to Champion for review

**API Endpoints Used:**
- `GET /api/bia-workflow/assignments?smeId={id}` - Fetch BIAs assigned to this SME
- `POST /api/bia-workflow/submit-to-champion` - Submit BIA to Champion

---

### 3. Reviewer Dashboard (Division Head - Stage 1)
**File:** `src/app/dashboard/components/ReviewerDashboard.tsx`

**Purpose:** Review BIAs submitted for official approval, approve or request changes

**Features:**
- **KPI Cards:**
  - Pending Review
  - High Priority
  - Overdue (>3 days)

- **BIAs Table:**
  - BIA Name
  - Submitted By (Champion name)
  - Priority
  - Submitted (days ago)
  - Actions

- **Actions Available:**
  - [Review] - Navigate to read-only wizard view
  - [Approve] - Approve and move to Stage 2 (BCM Verifier)
  - [Request Changes] - Send back to Champion with comments

**API Endpoints Used:**
- `GET /api/bia-approval/pending-review?reviewerId={id}&stage=1` - Fetch BIAs pending review
- `POST /api/bia-approval/approve` - Approve BIA
- `POST /api/bia-approval/request-changes` - Request changes

---

### 4. Verifier Dashboard (BCM Dept - Stage 2)
**File:** `src/app/dashboard/components/VerifierDashboard.tsx`

**Purpose:** Verify BIAs approved by Division Head, approve or request changes

**Features:**
- **KPI Cards:**
  - Pending Verification
  - High Priority
  - Overdue (>2 days)

- **BIAs Table:**
  - BIA Name
  - Reviewed By (Division Head name)
  - Priority
  - Reviewed (days ago)
  - Actions

- **Actions Available:**
  - [Review] - Navigate to read-only wizard view
  - [Verify] - Approve and move to Stage 3 (Chief Approver)
  - [Request Changes] - Send back with comments

**API Endpoints Used:**
- `GET /api/bia-approval/pending-verification?verifierId={id}&stage=2` - Fetch BIAs pending verification
- `POST /api/bia-approval/approve` - Verify BIA
- `POST /api/bia-approval/request-changes` - Request changes

---

### 5. Approver Dashboard (Chief - Stage 3)
**File:** `src/app/dashboard/components/ApproverDashboard.tsx`

**Purpose:** Final approval of BIAs, complete the workflow

**Features:**
- **KPI Cards:**
  - Pending Approval
  - High Priority
  - Overdue (>1 day)

- **BIAs Table:**
  - BIA Name
  - Verified By (BCM Verifier name)
  - Priority
  - Verified (days ago)
  - Actions

- **Actions Available:**
  - [Review] - Navigate to read-only wizard view
  - [Approve] - Final approval, BIA becomes complete
  - [Reject] - Reject and send back to Champion

**API Endpoints Used:**
- `GET /api/bia-approval/pending-approval?approverId={id}&stage=3` - Fetch BIAs pending final approval
- `POST /api/bia-approval/approve` - Final approval
- `POST /api/bia-approval/reject` - Reject BIA

---

## Supporting Components

### BIA Delegation Modal
**File:** `src/components/BIADelegationModal.tsx`

**Purpose:** Allow Champions to assign BIAs to SMEs

**Features:**
- SME selection dropdown (filtered by department/unit)
- Priority level (High/Medium/Low)
- Due date (optional)
- Assignment reason/notes (required)
- Sends notification to SME

**API Endpoint:**
- `POST /api/bia-workflow/delegate` - Assign BIA to SME

**Request Body:**
```json
{
  "biaId": 123,
  "championId": 1,
  "smeId": 101,
  "assignmentReason": "You have expertise in this process",
  "dueDate": "2025-11-15",
  "priority": "HIGH"
}
```

---

## Navigation Integration

### Updated Navigation
**File:** `src/components/Navigation.tsx`

Added "My Dashboard" link to main navigation:
- **Home** - Overview page (existing)
- **My Dashboard** - Role-based dashboard (NEW)
- Libraries, BIA, Risk Assessment, etc. (existing)

The "My Dashboard" link routes to `/dashboard` which automatically shows the appropriate role-specific dashboard.

---

## UI/UX Design Standards

All dashboards follow the same design system used in Assets, Vendors, and Vital Records libraries:

### Typography
- Page title: `text-xl font-semibold text-gray-900`
- Subtitle: `text-xs text-gray-500`
- Table headers: `text-[10px] font-medium text-gray-500 uppercase tracking-wider`
- Table content: `text-xs text-gray-900`
- KPI labels: `text-[10px] font-medium text-gray-500 uppercase tracking-wider`
- KPI values: `text-2xl font-semibold`

### Spacing
- Page padding: `px-6 py-4`
- Card padding: `p-3`
- Button padding: `px-3 py-1.5` (standard), `px-2 py-1` (small)
- Grid gaps: `gap-3`
- Section spacing: `mb-4`

### Colors
- **Status Badges:**
  - Draft: `bg-gray-100 text-gray-700`
  - In Progress: `bg-blue-100 text-blue-700`
  - Submitted: `bg-yellow-100 text-yellow-700`
  - In Review: `bg-purple-100 text-purple-700`
  - Approved: `bg-green-100 text-green-700`
  - Rejected: `bg-red-100 text-red-700`

- **Priority Badges:**
  - High: `bg-red-100 text-red-700`
  - Medium: `bg-yellow-100 text-yellow-700`
  - Low: `bg-green-100 text-green-700`

### Components
- Border radius: `rounded-sm` (all components)
- Borders: `border border-gray-200`
- Buttons: `text-xs font-medium rounded-sm`
- Icons: `h-3.5 w-3.5` (buttons), `h-4 w-4` (headers)

---

## Workflow Integration

### Complete BIA Workflow

1. **Initiation (Champion)**
   - Champion clicks "Initiate BIA" → Creates Draft BIA
   - Champion can either:
     - Start BIA themselves, OR
     - Assign to SME via delegation modal

2. **Data Entry (Champion or SME)**
   - Assigned person completes 14-step wizard
   - Saves progress (status: IN_PROGRESS)
   - Submits to Champion (if SME) or directly for approval (if Champion)

3. **Champion Review (if delegated)**
   - Champion reviews SME's work
   - Can request changes or submit for official approval

4. **Stage 1: Division Head Review**
   - Division Head sees BIA in Reviewer Dashboard
   - Reviews and either:
     - Approves → moves to Stage 2
     - Requests changes → back to Champion

5. **Stage 2: BCM Verifier**
   - BCM Verifier sees BIA in Verifier Dashboard
   - Verifies and either:
     - Approves → moves to Stage 3
     - Requests changes → back to Champion

6. **Stage 3: Chief Approver**
   - Chief sees BIA in Approver Dashboard
   - Final decision:
     - Approves → BIA complete (status: APPROVED)
     - Rejects → back to Champion

---

## Next Steps

### Still To Implement:

1. **BIA Review Interface** (`/bia-records/[id]/approve/page.tsx`)
   - Read-only wizard view for reviewers/verifiers/approvers
   - Comment system
   - Approve/Reject/Request Changes actions

2. **Real-time Notifications**
   - Fetch from backend `/api/notifications`
   - Display in notification bell with unread count
   - Make notifications clickable with action URLs

3. **Campaign Initiation Feature**
   - BCM Team bulk-creates multiple Process BIA records
   - All set to Draft status
   - Assigned to Champions

4. **Backend API Integration**
   - Currently using mock data
   - Need to connect to actual Spring Boot endpoints
   - Handle error states and loading states

5. **Testing**
   - End-to-end workflow testing
   - Role switching testing
   - Permission validation

---

## Files Created/Modified

### New Files:
- `src/app/dashboard/page.tsx` - Dashboard router
- `src/app/dashboard/components/ChampionDashboard.tsx` - Champion dashboard
- `src/app/dashboard/components/SMEDashboard.tsx` - SME dashboard
- `src/app/dashboard/components/ReviewerDashboard.tsx` - Division Head dashboard
- `src/app/dashboard/components/VerifierDashboard.tsx` - BCM Verifier dashboard
- `src/app/dashboard/components/ApproverDashboard.tsx` - Chief Approver dashboard
- `src/components/BIADelegationModal.tsx` - Delegation modal component

### Modified Files:
- `src/components/Navigation.tsx` - Added "My Dashboard" link

---

## Summary

This implementation provides a complete role-based dashboard system that supports the multi-stage BIA workflow. Each role sees only the information and actions relevant to their responsibilities, creating a clean, focused user experience that guides users through their tasks efficiently.

The system is designed to scale with additional roles and workflow stages, and follows enterprise UI/UX standards for consistency across the entire BCM platform.

