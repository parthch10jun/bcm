# ✅ BCM Backend - RUNNING!

## 🎉 Status: OPERATIONAL

The BCM Platform backend is now **fully operational** and ready for frontend integration!

---

## 🚀 Quick Start

### Start the Backend
```bash
cd bcm-backend
mvn spring-boot:run
```

The backend will start on **http://localhost:8080**

---

## 📡 API Endpoints

### Base URL
```
http://localhost:8080/api/organizational-units
```

### Available Endpoints

#### 1. Health Check
```bash
GET /api/organizational-units/health
```
**Response:**
```
Organizational Units API is running
```

#### 2. Get All Organizational Units
```bash
GET /api/organizational-units
```
**Response:** Array of all organizational units (21 sample records)

#### 3. Get BIA-Eligible Units (Leaf Nodes Only)
```bash
GET /api/organizational-units/bia-eligible
```
**Response:** Array of units with no children (can be used in BIA)

#### 4. Get Top-Level Units
```bash
GET /api/organizational-units/top-level
```
**Response:** Array of root organizational units (no parent)

#### 5. Get Unit by ID
```bash
GET /api/organizational-units/{id}
```
**Response:** Single organizational unit

#### 6. Search Units
```bash
GET /api/organizational-units/search?name={name}&type={type}&parentId={parentId}
```
**Response:** Filtered array of organizational units

#### 7. Create New Unit
```bash
POST /api/organizational-units
Content-Type: application/json

{
  "unitCode": "IT-DEV",
  "unitName": "Development Team",
  "description": "Software development",
  "parentUnitId": 10,
  "unitType": "TEAM",
  "unitHead": "John Doe",
  "unitHeadEmail": "john.doe@acme.com",
  "employeeCount": 15,
  "annualBudget": 2000000
}
```
**Response:** Created organizational unit with auto-calculated BIA eligibility

#### 8. Update Unit
```bash
PUT /api/organizational-units/{id}
Content-Type: application/json

{
  "unitName": "Updated Name",
  "description": "Updated description"
}
```
**Response:** Updated organizational unit

#### 9. Delete Unit
```bash
DELETE /api/organizational-units/{id}
```
**Response:** 204 No Content

---

## 🗄️ Database

### Technology
- **H2 In-Memory Database** (for development)
- **PostgreSQL Compatibility Mode**
- **Flyway Migrations** (automatic on startup)

### H2 Console
Access the H2 console at: **http://localhost:8080/h2-console**

**Connection Details:**
- JDBC URL: `jdbc:h2:mem:bcm_platform`
- Username: `sa`
- Password: *(leave blank)*

### Sample Data
The database is pre-populated with **21 organizational units** representing:
- 1 Organization (ACME Corporation)
- 5 Divisions
- 15 Departments/Teams

---

## 🔒 Security

**Status:** Disabled for development

Security is currently disabled to allow easy testing. The `DevSecurityConfig` class permits all requests without authentication.

**For Production:** Enable security by removing or modifying `DevSecurityConfig.java`

---

## 🏗️ Architecture

### Technology Stack
- **Java 17**
- **Spring Boot 3.2.1**
- **Spring Data JPA** (Hibernate 6.4.1)
- **H2 Database 2.2.224**
- **Flyway 9.22.3**
- **Lombok** (for boilerplate reduction)
- **Maven** (build tool)

### Layers
1. **Controller** - REST API endpoints (`OrganizationalUnitController`)
2. **Service** - Business logic (`OrganizationalUnitService`)
3. **Repository** - Data access (`OrganizationalUnitRepository`)
4. **Entity** - JPA entities (`OrganizationalUnit`)
5. **DTO** - Data transfer objects (request/response)

---

## 📊 Sample API Responses

### Get All Units (First 3)
```json
[
  {
    "id": 1,
    "unitCode": "ACME",
    "unitName": "ACME Corporation",
    "description": "Global technology and services company",
    "unitType": "ORGANIZATION",
    "isBiaEligible": false,
    "isLeafNode": false,
    "employeeCount": 5000,
    "annualBudget": 500000000.0,
    "fullPath": "ACME Corporation",
    "level": 0,
    "childUnitIds": [2, 3, 4, 5, 6],
    "childCount": 5,
    "createdAt": "2025-10-11T17:06:15.82452",
    "createdBy": "system",
    "isDeleted": false,
    "version": 0
  },
  {
    "id": 2,
    "unitCode": "OPS",
    "unitName": "Operations Division",
    "description": "Manages all operational activities",
    "parentUnitId": 1,
    "parentUnitName": "ACME Corporation",
    "unitType": "DIVISION",
    "isBiaEligible": false,
    "isLeafNode": false,
    "employeeCount": 1500,
    "annualBudget": 150000000.0,
    "fullPath": "ACME Corporation > Operations Division",
    "level": 1,
    "childUnitIds": [7, 8, 9],
    "childCount": 3,
    "createdAt": "2025-10-11T17:06:15.82452",
    "createdBy": "system",
    "isDeleted": false,
    "version": 0
  }
]
```

### Get BIA-Eligible Units (Leaf Nodes)
```json
[
  {
    "id": 7,
    "unitCode": "OPS-CS",
    "unitName": "Customer Service",
    "description": "Customer support and service",
    "parentUnitId": 2,
    "parentUnitName": "Operations Division",
    "unitType": "DEPARTMENT",
    "isBiaEligible": true,
    "isLeafNode": true,
    "unitHead": "Sarah Johnson",
    "unitHeadEmail": "sarah.johnson@acme.com",
    "employeeCount": 200,
    "annualBudget": 20000000.0,
    "fullPath": "ACME Corporation > Operations Division > Customer Service",
    "level": 2,
    "childUnitIds": [],
    "childCount": 0,
    "createdAt": "2025-10-11T17:06:15.82452",
    "createdBy": "system",
    "isDeleted": false,
    "version": 0
  }
]
```

---

## ✨ Key Features

### 1. Automatic BIA Eligibility
- Units with **no children** are automatically marked as `isBiaEligible: true`
- When a child is added to a unit, the parent's BIA eligibility is automatically set to `false`
- When the last child is removed, the parent becomes BIA-eligible again

### 2. Hierarchical Structure
- Self-referencing parent-child relationships
- Automatic calculation of `fullPath` (e.g., "ACME > Tech > Development")
- Automatic calculation of `level` (depth in hierarchy)
- `childUnitIds` array for easy tree building

### 3. Circular Reference Prevention
- Service layer prevents creating circular references
- Validates that a unit cannot be its own ancestor

### 4. Soft Delete
- Units are marked as `isDeleted: true` instead of being physically deleted
- Preserves data integrity and audit trail

---

## 🔄 Next Steps

### Frontend Integration
1. Create API service layer in frontend (`organizationalUnitService.ts`)
2. Replace mock data with real API calls
3. Implement tree building logic
4. Add CORS configuration if needed
5. Test create/update/delete operations

### Future Enhancements
1. Add Process entity and link to organizational units
2. Add Location entity
3. Add BiaRecord entity
4. Implement authentication and authorization
5. Add pagination for large datasets
6. Add sorting and advanced filtering
7. Add export functionality (CSV, Excel)

---

## 🐛 Troubleshooting

### Backend Won't Start
```bash
# Clean and rebuild
mvn clean package -DskipTests
mvn spring-boot:run
```

### Port 8080 Already in Use
```bash
# Find and kill the process
lsof -ti:8080 | xargs kill -9
```

### Database Issues
The H2 database is in-memory and resets on every restart. This is intentional for development.

---

## 📝 Notes

- **Development Mode:** Spring DevTools is enabled for hot reload
- **Logging:** Debug logging is enabled for `com.bcm` package
- **SQL Logging:** All SQL queries are logged to console
- **Error Handling:** Global exception handler provides consistent error responses

---

**Backend Status:** ✅ READY FOR FRONTEND INTEGRATION!

