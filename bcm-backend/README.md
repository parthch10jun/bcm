# BCM Platform - Backend API

Business Continuity Management Platform - Spring Boot Backend with PostgreSQL

## 🏗️ Technology Stack

- **Framework**: Spring Boot 3.2.1
- **Language**: Java 17 (JVM)
- **Database**: PostgreSQL 15+
- **ORM**: Spring Data JPA / Hibernate
- **Security**: Spring Security + JWT
- **API Documentation**: SpringDoc OpenAPI (Swagger)
- **Build Tool**: Maven
- **Database Migration**: Flyway

## 📋 Prerequisites

- Java 17 or higher
- Maven 3.8+
- PostgreSQL 15+ (or Docker)
- Git

## 🚀 Quick Start

### 1. Clone the Repository

```bash
cd bcm-backend
```

### 2. Start PostgreSQL (Using Docker)

```bash
# Start PostgreSQL and pgAdmin
docker-compose up -d

# Check if containers are running
docker-compose ps

# View logs
docker-compose logs -f postgres
```

**Database Credentials:**
- Host: `localhost`
- Port: `5432`
- Database: `bcm_platform_dev`
- Username: `bcm_user`
- Password: `bcm_password`

**pgAdmin Access:**
- URL: `http://localhost:5050`
- Email: `admin@bcm.com`
- Password: `admin`

### 3. Build the Project

```bash
# Clean and build
mvn clean install

# Skip tests (faster)
mvn clean install -DskipTests
```

### 4. Run the Application

```bash
# Run with dev profile
mvn spring-boot:run -Dspring-boot.run.profiles=dev

# Or run the JAR directly
java -jar target/bcm-platform-1.0.0-SNAPSHOT.jar --spring.profiles.active=dev
```

### 5. Access the Application

- **API Base URL**: `http://localhost:8080/api`
- **Swagger UI**: `http://localhost:8080/api/swagger-ui.html`
- **API Docs**: `http://localhost:8080/api/api-docs`
- **Health Check**: `http://localhost:8080/api/health`

## 📁 Project Structure

```
bcm-backend/
├── src/main/java/com/bcm/
│   ├── BcmPlatformApplication.java      # Main application
│   ├── config/                          # Configuration classes
│   ├── entity/                          # JPA entities
│   ├── dto/                             # Data Transfer Objects
│   ├── repository/                      # Spring Data repositories
│   ├── service/                         # Business logic
│   ├── controller/                      # REST controllers
│   ├── mapper/                          # MapStruct mappers
│   ├── security/                        # Security components
│   ├── enums/                           # Enumerations
│   ├── exception/                       # Exception handling
│   └── util/                            # Utilities
├── src/main/resources/
│   ├── application.yml                  # Main config
│   ├── application-dev.yml              # Dev config
│   ├── application-prod.yml             # Prod config
│   └── db/migration/                    # Flyway migrations
├── src/test/                            # Tests
├── pom.xml                              # Maven config
└── docker-compose.yml                   # Docker setup
```

## 🗄️ Database Setup

### Option 1: Docker (Recommended)

```bash
docker-compose up -d
```

### Option 2: Local PostgreSQL

```bash
# Create database
createdb bcm_platform_dev

# Create user
psql -c "CREATE USER bcm_user WITH PASSWORD 'bcm_password';"

# Grant privileges
psql -c "GRANT ALL PRIVILEGES ON DATABASE bcm_platform_dev TO bcm_user;"
```

### Database Migrations

Flyway will automatically run migrations on application startup.

```bash
# Check migration status
mvn flyway:info

# Run migrations manually
mvn flyway:migrate

# Clean database (WARNING: Deletes all data)
mvn flyway:clean
```

## 🔐 Authentication

### JWT Token Authentication

The API uses JWT tokens for authentication.

**Login:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "expiresIn": 86400
}
```

**Use Token in Requests:**
```bash
curl -X GET http://localhost:8080/api/processes \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - Logout

### Processes
- `GET /api/processes` - List processes
- `GET /api/processes/{id}` - Get process
- `POST /api/processes` - Create process
- `PUT /api/processes/{id}` - Update process
- `DELETE /api/processes/{id}` - Delete process

### BIA Records
- `GET /api/bia-records` - List BIA records
- `GET /api/bia-records/{id}` - Get BIA record
- `POST /api/bia-records` - Create BIA record
- `PUT /api/bia-records/{id}` - Update BIA record
- `DELETE /api/bia-records/{id}` - Delete BIA record
- `POST /api/bia-records/{id}/submit` - Submit for review
- `POST /api/bia-records/{id}/approve` - Approve BIA

### Departments
- `GET /api/departments` - List departments
- `GET /api/departments/{id}` - Get department
- `POST /api/departments` - Create department
- `PUT /api/departments/{id}` - Update department
- `GET /api/departments/tree` - Get org tree

### Locations
- `GET /api/locations` - List locations
- `GET /api/locations/{id}` - Get location
- `POST /api/locations` - Create location
- `PUT /api/locations/{id}` - Update location

### Services
- `GET /api/services` - List services
- `GET /api/services/{id}` - Get service
- `POST /api/services` - Create service
- `PUT /api/services/{id}` - Update service

### BIA Templates
- `GET /api/bia-templates` - List templates
- `GET /api/bia-templates/{id}` - Get template
- `POST /api/bia-templates` - Create template
- `PUT /api/bia-templates/{id}` - Update template
- `POST /api/bia-templates/{id}/set-default` - Set default

### Consolidation
- `GET /api/consolidation/overview` - BIA overview
- `GET /api/consolidation/criticality-matrix` - Criticality matrix
- `GET /api/consolidation/rto-summary` - RTO summary

**Full API documentation available at Swagger UI**

## 🧪 Testing

```bash
# Run all tests
mvn test

# Run specific test
mvn test -Dtest=ProcessServiceTest

# Run with coverage
mvn clean test jacoco:report

# View coverage report
open target/site/jacoco/index.html
```

## 🔧 Configuration

### Environment Variables

```bash
# Database
export DATABASE_URL=jdbc:postgresql://localhost:5432/bcm_platform_dev
export DATABASE_USERNAME=bcm_user
export DATABASE_PASSWORD=bcm_password

# JWT
export JWT_SECRET=your-secret-key-here

# Email (optional)
export EMAIL_USERNAME=your-email@gmail.com
export EMAIL_PASSWORD=your-app-password
```

### Application Profiles

- **dev**: Development environment (default)
- **prod**: Production environment
- **test**: Testing environment

```bash
# Run with specific profile
mvn spring-boot:run -Dspring-boot.run.profiles=prod
```

## 📦 Building for Production

```bash
# Build production JAR
mvn clean package -Pprod

# Run production build
java -jar target/bcm-platform-1.0.0-SNAPSHOT.jar --spring.profiles.active=prod
```

## 🐳 Docker Deployment

```bash
# Build Docker image
docker build -t bcm-platform-backend .

# Run container
docker run -p 8080:8080 \
  -e SPRING_PROFILES_ACTIVE=prod \
  -e DATABASE_URL=jdbc:postgresql://host.docker.internal:5432/bcm_platform \
  -e DATABASE_USERNAME=bcm_user \
  -e DATABASE_PASSWORD=bcm_password \
  -e JWT_SECRET=your-secret-key \
  bcm-platform-backend
```

## 🔄 Integration with React Frontend

### Frontend Configuration

Update `bia-module/src/services/api.ts`:

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### CORS Configuration

Already configured to allow `http://localhost:3000` (React dev server).

Update `application.yml` for production:

```yaml
cors:
  allowed-origins: https://your-production-domain.com
```

## 📊 Database Schema

See `BACKEND_ARCHITECTURE.md` for complete database schema documentation.

## 🛠️ Development Tools

### Hot Reload

Spring Boot DevTools is included for automatic restart on code changes.

### Database GUI

Access pgAdmin at `http://localhost:5050` to manage the database visually.

### API Testing

Use Swagger UI at `http://localhost:8080/api/swagger-ui.html` for interactive API testing.

## 📝 Logging

Logs are written to:
- Console (stdout)
- File: `logs/bcm-platform.log`

Configure logging in `application.yml`:

```yaml
logging:
  level:
    root: INFO
    com.bcm: DEBUG
```

## 🚨 Troubleshooting

### Port Already in Use

```bash
# Find process using port 8080
lsof -i :8080

# Kill the process
kill -9 <PID>
```

### Database Connection Issues

```bash
# Check if PostgreSQL is running
docker-compose ps

# Restart PostgreSQL
docker-compose restart postgres

# View PostgreSQL logs
docker-compose logs postgres
```

### Build Failures

```bash
# Clean Maven cache
mvn clean

# Update dependencies
mvn dependency:purge-local-repository

# Rebuild
mvn clean install
```

## 📚 Additional Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Data JPA](https://spring.io/projects/spring-data-jpa)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Flyway Documentation](https://flywaydb.org/documentation/)
- [JWT.io](https://jwt.io/)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Write tests
4. Submit a pull request

## 📄 License

Proprietary - All rights reserved

---

**Backend is ready for development!** 🎉

For detailed architecture documentation, see `BACKEND_ARCHITECTURE.md`.

