# Application Impact Analysis (AIA) Workflow Implementation

## Overview
Implemented a comprehensive **Application Impact Analysis (AIA) / Technical BIA Workflow** integrated into the BIA module. This workflow bridges business requirements (RTO/RPO from Business BIA) to specific IT assets and dependencies, following ISO 27031:2025 (IRBC) requirements.

---

## 🎯 What is AIA?

**Application Impact Analysis (AIA)** is the technical counterpart to Business Impact Analysis. While Business BIA focuses on business processes and their criticality, AIA:

1. **Maps business requirements to IT systems** - Links RTO/RPO/MTPD from Business BIA to specific applications, databases, and infrastructure
2. **Identifies technical dependencies** - Shows how business processes depend on technical components via CMDB logic
3. **Reveals cascading effects** - Demonstrates how a single technical failure can impact multiple business processes
4. **Drives IT DR strategy** - Criticality tiering (Tier 1-4) directly informs recovery strategy selection (Active-Active, Hot Site, Warm Site, Cold Site)

**Key Concept**: IT is not just a support function - it's a business unit. AIA ensures IT recovery strategies align with actual business continuity objectives, not arbitrary technical targets.

---

## 📋 The 7-Step AIA Workflow

### **Step 1: Preparation & Scoping**
**Purpose**: Define which applications and services fall within the scope based on business criticality.

**Features**:
- AIA name and description
- Business unit selection
- Scope type: Application | Service | Infrastructure
- Stakeholder identification
- ISO 27031:2025 compliance banner explaining AIA purpose

**Key Output**: Clearly defined scope and objectives

---

### **Step 2: Asset Inventory**
**Purpose**: Create a comprehensive record of all IT resources.

**Features**:
- **5 Asset Categories**:
  - Applications (business-critical systems)
  - Databases (data stores)
  - Servers (compute infrastructure)
  - Networks (connectivity)
  - Licenses (software entitlements)
- Tabbed interface for each category
- Add/Edit/Delete functionality
- Sample data loader for demo purposes

**Key Output**: Complete IT asset catalog

---

### **Step 3: Dependency Mapping**
**Purpose**: Link business processes to specific technical components via CMDB. Identify cascading effects.

**Features**:
- **Process → Technical Mapping**: Shows which IT systems support which business processes
- **Cascading Impact Analysis**: Demonstrates how one technical failure impacts multiple business processes
- **Example**: "If Core Insurance Platform fails, all policy operations stop immediately affecting 3 business processes"

**Key Output**: Dependency map showing business-to-technical linkages and cascade risks

---

### **Step 4: Requirement Mapping**
**Purpose**: Assign RTO, RPO, and MTPD from the Business BIA to the specific supporting IT systems.

**Features**:
- Table showing IT System → Business Process → RTO/RPO/MTPD
- Source tracking: BIA-derived vs. Manual entry
- Ensures IT recovery targets are driven by business needs, not arbitrary technical goals

**Key Output**: IT systems with business-aligned recovery requirements

---

### **Step 5: Criticality Tiering**
**Purpose**: Categorize systems into tiers based on their recovery requirements.

**Features**:
- **Tier 1 - Mission Critical**: RTO < 2 hours, RPO < 15 minutes (Near-zero data loss, instant failover)
- **Tier 2 - Business Critical**: RTO < 4 hours, RPO < 1 hour (Minimal data loss, rapid recovery)
- **Tier 3 - Important**: RTO < 24 hours, RPO < 4 hours (Moderate recovery timeframe)
- **Tier 4 - Standard**: RTO > 24 hours, RPO > 4 hours (Extended recovery timeframe)

**Visual Display**: Color-coded cards showing systems in each tier

**Key Output**: Tiering that drives recovery strategy selection and budget allocation

---

### **Step 6: Resource Requirement Identification**
**Purpose**: Determine what personnel, facilities, and vendor contracts are needed to restore the technical stack.

**Features**:
- **Personnel Requirements**: Roles, count, skills, availability (e.g., Database Administrator, Network Engineer)
- **Vendor Requirements**: Third-party services, SLAs, escalation paths (e.g., AWS Enterprise Support, Oracle Platinum)

**Key Output**: Resource plan for IT recovery

---

### **Step 7: Reporting & Validation**
**Purpose**: Document findings and obtain stakeholder approval.

**Features**:
- **Key Findings**: RTO gaps, single points of failure, dependency risks
- **Approval Workflow**: IT Manager → CISO → CIO (mirrors executive approval workflow)
- **Completion Banner**: "AIA Complete - Ready for IT DR Plan Development"

**Key Output**: Approved AIA ready to inform IT DR Plan creation

---

## 🔗 Integration Points

### **BIA Records Page**
Added "New AIA (Technical BIA)" button next to "New BIA" button:
- **URL**: `/bia-records/new-aia`
- **Button Color**: Blue (to distinguish from standard BIA)
- **Icon**: ChartBarIcon

### **Workflow Navigation**
- **Progress Stepper**: Visual progress bar showing X of 7 steps completed
- **Step Navigation**: Click on completed steps to navigate back
- **Next/Previous Buttons**: Navigate through workflow
- **Complete AIA Button**: Final step submission

---

## 📊 Demo Walkthrough

### **How to Access**
1. Navigate to **BIA Records** page
2. Click **"New AIA (Technical BIA)"** button (blue button)
3. You'll be taken to the 7-step AIA workflow

### **Demo Flow**
1. **Step 1**: Enter AIA name (e.g., "Core Insurance Platform AIA"), select business unit
2. **Step 2**: Click "Load Sample Data" to populate applications (Core Insurance Platform, Customer Portal, Claims Management System)
3. **Step 3**: Click "Load Sample Mappings" to show process-to-technical dependencies
4. **Step 4**: Click "Load Sample Requirements" to populate RTO/RPO/MTPD from BIA
5. **Step 5**: Click "Load Sample Tiering" to categorize systems into Tier 1-4
6. **Step 6**: Click "Load Sample Personnel" and "Load Sample Vendors" to populate resource requirements
7. **Step 7**: Click "Load Sample Findings" to show RTO gaps and recommendations
8. Click **"Complete AIA"** to finish

---

## 🎓 Educational Value

### **ISO 27031:2025 Compliance**
- **Clause 6.4**: IT service dependency analysis
- **Clause 7.2**: Technical BIA as input to IT DR strategy
- **Clause 8.3**: Alignment of IT recovery with business requirements

### **Key Concepts Demonstrated**
1. **IT as a Business Unit**: IT has its own BIA (AIA) separate from business BIA
2. **Cascading Effects**: Technical failures cascade to business processes
3. **Tiering Drives Strategy**: Tier 1 = Active-Active, Tier 2 = Warm Site, Tier 3/4 = Cold Site
4. **BIA-Driven Requirements**: RTO/RPO come from business needs, not IT preferences

---

## 📁 Technical Details

### **Files Created**
- `bia-module/src/app/bia-records/new-aia/page.tsx` (935 lines)

### **Files Modified**
- `bia-module/src/app/bia-records/page.tsx` - Added "New AIA" button

### **Component Structure**
- Main workflow component with 7 step components
- Each step is a separate function component
- State management for all 7 steps
- Progress tracking and navigation logic

---

## ✅ Status

**COMPLETE** - Ready for customer demo

The AIA workflow is fully functional and demonstrates the technical bridge between Business BIA and IT DR Plans, aligned with ISO 27031:2025 requirements.

