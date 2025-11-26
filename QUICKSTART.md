# 🚀 Quick Start Guide

Get Carbon Tracker up and running in 5 minutes!

## Prerequisites

- **Docker** & Docker Compose installed
- **Node.js** >= 18.0.0 (for local dev without Docker)

## Option 1: Docker Compose (Recommended)

```bash
# 1. Clone and navigate
git clone <your-repo-url>
cd carbon-footprint-tracker

# 2. Create environment file (optional)
# See docker-compose.yml for environment variables

# 3. Start all services
docker-compose up --build

# 4. Access the app
# Frontend: http://localhost:3000
# API Docs: http://localhost:8000/docs
# ML Health: http://localhost:8001/health
```

That's it! All services are now running in Docker containers.

## Option 2: Local Development

See `HOW_TO_RUN.md` for detailed manual setup instructions.

**Quick Steps:**

1. **Start Database & Redis** (Docker):
```bash
docker compose up postgres redis -d
```

2. **Backend API** (Terminal 1):
```bash
cd api
pip install -r requirements.txt
uvicorn main:app --reload
```

3. **ML Service** (Terminal 2):
```bash
cd ml
pip install -r requirements.txt
uvicorn main:app --reload --port 8001
```

4. **Frontend** (Terminal 3):
```bash
# Build shared-types first
cd packages/shared-types
npm install && npm run build

# Then start frontend
cd ../../web
npm install
npm run dev
```

5. **Run Migrations** (First time only):
```bash
cd api
alembic upgrade head
```

## First Steps

1. **Open the app**: http://localhost:3000
2. **Check API**: http://localhost:8000/docs
3. **Explore features**:
   - Dashboard with carbon tracking
   - Waste scanner with ML recognition
   - Leaderboard & gamification
   - Onboarding flow

## Common Issues

### Port already in use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or change ports in docker-compose.yml
```

### Database connection error
```bash
# Check PostgreSQL is running
docker ps | grep postgres

# Or restart the database
docker-compose restart postgres
```

### Frontend can't connect to API
```bash
# Check API is running
curl http://localhost:8000/health

# Check CORS settings in api/app/config.py
```

## Next Steps

- See `README.md` for full documentation
- Check `HOW_TO_RUN.md` for detailed manual setup
- Review `PROJECT_STATUS.md` for current features
- Check `http://localhost:8000/docs` for API reference
- Review `CONTRIBUTING.md` for development guidelines

## Need Help?

- See `README.md` for comprehensive documentation
- Check `HOW_TO_RUN.md` for troubleshooting
- Review `PROJECT_STATUS.md` for feature status
- Open an issue on GitHub
- Check API docs at `http://localhost:8000/docs`

Happy coding! 🌱

