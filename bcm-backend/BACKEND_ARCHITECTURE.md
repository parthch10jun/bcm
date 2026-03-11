# BCM Platform Backend Architecture

## 🏗️ Technology Stack

- **Framework**: Spring Boot 3.2.1
- **Language**: Java 17 (JVM)
- **Database**: PostgreSQL 15+
- **ORM**: Spring Data JPA / Hibernate
- **Security**: Spring Security + JWT
- **API Documentation**: SpringDoc OpenAPI (Swagger)
- **Build Tool**: Maven
- **Database Migration**: Flyway

---

## 📁 Project Structure

```
bcm-backend/
├── src/
│   ├── main/
│   │   ├── java/com/bcm/
│   │   │   ├── BcmPlatformApplication.java          # Main application class
│   │   │   │
│   │   │   ├── config/                              # Configuration classes
│   │   │   │   ├── CorsConfig.java                  # CORS configuration
│   │   │   │   ├── SecurityConfig.java              # Security & JWT config
│   │   │   │   ├── OpenApiConfig.java               # Swagger/OpenAPI config
│   │   │   │   └── AuditConfig.java                 # JPA auditing config
│   │   │   │
│   │   │   ├── entity/                              # JPA Entities
│   │   │   │   ├── BaseEntity.java                  # Base entity with audit fields
│   │   │   │   ├── User.java                        # User entity
│   │   │   │   ├── Role.java                        # Role entity
│   │   │   │   ├── Process.java                     # Business process
│   │   │   │   ├── Department.java                  # Department/Org unit
│   │   │   │   ├── Location.java                    # Physical location
│   │   │   │   ├── Service.java                     # IT/Business service
│   │   │   │   ├── BiaRecord.java                   # BIA record
│   │   │   │   ├── ImpactAnalysis.java              # Impact analysis data
│   │   │   │   ├── ProcessDependency.java           # Process dependencies
│   │   │   │   ├── Resource.java                    # BETH3V resources
│   │   │   │   ├── SpofAnalysis.java                # SPOF analysis
│   │   │   │   ├── BiaTemplate.java                 # BIA template
│   │   │   │   ├── BiaTemplateField.java            # Template fields
│   │   │   │   └── AuditLog.java                    # Audit trail
│   │   │   │
│   │   │   ├── dto/                                 # Data Transfer Objects
│   │   │   │   ├── request/                         # Request DTOs
│   │   │   │   │   ├── CreateBiaRecordRequest.java
│   │   │   │   │   ├── UpdateProcessRequest.java
│   │   │   │   │   ├── LoginRequest.java
│   │   │   │   │   └── ...
│   │   │   │   ├── response/                        # Response DTOs
│   │   │   │   │   ├── BiaRecordResponse.java
│   │   │   │   │   ├── ProcessResponse.java
│   │   │   │   │   ├── AuthResponse.java
│   │   │   │   │   └── ...
│   │   │   │   └── common/                          # Common DTOs
│   │   │   │       ├── PageResponse.java
│   │   │   │       ├── ApiResponse.java
│   │   │   │       └── ErrorResponse.java
│   │   │   │
│   │   │   ├── repository/                          # Spring Data JPA Repositories
│   │   │   │   ├── UserRepository.java
│   │   │   │   ├── ProcessRepository.java
│   │   │   │   ├── BiaRecordRepository.java
│   │   │   │   ├── DepartmentRepository.java
│   │   │   │   ├── LocationRepository.java
│   │   │   │   ├── ServiceRepository.java
│   │   │   │   ├── BiaTemplateRepository.java
│   │   │   │   └── ...
│   │   │   │
│   │   │   ├── service/                             # Business logic layer
│   │   │   │   ├── AuthService.java
│   │   │   │   ├── UserService.java
│   │   │   │   ├── ProcessService.java
│   │   │   │   ├── BiaRecordService.java
│   │   │   │   ├── ImpactAnalysisService.java
│   │   │   │   ├── CriticalityCalculationService.java
│   │   │   │   ├── DependencyService.java
│   │   │   │   ├── BiaTemplateService.java
│   │   │   │   └── ...
│   │   │   │
│   │   │   ├── controller/                          # REST Controllers
│   │   │   │   ├── AuthController.java              # /api/auth/**
│   │   │   │   ├── ProcessController.java           # /api/processes/**
│   │   │   │   ├── BiaRecordController.java         # /api/bia-records/**
│   │   │   │   ├── DepartmentController.java        # /api/departments/**
│   │   │   │   ├── LocationController.java          # /api/locations/**
│   │   │   │   ├── ServiceController.java           # /api/services/**
│   │   │   │   ├── BiaTemplateController.java       # /api/bia-templates/**
│   │   │   │   ├── ConsolidationController.java     # /api/consolidation/**
│   │   │   │   └── ...
│   │   │   │
│   │   │   ├── mapper/                              # MapStruct mappers
│   │   │   │   ├── ProcessMapper.java
│   │   │   │   ├── BiaRecordMapper.java
│   │   │   │   ├── UserMapper.java
│   │   │   │   └── ...
│   │   │   │
│   │   │   ├── security/                            # Security components
│   │   │   │   ├── JwtAuthenticationFilter.java     # JWT filter
│   │   │   │   ├── JwtAuthenticationEntryPoint.java # Auth entry point
│   │   │   │   ├── JwtTokenProvider.java            # JWT token utility
│   │   │   │   └── UserDetailsServiceImpl.java      # User details service
│   │   │   │
│   │   │   ├── enums/                               # Enumerations
│   │   │   │   ├── BiaStatus.java
│   │   │   │   ├── CriticalityTier.java
│   │   │   │   ├── ImpactLevel.java
│   │   │   │   ├── TimeFrame.java
│   │   │   │   ├── ProcessStatus.java
│   │   │   │   ├── ResourceType.java
│   │   │   │   └── ...
│   │   │   │
│   │   │   ├── exception/                           # Custom exceptions
│   │   │   │   ├── GlobalExceptionHandler.java      # Global exception handler
│   │   │   │   ├── ResourceNotFoundException.java
│   │   │   │   ├── BusinessException.java
│   │   │   │   ├── ValidationException.java
│   │   │   │   └── ...
│   │   │   │
│   │   │   └── util/                                # Utility classes
│   │   │       ├── DateTimeUtil.java
│   │   │       ├── ValidationUtil.java
│   │   │       └── ...
│   │   │
│   │   └── resources/
│   │       ├── application.yml                      # Main configuration
│   │       ├── application-dev.yml                  # Dev environment
│   │       ├── application-prod.yml                 # Production environment
│   │       └── db/migration/                        # Flyway migrations
│   │           ├── V1__create_users_and_roles.sql
│   │           ├── V2__create_processes.sql
│   │           ├── V3__create_departments.sql
│   │           ├── V4__create_locations.sql
│   │           ├── V5__create_services.sql
│   │           ├── V6__create_bia_records.sql
│   │           ├── V7__create_impact_analysis.sql
│   │           ├── V8__create_dependencies.sql
│   │           ├── V9__create_resources.sql
│   │           ├── V10__create_bia_templates.sql
│   │           └── V11__insert_sample_data.sql
│   │
│   └── test/
│       └── java/com/bcm/
│           ├── controller/                          # Controller tests
│           ├── service/                             # Service tests
│           └── repository/                          # Repository tests
│
├── pom.xml                                          # Maven configuration
├── .gitignore
├── README.md
└── docker-compose.yml                               # Docker setup for PostgreSQL
```

---

## 🗄️ Database Schema Overview

### Core Tables

#### 1. **users**
- User authentication and profile information
- Fields: id, username, email, password_hash, first_name, last_name, etc.

#### 2. **roles**
- User roles (Admin, BIA Coordinator, Process Owner, Viewer)
- Fields: id, name, description

#### 3. **user_roles**
- Many-to-many relationship between users and roles

#### 4. **processes**
- Business processes
- Fields: id, process_id, name, description, owner, criticality_tier, approved_rto, approved_rpo, mtpd, etc.

#### 5. **departments**
- Organizational units
- Fields: id, name, description, parent_id (self-referencing), head, etc.

#### 6. **locations**
- Physical locations
- Fields: id, name, address, city, country, coordinates, etc.

#### 7. **services**
- IT/Business services (enablers)
- Fields: id, name, description, service_type, criticality_tier, etc.

#### 8. **bia_records**
- BIA records (Process/Department/Location BIAs)
- Fields: id, bia_id, bia_type, status, process_id, department_id, location_id, coordinator, etc.

#### 9. **impact_analysis**
- Impact analysis data for each BIA
- Fields: id, bia_record_id, timeframe, financial_impact, operational_impact, reputational_impact, regulatory_impact, mtpd, etc.

#### 10. **process_dependencies**
- Dependencies between processes
- Fields: id, process_id, dependent_process_id, dependency_type, criticality, etc.

#### 11. **resources** (BETH3V)
- Buildings, Equipment, Technology, Vital Records, Human Resources, Vendors
- Fields: id, resource_type, name, description, criticality, etc.

#### 12. **spof_analysis**
- Single Point of Failure analysis
- Fields: id, bia_record_id, single_person_dependency, single_technology_dependency, single_vendor_dependency, etc.

#### 13. **bia_templates**
- BIA templates configuration
- Fields: id, name, organizational_level, is_default, etc.

#### 14. **bia_template_fields**
- Template field configuration
- Fields: id, template_id, field_type, field_name, is_enabled, order, etc.

#### 15. **audit_logs**
- Audit trail for all changes
- Fields: id, entity_type, entity_id, action, user_id, changes, timestamp, etc.

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - User logout

### Processes
- `GET /api/processes` - List all processes (with pagination, filtering, sorting)
- `GET /api/processes/{id}` - Get process by ID
- `POST /api/processes` - Create new process
- `PUT /api/processes/{id}` - Update process
- `DELETE /api/processes/{id}` - Delete process (soft delete)
- `GET /api/processes/{id}/dependencies` - Get process dependencies
- `GET /api/processes/{id}/bia-records` - Get BIA records for process

### BIA Records
- `GET /api/bia-records` - List all BIA records
- `GET /api/bia-records/{id}` - Get BIA record by ID
- `POST /api/bia-records` - Create new BIA record
- `PUT /api/bia-records/{id}` - Update BIA record
- `DELETE /api/bia-records/{id}` - Delete BIA record
- `POST /api/bia-records/{id}/submit` - Submit BIA for review
- `POST /api/bia-records/{id}/approve` - Approve BIA
- `POST /api/bia-records/{id}/reject` - Reject BIA
- `GET /api/bia-records/{id}/audit-trail` - Get audit trail

### Departments
- `GET /api/departments` - List all departments
- `GET /api/departments/{id}` - Get department by ID
- `POST /api/departments` - Create department
- `PUT /api/departments/{id}` - Update department
- `DELETE /api/departments/{id}` - Delete department
- `GET /api/departments/tree` - Get organizational tree

### Locations
- `GET /api/locations` - List all locations
- `GET /api/locations/{id}` - Get location by ID
- `POST /api/locations` - Create location
- `PUT /api/locations/{id}` - Update location
- `DELETE /api/locations/{id}` - Delete location

### Services
- `GET /api/services` - List all services
- `GET /api/services/{id}` - Get service by ID
- `POST /api/services` - Create service
- `PUT /api/services/{id}` - Update service
- `DELETE /api/services/{id}` - Delete service

### BIA Templates
- `GET /api/bia-templates` - List all templates
- `GET /api/bia-templates/{id}` - Get template by ID
- `POST /api/bia-templates` - Create template
- `PUT /api/bia-templates/{id}` - Update template
- `DELETE /api/bia-templates/{id}` - Delete template
- `POST /api/bia-templates/{id}/set-default` - Set as default template

### Consolidation
- `GET /api/consolidation/overview` - Get organization-wide BIA overview
- `GET /api/consolidation/criticality-matrix` - Get criticality matrix
- `GET /api/consolidation/rto-summary` - Get RTO summary
- `GET /api/consolidation/dependencies-graph` - Get dependencies graph data

---

## 🔐 Security

### JWT Authentication
- Access Token: 24 hours expiration
- Refresh Token: 7 days expiration
- Token stored in HTTP-only cookies (optional) or Authorization header

### Role-Based Access Control (RBAC)
- **Admin**: Full access to all features
- **BIA Coordinator**: Create/edit BIA records, manage templates
- **Process Owner**: View/edit own processes and BIAs
- **Viewer**: Read-only access

### Password Security
- BCrypt password hashing
- Minimum password requirements enforced
- Password reset functionality

---

## 📊 Key Features

### 1. **BIA Criticality Calculation**
Automatic calculation based on:
- Impact Value × Time Weight
- Tier assignment (Tier 1-4)
- Inheritance to enablers (services, locations)

### 2. **Waterfall Logic**
- Impact cascades to subsequent timeframes
- Automatic MTPD calculation
- RTO validation (must be < MTPD)

### 3. **Dependency Management**
- Upstream/downstream process dependencies
- BETH3V resource mapping
- RTO conflict detection

### 4. **Template System**
- Configurable BIA templates
- Field-level customization
- Organizational level templates (Process, Department, Location, Organization)

### 5. **Audit Trail**
- Complete change history
- User attribution
- Timestamp tracking

---

## 🚀 Getting Started

### Prerequisites
- Java 17 or higher
- Maven 3.8+
- PostgreSQL 15+
- Docker (optional, for PostgreSQL)

### Setup Instructions

1. **Clone the repository**
```bash
cd bcm-backend
```

2. **Set up PostgreSQL**
```bash
# Using Docker
docker-compose up -d

# Or install PostgreSQL locally and create database
createdb bcm_platform_dev
```

3. **Configure application properties**
```bash
# Edit src/main/resources/application-dev.yml
# Update database credentials if needed
```

4. **Build the project**
```bash
mvn clean install
```

5. **Run the application**
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

6. **Access Swagger UI**
```
http://localhost:8080/api/swagger-ui.html
```

---

## 🧪 Testing

```bash
# Run all tests
mvn test

# Run specific test class
mvn test -Dtest=ProcessServiceTest

# Run with coverage
mvn clean test jacoco:report
```

---

## 📦 Deployment

### Production Build
```bash
mvn clean package -Pprod
```

### Docker Deployment
```bash
docker build -t bcm-platform-backend .
docker run -p 8080:8080 bcm-platform-backend
```

---

## 🔄 Integration with React Frontend

### API Base URL
- Development: `http://localhost:8080/api`
- Production: `https://your-domain.com/api`

### Frontend Configuration
Update `bia-module/src/services/api.ts`:
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
```

### CORS Configuration
Already configured to allow `http://localhost:3000` (React dev server)

---

## 📝 Next Steps

1. ✅ Complete entity creation
2. ✅ Implement repositories
3. ✅ Create service layer
4. ✅ Build REST controllers
5. ✅ Add Flyway migrations
6. ✅ Write unit tests
7. ✅ Create integration tests
8. ✅ Set up CI/CD pipeline
9. ✅ Deploy to production

---

**Backend is ready for development!** 🎉

