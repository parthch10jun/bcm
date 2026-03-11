# Frontend Validation Testing Guide

## Overview
This document provides a comprehensive testing guide for all frontend validations implemented in the Organizational Units module.

---

## ✅ Validations Implemented

### 1. **Single Top-Level Unit Prevention**
- **Location:** Create & Edit forms
- **Behavior:** 
  - If a root unit exists, the "Top Level (No Parent)" option is disabled
  - Help text changes to indicate root already exists
  - In edit mode: Only disabled if current unit is NOT the root

### 2. **Unit Name Uniqueness Within Parent**
- **Location:** Create & Edit forms
- **Behavior:**
  - Real-time validation on blur
  - Checks if name exists under selected parent
  - Shows red border and error message if duplicate
  - In edit mode: Excludes current unit from check
  - Re-validates when parent selection changes

### 3. **Unit Code Global Uniqueness**
- **Location:** Create & Edit forms
- **Behavior:**
  - Real-time validation on blur
  - Shows loading spinner while checking
  - Shows green checkmark (✓) if available
  - Shows red X if taken
  - Border color changes (green/red)
  - In edit mode: Excludes current unit code from check

### 4. **Circular Dependency Prevention**
- **Location:** Edit form only
- **Behavior:**
  - Filters out current unit from parent dropdown
  - Filters out all descendants from parent dropdown
  - Prevents selecting a subordinate as parent

### 5. **Field Length Limits**
- **Location:** Create & Edit forms
- **Fields with maxLength:**
  - Unit Name: 255 characters
  - Unit Code: 50 characters
  - Description: 2000 characters (with counter)
  - Unit Head: 255 characters
  - Unit Head Email: 255 characters
  - Unit Head Phone: 50 characters
- **Description Counter:**
  - Shows "X / 2000 characters"
  - Turns orange when > 1800 characters

---

## 🧪 Manual Testing Checklist

### Test 1: Single Top-Level Unit Prevention ✅

**Steps:**
1. Navigate to http://localhost:3000/libraries/organizational-units/new
2. Check the "Parent Unit" dropdown
3. Verify the "Top Level (No Parent)" option is disabled
4. Verify help text says "A top-level organization already exists"

**Expected Result:**
- ✅ Top-level option is disabled
- ✅ Help text indicates root exists
- ✅ User must select a parent

---

### Test 2: Unit Name Uniqueness - Create Form ✅

**Steps:**
1. Navigate to http://localhost:3000/libraries/organizational-units/new
2. Select "Operations Division" as parent (ID: 2)
3. Enter "Customer Service" as unit name (this already exists under Operations)
4. Click outside the field (blur)

**Expected Result:**
- ✅ Red border appears on unit name field
- ✅ Error message: "A unit named 'Customer Service' already exists under Operations Division"
- ✅ Submit button should show alert if clicked

**Steps to Clear Error:**
1. Change name to "Customer Support"
2. Click outside the field

**Expected Result:**
- ✅ Error message disappears
- ✅ Border returns to normal

---

### Test 3: Unit Name Re-validation on Parent Change ✅

**Steps:**
1. Navigate to http://localhost:3000/libraries/organizational-units/new
2. Select "Operations Division" as parent
3. Enter "Customer Service" as unit name
4. See error appear
5. Change parent to "Technology Division" (ID: 3)

**Expected Result:**
- ✅ Error disappears (because "Customer Service" doesn't exist under Technology Division)
- ✅ Border returns to normal

---

### Test 4: Unit Code Uniqueness - Create Form ✅

**Steps:**
1. Navigate to http://localhost:3000/libraries/organizational-units/new
2. Enter "ACME" as unit code (this is the root organization's code)
3. Click outside the field (blur)

**Expected Result:**
- ✅ Loading spinner appears briefly
- ✅ Red X icon appears in field
- ✅ Red border appears
- ✅ Error message: "Unit code 'ACME' is already in use"

**Steps to Test Available Code:**
1. Change code to "TEST-NEW-CODE"
2. Click outside the field

**Expected Result:**
- ✅ Loading spinner appears briefly
- ✅ Green checkmark (✓) appears in field
- ✅ Green border appears
- ✅ Success message: "✓ Unit code is available"

---

### Test 5: Circular Dependency Prevention - Edit Form ✅

**Setup:**
Current hierarchy:
- ACME Corporation (ID: 1)
  - Operations Division (ID: 2)
    - Customer Service (ID: 4)
      - Support Team (ID: 5)

**Steps:**
1. Navigate to http://localhost:3000/libraries/organizational-units/2/edit (Operations Division)
2. Open the "Parent Unit" dropdown
3. Check available options

**Expected Result:**
- ✅ "Operations Division" itself is NOT in the list
- ✅ "Customer Service" (child) is NOT in the list
- ✅ "Support Team" (grandchild) is NOT in the list
- ✅ Only "ACME Corporation" and other non-descendants are available

---

### Test 6: Description Character Counter ✅

**Steps:**
1. Navigate to http://localhost:3000/libraries/organizational-units/new
2. Type or paste text into the Description field
3. Watch the character counter

**Expected Result:**
- ✅ Counter shows "X / 2000 characters"
- ✅ Counter is gray when < 1800 characters
- ✅ Counter turns orange when > 1800 characters
- ✅ Field prevents typing beyond 2000 characters

---

### Test 7: Edit Form - Exclude Self from Name Validation ✅

**Steps:**
1. Navigate to http://localhost:3000/libraries/organizational-units/2/edit (Operations Division)
2. Keep the name as "Operations Division" (unchanged)
3. Click outside the field (blur)

**Expected Result:**
- ✅ NO error appears (should not flag itself as duplicate)
- ✅ Border remains normal

---

### Test 8: Edit Form - Exclude Self from Code Validation ✅

**Steps:**
1. Navigate to http://localhost:3000/libraries/organizational-units/2/edit (Operations Division)
2. Keep the code as "OPS-DIV" (unchanged)
3. Click outside the field (blur)

**Expected Result:**
- ✅ Green checkmark appears (code is "available" because we exclude self)
- ✅ Success message appears
- ✅ NO error

---

### Test 9: Top-Level Option in Edit Form (Current Root) ✅

**Steps:**
1. Navigate to http://localhost:3000/libraries/organizational-units/1/edit (ACME Corporation - the root)
2. Check the "Parent Unit" dropdown

**Expected Result:**
- ✅ "None (Top Level)" option is ENABLED (because this IS the root)
- ✅ User can keep it as top-level

---

### Test 10: Top-Level Option in Edit Form (Non-Root) ✅

**Steps:**
1. Navigate to http://localhost:3000/libraries/organizational-units/2/edit (Operations Division - NOT root)
2. Check the "Parent Unit" dropdown

**Expected Result:**
- ✅ "Top Level (Already Exists)" option is DISABLED
- ✅ Help text indicates root already exists

---

### Test 11: Submit with Validation Errors ✅

**Steps:**
1. Navigate to http://localhost:3000/libraries/organizational-units/new
2. Select "Operations Division" as parent
3. Enter "Customer Service" as name (duplicate)
4. Click "Create Organizational Unit" button

**Expected Result:**
- ✅ Alert appears: "Please fix validation errors before submitting"
- ✅ Form is NOT submitted
- ✅ User remains on page

---

### Test 12: Backend Error Display ✅

**Steps:**
1. Navigate to http://localhost:3000/libraries/organizational-units/new
2. Leave "Parent Unit" as "Top Level"
3. Fill in required fields
4. Click "Create Organizational Unit"

**Expected Result:**
- ✅ Backend returns error: "A top-level organization already exists"
- ✅ Alert shows: "Error: A top-level organization already exists. Only one root unit is allowed."
- ✅ User can see the full error message from backend

---

## 📊 Validation Summary

| Validation | Create Form | Edit Form | Status |
|------------|-------------|-----------|--------|
| Single Top-Level Unit | ✅ Disabled | ✅ Conditional | COMPLETE |
| Unit Name Uniqueness | ✅ Real-time | ✅ Real-time | COMPLETE |
| Unit Code Uniqueness | ✅ Real-time | ✅ Real-time | COMPLETE |
| Circular Dependency | N/A | ✅ Filtered | COMPLETE |
| Field Length Limits | ✅ All fields | ✅ All fields | COMPLETE |
| Character Counter | ✅ Description | ✅ Description | COMPLETE |

---

## 🎨 Visual Feedback Summary

### Unit Name Field
- ❌ **Error State:** Red border + error message below
- ✅ **Valid State:** Normal gray border

### Unit Code Field
- 🔄 **Checking:** Loading spinner in field
- ✅ **Available:** Green border + green checkmark + success message
- ❌ **Taken:** Red border + red X + error message
- ⚪ **Idle:** Normal gray border

### Description Field
- 📊 **Character Counter:** Always visible
- ⚠️ **Warning:** Orange text when > 1800 characters
- 🚫 **Hard Limit:** Cannot type beyond 2000 characters

### Parent Unit Dropdown
- 🚫 **Disabled Options:** Grayed out with explanatory text
- 🔍 **Filtered Options:** Invalid parents not shown in edit mode

---

## 🚀 Next Steps

1. **Manual Testing:** Follow the checklist above to verify all validations
2. **Browser Testing:** Test in Chrome, Firefox, Safari
3. **Edge Cases:** Test with special characters, very long names, etc.
4. **User Experience:** Verify error messages are clear and helpful

---

## 📝 Notes

- All validations work on both Create and Edit forms
- Edit form has additional logic to exclude self from checks
- Edit form filters out descendants to prevent circular references
- Backend validations are the final authority (frontend is for UX)
- Error messages from backend are displayed to user

