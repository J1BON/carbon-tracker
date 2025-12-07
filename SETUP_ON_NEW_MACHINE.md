# 🚀 Setup Guide - Moving Project to New Laptop

Complete step-by-step guide to set up Carbon Tracker on a new laptop and run it on localhost.

---

## 📋 Prerequisites - Install These First

Before you start, install these on your new laptop:

### 1. **Docker Desktop** (Required)
- **Download**: [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)
- **Install**: Run the installer and follow the setup wizard
- **Verify**: Open PowerShell/Terminal and run:
  ```bash
  docker --version
  docker compose version
  ```
- **Start Docker Desktop**: Make sure Docker Desktop is running (you'll see a whale icon in system tray)

### 2. **Node.js** (Required for Frontend)
- **Download**: [https://nodejs.org/](https://nodejs.org/) - Get version 18.0.0 or higher
- **Install**: Run the installer
- **Verify**: Open PowerShell/Terminal and run:
  ```bash
  node --version
  npm --version
  ```

### 3. **Python** (Required for Backend)
- **Download**: [https://www.python.org/downloads/](https://www.python.org/downloads/) - Get version 3.11 or higher
- **Install**: Run the installer
- **IMPORTANT**: Check ✅ "Add Python to PATH" during installation
- **Verify**: Open PowerShell/Terminal and run:
  ```bash
  python --version
  pip --version
  ```

### 4. **Git** (Required to clone repository)
- **Download**: [https://git-scm.com/downloads](https://git-scm.com/downloads)
- **Install**: Run the installer with default settings
- **Verify**: Open PowerShell/Terminal and run:
  ```bash
  git --version
  ```

---

## 📦 Step 1: Get the Project Files

### Option A: Clone from Git Repository (Recommended)

```bash
# Open PowerShell/Terminal
# Navigate to where you want the project (e.g., Documents or Desktop)
cd C:\Users\YourName\Documents

# Clone the repository
git clone <your-repo-url>
# OR if you have SSH set up:
# git clone git@github.com:yourusername/carbon-tracker.git

# Navigate into the project
cd carbon-tracker
# (or whatever your project folder is named)
```

### Option B: Copy Project Folder

If you're copying from another computer:

1. Copy the entire project folder to your new laptop
2. Place it in a location like `C:\Users\YourName\Documents\carbon-tracker`
3. Open PowerShell/Terminal and navigate to it:
   ```bash
   cd C:\Users\YourName\Documents\carbon-tracker
   ```

---

## 🔧 Step 2: Initial Setup

### 2.1 Verify Project Structure

Make sure you have these folders:
- `api/` - Backend code
- `web/` - Frontend code
- `packages/shared-types/` - Shared TypeScript types
- `docker-compose.yml` - Docker configuration

### 2.2 Check Docker is Running

```bash
# Make sure Docker Desktop is running
docker ps
```

If you see an error, start Docker Desktop application.

---

## 🗄️ Step 3: Start Database Services

The project needs PostgreSQL and Redis databases. We'll run them in Docker:

```bash
# From project root directory
docker compose up -d postgres redis
```

**Wait 10-15 seconds** for services to start.

**Verify it's running:**
```bash
docker compose ps
```

You should see:
- `carbon-tracker-db` (postgres) - Running
- `carbon-tracker-redis` (redis) - Running

---

## 🐍 Step 4: Setup Backend (API)

### 4.1 Navigate to API Folder

```bash
cd api
```

### 4.2 Install Python Dependencies (First Time Only)

```bash
# Install all required packages
pip install -r requirements.txt
```

**This takes 2-5 minutes** - be patient! It downloads all Python packages needed.

**If you get errors:**
- Try: `python -m pip install -r requirements.txt`
- Make sure Python is in your PATH

### 4.3 Setup Database Tables (First Time Only)

```bash
# Run database migrations to create tables
alembic upgrade head
```

**What this does**: Creates all database tables needed for the application.

### 4.4 Start Backend Server

```bash
# Start the API server
uvicorn main:app --reload --port 8000
```

**You should see:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

**✅ Backend is now running!** Keep this terminal window open.

---

## ⚛️ Step 5: Setup Frontend (Web)

Open a **NEW** terminal/PowerShell window (keep the backend running in the first one).

### 5.1 Build Shared Types Package (First Time Only)

```bash
# From project root
cd packages/shared-types

# Install dependencies
npm install

# Build the package
npm run build
```

### 5.2 Setup Frontend

```bash
# Navigate to web folder
cd ../../web

# Install dependencies (first time only)
npm install

# This takes 2-3 minutes
```

### 5.3 Start Frontend Development Server

```bash
# Start the frontend
npm run dev
```

**You should see:**
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:3000/
```

**✅ Frontend is now running!**

---

## ✅ Step 6: Verify Everything is Working

### 6.1 Check Backend API

Open in browser: **http://localhost:8000/docs**

You should see the Swagger API documentation page.

**Or check health:**
Open: **http://localhost:8000/health**

You should see:
```json
{"status":"healthy","database":"connected","service":"carbon-tracker-api","version":"0.1.0"}
```

### 6.2 Check Frontend

Open in browser: **http://localhost:3000**

You should see the Carbon Tracker homepage/login page.

### 6.3 Check Database

```bash
# In a new terminal
docker compose ps
```

All services should show "Up" status.

---

## 🎉 Success! Your Project is Running

You now have:
- ✅ **Backend API**: http://localhost:8000
- ✅ **API Documentation**: http://localhost:8000/docs
- ✅ **Frontend**: http://localhost:3000
- ✅ **Database**: Running in Docker

---

## 📝 Quick Reference - Starting the Project Later

After the first setup, starting the project is much simpler:

### Start Database (if not running)
```bash
# From project root
docker compose up -d postgres redis
```

### Start Backend
```bash
# Terminal 1
cd api
uvicorn main:app --reload --port 8000
```

### Start Frontend
```bash
# Terminal 2
cd web
npm run dev
```

**That's it!** No need to install packages or run migrations again.

---

## 🛑 Stopping the Project

### Stop Backend
- In the backend terminal, press `Ctrl + C`

### Stop Frontend
- In the frontend terminal, press `Ctrl + C`

### Stop Database
```bash
# From project root
docker compose stop postgres redis
```

### Stop Everything
```bash
# From project root
docker compose down
```

---

## 🐛 Troubleshooting

### Problem: "docker is not recognized"
**Solution**: 
- Make sure Docker Desktop is installed and running
- Check system tray for Docker icon
- Restart your terminal

### Problem: "python is not recognized"
**Solution**:
- Python is not installed or not in PATH
- Reinstall Python and check ✅ "Add Python to PATH"
- Restart terminal after installation

### Problem: "pip is not recognized"
**Solution**:
```bash
python -m pip install -r requirements.txt
```

### Problem: "Port 8000 is already in use"
**Solution**:
```bash
# Find what's using the port (Windows)
netstat -ano | findstr :8000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F

# Or use a different port
uvicorn main:app --reload --port 8001
```

### Problem: "Port 3000 is already in use"
**Solution**:
```bash
# Find what's using the port (Windows)
netstat -ano | findstr :3000

# Kill the process
taskkill /PID <PID> /F

# Or change port in web/vite.config.ts
```

### Problem: "Database connection error"
**Solution**:
```bash
# Make sure database is running
docker compose ps

# If not running, start it
docker compose up -d postgres redis

# Wait 10 seconds, then restart backend
```

### Problem: "ModuleNotFoundError" in Python
**Solution**:
```bash
cd api
pip install -r requirements.txt
```

### Problem: "npm install" fails
**Solution**:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Try again
npm install
```

### Problem: Frontend can't connect to API
**Solution**:
1. Check backend is running: http://localhost:8000/health
2. Check `web/.env` or `web/.env.local` has:
   ```env
   VITE_API_URL=http://localhost:8000
   ```
3. Restart frontend after changing .env

---

## 📁 Project Structure Overview

```
carbon-tracker/
├── api/                    # Backend (Python/FastAPI)
│   ├── app/               # Application code
│   ├── alembic/           # Database migrations
│   ├── main.py            # Entry point
│   └── requirements.txt   # Python dependencies
│
├── web/                    # Frontend (React/TypeScript)
│   ├── src/               # Source code
│   ├── package.json       # Node dependencies
│   └── vite.config.ts     # Vite configuration
│
├── packages/
│   └── shared-types/      # Shared TypeScript types
│
└── docker-compose.yml     # Docker services configuration
```

---

## 🔐 Environment Variables (Optional)

### Backend Environment Variables

Create `api/.env` (optional - for custom configuration):

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/carbon_tracker
SECRET_KEY=your-secret-key-change-in-production
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

### Frontend Environment Variables

Create `web/.env.local` (optional):

```env
VITE_API_URL=http://localhost:8000
VITE_MAPBOX_TOKEN=your-mapbox-token-here
```

**Note**: These are optional. The project works with defaults from `docker-compose.yml`.

---

## 🎯 First Time Using the App

1. **Open**: http://localhost:3000
2. **Register**: Create a new account
3. **Login**: Use your credentials
4. **Explore**:
   - Dashboard - View your carbon footprint
   - Carbon Calculator - Log emissions
   - Leaderboard - See rankings
   - Tree Planting - Calculate tree impact

---

## 📚 Additional Resources

- **Full Documentation**: See `COMPLETE_DOCUMENTATION.md`
- **API Documentation**: http://localhost:8000/docs (when backend is running)
- **Architecture**: See `ARCHITECTURE.md`
- **How to Run**: See `HOW_TO_RUN.md` for more details

---

## ✅ Setup Checklist

Use this checklist to ensure everything is set up:

- [ ] Docker Desktop installed and running
- [ ] Node.js installed (v18+)
- [ ] Python installed (v3.11+)
- [ ] Git installed
- [ ] Project files copied/cloned
- [ ] Database services started (`docker compose up -d postgres redis`)
- [ ] Backend dependencies installed (`pip install -r requirements.txt`)
- [ ] Database migrations run (`alembic upgrade head`)
- [ ] Backend running (`uvicorn main:app --reload --port 8000`)
- [ ] Shared types built (`npm install && npm run build` in packages/shared-types)
- [ ] Frontend dependencies installed (`npm install` in web/)
- [ ] Frontend running (`npm run dev`)
- [ ] Backend accessible at http://localhost:8000/docs
- [ ] Frontend accessible at http://localhost:3000

---

## 🎓 Understanding the Setup

**What's running:**
- **PostgreSQL** (Docker): Database storing all data
- **Redis** (Docker): Cache for faster performance
- **Backend API** (Python): Handles all business logic
- **Frontend** (React): User interface

**Why Docker?**
- Easy database setup (no manual PostgreSQL installation)
- Consistent environment across machines
- Isolated services

**Why separate terminals?**
- Backend and frontend run independently
- You can see logs from each service
- Easy to restart one without affecting the other

---

## 🆘 Need Help?

1. **Check error messages** - They usually tell you what's wrong
2. **Verify prerequisites** - Make sure Docker, Node, Python are installed
3. **Check service status** - `docker compose ps` shows what's running
4. **Check logs** - `docker compose logs` shows error messages
5. **Restart services** - Sometimes a restart fixes issues

---

## 🎉 You're All Set!

Your Carbon Tracker project is now running on your new laptop!

**Remember:**
- Keep backend terminal open while developing
- Keep frontend terminal open while developing
- Database runs in background (Docker)
- Changes auto-reload (thanks to `--reload` flag)

**Happy coding! 🌱**

---

*Last updated: January 2025*

