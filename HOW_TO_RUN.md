# 🚀 How to Run Carbon Tracker

Complete guide to running the Carbon Tracker application locally.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Docker** & **Docker Compose** (v2.0+)
  - [Download Docker Desktop](https://www.docker.com/products/docker-desktop/)
  - Verify installation: `docker --version` and `docker compose version`

- **Node.js** >= 18.0.0 and **npm** >= 10.0.0
  - [Download Node.js](https://nodejs.org/)
  - Verify installation: `node --version` and `npm --version`

- **Python** >= 3.11 (for local development without Docker)
  - [Download Python](https://www.python.org/downloads/)
  - Verify installation: `python --version`

- **Git** (for cloning the repository)
  - [Download Git](https://git-scm.com/downloads)

---

## 🎯 Quick Start (Recommended)

### Option 1: Full Docker Setup (Easiest)

Run everything in Docker containers:

```bash
# 1. Clone the repository (if not already done)
git clone <your-repo-url>
cd carbon-footprint-tracker

# 2. Create .env file (optional - for custom configuration)
# Copy docker-compose.yml environment variables if needed

# 3. Start all services
docker compose up --build

# This will start:
# - PostgreSQL database (port 5432)
# - Redis cache (port 6379)
# - FastAPI backend (http://localhost:8000)
# - ML service (http://localhost:8001)
# - React frontend (http://localhost:3000)
```

**First-time setup:** The first run will:
- Download Docker images (~500MB)
- Create database tables automatically

**Access the application:**
- **Frontend**: http://localhost:3000
- **API Docs**: http://localhost:8000/docs
- **ML Health Check**: http://localhost:8001/health

---

### Option 2: Docker Backend + Local Frontend (For Development)

Use Docker for backend services, run frontend locally for hot-reload:

#### Step 1: Start Backend Services

```bash
# Start database, Redis, API, and ML service
docker compose up -d postgres redis api ml-service

# Wait for services to be healthy (about 30 seconds)
docker compose ps
```

#### Step 2: Run Database Migrations (First Time Only)

```bash
# Run migrations to create database tables
docker compose exec api alembic upgrade head
```

#### Step 3: Build Shared Types Package

```bash
# From project root
cd packages/shared-types
npm install
npm run build
```

#### Step 4: Start Frontend Locally

```bash
# From project root
cd web
npm install
npm run dev
```

The frontend will be available at http://localhost:3000 with hot-reload enabled.

---

### Option 3: Fully Local Development

Run everything locally without Docker (for advanced development):

#### Step 1: Start PostgreSQL and Redis (Docker)

```bash
# Start only database and cache
docker compose up -d postgres redis
```

#### Step 2: Setup Backend API

```bash
# Terminal 1: Backend API
cd api

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run database migrations
alembic upgrade head

# Start API server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### Step 3: Setup ML Service

```bash
# Terminal 2: ML Service
cd ml

# Use the same virtual environment or create new one
# Activate virtual environment (if using separate one)

# Install dependencies
pip install -r requirements.txt

# Start ML service
uvicorn main:app --reload --host 0.0.0.0 --port 8001
```

#### Step 4: Setup Frontend

```bash
# Terminal 3: Frontend
# From project root

# Build shared-types package
cd packages/shared-types
npm install
npm run build

# Start frontend
cd ../../web
npm install
npm run dev
```

---

## ✅ Verification Steps

After starting the services, verify everything is working:

### 1. Check Docker Services Status

```bash
docker compose ps
```

You should see all services running:
- `carbon-tracker-db` (postgres)
- `carbon-tracker-redis` (redis)
- `carbon-tracker-api` (api)
- `carbon-tracker-ml` (ml-service)
- `carbon-tracker-web` (web) - if using Option 1

### 2. Check API Health

```bash
curl http://localhost:8000/health
```

Expected response:
```json
{
  "status": "healthy",
  "database": "connected",
  "version": "0.1.0"
}
```

### 3. Check ML Service Health

```bash
curl http://localhost:8001/health
```

Expected response:
```json
{
  "status": "healthy",
  "model": {
    "type": "Heuristics Fallback",
    "loaded": true
  },
  "device": "cpu"
}
```

### 4. Check Frontend

Open http://localhost:3000 in your browser. You should see the login page.

### 5. Check API Documentation

Open http://localhost:8000/docs in your browser. You should see the Swagger UI.

---

## 🧪 First-Time Setup

### 1. Create an Account

1. Open http://localhost:3000
2. Click "Register" or navigate to registration
3. Fill in your details:
   - Name
   - Email
   - Password
4. Click "Register"

### 2. Explore Features

Once logged in, you can:

- **Dashboard**: View your carbon footprint statistics
- **Carbon Calculator**: Log your carbon emissions
- **Waste Scanner**: Upload images to identify waste types
- **Leaderboard**: See rankings and compete with others
- **Tree Planting**: Calculate tree planting impact
- **Onboarding**: Complete guided setup

---

## 🛑 Stopping Services

### Stop All Services (Docker)

```bash
# Stop all containers
docker compose down

# Stop and remove volumes (⚠️ This deletes all data)
docker compose down -v
```

### Stop Individual Services

```bash
# Stop specific service
docker compose stop api

# Restart specific service
docker compose restart api
```

### For Local Development

Press `Ctrl+C` in each terminal running a service.

---

## 🔧 Environment Variables

### Docker Compose Environment Variables

Create a `.env` file in the project root for custom configuration:

```env
# Database
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your-secure-password
POSTGRES_DB=carbon_tracker

# API
SECRET_KEY=your-secret-key-change-in-production
DATABASE_URL=postgresql://postgres:your-secure-password@postgres:5432/carbon_tracker

# ML Service
CONFIDENCE_THRESHOLD=0.7

# AWS S3 (optional - for image storage)
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_BUCKET_NAME=carbon-tracker-images
AWS_ENDPOINT_URL=https://s3.amazonaws.com

# Mapbox (optional - for maps integration)
MAPBOX_TOKEN=your-mapbox-token
```

### Frontend Environment Variables

Create `web/.env.local` for frontend configuration:

```env
VITE_API_URL=http://localhost:8000
VITE_ML_SERVICE_URL=http://localhost:8001
VITE_MAPBOX_TOKEN=your-mapbox-token
```

---

## 🐛 Troubleshooting

### Port Already in Use

**Error:** `Port 3000 is already in use` or similar

**Solution:**
```bash
# Find process using port (Linux/macOS)
lsof -ti:3000 | xargs kill -9

# Find process using port (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or change ports in docker-compose.yml
```

### Database Connection Error

**Error:** `Connection refused` or `database does not exist`

**Solution:**
```bash
# Check PostgreSQL is running
docker compose ps | grep postgres

# Check database logs
docker compose logs postgres

# Restart database
docker compose restart postgres

# Recreate database (⚠️ This deletes data)
docker compose down -v
docker compose up -d postgres
```

### Frontend Can't Connect to API

**Error:** `Network Error` or `CORS error`

**Solution:**
```bash
# Verify API is running
curl http://localhost:8000/health

# Check CORS settings in api/app/config.py
# Ensure VITE_API_URL in frontend matches API URL

# Check API logs
docker compose logs api
```

### ML Service Not Loading Model

**Error:** `Model not loaded` or timeout

**Solution:**
```bash
# Check ML service logs
docker compose logs ml-service

# Verify internet connection (model downloads from Hugging Face)
# Check disk space (~200MB needed for model)

# Restart ML service
docker compose restart ml-service
```

### Frontend Build Errors

**Error:** Module not found or build failures

**Solution:**
```bash
# Clean and reinstall
cd web
rm -rf node_modules package-lock.json
npm install

# Build shared-types first
cd ../packages/shared-types
npm install
npm run build

# Then build frontend
cd ../../web
npm run build
```

### Docker Permission Errors

**Error:** `Permission denied` on Linux/macOS

**Solution:**
```bash
# Add user to docker group (Linux)
sudo usermod -aG docker $USER
newgrp docker

# Restart Docker Desktop (macOS/Windows)
```

### Database Migration Errors

**Error:** `alembic` command not found or migration errors

**Solution:**
```bash
# Run migrations inside Docker container
docker compose exec api alembic upgrade head

# Or install alembic locally
pip install alembic
cd api
alembic upgrade head
```

---

## 📊 Service URLs & Ports

| Service | URL | Port | Description |
|---------|-----|------|-------------|
| Frontend | http://localhost:3000 | 3000 | React web application |
| API | http://localhost:8000 | 8000 | FastAPI backend |
| API Docs | http://localhost:8000/docs | 8000 | Swagger documentation |
| ML Service | http://localhost:8001 | 8001 | ML inference service |
| ML Health | http://localhost:8001/health | 8001 | ML service health check |
| PostgreSQL | localhost:5432 | 5432 | Database (internal) |
| Redis | localhost:6379 | 6379 | Cache (internal) |

---

## 🚀 Development Workflow

### Hot Reload

- **Frontend**: Automatically reloads on file changes (Vite)
- **Backend**: Automatically reloads on file changes (uvicorn --reload)
- **Docker**: Use volume mounts for live code updates

### Viewing Logs

```bash
# View all logs
docker compose logs -f

# View specific service logs
docker compose logs -f api
docker compose logs -f ml-service

# View last 100 lines
docker compose logs --tail=100 api
```

### Database Management

```bash
# Connect to database
docker compose exec postgres psql -U postgres -d carbon_tracker

# Run SQL queries
docker compose exec postgres psql -U postgres -d carbon_tracker -c "SELECT * FROM users;"

# Backup database
docker compose exec postgres pg_dump -U postgres carbon_tracker > backup.sql

# Restore database
docker compose exec -T postgres psql -U postgres -d carbon_tracker < backup.sql
```

---

## 📝 Next Steps

After successfully running the application:

1. **Read the Documentation**:
   - `README.md` - Project overview
   - `ARCHITECTURE.md` - System architecture
   - `PROJECT_STATUS.md` - Feature status

2. **Explore the API**:
   - Visit http://localhost:8000/docs
   - Try out endpoints interactively

3. **Test Features**:
   - Register and login
   - Track carbon emissions
   - Scan waste images
   - View leaderboard

4. **Development**:
   - Check `CONTRIBUTING.md` for development guidelines
   - Review code structure
   - Run tests (when available)

---

## 🆘 Need Help?

- **Documentation**: See `README.md` for comprehensive docs
- **Quick Start**: See `QUICKSTART.md` for 5-minute setup
- **Issues**: Check existing GitHub issues or create new one
- **API Docs**: Visit http://localhost:8000/docs for API reference

---

**Happy coding! 🌱**

*Last updated: Check git history for latest changes*

