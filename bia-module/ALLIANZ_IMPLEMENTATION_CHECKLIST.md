# Allianz ITSCM Demo - Implementation Checklist

## 🎯 Quick Reference

**Demo Date:** This week  
**Total Build Time Estimate:** 8-12 hours  
**Priority:** Build in order listed below

---

## ✅ Phase 1: ITSCM Dashboard (MUST HAVE)

### **File:** `bia-module/src/app/itscm-dashboard/page.tsx`

**Estimated Time:** 3 hours

**Components to Build:**
- [ ] Page layout with header "IT Service Continuity Management"
- [ ] 6 KPI metric cards:
  - [ ] IT Services Covered (%)
  - [ ] Application Recovery Plans (count)
  - [ ] Infrastructure Recovery Plans (count)
  - [ ] RTO Compliance by Tier (%)
  - [ ] Last DR Test Date
  - [ ] Cyber Incident Response Readiness
- [ ] Quick action buttons:
  - [ ] "View IT Service Catalog"
  - [ ] "View Application Mapping"
  - [ ] "View Recovery Plans"
  - [ ] "Run DR Simulation"
- [ ] Recent activity feed (last 5 ITSCM activities)
- [ ] RTO Compliance Chart (bar chart by tier)

**Reference Files:**
- `/bia-module/src/app/dashboard/page.tsx` - Layout structure
- `/bia-module/src/app/reporting/components/ITDRMetrics.tsx` - Metrics cards

**Mock Data:**
```typescript
const itscmMetrics = {
  totalITServices: 45,
  coveredITServices: 38,
  coveragePercent: 84,
  applicationRecoveryPlans: 24,
  infrastructureRecoveryPlans: 12,
  rtoComplianceTier1: 95,
  rtoComplianceTier2: 88,
  rtoComplianceTier3: 72,
  lastDRTest: '2024-11-15',
  cyberIncidentReadiness: 'Ready'
};
```

---

## ✅ Phase 2: IT Service Catalog (MUST HAVE)

### **File:** `bia-module/src/app/itscm-dashboard/service-catalog/page.tsx`

**Estimated Time:** 2 hours

**Components to Build:**
- [ ] Data table with columns:
  - [ ] IT Service Name
  - [ ] Business Owner
  - [ ] IT Owner
  - [ ] Criticality (Tier 1/2/3/4)
  - [ ] RTO Target
  - [ ] RPO Target
  - [ ] Current Recovery Capability
  - [ ] Gap Status (Yes/No with icon)
  - [ ] Recovery Strategy
  - [ ] Linked BIA (clickable)
  - [ ] Linked IT DR Plan (clickable)
  - [ ] Last Tested
  - [ ] Actions (View/Edit/Test)
- [ ] Filters:
  - [ ] Search by service name
  - [ ] Filter by criticality tier
  - [ ] Filter by gap status
  - [ ] Filter by recovery strategy
- [ ] Sorting on all columns
- [ ] Pagination (25/50/100 per page)

**Reference Files:**
- `/bia-module/src/app/it-dr-plans/page.tsx` - Table structure
- `/bia-module/src/app/bia-records/page.tsx` - Filtering logic

**Mock Data:**
```typescript
const itServices = [
  {
    id: 'ITS-001',
    name: 'SAP ERP System',
    businessOwner: 'Sarah Mitchell',
    itOwner: 'Mike Chen',
    criticality: 'Tier 1',
    rtoTarget: '4 hours',
    rpoTarget: '1 hour',
    currentCapability: '4 hours',
    hasGap: false,
    recoveryStrategy: 'Hot Site (Active-Active)',
    linkedBIA: 'BIA-001',
    linkedDRPlan: 'DR-001',
    lastTested: '2024-11-10'
  },
  // ... more services
];
```

---

## ✅ Phase 3: Application Mapping (MUST HAVE)

### **File:** `bia-module/src/app/itscm-dashboard/application-mapping/page.tsx`

**Estimated Time:** 3 hours

**Components to Build:**
- [ ] React Flow dependency graph showing:
  - [ ] Business Processes (top layer - blue nodes)
  - [ ] IT Applications (second layer - purple nodes)
  - [ ] Databases (third layer - green nodes)
  - [ ] Infrastructure (fourth layer - orange nodes)
  - [ ] Third-Party Services (fifth layer - gray nodes)
- [ ] Interactive features:
  - [ ] Click on node to highlight dependencies
  - [ ] Hover to show details
  - [ ] Filter by criticality tier
  - [ ] Search for specific service
- [ ] Side panel showing:
  - [ ] Selected node details
  - [ ] Upstream dependencies (what depends on this)
  - [ ] Downstream dependencies (what this depends on)
  - [ ] RTO/RPO requirements
  - [ ] Recovery strategy
- [ ] "Run Impact Simulation" button
- [ ] "Export to Crisis Plan" button

**Reference Files:**
- `/bia-module/src/app/crisis-plans/dependency-analysis/page.tsx` - React Flow implementation

**Mock Data Structure:**
```typescript
const nodes = [
  { id: 'bp-1', type: 'businessProcess', data: { label: 'Payment Processing', tier: 'Tier 1' } },
  { id: 'app-1', type: 'application', data: { label: 'SAP ERP', rto: '4h' } },
  { id: 'db-1', type: 'database', data: { label: 'Oracle DB', rpo: '1h' } },
  { id: 'infra-1', type: 'infrastructure', data: { label: 'Primary DC', location: 'Mumbai' } },
  { id: 'vendor-1', type: 'vendor', data: { label: 'AWS DR Site', sla: '99.99%' } }
];

const edges = [
  { id: 'e1', source: 'bp-1', target: 'app-1', label: 'depends on' },
  { id: 'e2', source: 'app-1', target: 'db-1', label: 'uses' },
  { id: 'e3', source: 'db-1', target: 'infra-1', label: 'hosted on' },
  { id: 'e4', source: 'infra-1', target: 'vendor-1', label: 'fails over to' }
];
```

---

## ✅ Phase 4: Enhanced IT DR Plans (SHOULD HAVE)

### **File:** `bia-module/src/app/it-dr-plans/page.tsx` (MODIFY EXISTING)

**Estimated Time:** 1 hour

**Enhancements:**
- [ ] Add "Plan Type" column with filter:
  - [ ] Application Recovery Plan (ARP)
  - [ ] Infrastructure Recovery Plan (IRP)
  - [ ] Data Recovery Plan (DRP)
  - [ ] Cyber Incident Response Plan (CIRP)
- [ ] Add "IT Service" column (linked to IT Service Catalog)
- [ ] Add "Business Impact" column (linked business processes count)
- [ ] Add "Recovery Strategy" badge with icon
- [ ] Update mock data to include new fields

**Changes Required:**
```typescript
// Add to BCPPlan interface
interface BCPPlan {
  // ... existing fields
  planType: 'ARP' | 'IRP' | 'DRP' | 'CIRP';
  itService: string;
  businessProcessesCount: number;
  recoveryStrategy: 'Hot Site' | 'Warm Site' | 'Cold Site' | 'Cloud DR' | 'Manual';
}
```

---

## ✅ Phase 5: Enhanced Reporting (SHOULD HAVE)

### **File:** `bia-module/src/app/reporting/components/ITSCMMetrics.tsx` (NEW)

**Estimated Time:** 2 hours

**Components to Build:**
- [ ] ITSCM Metrics Section:
  - [ ] IT Service Continuity Coverage chart
  - [ ] Application Recovery Readiness gauge
  - [ ] Infrastructure Resilience Score
  - [ ] Cyber Incident Response Readiness
  - [ ] RTO/RPO Compliance by Tier (stacked bar chart)
- [ ] BCM-ITSCM Alignment Section:
  - [ ] Business Processes with IT Recovery Plans (%)
  - [ ] Critical Applications with DR Plans (%)
  - [ ] Vendor Dependencies with Continuity Agreements (%)
- [ ] Integrated Testing Results:
  - [ ] Last Tabletop Exercise date and result
  - [ ] Last DR Simulation date and result
  - [ ] Last Full DR Test date and result
  - [ ] Issues Identified vs Resolved chart

**Then import in:** `bia-module/src/app/reporting/page.tsx`

---

## 📋 Demo Script Preparation

### **Demo Dataset to Create:**
- [ ] 5-7 Business Processes (Insurance-specific):
  - [ ] Claims Processing
  - [ ] Policy Underwriting
  - [ ] Customer Portal
  - [ ] Payment Processing
  - [ ] Risk Assessment Engine
  - [ ] Document Management
  - [ ] Regulatory Reporting

- [ ] 15-20 IT Services:
  - [ ] Core Insurance Platform
  - [ ] Claims Management System
  - [ ] Policy Administration System
  - [ ] Customer Relationship Management (CRM)
  - [ ] Document Management System
  - [ ] Payment Gateway
  - [ ] Data Warehouse
  - [ ] Reporting & Analytics Platform
  - [ ] Email System
  - [ ] Active Directory
  - [ ] Network Infrastructure
  - [ ] Firewall & Security
  - [ ] Backup & Recovery System
  - [ ] Disaster Recovery Site

- [ ] 10-12 IT DR Plans covering above services

---

## 🎬 Demo Flow Checklist

- [ ] **Slide 1:** Platform Overview (2 min)
- [ ] **Slide 2:** BCM Lifecycle - BIA Module (3 min)
- [ ] **Slide 3:** BCM Lifecycle - Risk Assessment (2 min)
- [ ] **Slide 4:** BCM Lifecycle - BCP Creation (3 min)
- [ ] **Slide 5:** ITSCM Dashboard (3 min) ⭐ NEW
- [ ] **Slide 6:** IT Service Catalog (3 min) ⭐ NEW
- [ ] **Slide 7:** Application Mapping (4 min) ⭐ NEW
- [ ] **Slide 8:** IT DR Plans (3 min)
- [ ] **Slide 9:** DR Simulation (3 min)
- [ ] **Slide 10:** Integrated Reporting (3 min)
- [ ] **Slide 11:** Testing Module (2 min)
- [ ] **Slide 12:** Dependency Graph (3 min)
- [ ] **Q&A:** (5-10 min)

**Total Time:** 30-35 minutes + Q&A

---

## 🚀 Quick Start Commands

```bash
# Navigate to project
cd bia-module

# Create new directories
mkdir -p src/app/itscm-dashboard/service-catalog
mkdir -p src/app/itscm-dashboard/application-mapping

# Start development server
npm run dev

# Open in browser
# http://localhost:3005/itscm-dashboard
```

---

## ✅ Final Checklist Before Demo

- [ ] All 3 new pages built and tested
- [ ] Mock data populated with insurance industry examples
- [ ] UI/UX consistent with existing design system
- [ ] All links between modules working
- [ ] Demo script rehearsed
- [ ] Screenshots taken for backup
- [ ] Licensing/pricing deck prepared
- [ ] Team briefed on key differentiators

---

**Status:** Ready to Build  
**Next Action:** Start with Phase 1 (ITSCM Dashboard)

