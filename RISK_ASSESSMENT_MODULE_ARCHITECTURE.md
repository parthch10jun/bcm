# 🎯 Risk Assessment Module - Complete Architecture

**Status:** Backend Entities & Repositories Complete ✅  
**Next:** Services, Controllers, Frontend Implementation

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Database Schema](#database-schema)
3. [Backend Entities](#backend-entities)
4. [Backend Repositories](#backend-repositories)
5. [Data Flow](#data-flow)
6. [Integration with Existing Libraries](#integration-with-existing-libraries)
7. [Next Steps](#next-steps)

---

## 🎯 Overview

The Risk Assessment (RA) module is built on two core libraries:

### 1️⃣ **Threat Library**
- **Purpose**: Catalog of threats that can impact the organization
- **Components**: Threat Types, Threats, Enabler Types (BETH3V), Threat-Enabler mappings
- **Examples**: Natural Disasters, Cyber Attacks, Pandemics, Equipment Failures

### 2️⃣ **Risk Category Library**
- **Purpose**: Defines the "assessment lens" or context for risk assessments
- **Components**: Risk Categories, Risk Category-Threat mappings
- **Examples**: Location Level, Process, Suppliers, Applications, Org Units

### 3️⃣ **Risk Assessment Engine**
- **Purpose**: Conduct actual risk assessments using threats from the library
- **Components**: Risk Assessments, Threat Assessments (individual threat evaluations)
- **Output**: Risk heat maps, dashboards, reports

---

## 🗄️ Database Schema

### Core Tables

#### **Threat Library Tables**

1. **`threat_types`** - Categorizes threats
   - `id` (PK)
   - `name` (e.g., "Natural Disaster", "Cyber Security")
   - `description`
   - `display_order`
   - Audit fields (created_at, updated_at, created_by, updated_by, version, is_deleted)

2. **`enabler_types`** - BETH3V resource categories
   - `id` (PK)
   - `code` (ENUM: BUILDING, EQUIPMENT, TECHNOLOGY, PEOPLE, VENDOR, VITAL_RECORD)
   - `name`
   - `description`
   - `display_order`
   - Audit fields

3. **`threats`** - Actual threat catalog
   - `id` (PK)
   - `name` (e.g., "Flood/Flash Flood", "Ransomware Attack")
   - `description`
   - `threat_type_id` (FK → threat_types)
   - `default_likelihood` (ENUM: RARE, UNLIKELY, POSSIBLE, LIKELY, ALMOST_CERTAIN)
   - `default_impact` (ENUM: INSIGNIFICANT, MINOR, MODERATE, MAJOR, CATASTROPHIC)
   - `velocity` (how quickly threat materializes)
   - `warning_time` (advance warning available)
   - `recovery_complexity`
   - `display_order`
   - Audit fields

4. **`threat_enabler_types`** - Junction table: which enabler types a threat can impact
   - `id` (PK)
   - `threat_id` (FK → threats)
   - `enabler_type_id` (FK → enabler_types)
   - `scenario_description` (e.g., "Building Unavailable", "Tech Unavailable")
   - Audit fields
   - Unique constraint: (threat_id, enabler_type_id)

#### **Risk Category Tables**

5. **`risk_categories`** - Assessment contexts
   - `id` (PK)
   - `code` (ENUM: LOCATION, PROCESS, SUPPLIER, APPLICATION, ORG_UNIT, ASSET, PROJECT)
   - `name`
   - `description`
   - `display_order`
   - `is_active`
   - Audit fields

6. **`risk_category_threats`** - Junction table: which threats are allowed for each category
   - `id` (PK)
   - `risk_category_id` (FK → risk_categories)
   - `threat_id` (FK → threats)
   - `is_default_selected`
   - Audit fields
   - Unique constraint: (risk_category_id, threat_id)

#### **Risk Assessment Tables**

7. **`risk_assessments`** - Main RA records
   - `id` (PK)
   - `assessment_name`
   - `description`
   - `risk_category_id` (FK → risk_categories)
   - `context_type` (ENUM: matches RiskCategoryCode)
   - `context_id` (polymorphic reference to Process/Location/Vendor/etc.)
   - `context_name` (denormalized for display)
   - `status` (ENUM: DRAFT, IN_PROGRESS, UNDER_REVIEW, APPROVED, ARCHIVED)
   - `assessment_date`
   - `review_date`
   - `next_review_date`
   - `assessor_name`, `assessor_email`
   - `reviewer_name`, `reviewer_email`
   - `executive_summary`
   - `recommendations`
   - Audit fields

8. **`threat_assessments`** - Individual threat evaluations within an RA
   - `id` (PK)
   - `risk_assessment_id` (FK → risk_assessments)
   - `threat_id` (FK → threats)
   - `likelihood` (ENUM: 1-5 scale)
   - `impact` (ENUM: 1-5 scale)
   - `risk_level` (ENUM: LOW, MEDIUM, HIGH - calculated)
   - `risk_score` (likelihood × impact)
   - `rationale`
   - `existing_controls`
   - `control_effectiveness`
   - `residual_likelihood`, `residual_impact`, `residual_risk_level`
   - `mitigation_actions`
   - `action_owner`
   - `target_completion_date`
   - `notes`
   - Audit fields

---

## 🏗️ Backend Entities

### ✅ Created Entities

1. **`ThreatType.java`** - Threat categorization
2. **`EnablerType.java`** - BETH3V resource types
3. **`Threat.java`** - Threat catalog items
4. **`ThreatEnablerType.java`** - Threat-Enabler junction
5. **`RiskCategory.java`** - Assessment contexts
6. **`RiskCategoryThreat.java`** - Category-Threat junction
7. **`RiskAssessment.java`** - Main RA entity
8. **`ThreatAssessment.java`** - Individual threat evaluations

### ✅ Created Enums

1. **`EnablerTypeCode.java`** - BETH3V codes
2. **`LikelihoodLevel.java`** - Probability levels (1-5)
3. **`RiskImpactLevel.java`** - Impact severity (1-5)
4. **`RiskCategoryCode.java`** - Assessment context types
5. **`RiskAssessmentStatus.java`** - RA lifecycle states
6. **`RiskLevel.java`** - Overall risk rating (LOW/MEDIUM/HIGH)

### 🔑 Key Features

- **All entities extend `BaseEntity`** for consistent audit fields
- **Soft delete support** via `isDeleted` flag
- **Optimistic locking** via `@Version` field
- **Automatic risk calculation** in `ThreatAssessment` via `@PrePersist` and `@PreUpdate`
- **Proper indexing** for performance
- **Unique constraints** to prevent duplicates

---

## 📚 Backend Repositories

### ✅ Created Repositories

1. **`ThreatTypeRepository.java`**
   - `findByIsDeletedFalseOrderByDisplayOrderAsc()`
   - `findByNameAndIsDeletedFalse(String name)`
   - `existsByNameIgnoreCase(String name)`

2. **`EnablerTypeRepository.java`**
   - `findByIsDeletedFalseOrderByDisplayOrderAsc()`
   - `findByCodeAndIsDeletedFalse(EnablerTypeCode code)`
   - `existsByCodeAndIsDeletedFalse(EnablerTypeCode code)`

3. **`ThreatRepository.java`**
   - `findByIsDeletedFalseOrderByDisplayOrderAsc()`
   - `findByThreatTypeId(Long threatTypeId)`
   - `findByEnablerTypeCode(EnablerTypeCode code)`
   - `findByRiskCategoryId(Long riskCategoryId)`
   - `findApplicableThreats(Long riskCategoryId, List<EnablerTypeCode> codes)` ⭐
   - `searchByName(String searchTerm)`
   - `existsByNameIgnoreCase(String name)`

4. **`ThreatEnablerTypeRepository.java`**
   - `findByThreatId(Long threatId)`
   - `findByEnablerTypeId(Long enablerTypeId)`
   - `deleteByThreatId(Long threatId)`
   - `existsByThreatIdAndEnablerTypeId(Long threatId, Long enablerTypeId)`

5. **`RiskCategoryRepository.java`**
   - `findByIsDeletedFalseOrderByDisplayOrderAsc()`
   - `findByIsActiveTrueAndIsDeletedFalseOrderByDisplayOrderAsc()`
   - `findByCodeAndIsDeletedFalse(RiskCategoryCode code)`
   - `existsByCodeAndIsDeletedFalse(RiskCategoryCode code)`
   - `searchByName(String searchTerm)`

6. **`RiskCategoryThreatRepository.java`**
   - `findByRiskCategoryId(Long riskCategoryId)`
   - `findByThreatId(Long threatId)`
   - `deleteByRiskCategoryId(Long riskCategoryId)`
   - `existsByRiskCategoryIdAndThreatId(Long categoryId, Long threatId)`

7. **`RiskAssessmentRepository.java`**
   - `findByIsDeletedFalseOrderByCreatedAtDesc()`
   - `findByStatusAndIsDeletedFalseOrderByCreatedAtDesc(RiskAssessmentStatus status)`
   - `findByRiskCategoryId(Long riskCategoryId)`
   - `findByContextTypeAndIsDeletedFalseOrderByCreatedAtDesc(RiskCategoryCode type)`
   - `findByContext(RiskCategoryCode type, Long contextId)` ⭐
   - `findLatestByContext(RiskCategoryCode type, Long contextId)` ⭐
   - `searchByName(String searchTerm)`
   - `countByStatus(RiskAssessmentStatus status)`
   - `countTotal()`

8. **`ThreatAssessmentRepository.java`**
   - `findByRiskAssessmentId(Long riskAssessmentId)`
   - `findByRiskLevel(RiskLevel riskLevel)`
   - `findHighRiskByRiskAssessmentId(Long riskAssessmentId)`
   - `countByRiskAssessmentIdAndRiskLevel(Long raId, RiskLevel level)`
   - `findByThreatId(Long threatId)`

---

## 🔄 Data Flow

### Creating a Risk Assessment

```
1. User selects Risk Category (e.g., "Process")
   ↓
2. System loads context object (e.g., Process with ID=5)
   ↓
3. System gets applicable threats:
   - From RiskCategoryThreat (threats allowed for "Process" category)
   - Filtered by ThreatEnablerType (threats that impact enabler types used by this process)
   ↓
4. User evaluates each threat:
   - Sets Likelihood (1-5)
   - Sets Impact (1-5)
   - System calculates Risk Level (LOW/MEDIUM/HIGH)
   ↓
5. System creates ThreatAssessment records
   ↓
6. User completes RA with summary and recommendations
   ↓
7. RA status changes: DRAFT → IN_PROGRESS → UNDER_REVIEW → APPROVED
```

### Risk Calculation Logic

```java
Risk Score = Likelihood × Impact

Risk Level:
- Score 1-6:   LOW    (Green #28a745)
- Score 7-14:  MEDIUM (Amber #ffc107)
- Score 15-25: HIGH   (Red #dc3545)
```

---

## 🔗 Integration with Existing Libraries

### BETH3V Framework Integration

The RA module integrates with existing BCM libraries through the **EnablerType** concept:

| EnablerType Code | Maps To | Example |
|------------------|---------|---------|
| `BUILDING` | Locations | Delhi HQ, Mumbai Office |
| `EQUIPMENT` | Assets (Physical) | Generators, Servers |
| `TECHNOLOGY` | Assets (IT/Applications) | HRMS App, CRM System |
| `PEOPLE` | People/Teams | Payroll Team, IT Support |
| `VENDOR` | Vendors | AWS, Microsoft, Supplier X |
| `VITAL_RECORD` | Vital Records | Employee Records, Contracts |

### Process-Enabler Linkage

```
Process
  ↓ (via ProcessAsset, ProcessVendor, etc.)
Enabler (Asset/Vendor/People/Location/VitalRecord)
  ↓ (has EnablerType)
EnablerType (BETH3V)
  ↓ (via ThreatEnablerType)
Threat
```

**Example Query:**
"For Process 'Payroll Processing', which threats are applicable?"

```sql
1. Get Process dependencies:
   - ProcessAsset → Asset (type: TECHNOLOGY)
   - ProcessVendor → Vendor (type: VENDOR)
   - ProcessPeople → People (type: PEOPLE)

2. Extract EnablerTypes: [TECHNOLOGY, VENDOR, PEOPLE]

3. Get applicable threats:
   SELECT DISTINCT t.*
   FROM threats t
   JOIN threat_enabler_types tet ON t.id = tet.threat_id
   JOIN risk_category_threats rct ON t.id = rct.threat_id
   WHERE rct.risk_category_id = (SELECT id FROM risk_categories WHERE code = 'PROCESS')
   AND tet.enabler_type_id IN (SELECT id FROM enabler_types WHERE code IN ('TECHNOLOGY', 'VENDOR', 'PEOPLE'))
```

---

## 📊 Next Steps

### ✅ Completed
- [x] Backend entities and database schema
- [x] Backend repositories with custom queries
- [x] Enums for all categorical data

### 🔄 In Progress
- [ ] Backend services (business logic)
- [ ] Backend controllers (REST APIs)
- [ ] Frontend TypeScript interfaces
- [ ] Frontend API services
- [ ] Threat Library Admin UI
- [ ] Risk Category Library Admin UI
- [ ] Risk Assessment Dashboard
- [ ] Risk Assessment Wizard
- [ ] Integration testing

### 📝 Service Layer (Next)

**Services to Create:**
1. `ThreatTypeService` - CRUD for threat types
2. `EnablerTypeService` - CRUD for enabler types (may be read-only, seeded data)
3. `ThreatService` - CRUD for threats + enabler type assignment
4. `RiskCategoryService` - CRUD for risk categories + threat assignment
5. `RiskAssessmentService` - RA lifecycle management
6. `ThreatAssessmentService` - Individual threat evaluation
7. `RiskContextService` - Helper service to resolve context objects and applicable threats

**Key Service Methods:**
```java
// ThreatService
List<Threat> getApplicableThreats(Long riskCategoryId, RiskCategoryCode contextType, Long contextId)

// RiskContextService
List<EnablerTypeCode> getEnablerTypesForContext(RiskCategoryCode contextType, Long contextId)
Object getContextObject(RiskCategoryCode contextType, Long contextId)

// RiskAssessmentService
RiskAssessment createRiskAssessment(RiskAssessmentDTO dto)
RiskAssessment updateStatus(Long id, RiskAssessmentStatus newStatus)
Map<RiskLevel, Long> getRiskDistribution(Long riskAssessmentId)
```

---

## 🎨 UI/UX Design (Planned)

### Threat Library Pages
- **Threat Types Grid**: CRUD operations, drag-to-reorder
- **Threats Grid**: Name, Type, Enabler Types (chips), Default Likelihood/Impact
- **Threat Edit Modal**: Multi-select for Enabler Types (BETH3V checkboxes)

### Risk Category Library Pages
- **Risk Categories Grid**: Name, Code, Active status, Threat count
- **Risk Category Edit Modal**: Multi-select for Threats (searchable dropdown)

### Risk Assessment Dashboard
- **Donut Charts**: Risk distribution (Low/Medium/High) with color coding
- **5x5 Heat Map**: Clickable cells showing threat count per likelihood/impact combination
- **Threat Intelligence Alerts**: Recent high-risk threats
- **Data Tables**: All RAs with status badges, filters, search

### Risk Assessment Wizard
- **Step 1**: Select Risk Category
- **Step 2**: Select Context Object (Process/Location/Vendor/etc.)
- **Step 3**: Threat Evaluation (table with Likelihood/Impact dropdowns)
- **Step 4**: Mitigation Actions
- **Step 5**: Review & Submit

---

**Architecture Status:** 🟢 **Backend Foundation Complete**  
**Next Milestone:** Backend Services & Controllers  
**Target:** Full RA module operational with enterprise-grade UI/UX

