# BIA Status Aggregation Implementation Plan

## 🎯 Overview

Implement BIA status aggregation at the organizational unit level by rolling up the status of all processes linked to each unit. This bridges the organizational structure with the BIA module.

---

## 📋 Requirements Summary

### 1. **Process BIA Status**
Each process has a BIA status:
- **Not Started** (Grey) - No BIA initiated
- **Draft** (Blue) - BIA in progress
- **In Progress** (Blue) - BIA being completed
- **Submitted** (Yellow) - Awaiting approval
- **Under Review** (Orange) - Being reviewed
- **Approved** (Green) - BIA completed and approved
- **Rejected** (Red) - BIA rejected, needs rework

### 2. **Department/Unit BIA Status Aggregation**
The unit's BIA status is calculated based on its processes:

**Aggregation Rules:**
- If **all processes are Approved** → Unit BIA is **Completed** (Green)
- If **at least one process is In Progress/Draft/Submitted/Under Review** → Unit BIA is **In Progress** (Blue)
- If **all processes are Not Started** → Unit BIA is **Not Started** (Grey)
- If **any process is Rejected** → Unit BIA is **Requires Attention** (Red)

### 3. **Visual Indicators**

#### **Progress Bar**
```
Recruitment | Department | BIA: [██████----] 60% (3/5 processes)
```

#### **Status Icon/Tag**
```
Recruitment | Department | BIA: In Progress 🔵
```

#### **Detailed Tooltip**
```
Recruitment BIA Status
━━━━━━━━━━━━━━━━━━━━━
Total Processes: 5
✅ Approved: 3
🔵 In Progress: 1
⚪ Not Started: 1
━━━━━━━━━━━━━━━━━━━━━
Overall: 60% Complete
```

---

## 🏗️ Architecture

### Backend Structure

```
OrganizationalUnit
├── id
├── unitName
├── isBiaEligible
└── processes[] (when Process entity is created)
    ├── Process
    │   ├── id
    │   ├── processName
    │   ├── organizationalUnitId
    │   └── biaRecord
    │       ├── id
    │       ├── status (DRAFT, IN_PROGRESS, SUBMITTED, UNDER_REVIEW, APPROVED, REJECTED)
    │       └── ...
```

### API Response Structure

```json
{
  "id": "2",
  "unitName": "Operations Division",
  "unitType": "DIVISION",
  "isBiaEligible": false,
  "biaStatusSummary": {
    "totalProcesses": 5,
    "statusBreakdown": {
      "notStarted": 1,
      "draft": 0,
      "inProgress": 1,
      "submitted": 0,
      "underReview": 0,
      "approved": 3,
      "rejected": 0
    },
    "overallStatus": "IN_PROGRESS",
    "completionPercentage": 60,
    "processes": [
      {
        "id": "proc-1",
        "processName": "Customer Onboarding",
        "biaStatus": "APPROVED",
        "lastUpdated": "2024-01-15T10:30:00Z"
      },
      {
        "id": "proc-2",
        "processName": "Order Processing",
        "biaStatus": "IN_PROGRESS",
        "lastUpdated": "2024-01-20T14:45:00Z"
      }
    ]
  }
}
```

---

## 🔧 Implementation Phases

### **Phase 1: Frontend UI/UX (IMMEDIATE)** ✅
Implement the UI with mock data to demonstrate the design and user experience.

**Files to Create/Modify:**
1. `bia-module/src/types/bia-status.ts` - Type definitions
2. `bia-module/src/components/BIAStatusIndicator.tsx` - Status badge component
3. `bia-module/src/components/BIAProgressBar.tsx` - Progress bar component
4. `bia-module/src/components/BIAStatusTooltip.tsx` - Detailed tooltip
5. `bia-module/src/app/libraries/organizational-units/page.tsx` - Update detail pane

**Mock Data Structure:**
```typescript
const mockBIAStatus = {
  totalProcesses: 5,
  statusBreakdown: {
    notStarted: 1,
    draft: 0,
    inProgress: 1,
    submitted: 0,
    underReview: 0,
    approved: 3,
    rejected: 0
  },
  overallStatus: 'IN_PROGRESS',
  completionPercentage: 60,
  processes: [...]
};
```

---

### **Phase 2: Backend Entities (FUTURE)** 🔜
Create Process and BIA entities when ready.

**Files to Create:**
1. `bcm-backend/src/main/java/com/bcm/entity/Process.java`
2. `bcm-backend/src/main/java/com/bcm/entity/BIARecord.java`
3. `bcm-backend/src/main/java/com/bcm/repository/ProcessRepository.java`
4. `bcm-backend/src/main/java/com/bcm/repository/BIARecordRepository.java`

**Process Entity:**
```java
@Entity
@Table(name = "processes")
public class Process extends BaseEntity {
    @Column(name = "process_name", nullable = false)
    private String processName;
    
    @ManyToOne
    @JoinColumn(name = "organizational_unit_id")
    private OrganizationalUnit organizationalUnit;
    
    @OneToOne(mappedBy = "process")
    private BIARecord biaRecord;
    
    // ... other fields
}
```

**BIARecord Entity:**
```java
@Entity
@Table(name = "bia_records")
public class BIARecord extends BaseEntity {
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private BiaStatus status; // DRAFT, IN_PROGRESS, SUBMITTED, etc.
    
    @OneToOne
    @JoinColumn(name = "process_id")
    private Process process;
    
    // ... other fields
}
```

---

### **Phase 3: Backend API (FUTURE)** 🔜
Create endpoints to calculate and return BIA status aggregation.

**Files to Create/Modify:**
1. `bcm-backend/src/main/java/com/bcm/service/BIAStatusAggregationService.java`
2. `bcm-backend/src/main/java/com/bcm/dto/BIAStatusSummaryDTO.java`
3. `bcm-backend/src/main/java/com/bcm/controller/OrganizationalUnitController.java` (modify)

**New Endpoint:**
```java
@GetMapping("/{id}/bia-status")
public ResponseEntity<BIAStatusSummaryDTO> getBIAStatus(@PathVariable Long id) {
    BIAStatusSummaryDTO summary = biaStatusAggregationService.calculateBIAStatus(id);
    return ResponseEntity.ok(summary);
}
```

**Service Logic:**
```java
public BIAStatusSummaryDTO calculateBIAStatus(Long organizationalUnitId) {
    OrganizationalUnit unit = organizationalUnitRepository.findById(organizationalUnitId)
        .orElseThrow(() -> new ResourceNotFoundException("Unit not found"));
    
    // Get all processes for this unit
    List<Process> processes = processRepository.findByOrganizationalUnitId(organizationalUnitId);
    
    // Calculate status breakdown
    Map<BiaStatus, Long> statusCounts = processes.stream()
        .map(Process::getBiaRecord)
        .filter(Objects::nonNull)
        .map(BIARecord::getStatus)
        .collect(Collectors.groupingBy(Function.identity(), Collectors.counting()));
    
    // Calculate overall status and percentage
    String overallStatus = determineOverallStatus(statusCounts, processes.size());
    int completionPercentage = calculateCompletionPercentage(statusCounts, processes.size());
    
    return BIAStatusSummaryDTO.builder()
        .totalProcesses(processes.size())
        .statusBreakdown(statusCounts)
        .overallStatus(overallStatus)
        .completionPercentage(completionPercentage)
        .processes(mapToProcessSummary(processes))
        .build();
}
```

---

## 🎨 UI Components Design

### 1. **BIA Status Badge**
Small colored badge showing overall status:
- 🟢 **Completed** - All processes approved
- 🔵 **In Progress** - Some processes in progress
- ⚪ **Not Started** - No processes started
- 🔴 **Requires Attention** - Some processes rejected

### 2. **Progress Bar**
Visual bar showing completion percentage:
```
[████████████░░░░░░░░] 60%
```

### 3. **Detailed Breakdown (Tooltip/Panel)**
Shows full breakdown:
```
┌─────────────────────────────┐
│ BIA Status Summary          │
├─────────────────────────────┤
│ Total Processes: 5          │
│                             │
│ ✅ Approved:        3 (60%) │
│ 🔵 In Progress:     1 (20%) │
│ ⚪ Not Started:     1 (20%) │
│ 🟡 Submitted:       0 (0%)  │
│ 🟠 Under Review:    0 (0%)  │
│ 🔴 Rejected:        0 (0%)  │
└─────────────────────────────┘
```

### 4. **Process List in Detail Pane**
Shows all processes with their individual statuses:
```
Processes (5)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Customer Onboarding        [Approved]
🔵 Order Processing           [In Progress]
✅ Invoice Generation         [Approved]
✅ Payment Processing         [Approved]
⚪ Returns Management         [Not Started]
```

---

## 📊 Status Color Scheme

| Status | Color | Icon | Hex Code |
|--------|-------|------|----------|
| Not Started | Grey | ⚪ | #9CA3AF |
| Draft | Blue | 🔵 | #3B82F6 |
| In Progress | Blue | 🔵 | #3B82F6 |
| Submitted | Yellow | 🟡 | #F59E0B |
| Under Review | Orange | 🟠 | #F97316 |
| Approved | Green | ✅ | #10B981 |
| Rejected | Red | 🔴 | #EF4444 |

---

## 🚀 Implementation Order

1. ✅ **Create type definitions** for BIA status
2. ✅ **Create UI components** (badge, progress bar, tooltip)
3. ✅ **Update detail pane** to show BIA status and process list
4. ✅ **Add mock data** for demonstration
5. 🔜 **Create backend entities** (Process, BIARecord) - when ready
6. 🔜 **Create backend service** for aggregation - when ready
7. 🔜 **Create API endpoint** - when ready
8. 🔜 **Connect frontend to real API** - when ready

---

## 📝 Notes

- **Phase 1 (UI/UX)** can be implemented immediately with mock data
- **Phases 2-3 (Backend)** will be implemented when Process and BIA entities are created
- The UI design will remain the same, only the data source will change
- Mock data will clearly indicate it's for demonstration purposes

---

## ✅ Next Steps

**IMMEDIATE (Phase 1):**
1. Create BIA status type definitions
2. Create reusable UI components
3. Update organizational units page with BIA status display
4. Add process list to detail pane
5. Implement tooltips and visual indicators

**FUTURE (Phases 2-3):**
- Will be implemented when Process and BIA entities are ready
- Frontend components are designed to easily switch from mock to real data

