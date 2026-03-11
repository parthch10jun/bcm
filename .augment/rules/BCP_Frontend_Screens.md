---
type: "manual"
---

# BCP Module - Frontend Screen Specifications

## Overview

This document provides detailed UI/UX specifications for all BCP Module screens. Each screen includes layout structure, UI components, user interactions, and frontend validation requirements.

**Design Principles:**
- Clean, professional GRC/audit-grade interface
- Responsive design (desktop primary, tablet secondary)
- Accessibility compliant (WCAG 2.1 AA)
- Consistent with enterprise design patterns
- Progressive disclosure (show complexity only when needed)

---

## SCREEN 0: BCP MODULE LANDING PAGE (Portfolio View)

### Screen Purpose
Management dashboard providing situational awareness across all BCPs with quick access to critical information and actions.

### Layout Structure

```
┌─────────────────────────────────────────────────────────────────┐
│ [BCP Module Header]                              [+ Create BCP] │
├─────────────────────────────────────────────────────────────────┤
│ Key Metrics (Cards Row)                                         │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌─────────┐│
│ │   XX%        │ │   XX%        │ │   XX         │ │   XX    ││
│ │ Coverage     │ │ Tested 12mo  │ │ Overdue      │ │ Gaps    ││
│ └──────────────┘ └──────────────┘ └──────────────┘ └─────────┘│
├─────────────────────────────────────────────────────────────────┤
│ Filters & Search                                                │
│ [Search: Plan Name...] [Status ▼] [Owner ▼] [Location ▼]      │
├─────────────────────────────────────────────────────────────────┤
│ BCP List (Data Table)                                           │
│ ┌──────────────────────────────────────────────────────────────┐│
│ │Plan Name │Status  │Owner  │Last Review│Next Due│ Status ││
│ ├──────────────────────────────────────────────────────────────┤│
│ │IT Systems│Published│John D │2024-11-15│2025-11│ ✓ Compliant││
│ │Customer  │In Review│Sarah M│2024-10-20│2025-10│ ⚠ Gaps     ││
│ │...       │...      │...    │...       │...    │ ...        ││
│ └──────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

### UI Components

#### 1. Header Section
- **Module Title**: "Business Continuity Plans" (H1)
- **Primary Action Button**: "+ Create BCP" (Primary color, top right)
- **Breadcrumb** (optional): Home > GRC > BCP Module

#### 2. Key Metrics Cards (4 Cards)
Each card contains:
- **Large Number**: Primary metric value (e.g., "87%")
- **Label**: Description (e.g., "Critical Services with Published BCP")
- **Trend Indicator** (optional): ↑ or ↓ with small percentage
- **Background Color**: 
  - Green if metric meets threshold
  - Yellow if approaching threshold
  - Red if below threshold

**Metrics to Display:**
1. **Coverage**: % of critical services with published BCP
2. **Testing**: % of BCPs tested in last 12 months
3. **Overdue**: Count of overdue reviews/tests (number, not %)
4. ** Gaps**: Count of BCPs with compliance gaps

#### 3. Filters & Search Bar
- **Search Input**: 
  - Placeholder: "Search by plan name, owner, or service..."
  - Icon: Magnifying glass
  - Real-time filtering as user types
  
- **Filter Dropdowns** (4 filters):
  1. **Status**: All / Draft / In Review / Approved / Published
  2. **Owner**: All / [List of plan owners]
  3. **Location**: All / [List of locations]
  4. **Compliance**: All / Compliant / Has Gaps / Not Assessed
  
- **Clear Filters** link (appears when filters active)

#### 4. BCP List Data Table

**Table Columns:**
| Column | Width | Sortable | Details |
|--------|-------|----------|---------|
| Plan Name | 25% | Yes | Hyperlink to BCP detail view |
| Status | 12% | Yes | Badge component with color coding |
| Owner | 15% | Yes | User name with avatar |
| Last Reviewed | 12% | Yes | Date format: YYYY-MM-DD |
| Next Review Due | 12% | Yes | Date with warning if <30 days |
| Last Test Date | 12% | Yes | Date format: YYYY-MM-DD |
|  Status | 12% | Yes | Icon + text (✓ Compliant / ⚠ Gaps) |
| Actions | Auto | No | Three-dot menu |

**Status Badge Colors:**
- **Draft**: Gray
- **In Review**: Blue
- **Approved**: Green
- **Published**: Dark Green
- **Retired**: Light gray with strikethrough

**Row Actions Menu (Three-dot):**
- View Details
- Edit (if user has permission)
- Test
- Archive (if status allows)
- Export

**Table Features:**
- Pagination (25/50/100 items per page)
- Column sorting (click header to sort)
- Row hover effect
- Bulk actions checkbox (for future phase)

#### 5. Empty State
When no BCPs exist:
- **Icon**: Document illustration
- **Primary Message**: "No Business Continuity Plans Yet"
- **Secondary Message**: "Get started by creating your first BCP"
- **Action Button**: "Create BCP"

### User Interactions

1. **Click "+ Create BCP"** → Navigate to Screen 1
2. **Click Plan Name** → Navigate to BCP Detail View (read-only overview)
3. **Click "Edit" in actions menu** → Navigate to Screen 1 (edit mode)
4. **Click "Test"** → Navigate to Screen 11 (testing module)
5. **Filter/Search** → Table updates in real-time (no page reload)
6. **Sort column** → Table re-sorts with visual indicator (▲/▼)

### Frontend Validation
- None required (read-only screen)

### Responsive Behavior
- **Desktop (>1200px)**: Full table view
- **Tablet (768-1199px)**: Hide "Last Test Date" column, adjust widths
- **Mobile (<768px)**: Card view instead of table

---

## SCREEN 1: CREATE / INITIATE BCP (Plan Metadata & Control)

### Screen Purpose
Establish governance and ownership before content creation. First step in BCP creation workflow.

### Layout Structure

```
┌─────────────────────────────────────────────────────────────────┐
│ Create Business Continuity Plan                      [X Close]  │
├─────────────────────────────────────────────────────────────────┤
│ Progress: ● ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○                              │
│           1  2 3 4 5 6 7 8 9 10 11 12                           │
├─────────────────────────────────────────────────────────────────┤
│ PLAN DETAILS                                                    │
│                                                                 │
│ Plan Name *                                                     │
│ [_____________________________________________]                 │
│                                                                 │
│ Business Service / Process *                                    │
│ [Select from BIA ▼                           ]                 │
│ ℹ Only BIA-approved critical services are available            │
│                                                                 │
│ Plan Type *                                                     │
│ ○ Business Continuity Plan                                     │
│ ○ IT Disaster Recovery Plan (DRP)                              │
│ ○ Business Recovery Plan (BRP)                                 │
│                                                                 │
│ OWNERSHIP                                                       │
│                                                                 │
│ Plan Owner *                                                    │
│ [Select User ▼                               ]                 │
│                                                                 │
│ Deputy Owner *                                                  │
│ [Select User ▼                               ]                 │
│                                                                 │
│ LOCATION & SCOPE                                                │
│                                                                 │
│ Applicable Locations *                                          │
│ ☐ Headquarters - Riyadh                                        │
│ ☐ Branch Office - Jeddah                                       │
│ ☐ Data Center - Dubai                                          │
│ ☐ Regional Hub - London                                        │
│                                                                 │
│ GOVERNANCE                                                      │
│                                                                 │
│ Review Frequency                                                │
│ ● Annual ( Required) ○ Semi-Annual ○ Quarterly             │
│ ⚠  requires minimum annual review                          │
│                                                                 │
│                                                                 │
│                            [Cancel] [Save Draft] [Next: Scope] │
└─────────────────────────────────────────────────────────────────┘
```

### UI Components

#### 1. Header Section
- **Page Title**: "Create Business Continuity Plan" (H1)
- **Close Button**: X icon (top right) - prompts save draft confirmation if changes made
- **Progress Indicator**: 
  - 12 dots representing 12 screens
  - Filled dot = current screen
  - Gray dot = not started
  - Green dot = completed
  - Numbers below each dot (1-12)

#### 2. Form Sections (Collapsible Cards)

**Section 1: Plan Details**
- **Section Header**: "PLAN DETAILS" (H3, with expand/collapse icon)

**Field: Plan Name***
- Input Type: Text field
- Max Length: 100 characters
- Placeholder: "e.g., Customer Service Operations BCP"
- Character counter: Shows "X/100" below field
- Required field indicator: Red asterisk

**Field: Business Service / Process***
- Input Type: Dropdown (searchable)
- Options: Pull from BIA module (critical services only)
- Help Text: "ℹ Only BIA-approved critical services are available"
- Required field indicator: Red asterisk
- Search capability: Type to filter options

**Field: Plan Type***
- Input Type: Radio buttons (vertical)
- Options:
  - Business Continuity Plan
  - IT Disaster Recovery Plan (DRP)
  - Business Recovery Plan (BRP)
- Default: Business Continuity Plan (pre-selected)
- Required field indicator: Red asterisk

**Section 2: Ownership**
- **Section Header**: "OWNERSHIP" (H3)

**Field: Plan Owner***
- Input Type: User selector dropdown
- Shows: User name + avatar + job title
- Search capability: Type name to filter
- Required field indicator: Red asterisk

**Field: Deputy Owner***
- Input Type: User selector dropdown
- Same format as Plan Owner
- Validation: Cannot be same as Plan Owner
- Required field indicator: Red asterisk

**Section 3: Location & Scope**
- **Section Header**: "LOCATION & SCOPE" (H3)

**Field: Applicable Locations***
- Input Type: Multi-select checkboxes
- Dynamic list based on organization structure
- At least one must be selected
- Required field indicator: Red asterisk

**Section 4: Governance**
- **Section Header**: "GOVERNANCE" (H3)

**Field: Review Frequency**
- Input Type: Radio buttons (horizontal)
- Options: Annual / Semi-Annual / Quarterly
- Default: Annual ( Required) - pre-selected and recommended
- Help Text: "⚠  requires minimum annual review" (in warning color)
- Note: Semi-annual and Quarterly are allowed but annual cannot be removed

#### 3. Auto-Populated Fields (Read-Only Display)
Display in light gray box at bottom:
- **Version**: v1.0 (auto-assigned)
- **Status**: Draft
- **Created Date**: [Current date]
- **Created By**: [Current user]

#### 4. Action Buttons (Footer)
- **Cancel**: Secondary button, left side
  - If no changes: Close immediately
  - If changes made: "Are you sure? Unsaved changes will be lost"
  
- **Save Draft**: Secondary button, center-left
  - Saves current state without validation
  - Shows toast: "Draft saved successfully"
  
- **Next: Scope**: Primary button, right side
  - Validates all required fields
  - Saves and navigates to Screen 2

### User Interactions

1. **Fill Plan Name** → Character counter updates in real-time
2. **Select Business Service** → Dropdown opens, type to search, select option
3. **Select Plan Type** → Radio button selection changes
4. **Select Plan Owner** → User picker opens with search
5. **Select Deputy Owner** → Cannot select same user as Owner (validation error)
6. **Check Locations** → Multiple checkboxes can be selected
7. **Select Review Frequency** → Radio selection (Annual is default/recommended)
8. **Click "Save Draft"** → Form saves, toast notification appears, stays on page
9. **Click "Next: Scope"** → Validates required fields, saves, navigates to Screen 2
10. **Click "Cancel"** → Confirmation dialog if changes exist, then closes

### Frontend Validation

**Required Field Validation:**
- Trigger: On "Next" button click
- Display: Red border around field + error message below field
- Error Messages:
  - Plan Name: "Plan name is required"
  - Business Service: "Please select a business service from BIA"
  - Plan Owner: "Plan owner is required"
  - Deputy Owner: "Deputy owner is required"
  - Locations: "Select at least one applicable location"

**Business Rule Validation:**
- **Deputy ≠ Owner**: 
  - Trigger: On Deputy Owner selection
  - Error: "Deputy owner must be different from plan owner"
  - Display: Red text below Deputy Owner field

**Character Limit:**
- Plan Name: Max 100 characters
- Display: Character counter turns red when limit reached
- Prevent typing beyond limit

### Responsive Behavior
- **Desktop**: Full width form with left-aligned labels
- **Tablet**: Stacked form fields, full width inputs
- **Mobile**: Single column layout, larger touch targets

---

## SCREEN 2: SCOPE & DEPENDENCY CONFIRMATION

### Screen Purpose
Confirm BCP scope by reviewing auto-populated data from BIA and marking dependencies.

### Layout Structure

```
┌─────────────────────────────────────────────────────────────────┐
│ BCP: Customer Service Operations                    [X Close]   │
├─────────────────────────────────────────────────────────────────┤
│ Progress: ● ● ○ ○ ○ ○ ○ ○ ○ ○ ○ ○                              │
│           1 2  3 4 5 6 7 8 9 10 11 12                           │
├─────────────────────────────────────────────────────────────────┤
│ CRITICAL ACTIVITIES (Auto-populated from BIA)                   │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │Activity Name              │RTO    │RPO    │MAO    │Impact  │ │
│ ├─────────────────────────────────────────────────────────────┤ │
│ │Customer Inquiry Handling  │2 hrs  │1 hr   │4 hrs  │Critical│ │
│ │Issue Resolution           │4 hrs  │2 hrs  │8 hrs  │High    │ │
│ │Account Management         │8 hrs  │4 hrs  │24 hrs │Medium  │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                  │
│ SCOPE EXCLUSIONS (Optional)                                      │
│ ☐ Add exclusions                                                 │
│ [Hidden by default - expands when checkbox checked]             │
│                                                                  │
│ DEPENDENCIES (Auto-populated from BIA)                           │
│                                                                  │
│ ┌─────────────────────┐ ┌────────────────────┐                 │
│ │ People              │ │ Applications        │                 │
│ │ • CS Managers (5)   │ │ • CRM System        │                 │
│ │ • CS Reps (25)      │ │ • Ticketing System  │                 │
│ │ • Team Leads (3)    │ │ • Knowledge Base    │                 │
│ └─────────────────────┘ └────────────────────┘                 │
│                                                                  │
│ ┌─────────────────────┐ ┌────────────────────┐                 │
│ │ Infrastructure      │ │ Data / Records      │                 │
│ │ • Contact Center    │ │ • Customer DB       │                 │
│ │ • Telephony         │ │ • Service Logs      │                 │
│ │ • Workstations      │ │ • SLA Reports       │                 │
│ └─────────────────────┘ └────────────────────┘                 │
│                                                                  │
│ THIRD-PARTY DEPENDENCIES                                         │
│ ☑ Mark critical third-party suppliers                           │
│                                                                  │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │Supplier           │Service          │Critical? │BCP Status │ │
│ ├─────────────────────────────────────────────────────────────┤ │
│ │CloudTel Inc.      │Telephony        │ ☑        │✓ Verified │ │
│ │DataHost Solutions │CRM Hosting      │ ☑        │⚠ Pending  │ │
│ │TechSupport Corp   │IT Helpdesk      │ ☐        │- N/A      │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                  │
│                                                                  │
│                        [← Back] [Save Draft] [Next: Activation] │
└─────────────────────────────────────────────────────────────────┘
```

### UI Components

#### 1. Header Section
- **Plan Name Display**: "BCP: [Plan Name]" (H1)
- **Progress Indicator**: Screen 2 of 12 (filled dot)

#### 2. Critical Activities Section (Read-Only)
- **Section Header**: "CRITICAL ACTIVITIES (Auto-populated from BIA)" (H3)
- **Info Badge**: "ℹ Imported from BIA" (blue info box)

**Activities Table:**
- **Layout**: Read-only data table
- **Columns**:
  - Activity Name (40%)
  - RTO (15%)
  - RPO (15%)
  - MAO (15%)
  - Impact (15%)
- **Styling**: Light blue background to indicate auto-populated/read-only
- **Hover**: Show tooltip with full activity details

#### 3. Scope Exclusions Section (Expandable)
- **Toggle Checkbox**: "☐ Add exclusions"
- **Default State**: Collapsed/hidden
- **Expanded State**: Shows:
  - **Exclusion Text Area**: "Describe what is excluded from this BCP"
  - **Justification Field** (required if exclusions added): "Provide justification for exclusions"
  - **Warning**: "⚠ Exclusions require approval from BCM Manager"

#### 4. Dependencies Section (Read-Only Grid)
- **Section Header**: "DEPENDENCIES (Auto-populated from BIA)" (H3)
- **Layout**: 2x2 grid of cards

**Card Structure (4 cards):**
1. **People**
   - Icon: User group icon
   - List: Role (count)
   
2. **Applications**
   - Icon: Computer/app icon
   - List: Application names
   
3. **Infrastructure**
   - Icon: Server/building icon
   - List: Infrastructure components
   
4. **Data / Records**
   - Icon: Database icon
   - List: Data sources

**Card Styling:**
- Light background
- Border
- Scrollable if content exceeds card height

#### 5. Third-Party Dependencies Section (Interactive)
- **Section Header**: "THIRD-PARTY DEPENDENCIES" (H3)
- **Instruction Text**: "☑ Mark critical third-party suppliers"
- ** Badge**: " Required" (red badge)

**Suppliers Table:**
- **Columns**:
  - Supplier (30%)
  - Service (30%)
  - Critical? (Checkbox, 15%)
  - BCP Status (25%)

**Critical Checkbox Logic:**
- Checking "Critical" → Triggers BCP verification workflow
- Unchecking → Removes from critical supplier tracking

**BCP Status Indicators:**
- ✓ Verified (green)
- ⚠ Pending (yellow)
- ✗ Missing (red)
- - N/A (gray, if not marked critical)

**Add Supplier Button:**
- **Button**: "+ Add Third-Party Supplier"
- **Action**: Opens modal to add new supplier not in BIA

#### 6. Action Buttons
- **← Back**: Navigate to Screen 1
- **Save Draft**: Save current state
- **Next: Activation**: Validate and proceed to Screen 3

### User Interactions

1. **Review Activities Table** → Scroll if needed, hover for details
2. **Check "Add exclusions"** → Section expands with text areas
3. **Enter Exclusion** → Text area expands as user types
4. **Enter Justification** → Required if exclusions exist
5. **Review Dependencies Cards** → Read-only review, scroll within cards if needed
6. **Check "Critical" for Supplier** → Status changes, triggers BCP verification note
7. **Click "+ Add Supplier"** → Modal opens with supplier form
8. **Click "Next: Activation"** → Validates, saves, navigates to Screen 3

### Frontend Validation

**Conditional Validation:**
- If "Add exclusions" is checked:
  - **Exclusion description** is required
  - **Justification** is required
  - Error: "Please provide justification for scope exclusions"

**Third-Party Validation:**
- If any supplier marked as "Critical":
  - Warning notification: "Critical suppliers require BCP evidence within 30 days"
  - No blocking validation, just informational

### Responsive Behavior
- **Desktop**: 2x2 grid for dependencies, full table for suppliers
- **Tablet**: 2x1 grid for dependencies, table scrolls horizontally
- **Mobile**: Stacked cards, table converts to card view

---

## SCREEN 3: ACTIVATION & ESCALATION CRITERIA

### Screen Purpose
Define when the BCP is invoked, who decides, and how escalation flows.

### Layout Structure

```
┌─────────────────────────────────────────────────────────────────┐
│ BCP: Customer Service Operations                    [X Close]   │
├─────────────────────────────────────────────────────────────────┤
│ Progress: ● ● ● ○ ○ ○ ○ ○ ○ ○ ○ ○                              │
│           1 2 3  4 5 6 7 8 9 10 11 12                           │
├─────────────────────────────────────────────────────────────────┤
│ ACTIVATION TRIGGERS                                              │
│ Define what events or conditions will activate this BCP          │
│                                                                  │
│ [+ Add Activation Trigger]                                       │
│                                                                  │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Trigger 1: Time-Based                               [Edit][X]│ │
│ │ • Condition: Service outage > 2 hours                       │ │
│ │ • Auto-activation: Yes                                       │ │
│ │ • Severity: High                                             │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                  │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Trigger 2: Impact-Based                             [Edit][X]│ │
│ │ • Condition: >50 customers affected                          │ │
│ │ • Auto-activation: No (requires approval)                    │ │
│ │ • Severity: Medium                                           │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                  │
│ SEVERITY CLASSIFICATION                                          │
│                                                                  │
│ ┌──────────┬──────────────────────────────────────────────────┐│
│ │Severity  │ Definition                          │Escalation   ││
│ ├──────────┼──────────────────────────────────────────────────┤│
│ │Low       │Minimal impact, <10 users           │Team Lead    ││
│ │Medium    │Moderate impact, 10-50 users        │BCM Manager  ││
│ │High      │Significant impact, >50 users       │Crisis Team  ││
│ │Severe    │Critical/Regulatory breach          │Executive    ││
│ └──────────┴──────────────────────────────────────────────────┘│
│                                                                  │
│ ⚠  Requirement: Medium and High severity incidents must     │
│   trigger regulator notification within 24 hours                 │
│                                                                  │
│ ESCALATION WORKFLOW                                              │
│                                                                  │
│ ┌────────────────────────────────────────────────────────────┐ │
│ │ Step 1: Initial Assessment                                  │ │
│ │ • Role: Incident Responder                                  │ │
│ │ • Timeframe: Within 15 minutes                              │ │
│ │ • Actions: Assess severity, document impact                 │ │
│ └────────────────────────────────────────────────────────────┘ │
│         ↓                                                        │
│ ┌────────────────────────────────────────────────────────────┐ │
│ │ Step 2: Team Lead Notification                              │ │
│ │ • Role: Team Lead                                           │ │
│ │ • Timeframe: Within 30 minutes                              │ │
│ │ • Actions: Approve/reject activation                        │ │
│ └────────────────────────────────────────────────────────────┘ │
│         ↓                                                        │
│ ┌────────────────────────────────────────────────────────────┐ │
│ │ Step 3: BCM Manager Escalation (if Medium/High)             │ │
│ │ • Role: BCM Manager                                         │ │
│ │ • Timeframe: Within 1 hour                                  │ │
│ │ • Actions: Notify stakeholders, assess resources            │ │
│ └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│ [+ Add Escalation Step]                                          │
│                                                                  │
│ DECISION AUTHORITY MATRIX                                        │
│                                                                  │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │Action                      │Low   │Medium │High   │Severe   ││
│ ├─────────────────────────────────────────────────────────────┤│
│ │Activate BCP                │Lead  │Manager│Crisis │Exec     ││
│ │Engage Alternate Site       │Lead  │Manager│Manager│Crisis   ││
│ │Notify Regulators           │-     │Manager│Manager│Exec     ││
│ │Declare Major Incident      │-     │-      │Crisis │Exec     ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                  │
│                                                                  │
│                   [← Back] [Save Draft] [Next: Scenarios]       │
└─────────────────────────────────────────────────────────────────┘
```

### UI Components

#### 1. Activation Triggers Section
- **Section Header**: "ACTIVATION TRIGGERS" (H3)
- **Description**: "Define what events or conditions will activate this BCP"
- **Add Button**: "+ Add Activation Trigger" (primary action)

**Trigger Card Component:**
- **Card Header**: "Trigger [number]: [Type]" with [Edit] [X Delete] buttons
- **Card Content**:
  - Condition: Text description
  - Auto-activation: Yes/No toggle
  - Severity: Dropdown (Low/Medium/High/Severe)
- **Styling**: White card with border, hover effect
- **Drag Handle**: For reordering (optional)

**Add/Edit Trigger Modal:**
Opens when clicking "+ Add" or [Edit]
- **Trigger Type** (Radio buttons):
  - ○ Time-Based (e.g., outage duration)
  - ○ Impact-Based (e.g., number of users affected)
  - ○ Event-Based (e.g., facility loss, cyber incident)
  
- **Condition Description** (Text area)
- **Auto-Activation** (Toggle switch): Yes / No
- **Severity Level** (Dropdown): Low / Medium / High / Severe
- **Action Buttons**: [Cancel] [Save Trigger]

#### 2. Severity Classification Table
- **Section Header**: "SEVERITY CLASSIFICATION" (H3)
- **Table Type**: Read-only reference table (pre-configured)

**Table Columns:**
- Severity (color-coded badges)
  - Low: Gray
  - Medium: Yellow
  - High: Orange
  - Severe: Red
- Definition: Impact description
- Escalation: Who gets notified

** Warning Banner:**
- Icon: Warning triangle
- Text: " Requirement: Medium and High severity incidents must trigger regulator notification within 24 hours"
- Styling: Yellow background, border

#### 3. Escalation Workflow Section
- **Section Header**: "ESCALATION WORKFLOW" (H3)
- **Layout**: Vertical flow diagram with connecting arrows

**Escalation Step Card:**
- **Card Structure**:
  - Step number and name in header
  - Role: Who is responsible
  - Timeframe: Time limit (e.g., "Within 15 minutes")
  - Actions: What they must do
- **Arrow Connector**: Visual line connecting steps
- **Add Button**: "+ Add Escalation Step" at bottom

**Add/Edit Step Modal:**
- **Step Name** (Text input)
- **Responsible Role** (Dropdown): Select from organizational roles
- **Timeframe** (Number + Unit):
  - [__] minutes / hours / days
- **Required Actions** (Text area): Checklist-style
- **Conditions** (Optional): When this step applies (e.g., "Only if severity is High or Severe")
- **Action Buttons**: [Cancel] [Save Step]

#### 4. Decision Authority Matrix
- **Section Header**: "DECISION AUTHORITY MATRIX" (H3)
- **Table Type**: Editable grid

**Table Structure:**
- **Rows**: Actions (e.g., "Activate BCP", "Engage Alternate Site")
- **Columns**: Severity levels (Low / Medium / High / Severe)
- **Cells**: Dropdown to select role (Team Lead / Manager / Crisis Team / Executive / - N/A)

**Table Features:**
- Inline editing (click cell to change)
- Cell validation (cannot leave required cells empty)
- Color coding by severity level (column headers)

**Add Action Row:**
- **Button**: "+ Add Decision Point"
- **Modal**: 
  - Action Name (text input)
  - Authority by severity (4 dropdowns for each severity level)

#### 5. Action Buttons
- **← Back**: Navigate to Screen 2
- **Save Draft**: Save current state
- **Next: Scenarios**: Validate and proceed to Screen 4

### User Interactions

1. **Click "+ Add Activation Trigger"** → Modal opens
2. **Fill trigger details** → Select type, enter condition, set severity
3. **Click "Save Trigger"** → Card appears in list
4. **Click [Edit] on trigger card** → Modal opens with existing data
5. **Click [X] on trigger card** → Confirmation dialog, then deletes
6. **Drag trigger card** → Reorder triggers (optional)
7. **Click cell in Authority Matrix** → Dropdown appears, select role
8. **Click "+ Add Escalation Step"** → Modal opens
9. **Fill escalation step details** → Enter role, timeframe, actions
10. **Click "Next: Scenarios"** → Validates and proceeds

### Frontend Validation

**Required Fields:**
- At least 1 activation trigger must be defined
  - Error: "Please define at least one activation trigger"
- All escalation steps must have:
  - Role assigned
  - Timeframe specified
  - At least one action
- Decision Authority Matrix:
  - "Activate BCP" row must have authority for all severity levels
  - "Notify Regulators" must have authority for Medium, High, Severe

**Business Rules:**
- Escalation timeframes must be logical (each step > previous step)
  - Warning: "Escalation step 2 timeframe should be later than step 1"
- If trigger severity is Medium/High →  notification warning appears

**Field Validation:**
- Timeframe must be numeric and > 0
- Condition description: min 10 characters

### Responsive Behavior
- **Desktop**: Full layout with side-by-side modals
- **Tablet**: Stacked escalation steps, scrollable authority matrix
- **Mobile**: Card view for triggers, simplified matrix view

---

## SCREEN 4: SCENARIO CATALOG

### Screen Purpose
Capture disruption scenarios applicable to this BCP without locking into one template style.

### Layout Structure

```
┌─────────────────────────────────────────────────────────────────┐
│ BCP: Customer Service Operations                    [X Close]   │
├─────────────────────────────────────────────────────────────────┤
│ Progress: ● ● ● ● ○ ○ ○ ○ ○ ○ ○ ○                              │
│           1 2 3 4  5 6 7 8 9 10 11 12                           │
├─────────────────────────────────────────────────────────────────┤
│ DISRUPTION SCENARIOS                                             │
│ Select scenarios that could disrupt this business service        │
│                                                                  │
│ [View: All Scenarios ▼]  [Search scenarios...]                  │
│                                                                  │
│ ┌────────────────────┐ ┌────────────────────┐ ┌──────────────┐ │
│ │ ☑ Facility Loss    │ │ ☑ IT System Outage │ │ ☐ Pandemic   │ │
│ │ Building unavail.  │ │ Critical systems   │ │ Mass absence │ │
│ │ Impact: High       │ │ Impact: Critical   │ │ Impact: Med  │ │
│ │ [View Details]     │ │ [View Details]     │ │ [View Details]││
