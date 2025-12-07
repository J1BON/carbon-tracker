# 🚀 Quick Backend Setup Guide

**How to run the backend API on localhost**

---

## ⚡ Quick Start (3 Steps)

### Step 1: Start Database (Docker)

```bash
# From project root
docker compose up -d postgres redis
```

This starts PostgreSQL and Redis in the background.

### Step 2: Navigate to API Folder

```bash
cd api
```

### Step 3: Run Backend

**Option A: With Virtual Environment (Recommended)**

```bash
# Create virtual environment (first time only)
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies (first time only)
pip install -r requirements.txt

# Run database migrations (first time only)
alembic upgrade head

# Start the server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Option B: Without Virtual Environment (Quick Test)**

```bash
# Install dependencies (first time only)
pip install -r requirements.txt

# Run database migrations (first time only)
alembic upgrade head

# Start the server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

---

## ✅ Verify It's Working

### 1. Check Server Output

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

### 2. Test Health Endpoint

Open in browser or use curl:
- **Browser**: http://localhost:8000/health
- **Command**: `curl http://localhost:8000/health`

Expected response:
```json
{
  "status": "healthy",
  "database": "connected",
  "version": "0.1.0"
}
```

### 3. Check API Documentation

Open in browser:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

---

## 🔧 Environment Variables

Create `api/.env` file (if not exists):

```env
# Database Connection
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/carbon_tracker

# Secret Key (generate a random string)
SECRET_KEY=your-secret-key-change-this-in-production

# CORS Settings
CORS_ORIGINS=http://localhost:3000,http://localhost:5173

# Port (optional, defaults to 8000)
PORT=8000
```

**Note**: If you don't create `.env`, it will use default values from `docker-compose.yml`.

---

## 🐛 Troubleshooting

### Problem: "ModuleNotFoundError: No module named 'fastapi'"

**Solution:**
```bash
cd api
pip install -r requirements.txt
```

### Problem: "Connection refused" or "database does not exist"

**Solution:**
```bash
# Make sure database is running
docker compose ps

# If not running, start it
docker compose up -d postgres redis

# Wait 10 seconds, then try again
```

### Problem: "alembic: command not found"

**Solution:**
```bash
# Install alembic
pip install alembic

# Or install all requirements
pip install -r requirements.txt
```

### Problem: "Port 8000 is already in use"

**Solution:**
```bash
# Windows: Find and kill process
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Mac/Linux: Find and kill process
lsof -ti:8000 | xargs kill -9

# Or use different port
uvicorn main:app --reload --port 8001
```

### Problem: "pip is not recognized"

**Solution:**
```bash
# Use python -m pip instead
python -m pip install -r requirements.txt

# Or on Windows, try:
py -m pip install -r requirements.txt
```

### Problem: "psycopg2-binary installation fails"

**Solution:**
```bash
# Upgrade pip first
python -m pip install --upgrade pip

# Install with wheel-only flag
python -m pip install --only-binary :all: psycopg2-binary

# Then install rest
python -m pip install -r requirements.txt
```

---

## 📝 Common Commands

### Start Backend
```bash
cd api
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Stop Backend
Press `Ctrl+C` in the terminal

### Run Migrations
```bash
cd api
alembic upgrade head
```

### Check Database Connection
```bash
# From project root
docker compose exec postgres psql -U postgres -d carbon_tracker -c "SELECT 1;"
```

### View Backend Logs
Logs appear in the terminal where you ran `uvicorn`

### Restart Backend
1. Press `Ctrl+C` to stop
2. Run `uvicorn` command again

---

## 🎯 What Each Command Does

- `uvicorn main:app` - Runs the FastAPI application
- `--reload` - Auto-reloads when code changes (development mode)
- `--host 0.0.0.0` - Makes server accessible from network
- `--port 8000` - Runs on port 8000

---

## 🔗 URLs

Once running, access:
- **API**: http://localhost:8000
- **Health Check**: http://localhost:8000/health
- **API Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

---

## 💡 Tips

1. **Keep terminal open**: The server runs in the terminal
2. **Auto-reload**: With `--reload`, changes auto-restart server
3. **Check logs**: Errors appear in the terminal
4. **Database first**: Always start database before backend
5. **Virtual environment**: Recommended to avoid dependency conflicts

---

## 🆘 Still Having Issues?

1. Check `HOW_TO_RUN.md` for detailed instructions
2. Verify Python version: `python --version` (should be 3.11+)
3. Verify database is running: `docker compose ps`
4. Check `api/.env` file exists and has correct values
5. Review error messages in terminal

---

**That's it! Your backend should now be running on http://localhost:8000** 🎉

