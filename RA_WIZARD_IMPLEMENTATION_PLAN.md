# Risk Assessment Wizard - Implementation Plan

**Date:** 2025-11-13  
**Feature:** 7-Step Risk Assessment Wizard  
**Status:** Planning Complete, Ready for Implementation

---

## 📋 OVERVIEW

Implementing a comprehensive 7-step wizard for conducting risk assessments following the blueprint provided. The wizard will guide users through the complete RA lifecycle from context selection to approval.

---

## 🎯 IMPLEMENTATION STRATEGY

### Phase 1: Backend Enhancements ✅ (Mostly Complete)
- ✅ Entities exist: `RiskAssessment`, `ThreatAssessment`
- ✅ Enums exist: `RiskAssessmentStatus`, `LikelihoodLevel`, `RiskImpactLevel`, `RiskLevel`
- ⏳ Need to add: `TreatmentPlan` entity and `TreatmentOption` enum
- ⏳ Need to enhance: `ThreatAssessment` with residual risk enums and velocity/vulnerability fields

### Phase 2: Backend APIs (New)
- Step 1 API: Create draft RA with context
- Step 2 API: Get context overview (BIA summary + enablers)
- Step 3 API: Get applicable threats and create threat assessments
- Step 4 API: Update threat assessment scores
- Step 5 API: Get risk summary and heatmap data
- Step 6 API: Create/update treatment plans
- Step 7 API: Submit for review/approval

### Phase 3: Frontend Wizard (New)
- Wizard shell with step navigation
- 7 step components
- Progress indicator
- Auto-save functionality
- Validation at each step

---

## 🗂️ DATABASE CHANGES NEEDED

### Migration V20: Enhance Risk Assessment Module

**1. Add Treatment Plan Table:**
```sql
CREATE TABLE risk_treatment_plans (
    id BIGSERIAL PRIMARY KEY,
    threat_assessment_id BIGINT NOT NULL,
    treatment_option VARCHAR(50) NOT NULL, -- ACCEPT, MITIGATE, TRANSFER, AVOID
    action_description TEXT,
    action_owner VARCHAR(255),
    target_date DATE,
    status VARCHAR(50) DEFAULT 'PLANNED', -- PLANNED, IN_PROGRESS, COMPLETED, CANCELLED
    completion_date DATE,
    effectiveness_review TEXT,
    
    -- Audit fields
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255),
    version INT DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE,
    
    FOREIGN KEY (threat_assessment_id) REFERENCES threat_assessments(id) ON DELETE CASCADE
);
```

**2. Alter ThreatAssessment Table:**
```sql
-- Add velocity and vulnerability fields
ALTER TABLE threat_assessments ADD COLUMN velocity VARCHAR(50);
ALTER TABLE threat_assessments ADD COLUMN vulnerability VARCHAR(50);
ALTER TABLE threat_assessments ADD COLUMN treatment_option VARCHAR(50);

-- Convert residual fields to proper enums (data migration needed)
-- residual_likelihood, residual_impact, residual_risk_level already exist as VARCHAR
```

---

## 🏗️ BACKEND ENTITIES TO CREATE/UPDATE

### 1. TreatmentOption Enum (NEW)
```java
public enum TreatmentOption {
    ACCEPT("Accept", "Accept the risk as is"),
    MITIGATE("Mitigate", "Implement controls to reduce risk"),
    TRANSFER("Transfer", "Transfer risk to third party (insurance, outsourcing)"),
    AVOID("Avoid", "Eliminate the activity causing the risk");
}
```

### 2. TreatmentPlanStatus Enum (NEW)
```java
public enum TreatmentPlanStatus {
    PLANNED("Planned", "Treatment plan created"),
    IN_PROGRESS("In Progress", "Actions being implemented"),
    COMPLETED("Completed", "Actions completed"),
    CANCELLED("Cancelled", "Plan cancelled");
}
```

### 3. RiskTreatmentPlan Entity (NEW)
```java
@Entity
@Table(name = "risk_treatment_plans")
public class RiskTreatmentPlan extends BaseEntity {
    @ManyToOne
    private ThreatAssessment threatAssessment;
    
    @Enumerated(EnumType.STRING)
    private TreatmentOption treatmentOption;
    
    private String actionDescription;
    private String actionOwner;
    private LocalDate targetDate;
    
    @Enumerated(EnumType.STRING)
    private TreatmentPlanStatus status;
    
    private LocalDate completionDate;
    private String effectivenessReview;
}
```

### 4. Update ThreatAssessment Entity
Add fields:
- `velocity` (String) - How fast threat materializes
- `vulnerability` (String) - Control weakness level
- `treatmentOption` (TreatmentOption enum)
- `residualLikelihood` (LikelihoodLevel enum) - Change from String
- `residualImpact` (RiskImpactLevel enum) - Change from String
- `residualRiskLevel` (RiskLevel enum) - Change from String

---

## 📡 BACKEND APIs TO IMPLEMENT

### RiskAssessmentWizardController

**Step 1: Create Draft RA**
```
POST /api/risk-assessments/wizard/create
Body: {
  riskCategoryId, contextType, contextId, assessmentName, 
  assessorName, assessorEmail, assessmentDate, notes
}
Response: RiskAssessment (DRAFT status)
```

**Step 2: Get Context Overview**
```
GET /api/risk-assessments/wizard/{raId}/context-overview
Response: {
  contextDetails: {...},
  biaSum mary: {rto, mtpd, criticality, ...},
  linkedEnabl ers: [{type, name, status}, ...],
  dependentProcesses: [...]
}
```

**Step 3: Get Applicable Threats & Initialize**
```
POST /api/risk-assessments/wizard/{raId}/initialize-threats
Response: {
  applicableThreats: [...],
  threatAssessments: [...] // Created with defaults
}
```

**Step 4: Update Threat Assessment**
```
PUT /api/threat-assessments/{id}
Body: {
  likelihood, impact, existingControls, controlEffectiveness,
  residualLikelihood, residualImpact, velocity, vulnerability,
  treatmentOption, notes
}
Response: ThreatAssessment (with calculated scores)
```

**Step 5: Get Risk Summary**
```
GET /api/risk-assessments/{raId}/summary
Response: {
  heatmapData: {inherent: [...], residual: [...]},
  thresholdAnalysis: {
    withinThresholdInherent: 6,
    withinThresholdResidual: 8,
    beyondThresholdResidual: 2
  },
  threatsByRiskLevel: {...}
}
```

**Step 6: Treatment Plans**
```
POST /api/risk-assessments/{raId}/treatment-plans
PUT /api/treatment-plans/{id}
GET /api/risk-assessments/{raId}/treatment-plans
```

**Step 7: Submit for Review**
```
POST /api/risk-assessments/{raId}/submit-for-review
Body: {executiveSummary, recommendations}
Response: RiskAssessment (IN_REVIEW status)
```

---

## 🎨 FRONTEND COMPONENTS TO CREATE

### 1. Wizard Shell
**File:** `bia-module/src/app/risk-assessment/wizard/[id]/page.tsx`

Components:
- Progress stepper (1-7)
- Step content area
- Navigation buttons (Back, Next, Save Draft)
- Auto-save indicator

### 2. Step Components

**Step1CreateRA.tsx** - Launch screen with context selection  
**Step2ContextOverview.tsx** - BIA summary and enablers display  
**Step3ThreatSelection.tsx** - Select applicable threats  
**Step4RiskEvaluation.tsx** - Evaluate each threat (L×I)  
**Step5RiskSummary.tsx** - Heatmap and threshold analysis  
**Step6TreatmentPlans.tsx** - Create treatment plans for high risks  
**Step7ReviewApproval.tsx** - Final review and sign-off  

### 3. Shared Components

**RiskHeatmap.tsx** - 5×5 risk matrix visualization  
**ThreatCard.tsx** - Individual threat evaluation card  
**RiskScoreCalculator.tsx** - Real-time L×I calculation  
**ThresholdGauge.tsx** - Visual threshold indicator  

---

## 🔄 DATA FLOW

```
User starts wizard
  ↓
Step 1: Create RA (DRAFT) → POST /api/risk-assessments/wizard/create
  ↓
Step 2: View context → GET /api/risk-assessments/wizard/{id}/context-overview
  ↓
Step 3: Initialize threats → POST /api/risk-assessments/wizard/{id}/initialize-threats
  ↓
Step 4: Evaluate threats → PUT /api/threat-assessments/{id} (for each)
  ↓
Step 5: View summary → GET /api/risk-assessments/{id}/summary
  ↓
Step 6: Create treatment plans → POST /api/risk-assessments/{id}/treatment-plans
  ↓
Step 7: Submit → POST /api/risk-assessments/{id}/submit-for-review
```

---

## ✅ IMPLEMENTATION CHECKLIST

### Backend (Priority 1)
- [ ] Create V20 migration for treatment plans and ThreatAssessment enhancements
- [ ] Create TreatmentOption enum
- [ ] Create TreatmentPlanStatus enum
- [ ] Create RiskTreatmentPlan entity
- [ ] Update ThreatAssessment entity with new fields
- [ ] Create RiskTreatmentPlanRepository
- [ ] Create RiskAssessmentWizardService
- [ ] Create RiskAssessmentWizardController with all 7 step APIs
- [ ] Test all APIs with curl/Postman

### Frontend (Priority 2)
- [ ] Create wizard route structure
- [ ] Create wizard shell component
- [ ] Implement Step 1: Create RA
- [ ] Implement Step 2: Context Overview
- [ ] Implement Step 3: Threat Selection
- [ ] Implement Step 4: Risk Evaluation
- [ ] Implement Step 5: Risk Summary
- [ ] Implement Step 6: Treatment Plans
- [ ] Implement Step 7: Review & Approval
- [ ] Add auto-save functionality
- [ ] Add validation
- [ ] Test complete workflow

---

## 🎯 SUCCESS CRITERIA

1. ✅ User can create a new RA and select context
2. ✅ System auto-loads applicable threats based on context
3. ✅ User can evaluate each threat with L×I scoring
4. ✅ System auto-calculates risk scores and levels
5. ✅ Heatmap visualizes inherent vs residual risk
6. ✅ Treatment plans can be created for high risks
7. ✅ RA can be submitted for review with proper status change
8. ✅ All data persists correctly
9. ✅ Wizard supports save draft and resume

---

**Next Step:** Begin implementation with V20 migration and backend entities.

