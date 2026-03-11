# Golf Saudi BIA Workflow - Role-Based Testing Script

## 🎯 Testing Objective
Verify that each of the 5 roles (Champion, SME, Division Head, BCM Verifier, Chief Approver) has the correct permissions and can only perform actions appropriate to their role.

---

## 🚀 Pre-Test Setup

### 1. Verify Services Running
- ✅ Backend: http://localhost:8080 (Spring Boot)
- ✅ Frontend: http://localhost:3000 (Next.js)

### 2. Open Browser
Navigate to: **http://localhost:3000/bia-records/new**

### 3. Locate Role Switcher
- Look for **user profile dropdown** in top-right corner
- Should show current user name and role
- Click to see all 5 role options

---

## 📋 Test Execution

### TEST 1: CHAMPION ROLE

#### Switch to Champion
1. Click user profile dropdown (top-right)
2. Select **"Champion"** (blue badge)
3. Verify role badge shows "CHAMPION" in blue

#### What You Should See
- ✅ **Role Banner**: Blue banner showing "CHAMPION - Complete department profile and assign processes to SMEs"
- ✅ **Logged in as**: Your name displayed
- ✅ **Workflow Stage**: "INITIATE" (first stage highlighted in blue)
- ✅ **Workflow Status**: "DRAFT"

#### Actions to Test

**A. Basic Information Form**
- ✅ Can fill in BIA Name
- ✅ Can select BIA Type (Process/Department/Location)
- ✅ Champion field auto-filled with your name
- ✅ Can fill Department Description
- ✅ Can select Department Location from Golf Saudi dropdown
- ✅ Can enter Number of Employees

**B. Process Selection**
- ✅ Can select processes from dropdown
- ✅ Can add multiple processes
- ✅ Can remove processes

**C. SME Assignment (Per Process)**
- ✅ Can see "Assign SME" dropdown for each process
- ✅ Can select SME from user list
- ✅ Can leave SME blank (Champion completes directly)

**D. Process Location**
- ✅ Can select Process Location from Golf Saudi locations dropdown
- ✅ Dropdown shows: HQ-RYD, GC-RYD-01, GC-JED-01, etc.

**E. Submit Button**
- ✅ Can see "Submit for Data Entry" button
- ✅ Button is enabled when form is valid
- ✅ Clicking moves workflow to "COMPLETE" stage

#### What You Should NOT See
- ❌ "Approve for Verification" button
- ❌ "Verify and Send for Approval" button
- ❌ "Final Approve" button
- ❌ "Reject" button

#### Expected Behavior
- Champion can CREATE and EDIT BIA
- Champion can ASSIGN processes to SMEs
- Champion can SUBMIT for data entry
- Champion CANNOT approve, verify, or reject

---

### TEST 2: SME ROLE

#### Switch to SME
1. Click user profile dropdown
2. Select **"SME"** (purple badge)
3. Verify role badge shows "SME" in purple

#### What You Should See
- ✅ **Role Banner**: Purple banner showing "SME - Complete assigned process-level impact analysis"
- ✅ **Workflow Stage**: "COMPLETE" (second stage highlighted)
- ✅ **Workflow Status**: "SUBMITTED"
- ✅ **Notifications**: Should show BIAs assigned to you

#### Actions to Test

**A. View Assigned BIAs Only**
- ✅ Can see notification: "IT Infrastructure BIA - Complete process-level impact analysis"
- ✅ Clicking notification navigates to assigned BIA
- ❌ Cannot see BIAs not assigned to them

**B. Complete Process-Level Data**
- ✅ Can fill Impact Analysis for assigned processes
- ✅ Can select impact ratings (None/Low/Medium/High/Critical)
- ✅ Can see MTPD calculation
- ✅ Can select RTO (must be < MTPD)
- ✅ Can select RPO

**C. Golf Saudi Process Fields**
- ✅ Can see Process Location (read-only if already set by Champion)
- ✅ Can see Assigned SME (shows their name)

**D. Dependencies**
- ✅ Can add People dependencies
- ✅ Can add Asset dependencies
- ✅ Can add Vendor dependencies
- ✅ Can add Vital Records dependencies

**E. HR Enabler Fields (for People dependencies)**
- ✅ Can enter "Competencies Required"
- ✅ Can select "Backup Resource" from user dropdown
- ✅ Can enter "Critical Availability Timeframe" (hours)

**F. Submit Button**
- ✅ Can see "Submit for Review" button
- ✅ Clicking moves workflow to "REVIEW" stage

#### What You Should NOT See
- ❌ "Create New BIA" button
- ❌ "Assign SME" dropdown (for other processes)
- ❌ BIAs not assigned to them
- ❌ Any approval/verification buttons

#### Expected Behavior
- SME can ONLY see assigned BIAs
- SME can EDIT assigned process data
- SME can SUBMIT for review
- SME CANNOT create BIAs or assign to others

---

### TEST 3: DIVISION HEAD ROLE

#### Switch to Division Head
1. Click user profile dropdown
2. Select **"Division Head"** (yellow badge)
3. Verify role badge shows "DIVISION HEAD" in yellow

#### What You Should See
- ✅ **Role Banner**: Yellow banner showing "DIVISION HEAD - Review and approve or request changes"
- ✅ **Workflow Stage**: "REVIEW" (third stage highlighted)
- ✅ **Workflow Status**: "IN_REVIEW"
- ✅ **Notifications**: BIAs pending review

#### Actions to Test

**A. View BIA Data (Read-Only)**
- ✅ Can see all basic information
- ✅ Can see all process analyses
- ✅ Can see impact scores
- ✅ Can see dependencies
- ✅ Can see HR enabler details
- ❌ CANNOT edit any fields (all should be read-only or disabled)

**B. Add Comments**
- ✅ Can see "Add Comment" button
- ✅ Can type comment text
- ✅ Can mark comment as "Change Request"
- ✅ Can submit comment

**C. Request Changes**
- ✅ Can see "Request Changes" button
- ✅ Clicking opens comment modal
- ✅ Can add change request comment
- ✅ Submitting sends BIA back to "COMPLETE" stage with status "CHANGES_REQUESTED"
- ✅ Champion/SME receives notification

**D. Approve for Verification**
- ✅ Can see "Approve for Verification" button
- ✅ Clicking moves workflow to "VERIFICATION" stage
- ✅ BCM Verifier receives notification

#### What You Should NOT See
- ❌ "Create New BIA" button
- ❌ Edit buttons on any fields
- ❌ "Verify and Send for Approval" button
- ❌ "Final Approve" button

#### Expected Behavior
- Division Head can VIEW all data
- Division Head can ADD COMMENTS
- Division Head can REQUEST CHANGES (sends back to Champion/SME)
- Division Head can APPROVE FOR VERIFICATION (sends to BCM)
- Division Head CANNOT edit data or provide final approval

---

### TEST 4: BCM VERIFIER ROLE

#### Switch to BCM Verifier
1. Click user profile dropdown
2. Select **"BCM Verifier"** (indigo badge)
3. Verify role badge shows "BCM VERIFIER" in indigo

#### What You Should See
- ✅ **Role Banner**: Indigo banner showing "BCM VERIFIER - Verify completeness and compliance with BCM methodology"
- ✅ **Workflow Stage**: "VERIFICATION" (fourth stage highlighted)
- ✅ **Workflow Status**: "IN_VERIFICATION"
- ✅ **Notifications**: BIAs pending verification

#### Actions to Test

**A. View BIA Data (Read-Only)**
- ✅ Can see all data
- ✅ Can see all comments and change requests
- ❌ CANNOT edit any fields

**B. Verify Completeness**
- ✅ Can review all required fields
- ✅ Can check impact analysis methodology
- ✅ Can verify RTO < MTPD validation
- ✅ Can verify dependencies are linked
- ✅ Can verify HR enabler data is complete

**C. Add Comments**
- ✅ Can add verification comments
- ✅ Can mark issues found

**D. Request Corrections**
- ✅ Can see "Request Corrections" button
- ✅ Clicking sends BIA back to "COMPLETE" stage
- ✅ Champion/SME receives notification

**E. Approve for Final Approval**
- ✅ Can see "Approve for Final Approval" button
- ✅ Clicking moves workflow to "APPROVAL" stage
- ✅ Chief Approver receives notification

#### What You Should NOT See
- ❌ "Create New BIA" button
- ❌ Edit buttons
- ❌ "Final Approve" button (only Chief can do this)

#### Expected Behavior
- BCM Verifier can VIEW all data
- BCM Verifier can ADD COMMENTS
- BCM Verifier can REQUEST CORRECTIONS (sends back to Champion/SME)
- BCM Verifier can APPROVE FOR FINAL APPROVAL (sends to Chief)
- BCM Verifier CANNOT edit data or provide final approval

---

### TEST 5: CHIEF APPROVER ROLE

#### Switch to Chief Approver
1. Click user profile dropdown
2. Select **"Chief Approver"** (green badge)
3. Verify role badge shows "CHIEF APPROVER" in green

#### What You Should See
- ✅ **Role Banner**: Green banner showing "CHIEF APPROVER - Provide final approval"
- ✅ **Workflow Stage**: "APPROVAL" (fifth stage highlighted)
- ✅ **Workflow Status**: "VERIFIED"
- ✅ **Notifications**: BIAs pending final approval

#### Actions to Test

**A. View Complete BIA (Read-Only)**
- ✅ Can see all data
- ✅ Can see complete workflow history
- ✅ Can see all comments from all stages
- ❌ CANNOT edit any fields

**B. Add Final Comments**
- ✅ Can add approval/rejection comments

**C. Reject BIA**
- ✅ Can see "Reject" button
- ✅ Clicking opens rejection reason modal
- ✅ Must provide rejection reason
- ✅ Submitting sets status to "REJECTED"
- ✅ Champion receives notification

**D. Approve BIA**
- ✅ Can see "Approve" button
- ✅ Clicking moves workflow to "APPROVED" stage
- ✅ Status changes to "APPROVED"
- ✅ Timestamp recorded
- ✅ BIA becomes read-only official record

#### What You Should NOT See
- ❌ "Create New BIA" button
- ❌ Edit buttons
- ❌ "Request Changes" button
- ❌ "Verify" button

#### Expected Behavior
- Chief Approver can VIEW all data
- Chief Approver can ADD COMMENTS
- Chief Approver can REJECT with reason
- Chief Approver can APPROVE (final approval)
- Chief Approver CANNOT edit data

---

## ✅ Validation Checklist

### Golf Saudi-Specific Features
- [ ] Process Location dropdown shows Golf Saudi locations
- [ ] RPO field NOT visible for Process BIA (info message shown)
- [ ] RTO validation prevents RTO >= MTPD
- [ ] HR Enabler fields visible for People dependencies:
  - [ ] Competencies Required (textarea)
  - [ ] Backup Resource (dropdown)
  - [ ] Critical Availability Timeframe (hours)
- [ ] Department profile fields visible for Department BIA

### Role-Based Access Control
- [ ] Champion can create and assign BIAs
- [ ] SME can only see assigned BIAs
- [ ] Division Head can only review (not edit)
- [ ] BCM Verifier can only verify (not edit)
- [ ] Chief Approver can only approve/reject (not edit)

### Workflow Progression
- [ ] INITIATE → COMPLETE (Champion submits)
- [ ] COMPLETE → REVIEW (Champion/SME submits)
- [ ] REVIEW → VERIFICATION (Division Head approves)
- [ ] VERIFICATION → APPROVAL (BCM Verifier approves)
- [ ] APPROVAL → APPROVED (Chief Approver approves)

### Change Request Flow
- [ ] Division Head can request changes
- [ ] BCM Verifier can request corrections
- [ ] BIA returns to COMPLETE stage
- [ ] Champion/SME can address change requests
- [ ] Can mark change requests as "Addressed"
- [ ] Can resubmit for review

### Notifications
- [ ] Champion sees BIAs to create/complete
- [ ] SME sees assigned BIAs
- [ ] Division Head sees BIAs to review
- [ ] BCM Verifier sees BIAs to verify
- [ ] Chief Approver sees BIAs to approve
- [ ] Notifications show priority (HIGH/MEDIUM/LOW)
- [ ] Notifications show due dates
- [ ] Clicking notification navigates to BIA

---

## 🐛 Issues Found

Document any issues found during testing:

1. **Issue**: 
   **Expected**: 
   **Actual**: 
   **Severity**: 

2. **Issue**: 
   **Expected**: 
   **Actual**: 
   **Severity**: 

---

## 📊 Test Results Summary

- **Total Tests**: 5 roles × ~10 actions each = ~50 tests
- **Passed**: ___
- **Failed**: ___
- **Blocked**: ___
- **Pass Rate**: ___%

---

## ✅ Sign-Off

- **Tester Name**: _______________
- **Date**: _______________
- **Overall Status**: PASS / FAIL / PARTIAL
- **Notes**: 


