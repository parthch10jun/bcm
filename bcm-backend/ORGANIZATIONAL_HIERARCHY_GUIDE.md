# Organizational Hierarchy - Self-Referencing Model Guide

## 🌳 Overview

The BCM Platform uses a **self-referencing hierarchical model** for organizational structure. This is an industry-standard approach that provides maximum flexibility and scalability.

### Key Benefits

✅ **Unlimited Nesting Levels** - Support any depth: Organization → Division → Department → Team → Sub-Team → etc.  
✅ **Easy Reorganizations** - Simply update the `parent_unit_id` to move units around  
✅ **Single Source of Truth** - One table manages the entire organizational structure  
✅ **BIA Eligibility Control** - Flag specific units where BIAs can be conducted  
✅ **Flexible Hierarchy** - No hardcoded levels, adapt to any organizational structure  

---

## 📊 Database Design

### Core Table: `organizational_units`

```sql
CREATE TABLE organizational_units (
    id BIGSERIAL PRIMARY KEY,
    unit_code VARCHAR(50) UNIQUE,
    unit_name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Self-Referencing Key (The Magic!)
    parent_unit_id BIGINT REFERENCES organizational_units(id),
    
    -- Classification
    unit_type VARCHAR(50) NOT NULL,  -- ORGANIZATION, DIVISION, DEPARTMENT, TEAM, etc.
    is_bia_eligible BOOLEAN NOT NULL DEFAULT false,  -- Can BIAs be conducted here?
    
    -- Leadership
    unit_head VARCHAR(255),
    unit_head_email VARCHAR(255),
    
    -- Metrics
    employee_count INTEGER,
    annual_budget DECIMAL(15, 2),
    
    -- Criticality (inherited from BIA)
    criticality_tier VARCHAR(20),
    criticality_score INTEGER,
    
    -- Audit fields
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255),
    version BIGINT,
    is_deleted BOOLEAN DEFAULT false
);
```

---

## 🔑 Key Concepts

### 1. Self-Referencing via `parent_unit_id`

The `parent_unit_id` column points to another record in the **same table**.

- **Top-level organization**: `parent_unit_id = NULL`
- **Division under organization**: `parent_unit_id = <organization_id>`
- **Department under division**: `parent_unit_id = <division_id>`
- **Team under department**: `parent_unit_id = <department_id>`

**Example:**

| id | unit_name | parent_unit_id | unit_type | is_bia_eligible |
|----|-----------|----------------|-----------|-----------------|
| 1  | ACME Corporation | NULL | ORGANIZATION | false |
| 2  | Operations | 1 | DIVISION | false |
| 3  | Technology | 1 | DIVISION | false |
| 4  | IT Infrastructure | 3 | DEPARTMENT | **true** |
| 5  | Software Development | 3 | DEPARTMENT | **true** |
| 6  | Frontend Team | 5 | TEAM | **true** |

**Hierarchy Visualization:**
```
ACME Corporation (id=1)
├── Operations (id=2)
└── Technology (id=3)
    ├── IT Infrastructure (id=4) ✓ BIA Eligible
    └── Software Development (id=5) ✓ BIA Eligible
        └── Frontend Team (id=6) ✓ BIA Eligible
```

---

### 2. BIA Eligibility Flag

The `is_bia_eligible` boolean flag determines where BIAs can be conducted.

**Business Rule:**
- Only units with `is_bia_eligible = true` can have BIAs created for them
- Typically set to `true` for "leaf nodes" (final-level departments/teams)
- Can be set to `true` at any level based on business requirements

**Why This Matters:**
- Prevents BIAs at too high a level (e.g., entire organization)
- Ensures BIAs are conducted at the appropriate granularity
- Provides flexibility to change eligibility as organization evolves

**Query for BIA-Eligible Units:**
```sql
SELECT id, unit_code, unit_name, unit_type
FROM organizational_units
WHERE is_bia_eligible = true 
  AND is_deleted = false
ORDER BY unit_name;
```

This query powers the dropdown in the UI when creating a new BIA.

---

### 3. Unit Types

The `unit_type` enum provides semantic meaning to each level:

```java
public enum UnitType {
    ORGANIZATION,  // Top level (e.g., "ACME Corporation")
    DIVISION,      // Major business units (e.g., "Operations", "Technology")
    DEPARTMENT,    // Functional departments (e.g., "IT Infrastructure")
    TEAM,          // Working teams (e.g., "Frontend Team")
    SUB_TEAM,      // Sub-teams (e.g., "React Developers")
    CUSTOM         // Custom levels for unique structures
}
```

**Flexibility:**
- Not enforced by database constraints
- Can have multiple levels of the same type
- Can skip types (e.g., Organization → Department, no Division)
- Can add new types without schema changes

---

## 🔄 Common Operations

### 1. Get Full Hierarchical Path

**SQL Query:**
```sql
WITH RECURSIVE unit_path AS (
    SELECT id, unit_name, parent_unit_id, unit_name as path
    FROM organizational_units
    WHERE id = 6  -- Frontend Team
    UNION ALL
    SELECT ou.id, ou.unit_name, ou.parent_unit_id, 
           ou.unit_name || ' > ' || up.path
    FROM organizational_units ou
    INNER JOIN unit_path up ON ou.id = up.parent_unit_id
)
SELECT path FROM unit_path WHERE parent_unit_id IS NULL;
```

**Result:**
```
ACME Corporation > Technology > Software Development > Frontend Team
```

**Java Helper Method:**
```java
@Transient
public String getFullPath() {
    if (parentUnit == null) {
        return unitName;
    }
    return parentUnit.getFullPath() + " > " + unitName;
}
```

---

### 2. Get All Children (Direct)

**SQL Query:**
```sql
SELECT id, unit_name, unit_type
FROM organizational_units
WHERE parent_unit_id = 3  -- Technology Division
  AND is_deleted = false
ORDER BY unit_name;
```

**Result:**
```
IT Infrastructure
Software Development
```

---

### 3. Get All Descendants (Recursive)

**SQL Query:**
```sql
WITH RECURSIVE descendants AS (
    SELECT id, unit_name, parent_unit_id, 0 as level
    FROM organizational_units
    WHERE id = 3  -- Technology Division
    UNION ALL
    SELECT ou.id, ou.unit_name, ou.parent_unit_id, d.level + 1
    FROM organizational_units ou
    INNER JOIN descendants d ON ou.parent_unit_id = d.id
)
SELECT id, unit_name, level
FROM descendants
WHERE id != 3  -- Exclude the starting unit
ORDER BY level, unit_name;
```

**Result:**
```
IT Infrastructure (level 1)
Software Development (level 1)
Frontend Team (level 2)
Backend Team (level 2)
```

**Java Helper Method:**
```java
@Transient
public List<OrganizationalUnit> getAllDescendants() {
    List<OrganizationalUnit> descendants = new ArrayList<>();
    for (OrganizationalUnit child : childUnits) {
        descendants.add(child);
        descendants.addAll(child.getAllDescendants());
    }
    return descendants;
}
```

---

### 4. Get All Ancestors

**SQL Query:**
```sql
WITH RECURSIVE ancestors AS (
    SELECT id, unit_name, parent_unit_id, 0 as level
    FROM organizational_units
    WHERE id = 6  -- Frontend Team
    UNION ALL
    SELECT ou.id, ou.unit_name, ou.parent_unit_id, a.level + 1
    FROM organizational_units ou
    INNER JOIN ancestors a ON ou.id = a.parent_unit_id
)
SELECT id, unit_name, level
FROM ancestors
WHERE id != 6  -- Exclude the starting unit
ORDER BY level DESC;
```

**Result:**
```
ACME Corporation (level 3)
Technology (level 2)
Software Development (level 1)
```

**Java Helper Method:**
```java
@Transient
public List<OrganizationalUnit> getAncestors() {
    List<OrganizationalUnit> ancestors = new ArrayList<>();
    OrganizationalUnit current = this.parentUnit;
    while (current != null) {
        ancestors.add(0, current);
        current = current.getParentUnit();
    }
    return ancestors;
}
```

---

### 5. Move a Unit to Different Parent

**SQL Update:**
```sql
UPDATE organizational_units
SET parent_unit_id = 4,  -- New parent: IT Infrastructure
    updated_at = CURRENT_TIMESTAMP,
    updated_by = 'admin'
WHERE id = 6;  -- Frontend Team
```

**Effect:**
- Frontend Team moves from Software Development to IT Infrastructure
- All descendants move with it automatically
- No complex cascading updates needed

---

## 🎯 Integration with BIA Records

### BIA Record References

```java
@Entity
public class BiaRecord extends BaseEntity {
    
    @Enumerated(EnumType.STRING)
    private BiaType biaType;  // PROCESS or DEPARTMENT
    
    // For Process BIAs
    @ManyToOne
    private Process process;
    
    // For Department BIAs (references organizational_units)
    @ManyToOne
    private OrganizationalUnit organizationalUnit;
    
    // For Location BIAs
    @ManyToOne
    private Location location;
}
```

### Creating a Department BIA

**Business Rule:**
- Only organizational units with `is_bia_eligible = true` can have BIAs

**Validation:**
```java
public void validateBiaCreation(Long organizationalUnitId) {
    OrganizationalUnit unit = repository.findById(organizationalUnitId)
        .orElseThrow(() -> new ResourceNotFoundException("Unit not found"));
    
    if (!unit.getIsBiaEligible()) {
        throw new ValidationException(
            "BIAs can only be conducted for BIA-eligible organizational units"
        );
    }
}
```

---

## 📱 UI Implementation

### Department Selector Dropdown

**API Endpoint:**
```java
@GetMapping("/api/organizational-units/bia-eligible")
public List<OrganizationalUnitDTO> getBiaEligibleUnits() {
    return organizationalUnitService.findBiaEligibleUnits();
}
```

**Service Method:**
```java
public List<OrganizationalUnitDTO> findBiaEligibleUnits() {
    return repository.findByIsBiaEligibleTrueAndIsDeletedFalse()
        .stream()
        .map(this::toDTO)
        .collect(Collectors.toList());
}
```

**Frontend (React):**
```typescript
const [biaEligibleUnits, setBiaEligibleUnits] = useState([]);

useEffect(() => {
  apiClient.get('/organizational-units/bia-eligible')
    .then(response => setBiaEligibleUnits(response.data));
}, []);

// Render dropdown
<select>
  {biaEligibleUnits.map(unit => (
    <option key={unit.id} value={unit.id}>
      {unit.fullPath} ({unit.unitType})
    </option>
  ))}
</select>
```

---

### Organizational Tree View

**API Endpoint:**
```java
@GetMapping("/api/organizational-units/tree")
public OrganizationalUnitTreeDTO getOrganizationalTree() {
    return organizationalUnitService.buildTree();
}
```

**Service Method:**
```java
public OrganizationalUnitTreeDTO buildTree() {
    // Get top-level organization (parent_unit_id = NULL)
    OrganizationalUnit root = repository.findByParentUnitIsNull()
        .orElseThrow(() -> new ResourceNotFoundException("No root organization found"));
    
    return buildTreeNode(root);
}

private OrganizationalUnitTreeDTO buildTreeNode(OrganizationalUnit unit) {
    OrganizationalUnitTreeDTO node = toTreeDTO(unit);
    
    // Recursively build children
    List<OrganizationalUnit> children = repository.findByParentUnit(unit);
    node.setChildren(
        children.stream()
            .map(this::buildTreeNode)
            .collect(Collectors.toList())
    );
    
    return node;
}
```

**Frontend (React with react-flow or tree component):**
```typescript
const renderTree = (node: OrganizationalUnitTreeDTO) => (
  <div className="tree-node">
    <div className={`unit ${node.isBiaEligible ? 'bia-eligible' : ''}`}>
      {node.unitName}
      {node.isBiaEligible && <span className="badge">BIA Eligible</span>}
    </div>
    {node.children && node.children.length > 0 && (
      <div className="children">
        {node.children.map(child => renderTree(child))}
      </div>
    )}
  </div>
);
```

---

## 🔍 Sample Queries

### 1. Get BIA-Eligible Units with Full Path

```sql
WITH RECURSIVE unit_path AS (
    SELECT 
        id, 
        unit_name, 
        parent_unit_id, 
        unit_name as path,
        is_bia_eligible
    FROM organizational_units
    WHERE is_bia_eligible = true AND is_deleted = false
    
    UNION ALL
    
    SELECT 
        ou.id, 
        ou.unit_name, 
        ou.parent_unit_id, 
        ou.unit_name || ' > ' || up.path,
        up.is_bia_eligible
    FROM organizational_units ou
    INNER JOIN unit_path up ON ou.id = up.parent_unit_id
)
SELECT DISTINCT ON (id) id, path as full_path
FROM unit_path
WHERE parent_unit_id IS NULL
ORDER BY id, path;
```

---

### 2. Count BIAs by Organizational Unit

```sql
SELECT 
    ou.unit_name,
    ou.unit_type,
    COUNT(br.id) as bia_count,
    COUNT(CASE WHEN br.status = 'APPROVED' THEN 1 END) as approved_count
FROM organizational_units ou
LEFT JOIN bia_records br ON br.organizational_unit_id = ou.id
WHERE ou.is_bia_eligible = true
GROUP BY ou.id, ou.unit_name, ou.unit_type
ORDER BY bia_count DESC;
```

---

### 3. Find Units Without BIAs

```sql
SELECT 
    ou.id,
    ou.unit_code,
    ou.unit_name,
    ou.unit_type,
    ou.unit_head
FROM organizational_units ou
LEFT JOIN bia_records br ON br.organizational_unit_id = ou.id
WHERE ou.is_bia_eligible = true
  AND ou.is_deleted = false
  AND br.id IS NULL
ORDER BY ou.unit_name;
```

---

## ✅ Best Practices

### 1. Setting BIA Eligibility

**Recommended Approach:**
- Set `is_bia_eligible = true` for **leaf nodes** (units with no children)
- Set `is_bia_eligible = false` for **parent nodes** (divisions, top-level departments)
- Allow flexibility to mark intermediate levels as eligible if needed

**Example:**
```
ACME Corporation (is_bia_eligible = false)
└── Technology (is_bia_eligible = false)
    ├── IT Infrastructure (is_bia_eligible = true) ✓
    └── Software Development (is_bia_eligible = false)
        ├── Frontend Team (is_bia_eligible = true) ✓
        └── Backend Team (is_bia_eligible = true) ✓
```

### 2. Handling Reorganizations

**Scenario:** Move "Frontend Team" from "Software Development" to "IT Infrastructure"

**SQL:**
```sql
UPDATE organizational_units
SET parent_unit_id = (SELECT id FROM organizational_units WHERE unit_code = 'DEPT-IT-INFRA')
WHERE unit_code = 'TEAM-FRONTEND';
```

**Impact:**
- Instant reorganization
- No data loss
- All BIAs remain intact
- Historical audit trail preserved

### 3. Soft Deletes

**Never hard delete organizational units** - use soft deletes:

```sql
UPDATE organizational_units
SET is_deleted = true,
    updated_at = CURRENT_TIMESTAMP,
    updated_by = 'admin'
WHERE id = 6;
```

**Benefits:**
- Preserve historical BIA data
- Maintain referential integrity
- Enable "undelete" functionality
- Support audit requirements

---

## 🎯 Summary

The self-referencing hierarchical model provides:

✅ **Flexibility** - Unlimited nesting levels  
✅ **Simplicity** - One table for entire org structure  
✅ **Scalability** - Handles organizations of any size  
✅ **Maintainability** - Easy reorganizations  
✅ **BIA Control** - Precise control over where BIAs can be conducted  

**This is the industry-standard approach for organizational hierarchies and will serve your BCM platform well!** 🎉

