# 🔧 Backend Troubleshooting Guide

**Step-by-step help to get your backend running**

---

## 🎯 Quick Diagnosis

Let's find out what's wrong. Run these commands and tell me what you see:

### Step 1: Check Python
```bash
python --version
```
**What should happen**: Shows Python version (like `Python 3.11.0`)

**If error**: Python not installed or not in PATH

### Step 2: Check if you're in the right folder
```bash
cd
```
Then:
```bash
cd C:\Projects\root\api
```
Check if you see files like `main.py` and `requirements.txt`:
```bash
dir
```

### Step 3: Check if database is running
```bash
docker compose ps
```
**What should happen**: Shows postgres and redis running

**If error**: Database not started

---

## 🚀 Complete Setup from Scratch

Follow these steps **in order**:

### Step 1: Open PowerShell/Terminal
- Press `Win + R`
- Type `powershell`
- Press Enter

### Step 2: Go to Project Root
```bash
cd C:\Projects\root
```

### Step 3: Start Database
```bash
docker compose up -d postgres redis
```

**Wait 10-15 seconds**, then check:
```bash
docker compose ps
```

You should see `postgres` and `redis` with status "Up"

### Step 4: Go to API Folder
```bash
cd api
```

### Step 5: Check Python Works
```bash
python --version
```

**If this works**, continue to Step 6.

**If this doesn't work**, try:
```bash
py --version
```

**If neither works**, you need to install Python (see below).

### Step 6: Install Packages
```bash
python -m pip install -r requirements.txt
```

**OR if python doesn't work:**
```bash
py -m pip install -r requirements.txt
```

**This takes 2-5 minutes** - be patient!

### Step 7: Setup Database Tables
```bash
alembic upgrade head
```

**OR if python doesn't work:**
```bash
py -m alembic upgrade head
```

### Step 8: Start Backend
```bash
uvicorn main:app --reload --port 8000
```

**OR if python doesn't work:**
```bash
py -m uvicorn main:app --reload --port 8000
```

---

## ❌ Common Problems & Fixes

### Problem 1: "python is not recognized"

**Fix**: Install Python or add to PATH

**Option A: Install Python**
1. Go to: https://www.python.org/downloads/
2. Download Python 3.11 or newer
3. **IMPORTANT**: During installation, check ✅ "Add Python to PATH"
4. Click "Install Now"
5. **Restart PowerShell** after installation
6. Try again

**Option B: Use Python Launcher**
```bash
py -m pip install -r requirements.txt
py -m alembic upgrade head
py -m uvicorn main:app --reload --port 8000
```

### Problem 2: "docker is not recognized"

**Fix**: Docker Desktop not running

1. Open Docker Desktop application
2. Wait for it to fully start (whale icon in system tray)
3. Try again:
```bash
docker compose up -d postgres redis
```

### Problem 3: "ModuleNotFoundError" or "No module named 'fastapi'"

**Fix**: Packages not installed

```bash
cd C:\Projects\root\api
python -m pip install -r requirements.txt
```

**OR:**
```bash
py -m pip install -r requirements.txt
```

### Problem 4: "Connection refused" or "database does not exist"

**Fix**: Database not running

```bash
# Go to project root
cd C:\Projects\root

# Start database
docker compose up -d postgres redis

# Wait 15 seconds

# Check if running
docker compose ps

# Should show postgres and redis as "Up"
```

### Problem 5: "alembic: command not found"

**Fix**: Use python -m alembic

```bash
python -m alembic upgrade head
```

**OR:**
```bash
py -m alembic upgrade head
```

### Problem 6: "Port 8000 is already in use"

**Fix**: Use different port or kill process

**Option A: Use different port**
```bash
uvicorn main:app --reload --port 8001
```
Then access: http://localhost:8001

**Option B: Kill process using port 8000**
```bash
# Find process
netstat -ano | findstr :8000

# Kill it (replace <PID> with number from above)
taskkill /PID <PID> /F
```

### Problem 7: "psycopg2-binary" installation fails

**Fix**: Upgrade pip first

```bash
python -m pip install --upgrade pip
python -m pip install --only-binary :all: psycopg2-binary
python -m pip install -r requirements.txt
```

### Problem 8: "Cannot connect to database"

**Fix**: Check database is running and wait

```bash
# Check database status
docker compose ps

# If not running, start it
docker compose up -d postgres redis

# Wait 15-20 seconds for database to fully start

# Try again
```

---

## 🔍 Detailed Error Diagnosis

### Copy the exact error message and check:

**Error contains "not recognized"**:
- Python/pip not in PATH → Use `python -m pip` or install Python

**Error contains "Connection refused"**:
- Database not running → Start with `docker compose up -d postgres redis`

**Error contains "ModuleNotFoundError"**:
- Packages not installed → Run `python -m pip install -r requirements.txt`

**Error contains "port" or "address already in use"**:
- Port 8000 busy → Use `--port 8001` or kill the process

**Error contains "database" or "postgres"**:
- Database issue → Check Docker is running, wait 15 seconds after starting

---

## ✅ Step-by-Step Checklist

Go through this checklist:

- [ ] **Docker Desktop is running** (check system tray)
- [ ] **Python is installed** (`python --version` works)
- [ ] **In correct folder** (`cd C:\Projects\root\api`)
- [ ] **Database is running** (`docker compose ps` shows postgres and redis)
- [ ] **Packages installed** (`python -m pip install -r requirements.txt` completed)
- [ ] **Database tables created** (`alembic upgrade head` completed)
- [ ] **No other process on port 8000**

---

## 🎯 One-Command Test

Try this complete sequence:

```bash
# 1. Go to project root
cd C:\Projects\root

# 2. Start database
docker compose up -d postgres redis

# 3. Wait 15 seconds (important!)

# 4. Go to api folder
cd api

# 5. Install packages (if not done)
python -m pip install -r requirements.txt

# 6. Setup database
python -m alembic upgrade head

# 7. Start backend
python -m uvicorn main:app --reload --port 8000
```

**OR if `python` doesn't work, use `py` instead:**

```bash
cd C:\Projects\root
docker compose up -d postgres redis
# Wait 15 seconds
cd api
py -m pip install -r requirements.txt
py -m alembic upgrade head
py -m uvicorn main:app --reload --port 8000
```

---

## 📝 What Success Looks Like

When backend starts successfully, you'll see:

```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [xxxxx]
INFO:     Started server process [xxxxx]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

**Then test it:**
- Open browser: http://localhost:8000/docs
- Should see API documentation page

---

## 🆘 Still Not Working?

**Tell me:**
1. What exact error message do you see?
2. What command were you running?
3. What folder are you in? (`cd` shows current folder)
4. Does `python --version` work?
5. Does `docker compose ps` show postgres running?

**Or try this diagnostic script:**

```bash
# Run these and tell me the results:

echo "=== Python Check ==="
python --version
py --version

echo "=== Docker Check ==="
docker --version
docker compose ps

echo "=== Current Folder ==="
cd

echo "=== Files in api folder ==="
cd C:\Projects\root\api
dir
```

---

## 💡 Pro Tips

1. **Always start database first** - Wait 15 seconds after starting
2. **Use `python -m pip`** instead of just `pip` on Windows
3. **Check Docker is running** before starting database
4. **One terminal for backend** - Keep it running, use another terminal for other commands
5. **Read error messages** - They usually tell you what's wrong

---

**Share the exact error message you're seeing and I'll help you fix it!** 🚀

