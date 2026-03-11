# Golf Saudi BIA Workflow - Comprehensive Test Plan

## Test Objective
Verify that the Golf Saudi BIA workflow correctly implements role-based access control and enforces proper segregation of duties across all 5 roles.

---

## Test Roles

### 1. Champion (BIA Initiator)
**Responsibilities:**
- Create new BIA
- Complete department/division profile
- Assign processes to SMEs
- Can complete process-level data directly OR assign to SMEs
- Address change requests
- Resubmit after corrections

**Should NOT be able to:**
- Review own BIA
- Verify own BIA
- Approve own BIA

---

### 2. SME (Subject Matter Expert)
**Responsibilities:**
- Complete assigned process-level data ONLY
- Fill impact analysis for assigned processes
- Define dependencies for assigned processes
- Address change requests for assigned processes

**Should NOT be able to:**
- Create new BIAs
- Assign BIAs to others
- View BIAs not assigned to them
- Review, verify, or approve BIAs

---

### 3. Division Head (Reviewer)
**Responsibilities:**
- Review submitted BIAs
- Add comments
- Request changes (sends back to Champion/SME)
- Approve for verification (sends to BCM)

**Should NOT be able to:**
- Create BIAs
- Edit BIA data
- Verify or approve BIAs (only review)

---

### 4. BCM Verifier (BCM Department)
**Responsibilities:**
- Verify completeness of BIA
- Check compliance with BCM methodology
- Request corrections (sends back to Champion/SME)
- Approve for final approval (sends to Chief)

**Should NOT be able to:**
- Create BIAs
- Edit BIA data
- Provide final approval (only verify)

---

### 5. Chief Approver (Chief of Department Head)
**Responsibilities:**
- Provide final approval
- Reject BIA with reason
- View complete BIA with all history

**Should NOT be able to:**
- Create BIAs
- Edit BIA data
- Review or verify (only approve/reject)

---

## Test Scenarios

### Scenario 1: Champion Creates and Assigns BIA

**Steps:**
1. Login as Champion
2. Navigate to "Create New BIA"
3. Select BIA Type (Process)
4. Complete Basic Information:
   - BIA Name
   - Champion (auto-filled)
   - Department Description
   - Department Location (Golf Saudi dropdown)
   - Number of Employees
5. Select Process(es)
6. For each process:
   - Assign to SME (optional) OR complete directly
   - Add Process Location (Golf Saudi dropdown)
7. Submit for Data Entry

**Expected Results:**
- ✅ Champion can create BIA
- ✅ Champion can assign SMEs
- ✅ Champion can complete directly
- ✅ Golf Saudi location dropdowns populated
- ✅ Workflow moves to COMPLETE stage
- ✅ SME receives notification (if assigned)

---

### Scenario 2: SME Completes Assigned Process

**Steps:**
1. Login as SME
2. View notifications
3. Click on assigned BIA
4. Complete process-level data:
   - Impact Analysis (all categories)
   - MTPD calculation
   - RTO selection (must be < MTPD)
   - Dependencies (People, Assets, Vendors, Vital Records)
   - For each HR enabler:
     - Competencies required
     - Backup resource
     - Critical availability timeframe
5. Submit for Review

**Expected Results:**
- ✅ SME sees ONLY assigned BIAs
- ✅ SME can ONLY edit assigned processes
- ✅ SME cannot see other BIAs
- ✅ RTO validation prevents RTO >= MTPD
- ✅ HR enabler fields captured
- ✅ Workflow moves to REVIEW stage
- ✅ Division Head receives notification

---

### Scenario 3: Division Head Reviews BIA

**Steps:**
1. Login as Division Head
2. View notifications
3. Click on BIA pending review
4. Review all data:
   - Basic information
   - Process analyses
   - Impact scores
   - Dependencies
   - HR enablers
5. Option A: Request Changes
   - Add comment explaining what needs to change
   - Mark as change request
   - Submit
6. Option B: Approve for Verification
   - Add approval comment (optional)
   - Submit for verification

**Expected Results:**
- ✅ Division Head can VIEW all data
- ✅ Division Head CANNOT edit data
- ✅ Division Head can add comments
- ✅ Division Head can request changes
- ✅ Division Head can approve for verification
- ✅ If changes requested: workflow returns to COMPLETE, Champion/SME notified
- ✅ If approved: workflow moves to VERIFICATION, BCM notified

---

### Scenario 4: Champion/SME Addresses Change Requests

**Steps:**
1. Login as Champion or SME
2. View notifications
3. Click on BIA with change requests
4. View change request comments
5. Make required corrections
6. Mark change requests as "Addressed"
7. Resubmit for review

**Expected Results:**
- ✅ Champion/SME sees change request notification
- ✅ Change requests clearly visible
- ✅ Can edit BIA to address changes
- ✅ Can mark change requests as addressed
- ✅ Workflow returns to REVIEW stage
- ✅ Division Head notified of resubmission

---

### Scenario 5: BCM Verifier Verifies BIA

**Steps:**
1. Login as BCM Verifier
2. View notifications
3. Click on BIA pending verification
4. Verify:
   - All required fields completed
   - Impact analysis methodology correct
   - RTO < MTPD validation
   - Dependencies properly linked
   - HR enabler data complete
5. Option A: Request Corrections
   - Add comment explaining issues
   - Send back to Champion/SME
6. Option B: Approve for Final Approval
   - Add verification comment
   - Submit for approval

**Expected Results:**
- ✅ BCM Verifier can VIEW all data
- ✅ BCM Verifier CANNOT edit data
- ✅ BCM Verifier can add comments
- ✅ BCM Verifier can request corrections
- ✅ BCM Verifier can approve for final approval
- ✅ If corrections requested: workflow returns to COMPLETE
- ✅ If approved: workflow moves to APPROVAL, Chief notified

---

### Scenario 6: Chief Approver Provides Final Approval

**Steps:**
1. Login as Chief Approver
2. View notifications
3. Click on BIA pending approval
4. Review complete BIA
5. Option A: Reject
   - Add rejection reason
   - Submit rejection
6. Option B: Approve
   - Add approval comment (optional)
   - Provide final approval

**Expected Results:**
- ✅ Chief Approver can VIEW all data
- ✅ Chief Approver CANNOT edit data
- ✅ Chief Approver can add comments
- ✅ Chief Approver can reject with reason
- ✅ Chief Approver can approve
- ✅ If rejected: workflow status = REJECTED
- ✅ If approved: workflow status = APPROVED, timestamp recorded
- ✅ Approved BIA becomes read-only official record

---

## Validation Checks

### Golf Saudi-Specific Validations

1. **Process Location**
   - ✅ Dropdown shows all Golf Saudi locations
   - ✅ Required field
   - ✅ Saved correctly

2. **RPO Removed from Process Level**
   - ✅ RPO field NOT visible for Process BIA
   - ✅ Only RTO and MTPD shown
   - ✅ Info message explains Golf Saudi methodology

3. **RTO Validation**
   - ✅ RTO must be < MTPD
   - ✅ Error message if RTO >= MTPD
   - ✅ Cannot submit with invalid RTO

4. **HR Enabler Fields**
   - ✅ Competencies required (textarea)
   - ✅ Backup resource (dropdown from Users)
   - ✅ Critical availability timeframe (hours)
   - ✅ All fields saved correctly

5. **Department Profile**
   - ✅ Department description
   - ✅ Department location (Golf Saudi dropdown)
   - ✅ Number of employees
   - ✅ Only shown for Department BIA

---

## Role-Based UI Visibility

### Champion View
- ✅ Can see "Create New BIA" button
- ✅ Can see "Assign SME" dropdown
- ✅ Can see "Submit for Data Entry" button
- ✅ Can see "Address Change Requests" buttons
- ❌ Cannot see "Approve" buttons
- ❌ Cannot see "Verify" buttons

### SME View
- ❌ Cannot see "Create New BIA" button
- ❌ Cannot see "Assign SME" dropdown
- ✅ Can see ONLY assigned processes
- ✅ Can see "Submit for Review" button
- ❌ Cannot see other users' BIAs

### Division Head View
- ❌ Cannot see "Create New BIA" button
- ❌ Cannot edit any fields
- ✅ Can see "Request Changes" button
- ✅ Can see "Approve for Verification" button
- ❌ Cannot see "Verify" or "Final Approve" buttons

### BCM Verifier View
- ❌ Cannot see "Create New BIA" button
- ❌ Cannot edit any fields
- ✅ Can see "Request Corrections" button
- ✅ Can see "Approve for Final Approval" button
- ❌ Cannot see "Final Approve" button

### Chief Approver View
- ❌ Cannot see "Create New BIA" button
- ❌ Cannot edit any fields
- ✅ Can see "Reject" button
- ✅ Can see "Approve" button
- ❌ Cannot see any other action buttons

---

## Test Execution Checklist

- [ ] Test Scenario 1: Champion Creates and Assigns BIA
- [ ] Test Scenario 2: SME Completes Assigned Process
- [ ] Test Scenario 3: Division Head Reviews BIA
- [ ] Test Scenario 4: Champion/SME Addresses Change Requests
- [ ] Test Scenario 5: BCM Verifier Verifies BIA
- [ ] Test Scenario 6: Chief Approver Provides Final Approval
- [ ] Validate all Golf Saudi-specific fields
- [ ] Validate all role-based UI restrictions
- [ ] Validate workflow stage transitions
- [ ] Validate notification system
- [ ] Validate audit trail

---

## Known Issues to Fix

1. **Role Switcher**: Currently shows all roles - need to restrict based on user permissions
2. **BIA Assignment**: No UI for Champion to assign entire BIA to SME
3. **Read-Only Mode**: Checkers can still see edit fields (need to disable)
4. **Workflow Enforcement**: Need to prevent manual stage changes
5. **Notification Actions**: Clicking notification should navigate to correct BIA view

---

## Success Criteria

✅ All 5 roles have distinct permissions
✅ No role can perform actions outside their scope
✅ Workflow progresses only through proper approvals
✅ Golf Saudi fields all functional
✅ RTO validation working
✅ HR enabler fields captured
✅ Notifications sent to correct roles
✅ Audit trail maintained

