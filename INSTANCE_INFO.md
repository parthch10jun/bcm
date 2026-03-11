# BCM Platform - Demo Instance

## Instance Type
**Development/Experimental Instance**

## Purpose
This is the development and experimental instance of the BCM Platform. Use this instance for:
- New feature development
- Experimental changes
- Testing breaking changes
- Learning and exploration
- Client demos with custom data

## Git Repository
- **Location**: `/Users/parthc/Documents/demo-instance`
- **Initialized**: Yes
- **Branch**: main

## Running the Application

### Backend (Port 8081)
```bash
cd bcm-backend
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=h2 --server.port=8081"
```

### Frontend (Port 3001)
```bash
cd bia-module
PORT=3001 npm run dev
```

## Access URLs
- Frontend: http://localhost:3001
- Backend API: http://localhost:8081
- H2 Console: http://localhost:8081/h2-console

## Database
- Type: H2 In-Memory Database
- All dummy data loaded via Flyway migrations
- Data resets on application restart

## Development Workflow
1. Make experimental changes here first
2. Test thoroughly
3. If successful, port changes to main instance
4. Commit frequently to track experiments

## Notes
- Feel free to break things here
- This is your sandbox for development
- Can run simultaneously with main instance on different ports
