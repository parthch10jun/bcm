# BCM Platform Backend - Complete Setup Guide

## 📋 Prerequisites Checklist

Before starting, ensure you have:

- [ ] Java 17 or higher installed
- [ ] Maven 3.8+ installed
- [ ] Docker and Docker Compose installed (for PostgreSQL)
- [ ] Git installed
- [ ] Your favorite IDE (IntelliJ IDEA, Eclipse, or VS Code)

### Verify Prerequisites

```bash
# Check Java version
java -version
# Should show: openjdk version "17.x.x" or higher

# Check Maven version
mvn -version
# Should show: Apache Maven 3.8.x or higher

# Check Docker version
docker --version
docker-compose --version
```

---

## 🚀 Step-by-Step Setup

### Step 1: Navigate to Backend Directory

```bash
cd bcm-backend
```

### Step 2: Start PostgreSQL Database

```bash
# Start PostgreSQL and pgAdmin using Docker Compose
docker-compose up -d

# Verify containers are running
docker-compose ps

# Expected output:
# NAME              STATUS    PORTS
# bcm-postgres      Up        0.0.0.0:5432->5432/tcp
# bcm-pgadmin       Up        0.0.0.0:5050->80/tcp
```

**Database Connection Details:**
- **Host**: localhost
- **Port**: 5432
- **Database**: bcm_platform_dev
- **Username**: bcm_user
- **Password**: bcm_password

**pgAdmin Access** (Optional GUI):
- **URL**: http://localhost:5050
- **Email**: admin@bcm.com
- **Password**: admin

### Step 3: Build the Project

```bash
# Clean and build the project
mvn clean install

# This will:
# 1. Download all dependencies
# 2. Compile the code
# 3. Run tests
# 4. Package the application

# If you want to skip tests (faster):
mvn clean install -DskipTests
```

### Step 4: Run the Application

```bash
# Run with development profile
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

**Expected Output:**
```
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::                (v3.2.1)

2024-01-15 10:30:00 - Starting BcmPlatformApplication
2024-01-15 10:30:02 - Started BcmPlatformApplication in 2.5 seconds
```

### Step 5: Verify Application is Running

```bash
# Test health endpoint
curl http://localhost:8080/api/health

# Expected response:
# {"status":"UP"}
```

### Step 6: Access Swagger UI

Open your browser and navigate to:
```
http://localhost:8080/api/swagger-ui.html
```

You should see the interactive API documentation.

---

## 🗄️ Database Setup Details

### Automatic Migration

Flyway will automatically create all database tables on first startup.

**Migration Files Location:**
```
src/main/resources/db/migration/
├── V1__create_users_and_roles.sql
├── V2__create_processes.sql
├── V3__create_departments.sql
├── V4__create_locations.sql
├── V5__create_services.sql
├── V6__create_bia_records.sql
├── V7__create_impact_analysis.sql
├── V8__create_dependencies.sql
├── V9__create_resources.sql
├── V10__create_bia_templates.sql
└── V11__insert_sample_data.sql
```

### Manual Database Access

**Using psql (Command Line):**
```bash
# Connect to database
docker exec -it bcm-postgres psql -U bcm_user -d bcm_platform_dev

# List tables
\dt

# Describe table
\d processes

# Run query
SELECT * FROM processes;

# Exit
\q
```

**Using pgAdmin (GUI):**
1. Open http://localhost:5050
2. Login with admin@bcm.com / admin
3. Add New Server:
   - Name: BCM Platform
   - Host: postgres (or host.docker.internal on Mac/Windows)
   - Port: 5432
   - Database: bcm_platform_dev
   - Username: bcm_user
   - Password: bcm_password

---

## 🔐 Initial User Setup

After the application starts, sample data will be created including:

**Default Admin User:**
- Username: `admin`
- Password: `admin123`
- Role: ADMIN

**Test Login:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

**Expected Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "expiresIn": 86400,
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@bcm.com",
    "firstName": "System",
    "lastName": "Administrator"
  }
}
```

---

## 🧪 Testing the API

### Using Swagger UI (Recommended)

1. Open http://localhost:8080/api/swagger-ui.html
2. Click "Authorize" button
3. Enter: `Bearer YOUR_ACCESS_TOKEN`
4. Try any endpoint

### Using cURL

```bash
# Get access token
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' \
  | jq -r '.accessToken')

# List processes
curl -X GET http://localhost:8080/api/processes \
  -H "Authorization: Bearer $TOKEN"

# Create a process
curl -X POST http://localhost:8080/api/processes \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "processId": "PROC-001",
    "name": "Customer Onboarding",
    "description": "Process for onboarding new customers",
    "owner": "John Doe",
    "ownerEmail": "john.doe@company.com",
    "status": "ACTIVE"
  }'
```

### Using Postman

1. Import the OpenAPI spec from: http://localhost:8080/api/api-docs
2. Create an environment with:
   - `baseUrl`: http://localhost:8080/api
   - `accessToken`: (get from login endpoint)
3. Add Authorization header: `Bearer {{accessToken}}`

---

## 🔄 Connecting React Frontend

### Update Frontend API Configuration

Edit `bia-module/src/services/api.ts`:

```typescript
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token to all requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired, redirect to login
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### Create API Service Functions

Create `bia-module/src/services/processService.ts`:

```typescript
import apiClient from './api';

export const processService = {
  getAll: async (params?: any) => {
    const response = await apiClient.get('/processes', { params });
    return response.data;
  },

  getById: async (id: number) => {
    const response = await apiClient.get(`/processes/${id}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await apiClient.post('/processes', data);
    return response.data;
  },

  update: async (id: number, data: any) => {
    const response = await apiClient.put(`/processes/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await apiClient.delete(`/processes/${id}`);
    return response.data;
  },
};
```

### Test Integration

```bash
# Start backend
cd bcm-backend
mvn spring-boot:run -Dspring-boot.run.profiles=dev

# In another terminal, start frontend
cd bia-module
npm run dev

# Both should be running:
# Backend: http://localhost:8080
# Frontend: http://localhost:3000
```

---

## 🛠️ Development Workflow

### Making Code Changes

1. **Edit code** in your IDE
2. **Spring Boot DevTools** will automatically restart the application
3. **Test changes** using Swagger UI or cURL
4. **Commit changes** to Git

### Adding New Endpoints

1. Create entity in `entity/`
2. Create repository in `repository/`
3. Create service in `service/`
4. Create controller in `controller/`
5. Create DTOs in `dto/`
6. Add database migration in `resources/db/migration/`

### Running Tests

```bash
# Run all tests
mvn test

# Run specific test class
mvn test -Dtest=ProcessServiceTest

# Run with coverage
mvn clean test jacoco:report

# View coverage report
open target/site/jacoco/index.html
```

---

## 🚨 Troubleshooting

### Problem: Port 8080 already in use

```bash
# Find process using port 8080
lsof -i :8080

# Kill the process
kill -9 <PID>

# Or change port in application.yml
server:
  port: 8081
```

### Problem: Database connection refused

```bash
# Check if PostgreSQL is running
docker-compose ps

# Restart PostgreSQL
docker-compose restart postgres

# View logs
docker-compose logs -f postgres

# Recreate containers
docker-compose down
docker-compose up -d
```

### Problem: Flyway migration errors

```bash
# Check migration status
mvn flyway:info

# Repair migration
mvn flyway:repair

# Clean and re-migrate (WARNING: Deletes all data)
mvn flyway:clean
mvn flyway:migrate
```

### Problem: Maven build fails

```bash
# Clean Maven cache
mvn clean

# Update dependencies
mvn dependency:purge-local-repository

# Rebuild
mvn clean install -U
```

### Problem: Out of memory

```bash
# Increase Maven memory
export MAVEN_OPTS="-Xmx1024m"

# Or add to pom.xml
<plugin>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-maven-plugin</artifactId>
  <configuration>
    <jvmArguments>-Xmx1024m</jvmArguments>
  </configuration>
</plugin>
```

---

## 📊 Monitoring and Logs

### View Application Logs

```bash
# Real-time logs
tail -f logs/bcm-platform.log

# Last 100 lines
tail -n 100 logs/bcm-platform.log

# Search logs
grep "ERROR" logs/bcm-platform.log
```

### Database Logs

```bash
# View PostgreSQL logs
docker-compose logs -f postgres

# Last 50 lines
docker-compose logs --tail=50 postgres
```

---

## 🎯 Next Steps

1. ✅ Backend is running
2. ✅ Database is set up
3. ✅ API is accessible
4. ⏭️ Connect React frontend
5. ⏭️ Implement authentication in frontend
6. ⏭️ Replace mock data with real API calls
7. ⏭️ Test end-to-end workflow

---

## 📚 Additional Resources

- **Swagger UI**: http://localhost:8080/api/swagger-ui.html
- **API Docs**: http://localhost:8080/api/api-docs
- **pgAdmin**: http://localhost:5050
- **Architecture**: See `BACKEND_ARCHITECTURE.md`
- **README**: See `README.md`

---

**Setup Complete! 🎉**

Your BCM Platform backend is now running and ready for development!

