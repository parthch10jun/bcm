# Allianz ITSCM Demo Strategy & Requirements

## 📋 Executive Summary

**Client:** Allianz  
**Objective:** Demonstrate end-to-end BCM + ITSCM capabilities aligned with ISO 22301 and ISO 27001  
**Demo Timeline:** This week  
**Key Requirement:** Show how BCM lifecycle feeds into ITSCM lifecycle, culminating in integrated reporting and testing

---

## 🎯 Allianz's Evaluation Criteria

### 1. **End-to-End BCM Lifecycle Coverage**
- ✅ **BIA** - Already built (`/bia-records`)
- ✅ **Risk Assessment** - Already built (`/risk-assessment`)
- ✅ **Strategy** - Covered in BIA (RTO/RPO strategies)
- ✅ **Plans** - Already built (`/bcp`, `/crisis-plans`)
- ✅ **Testing** - Already built (`/testing`)
- ✅ **Reporting** - Already built (`/reporting`)

### 2. **Business Process ↔ IT Application Linkage**
- ✅ **Current State:** BIA links business processes to IT assets via Libraries
- ⚠️ **Gap:** Need to show explicit "Application Dependency Mapping" view
- 🔧 **Action Required:** Create visual showing Business Process → IT Applications → Infrastructure

### 3. **Integration and Depth of ITSCM Capabilities**
- ✅ **Current State:** IT DR Plans module exists (`/it-dr-plans`)
- ⚠️ **Gap:** Need to rebrand/enhance as full "ITSCM Module" with:
  - IT Service Catalog
  - Application Recovery Plans
  - Infrastructure Recovery Plans
  - Data Recovery Plans
  - Cybersecurity Incident Response Plans
- 🔧 **Action Required:** Enhance IT DR module to show ITSCM depth

### 4. **User Experience for IT and Business Stakeholders**
- ✅ **Current State:** Role-based dashboards exist
- ✅ **Strength:** Clean UI/UX with minimal design
- 🔧 **Action Required:** Create separate "IT Stakeholder View" vs "Business Stakeholder View"

### 5. **Licensing Model and Scalability**
- ✅ **Current State:** Platform is built on Next.js with scalable architecture
- 🔧 **Action Required:** Prepare licensing slide deck (not in-app)

---

## 🔄 The BCM → ITSCM Flow (Allianz's Requirement)

```
BCM Lifecycle:
1. BIA (Business Impact Analysis)
   ↓
2. Risk Assessment
   ↓
3. Strategy Development (RTO/RPO)
   ↓
4. BCP Creation
   ↓
   
ITSCM Lifecycle (Triggered by BCM Outcomes):
5. IT Service Continuity Analysis
   ↓
6. IT Recovery Strategies
   ↓
7. IT DR Plans / Application Recovery Plans
   ↓
8. Infrastructure Recovery Plans
   ↓
   
Integrated Outputs:
9. Combined BCM + ITSCM Reporting
   ↓
10. Integrated Testing (Tabletop, Simulation, Full DR Test)
```

---

## 🛠️ What We Need to Build/Enhance for Demo

### **Priority 1: ITSCM Dashboard (NEW)**
**Path:** `/itscm-dashboard`

**Purpose:** Dedicated ITSCM landing page showing IT-specific continuity metrics

**Key Metrics:**
- IT Services Covered (%)
- Application Recovery Plans (Active/Draft)
- Infrastructure Recovery Plans (Active/Draft)
- RTO Compliance by Tier (Tier 1/2/3/4)
- Last DR Test Results
- Cyber Incident Response Readiness

**Visual Elements:**
- IT Service Catalog (linked to BIA)
- Application Dependency Map
- Infrastructure Topology View
- Recovery Strategy Matrix

**Reference for UI/UX:** `/dashboard/page.tsx`, `/reporting/page.tsx`

---

### **Priority 2: Business Process → IT Application Mapping (ENHANCE)**
**Path:** `/itscm-dashboard/application-mapping`

**Purpose:** Visual representation showing how business processes depend on IT applications

**Data Flow:**
```
Business Process (from BIA)
  ↓
IT Applications (from Assets Library - Type: Software/Application)
  ↓
Infrastructure (from Assets Library - Type: Hardware/Network)
  ↓
Data/Databases (from Assets Library - Type: Database)
  ↓
Third-Party Services (from Vendors Library)
```

**Visual:** Interactive dependency graph (similar to `/crisis-plans/dependency-analysis`)

**Reference:** Use React Flow like in `dependency-analysis/page.tsx`

---

### **Priority 3: IT Service Catalog (NEW)**
**Path:** `/itscm-dashboard/service-catalog`

**Purpose:** Centralized view of all IT services with their continuity attributes

**Columns:**
- IT Service Name
- Business Owner
- IT Owner
- Criticality (Tier 1/2/3/4)
- RTO Target
- RPO Target
- Current Recovery Capability
- Gap (Yes/No)
- Recovery Strategy
- Linked BIA
- Linked IT DR Plan
- Last Tested

**Data Source:** Pull from BIA records where `enablerType === 'Technology'`

**Reference:** Table structure from `/it-dr-plans/page.tsx`

---

### **Priority 4: Application Recovery Plans (ENHANCE EXISTING)**
**Path:** `/it-dr-plans` (rename to `/itscm/recovery-plans`)

**Current State:** IT DR Plans module exists with good structure

**Enhancements Needed:**
1. **Add "Plan Type" filter:**
   - Application Recovery Plan (ARP)
   - Infrastructure Recovery Plan (IRP)
   - Data Recovery Plan (DRP)
   - Cyber Incident Response Plan (CIRP)

2. **Add "IT Service" column** linking to IT Service Catalog

3. **Add "Business Impact" column** showing linked business processes

4. **Add "Recovery Strategy" visual:**
   - Hot Site (Active-Active)
   - Warm Site (Active-Passive)
   - Cold Site
   - Cloud-Based DR
   - Manual Workaround

**Reference:** Existing `/it-dr-plans/page.tsx` - just enhance with above fields

---

### **Priority 5: Integrated BCM + ITSCM Reporting (ENHANCE)**
**Path:** `/reporting` (add ITSCM section)

**Current State:** Reporting module exists

**Enhancements Needed:**
1. **Add "ITSCM Metrics" section:**
   - IT Service Continuity Coverage (%)
   - Application Recovery Readiness
   - Infrastructure Resilience Score
   - Cyber Incident Response Readiness
   - RTO/RPO Compliance by Tier

2. **Add "BCM-ITSCM Alignment" section:**
   - Business Processes with IT Recovery Plans (%)
   - Critical Applications with DR Plans (%)
   - Vendor Dependencies with Continuity Agreements (%)

3. **Add "Integrated Testing Results":**
   - Last Tabletop Exercise (BCM + IT)
   - Last DR Simulation (IT)
   - Last Full DR Test (IT)
   - Issues Identified / Resolved

**Reference:** Existing `/reporting/page.tsx` and `/reporting/components/ITDRMetrics.tsx`

---

### **Priority 6: Integrated Testing Module (ENHANCE)**
**Path:** `/testing` (add ITSCM test types)

**Current State:** Testing module exists with BCP tests

**Enhancements Needed:**
1. **Add ITSCM Test Types:**
   - Application Failover Test
   - Database Recovery Test
   - Network Failover Test
   - Cyber Incident Response Drill
   - Full DR Site Activation

2. **Add "Integrated BCM + ITSCM Tests":**
   - Combined Tabletop Exercise (Business + IT)
   - End-to-End Recovery Simulation

3. **Add "Test Scenario Builder":**
   - Select Business Process (from BIA)
   - Auto-populate dependent IT Services
   - Auto-populate dependent Infrastructure
   - Generate test script

**Reference:** Existing `/testing/page.tsx`

---

## 📊 Demo Flow for Allianz

### **Act 1: BCM Lifecycle (10 minutes)**

**Screen 1: BIA Module** (`/bia-records`)
- Show completed BIA for "Payment Processing" business process
- Highlight RTO: 4 hours, RPO: 1 hour
- Show dependencies: SAP ERP, Oracle Database, Payment Gateway

**Screen 2: Risk Assessment** (`/risk-assessment`)
- Show risk assessment for "IT System Failure"
- Show MITKAT real-time threat feed
- Show how threats auto-update risk scores

**Screen 3: BCP Creation** (`/bcp`)
- Show BCP for "Payment Processing"
- Highlight auto-linkage to BIA data
- Show recovery strategies

---

### **Act 2: ITSCM Lifecycle (15 minutes)**

**Screen 4: ITSCM Dashboard** (`/itscm-dashboard` - NEW)
- Show IT Service Catalog
- Show Application Recovery Plans coverage
- Show RTO compliance by tier

**Screen 5: Application Mapping** (`/itscm-dashboard/application-mapping` - NEW)
- Show visual dependency graph:
  - Payment Processing (Business Process)
  - → SAP ERP (Application)
  - → Oracle Database (Data)
  - → Primary Data Center (Infrastructure)
  - → AWS DR Site (Recovery Infrastructure)

**Screen 6: IT DR Plans** (`/it-dr-plans`)
- Show Application Recovery Plan for "SAP ERP"
- Show recovery procedures (Phase 1: Detection, Phase 2: Failover, Phase 3: Validation)
- Show runbooks with step-by-step instructions

**Screen 7: DR Simulation** (`/it-dr-plans/simulation`)
- Run live simulation of "Data Center Failure"
- Show automated failover steps
- Show RTO tracking in real-time

---

### **Act 3: Integrated Reporting & Testing (10 minutes)**

**Screen 8: Integrated Reporting** (`/reporting`)
- Show BCM metrics (BIA completion, BCP coverage)
- Show ITSCM metrics (IT service coverage, RTO compliance)
- Show BCM-ITSCM alignment (business processes with IT recovery plans)

**Screen 9: Testing Module** (`/testing`)
- Show last tabletop exercise results
- Show last DR test results
- Show integrated test calendar

**Screen 10: Dependency Graph** (`/crisis-plans/dependency-analysis`)
- Show BETH3V framework
- Run impact simulation
- Show cascade effect from infrastructure to business processes

---

## 🎨 UI/UX Consistency Guidelines

**Design System (Already Established):**
- **Text Sizes:** `text-xs` for body, `text-[10px]` for labels, `text-sm` for headings
- **Layout:** `h-full overflow-auto bg-gray-50` for page wrappers
- **Cards:** `bg-white border border-gray-200 rounded-sm`
- **Primary Color:** Gray/Black (`bg-gray-900`, `text-gray-900`)
- **Accent Colors:**
  - Red for critical (`text-red-600`)
  - Amber for warnings (`text-amber-600`)
  - Green for success (`text-green-600`)
  - Blue for links (`text-blue-600`)

**Component Patterns:**
- Use Heroicons (`@heroicons/react/24/outline`)
- Use React Flow for dependency graphs
- Use Recharts for charts/graphs
- Use Tailwind CSS for styling

---

## 📁 Reference Codebase Paths

**For ITSCM Dashboard:**
- `/bia-module/src/app/dashboard/page.tsx` - Dashboard layout
- `/bia-module/src/app/reporting/page.tsx` - Metrics cards
- `/bia-module/src/app/reporting/components/ITDRMetrics.tsx` - IT-specific metrics

**For Application Mapping:**
- `/bia-module/src/app/crisis-plans/dependency-analysis/page.tsx` - React Flow graph
- `/bia-module/src/types/centralLibraries.ts` - Data types

**For IT Service Catalog:**
- `/bia-module/src/app/it-dr-plans/page.tsx` - Table structure
- `/bia-module/src/app/bia-records/page.tsx` - Filtering/sorting logic

**For Recovery Plans:**
- `/bia-module/src/app/it-dr-plans/[id]/page.tsx` - Plan detail view
- `/bia-module/src/app/it-dr-plans/simulation/page.tsx` - DR simulation

**For Testing:**
- `/bia-module/src/app/testing/page.tsx` - Testing dashboard
- `/bia-module/src/app/testing/[id]/page.tsx` - Test detail view

---

## 🚀 Build Priority for Demo

### **Must Have (Build First):**
1. ✅ **ITSCM Dashboard** - Central hub for IT continuity
2. ✅ **IT Service Catalog** - Show all IT services with continuity attributes
3. ✅ **Application Mapping** - Visual business-to-IT dependency graph

### **Should Have (Build Second):**
4. ⚠️ **Enhanced IT DR Plans** - Add plan types, IT service linkage
5. ⚠️ **Integrated Reporting** - Add ITSCM metrics section

### **Nice to Have (If Time Permits):**
6. 🔵 **Enhanced Testing Module** - Add ITSCM test types
7. 🔵 **Cyber Incident Response Plans** - Separate section for CIRP

---

## 🎤 Key Messaging for Demo

### **Opening Statement:**
"Allianz, what you're about to see is a fully integrated BCM and ITSCM platform that eliminates the traditional silos between business continuity and IT disaster recovery. Our platform ensures that when you complete a BIA for a business process, the IT continuity requirements automatically flow into your IT recovery plans—no manual handoffs, no data duplication."

### **Core Differentiators:**
1. **Single Source of Truth:** Define IT services once in Libraries, use everywhere
2. **Automated Linkage:** Business processes auto-link to IT applications, infrastructure, and vendors
3. **Real-Time Intelligence:** MITKAT threat feeds auto-update both BCM and ITSCM risk assessments
4. **Integrated Testing:** Test business continuity and IT recovery together, not separately
5. **ISO 22301 + ISO 27001 Aligned:** Built-in compliance tracking for both standards

### **Closing Statement:**
"This isn't just a BCM tool with an IT module bolted on—it's a unified platform where business continuity and IT service continuity are two sides of the same coin. When your business needs change, your IT recovery plans automatically adapt. When your IT infrastructure changes, your business impact analysis automatically updates. That's the power of true integration."

---

## 📝 Next Steps

1. **Review this document** and confirm scope
2. **Build Priority 1 items** (ITSCM Dashboard, IT Service Catalog, Application Mapping)
3. **Enhance existing modules** (IT DR Plans, Reporting)
4. **Prepare demo script** with specific data examples
5. **Create demo dataset** (mock Allianz data for insurance industry)
6. **Rehearse demo flow** (30-35 minutes total)

---

## 🔗 Additional Resources

- **ISO 22301 Requirements:** Business Continuity Management Systems
- **ISO 27001 Requirements:** Information Security Management Systems (Annex A.17 - IT Service Continuity)
- **ITIL 4 ITSCM Practices:** IT Service Continuity Management best practices
- **NIST SP 800-34:** Contingency Planning Guide for Federal Information Systems

---

**Document Owner:** Parth
**Last Updated:** 2026-03-11
**Status:** Ready for Review

