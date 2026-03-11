# BIA Eligibility Logic - Critical Business Rules

## 🎯 Core Principle

**A department is BIA-eligible if and ONLY if it's a LEAF NODE in the organizational hierarchy.**

This prevents critical data integrity issues and ensures BIAs remain valid as the organization evolves.

---

## 📋 Key Definitions

### **Department**
The smallest operational unit in your organization where you can conduct a Business Impact Analysis (BIA). It's a "leaf node" in your organizational chart that contains a specific set of business processes.

### **Leaf Node**
An organizational unit that has **NO child units** beneath it in the hierarchy.

### **BIA Eligibility**
The ability for an organizational unit to have BIAs conducted. **BIAs are conducted on PROCESSES, not departments directly.** Departments are BIA-eligible if they can contain processes that can have BIAs.

---

## ⚠️ The Problem We're Preventing

### **Scenario: Manual BIA Eligibility (BAD)**

1. User creates "Finance Department"
2. User manually checks "BIA Eligible" checkbox
3. User conducts BIA on "Finance Department"
4. Later, user adds child units:
   - "Accounting" (child of Finance)
   - "Payroll" (child of Finance)
5. **PROBLEM:** Finance Department is no longer a leaf node, but the BIA still exists!
6. **DATA INTEGRITY ISSUE:** The BIA is now invalid

### **Solution: Automatic BIA Eligibility (GOOD)**

1. User creates "Finance Department" (no children)
2. System automatically marks it as BIA-eligible (it's a leaf node)
3. User conducts BIA on processes linked to "Finance Department"
4. Later, user adds child units:
   - "Accounting" (child of Finance)
   - "Payroll" (child of Finance)
5. **AUTOMATIC:** System detects Finance now has children
6. **AUTOMATIC:** Finance is no longer BIA-eligible
7. **AUTOMATIC:** System prevents new BIAs on Finance processes
8. **RESULT:** Existing BIAs remain valid, new structure is enforced

---

## 🏗️ Organizational Structure Setup Flow

### **Step 1: Build Organizational Hierarchy**

```
ACME Corporation (Organization)
├── Operations (Division)
│   ├── Customer Service (Department) ✓ LEAF NODE → BIA Eligible
│   ├── Logistics (Department) ✓ LEAF NODE → BIA Eligible
│   └── Quality Assurance (Department) ✓ LEAF NODE → BIA Eligible
├── Technology (Division)
│   ├── IT Infrastructure (Department) ✓ LEAF NODE → BIA Eligible
│   ├── Software Development (Department) ✗ NOT LEAF NODE → NOT BIA Eligible
│   │   ├── Frontend Team (Team) ✓ LEAF NODE → BIA Eligible
│   │   ├── Backend Team (Team) ✓ LEAF NODE → BIA Eligible
│   │   └── Mobile Team (Team) ✓ LEAF NODE → BIA Eligible
│   └── Cybersecurity (Department) ✓ LEAF NODE → BIA Eligible
└── Finance (Division)
    ├── Accounting (Department) ✓ LEAF NODE → BIA Eligible
    ├── Payroll (Department) ✓ LEAF NODE → BIA Eligible
    └── FP&A (Department) ✓ LEAF NODE → BIA Eligible
```

### **Step 2: Add Processes to Departments**

```
Customer Service Department
├── Process: Handle Customer Inquiries
├── Process: Process Returns
└── Process: Manage Customer Complaints

IT Infrastructure Department
├── Process: Server Maintenance
├── Process: Network Monitoring
└── Process: Backup Management
```

### **Step 3: Conduct BIAs on Processes**

```
Process: Handle Customer Inquiries
└── BIA Record
    ├── MTPD: 4 hours
    ├── RTO: 2 hours
    ├── Impact Analysis: High
    └── Recovery Strategy: ...
```

---

## 🔑 Database Schema

### **OrganizationalUnits Table**

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| `unit_id` | Integer (PK) | Unique ID | 101 |
| `unit_name` | Varchar | Name of unit | "Finance Department" |
| `parent_unit_id` | Integer (FK) | Parent unit ID | 5 (Corporate Division) |
| `unit_type` | Enum | Type of unit | DEPARTMENT |
| `is_bia_eligible` | Boolean | **Calculated field** | true (if leaf node) |

**Important:** `is_bia_eligible` should be **calculated dynamically** or **updated by database triggers**, NOT set manually by users.

### **Processes Table**

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| `process_id` | Integer (PK) | Unique ID | 5001 |
| `process_name` | Varchar | Name of process | "Monthly Payroll" |
| `department_id` | Integer (FK) | Department ID | 101 |
| `description` | Text | What it does | "Handles salary disbursement..." |

**Key Relationship:** `Processes.department_id` → `OrganizationalUnits.unit_id`

### **BiaRecords Table**

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| `bia_id` | Integer (PK) | Unique ID | 1001 |
| `process_id` | Integer (FK) | Process ID | 5001 |
| `mtpd` | Integer | Max tolerable disruption | 240 (minutes) |
| `rto` | Integer | Recovery time objective | 120 (minutes) |
| `status` | Enum | Draft/Approved/etc | APPROVED |

**Key Relationship:** `BiaRecords.process_id` → `Processes.process_id`

---

## 🔄 How It Works Together

### **Creating a Department**

```sql
-- User creates "IT Helpdesk" department
INSERT INTO organizational_units (unit_name, parent_unit_id, unit_type)
VALUES ('IT Helpdesk', 3, 'DEPARTMENT');
-- Returns unit_id = 102

-- System automatically calculates is_bia_eligible
-- Query: SELECT COUNT(*) FROM organizational_units WHERE parent_unit_id = 102
-- Result: 0 children → is_bia_eligible = true
```

### **Adding Processes**

```sql
-- User adds "New User Onboarding" process
INSERT INTO processes (process_name, department_id, description)
VALUES ('New User Onboarding', 102, 'Provision accounts for new employees');

-- User adds "Password Reset" process
INSERT INTO processes (process_name, department_id, description)
VALUES ('Password Reset Procedure', 102, 'Reset user passwords');
```

### **Viewing Department Processes**

```sql
-- Query all processes for IT Helpdesk
SELECT * FROM processes WHERE department_id = 102;

-- Returns:
-- process_id | process_name              | department_id
-- 5001       | New User Onboarding       | 102
-- 5002       | Password Reset Procedure  | 102
```

### **Conducting BIA on Process**

```sql
-- User conducts BIA on "New User Onboarding" process
INSERT INTO bia_records (process_id, mtpd, rto, status)
VALUES (5001, 240, 120, 'DRAFT');
```

---

## ✅ Business Rules

### **Rule 1: BIA Eligibility is Automatic**
- ✅ A unit is BIA-eligible if `childUnits.isEmpty()`
- ✅ This is calculated dynamically, not set by users
- ✅ Prevents data integrity issues

### **Rule 2: BIAs are Conducted on Processes**
- ✅ BIAs are linked to **processes**, not departments
- ✅ Departments are containers for processes
- ✅ A department can have 0 to many processes

### **Rule 3: Organizational Structure First**
- ✅ Build complete org hierarchy first
- ✅ Add departments (leaf nodes)
- ✅ Then add processes to departments
- ✅ Finally conduct BIAs on processes

### **Rule 4: Leaf Node Detection**
```java
@Transient
public boolean isLeafNode() {
    return childUnits == null || childUnits.isEmpty();
}

@Transient
public boolean getActualBiaEligibility() {
    return isLeafNode();
}
```

---

## 🚫 What NOT to Do

### **❌ DON'T: Allow Manual BIA Eligibility**
```typescript
// BAD - User can check/uncheck
<input type="checkbox" name="isBiaEligible" />
```

### **✅ DO: Show Automatic BIA Eligibility**
```typescript
// GOOD - Read-only, calculated
<div className="bg-blue-50">
  <p>BIA Eligibility: {unit.isLeafNode() ? 'Eligible' : 'Not Eligible'}</p>
  <p>Reason: {unit.isLeafNode() ? 'Leaf node' : 'Has child units'}</p>
</div>
```

### **❌ DON'T: Conduct BIAs on Departments**
```sql
-- BAD
INSERT INTO bia_records (department_id, mtpd, rto)
VALUES (102, 240, 120);
```

### **✅ DO: Conduct BIAs on Processes**
```sql
-- GOOD
INSERT INTO bia_records (process_id, mtpd, rto)
VALUES (5001, 240, 120);
```

---

## 🔍 Validation Logic

### **Backend Validation (Service Layer)**

```java
public void createBiaRecord(BiaRecord biaRecord) {
    // Get the process
    Process process = processRepository.findById(biaRecord.getProcessId())
        .orElseThrow(() -> new NotFoundException("Process not found"));
    
    // Get the department
    OrganizationalUnit department = process.getDepartment();
    
    // Validate department is BIA-eligible (leaf node)
    if (!department.isLeafNode()) {
        throw new ValidationException(
            "Cannot conduct BIA on process in non-leaf department. " +
            "Department has child units: " + department.getChildUnits().size()
        );
    }
    
    // Proceed with BIA creation
    biaRecordRepository.save(biaRecord);
}
```

### **Database Trigger (Optional)**

```sql
-- Automatically update is_bia_eligible when children are added/removed
CREATE OR REPLACE FUNCTION update_bia_eligibility()
RETURNS TRIGGER AS $$
BEGIN
    -- Update parent's BIA eligibility
    UPDATE organizational_units
    SET is_bia_eligible = (
        SELECT COUNT(*) = 0
        FROM organizational_units
        WHERE parent_unit_id = NEW.parent_unit_id
    )
    WHERE unit_id = NEW.parent_unit_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_bia_eligibility
AFTER INSERT OR DELETE ON organizational_units
FOR EACH ROW
EXECUTE FUNCTION update_bia_eligibility();
```

---

## 📊 Example Workflow

### **Scenario: Setting Up Finance Department**

1. **Create Division**
   ```
   Finance Division (unit_id=4, parent_unit_id=1)
   └── is_bia_eligible = false (will have children)
   ```

2. **Create Departments**
   ```
   Accounting (unit_id=10, parent_unit_id=4)
   └── is_bia_eligible = true (leaf node)
   
   Payroll (unit_id=11, parent_unit_id=4)
   └── is_bia_eligible = true (leaf node)
   ```

3. **Add Processes to Accounting**
   ```
   Monthly Close (process_id=101, department_id=10)
   Accounts Payable (process_id=102, department_id=10)
   Accounts Receivable (process_id=103, department_id=10)
   ```

4. **Conduct BIA on Monthly Close Process**
   ```
   BIA Record (bia_id=1, process_id=101)
   ├── MTPD: 24 hours
   ├── RTO: 8 hours
   ├── Impact: High
   └── Status: Approved
   ```

5. **Later: Restructure Accounting**
   ```
   Accounting (unit_id=10, parent_unit_id=4)
   ├── AP Team (unit_id=20, parent_unit_id=10) ← NEW
   └── AR Team (unit_id=21, parent_unit_id=10) ← NEW
   
   Result:
   - Accounting.is_bia_eligible = false (no longer leaf node)
   - AP Team.is_bia_eligible = true (leaf node)
   - AR Team.is_bia_eligible = true (leaf node)
   - Existing BIA on Monthly Close remains valid
   - New BIAs must be on processes in AP/AR teams
   ```

---

## ✅ Summary

**Key Takeaways:**

1. ✅ **BIA Eligibility = Leaf Node** (automatic, not manual)
2. ✅ **BIAs on Processes** (not departments)
3. ✅ **Org Structure First** (then processes, then BIAs)
4. ✅ **One-to-Many Relationship** (Department → Processes)
5. ✅ **Data Integrity** (prevents invalid BIAs)

**This approach ensures:**
- ✅ BIAs remain valid as org structure evolves
- ✅ Clear separation of concerns
- ✅ Scalable and maintainable
- ✅ Industry best practice

**This is the foundation for a robust BCM platform!** 🎉

