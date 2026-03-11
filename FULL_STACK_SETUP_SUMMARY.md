# BCM Platform - Full Stack Setup Summary

## 🎯 Complete Technology Stack

### Frontend
- **Framework**: Next.js 14.2.5 (React 18)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context + Hooks
- **Charts**: Chart.js, React Flow
- **Icons**: Heroicons
- **Port**: 3000

### Backend
- **Framework**: Spring Boot 3.2.1
- **Language**: Java 17 (JVM)
- **Database**: PostgreSQL 15+
- **ORM**: Spring Data JPA / Hibernate
- **Security**: Spring Security + JWT
- **API Docs**: SpringDoc OpenAPI (Swagger)
- **Build Tool**: Maven
- **Migrations**: Flyway
- **Port**: 8080

---

## 📁 Project Structure

```
Augment/
├── bia-module/                          # React Frontend (Next.js)
│   ├── src/
│   │   ├── app/                         # Next.js pages
│   │   │   ├── bia-records/             # BIA management
│   │   │   ├── libraries/               # Asset libraries
│   │   │   ├── settings/                # System settings
│   │   │   └── consolidation/           # BIA consolidation
│   │   ├── components/                  # React components
│   │   ├── contexts/                    # React contexts
│   │   ├── services/                    # API services (mock data)
│   │   ├── types/                       # TypeScript types
│   │   └── utils/                       # Utilities
│   ├── package.json
│   └── README.md
│
└── bcm-backend/                         # Spring Boot Backend
    ├── src/
    │   ├── main/
    │   │   ├── java/com/bcm/
    │   │   │   ├── BcmPlatformApplication.java
    │   │   │   ├── config/              # Configuration
    │   │   │   ├── entity/              # JPA entities
    │   │   │   ├── dto/                 # Data Transfer Objects
    │   │   │   ├── repository/          # Spring Data repos
    │   │   │   ├── service/             # Business logic
    │   │   │   ├── controller/          # REST controllers
    │   │   │   ├── security/            # JWT security
    │   │   │   ├── enums/               # Enumerations
    │   │   │   └── exception/           # Exception handling
    │   │   └── resources/
    │   │       ├── application.yml      # Configuration
    │   │       └── db/migration/        # Flyway migrations
    │   └── test/                        # Tests
    ├── pom.xml                          # Maven config
    ├── docker-compose.yml               # PostgreSQL setup
    ├── README.md
    ├── SETUP_GUIDE.md
    └── BACKEND_ARCHITECTURE.md
```

---

## 🚀 Quick Start Guide

### 1. Start the Backend

```bash
# Navigate to backend
cd bcm-backend

# Start PostgreSQL
docker-compose up -d

# Build and run Spring Boot
mvn clean install
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

**Backend will be running at:**
- API: http://localhost:8080/api
- Swagger UI: http://localhost:8080/api/swagger-ui.html

### 2. Start the Frontend

```bash
# Navigate to frontend (in new terminal)
cd bia-module

# Install dependencies (if not already done)
npm install

# Start Next.js dev server
npm run dev
```

**Frontend will be running at:**
- App: http://localhost:3000

### 3. Verify Both Are Running

```bash
# Test backend
curl http://localhost:8080/api/health

# Test frontend
curl http://localhost:3000
```

---

## 🔄 Integration Steps

### Phase 1: Backend Setup (COMPLETE ✅)

- [x] Spring Boot project structure
- [x] PostgreSQL database configuration
- [x] Docker Compose setup
- [x] Maven configuration with dependencies
- [x] Application configuration files
- [x] Security configuration (JWT)
- [x] CORS configuration
- [x] Base entity classes
- [x] Enumerations
- [x] Documentation

### Phase 2: Database Schema (NEXT)

- [ ] Create Flyway migration scripts
- [ ] User and Role tables
- [ ] Process tables
- [ ] Department tables
- [ ] Location tables
- [ ] Service tables
- [ ] BIA Record tables
- [ ] Impact Analysis tables
- [ ] Dependency tables
- [ ] Resource tables (BETH3V)
- [ ] BIA Template tables
- [ ] Audit Log tables
- [ ] Sample data insertion

### Phase 3: Backend Implementation (NEXT)

- [ ] Complete all entity classes
- [ ] Create repositories
- [ ] Implement services
- [ ] Build REST controllers
- [ ] Create DTOs and mappers
- [ ] Implement JWT authentication
- [ ] Add validation
- [ ] Write unit tests
- [ ] Write integration tests

### Phase 4: Frontend Integration (NEXT)

- [ ] Create API client service
- [ ] Replace mock data with real API calls
- [ ] Implement authentication flow
- [ ] Add JWT token management
- [ ] Update all services to use backend
- [ ] Add error handling
- [ ] Add loading states
- [ ] Test end-to-end workflows

### Phase 5: Advanced Features (FUTURE)

- [ ] File upload functionality
- [ ] Email notifications
- [ ] Audit trail visualization
- [ ] Advanced reporting
- [ ] Export to PDF/Excel
- [ ] Real-time updates (WebSocket)
- [ ] Multi-tenancy support

---

## 🗄️ Database Connection

### Development Database

**Connection Details:**
- Host: localhost
- Port: 5432
- Database: bcm_platform_dev
- Username: bcm_user
- Password: bcm_password

**Connection String:**
```
jdbc:postgresql://localhost:5432/bcm_platform_dev
```

### pgAdmin Access

- URL: http://localhost:5050
- Email: admin@bcm.com
- Password: admin

---

## 🔐 Authentication Flow

### 1. User Login (Backend)

```bash
POST /api/auth/login
{
  "username": "admin",
  "password": "admin123"
}

Response:
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "expiresIn": 86400
}
```

### 2. Store Token (Frontend)

```typescript
// Store in localStorage
localStorage.setItem('accessToken', response.accessToken);
localStorage.setItem('refreshToken', response.refreshToken);
```

### 3. Use Token in Requests (Frontend)

```typescript
// Add to axios interceptor
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

## 📡 API Endpoints Overview

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - Logout

### Processes
- `GET /api/processes` - List all
- `GET /api/processes/{id}` - Get one
- `POST /api/processes` - Create
- `PUT /api/processes/{id}` - Update
- `DELETE /api/processes/{id}` - Delete

### BIA Records
- `GET /api/bia-records` - List all
- `GET /api/bia-records/{id}` - Get one
- `POST /api/bia-records` - Create
- `PUT /api/bia-records/{id}` - Update
- `DELETE /api/bia-records/{id}` - Delete
- `POST /api/bia-records/{id}/submit` - Submit
- `POST /api/bia-records/{id}/approve` - Approve

### Departments, Locations, Services, Templates
- Similar CRUD operations for each

### Consolidation
- `GET /api/consolidation/overview` - Overview
- `GET /api/consolidation/criticality-matrix` - Matrix
- `GET /api/consolidation/rto-summary` - RTO summary

**Full documentation:** http://localhost:8080/api/swagger-ui.html

---

## 🛠️ Development Workflow

### Backend Development

1. **Create Entity**
   ```java
   @Entity
   @Table(name = "processes")
   public class Process extends BaseEntity {
       // fields, getters, setters
   }
   ```

2. **Create Repository**
   ```java
   public interface ProcessRepository extends JpaRepository<Process, Long> {
       // custom queries
   }
   ```

3. **Create Service**
   ```java
   @Service
   public class ProcessService {
       // business logic
   }
   ```

4. **Create Controller**
   ```java
   @RestController
   @RequestMapping("/api/processes")
   public class ProcessController {
       // REST endpoints
   }
   ```

5. **Add Migration**
   ```sql
   -- V2__create_processes.sql
   CREATE TABLE processes (...);
   ```

### Frontend Development

1. **Create API Service**
   ```typescript
   export const processService = {
     getAll: () => apiClient.get('/processes'),
     getById: (id) => apiClient.get(`/processes/${id}`),
     // ...
   };
   ```

2. **Use in Component**
   ```typescript
   const [processes, setProcesses] = useState([]);
   
   useEffect(() => {
     processService.getAll().then(setProcesses);
   }, []);
   ```

---

## 📊 Current Status

### ✅ Completed

1. **Frontend (React/Next.js)**
   - Complete UI implementation
   - All pages and components
   - Mock data services
   - BIA wizard with dynamic templates
   - Settings and configuration
   - Consolidation views

2. **Backend (Spring Boot)**
   - Project structure
   - Maven configuration
   - Database configuration
   - Docker Compose setup
   - Security configuration
   - CORS configuration
   - Base entities
   - Enumerations
   - Documentation

### 🔄 In Progress

1. **Database Schema**
   - Need to create Flyway migrations
   - Need to define all tables

2. **Backend Implementation**
   - Need to complete entities
   - Need to create repositories
   - Need to implement services
   - Need to build controllers

3. **Frontend Integration**
   - Need to replace mock data
   - Need to implement authentication
   - Need to connect to real API

---

## 🎯 Next Immediate Steps

### Step 1: Create Database Migrations

Create Flyway migration files in `bcm-backend/src/main/resources/db/migration/`:

1. `V1__create_users_and_roles.sql`
2. `V2__create_processes.sql`
3. `V3__create_departments.sql`
4. `V4__create_locations.sql`
5. `V5__create_services.sql`
6. `V6__create_bia_records.sql`
7. `V7__create_impact_analysis.sql`
8. `V8__create_dependencies.sql`
9. `V9__create_resources.sql`
10. `V10__create_bia_templates.sql`
11. `V11__insert_sample_data.sql`

### Step 2: Complete Backend Entities

Complete all entity classes in `bcm-backend/src/main/java/com/bcm/entity/`:

- User.java
- Role.java
- Department.java
- Location.java
- Service.java
- BiaRecord.java
- ImpactAnalysis.java
- ProcessDependency.java
- Resource.java
- SpofAnalysis.java
- BiaTemplate.java
- BiaTemplateField.java
- AuditLog.java

### Step 3: Implement Repositories

Create Spring Data JPA repositories for all entities.

### Step 4: Implement Services

Create service layer with business logic.

### Step 5: Build Controllers

Create REST controllers for all endpoints.

### Step 6: Test Backend

Test all endpoints using Swagger UI.

### Step 7: Integrate Frontend

Replace mock data with real API calls in the React frontend.

---

## 📚 Documentation

- **Backend README**: `bcm-backend/README.md`
- **Backend Setup Guide**: `bcm-backend/SETUP_GUIDE.md`
- **Backend Architecture**: `bcm-backend/BACKEND_ARCHITECTURE.md`
- **Frontend README**: `bia-module/README.md`
- **Navigation Fix**: `bia-module/NAVIGATION_FIX_SUMMARY.md`
- **Test Plan**: `bia-module/TEST_DYNAMIC_WIZARD.md`

---

## 🚀 Running the Full Stack

### Terminal 1: Backend
```bash
cd bcm-backend
docker-compose up -d
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

### Terminal 2: Frontend
```bash
cd bia-module
npm run dev
```

### Access Points
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080/api
- **Swagger UI**: http://localhost:8080/api/swagger-ui.html
- **pgAdmin**: http://localhost:5050

---

## ✅ Summary

**You now have:**

1. ✅ Complete React frontend with all UI components
2. ✅ Spring Boot backend structure ready
3. ✅ PostgreSQL database configured
4. ✅ Docker Compose for easy database setup
5. ✅ JWT authentication configured
6. ✅ CORS configured for frontend-backend communication
7. ✅ Comprehensive documentation
8. ✅ Development environment ready

**Next: Implement the database schema and complete the backend entities!**

---

**Full Stack Setup Complete! 🎉**

