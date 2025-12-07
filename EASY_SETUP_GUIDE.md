# 🎯 Easy Setup Guide - Step by Step

**Super simple guide to get your project running - no technical jargon!**

---

## 🚀 Running the Backend (Easiest Way)

### What You Need First:
- ✅ Python installed (check: `python --version`)
- ✅ Docker Desktop running
- ✅ Terminal/PowerShell open

---

## Step-by-Step Instructions

### Step 1: Open Terminal/PowerShell
- **Windows**: Press `Win + R`, type `powershell`, press Enter
- **Mac**: Press `Cmd + Space`, type `terminal`, press Enter
- **Linux**: Press `Ctrl + Alt + T`

### Step 2: Go to Your Project Folder
```bash
cd C:\Projects\root
```
*(Replace with your actual project path)*

### Step 3: Start the Database
```bash
docker compose up -d postgres redis
```

**Wait 10 seconds** for it to start.

**What this does**: Starts the database (where data is stored)

### Step 4: Go to the API Folder
```bash
cd api
```

### Step 5: Install Python Packages (First Time Only)
```bash
pip install -r requirements.txt
```

**This takes 2-5 minutes** - be patient!

**What this does**: Downloads all the tools your backend needs

### Step 6: Setup Database Tables (First Time Only)
```bash
alembic upgrade head
```

**What this does**: Creates the database tables

### Step 7: Start the Backend Server
```bash
uvicorn main:app --reload --port 8000
```

**You should see:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

**✅ Success!** Your backend is now running!

---

## 🎉 How to Check It's Working

### Option 1: Open in Browser
Go to: **http://localhost:8000/docs**

You should see a page with "Swagger UI" and lots of API endpoints.

### Option 2: Health Check
Go to: **http://localhost:8000/health**

You should see:
```json
{"status": "healthy", "database": "connected"}
```

---

## 🛑 How to Stop the Backend

In the terminal where it's running:
- Press `Ctrl + C`
- Type `Y` if asked
- Press Enter

---

## 🔄 How to Start It Again Later

Just repeat **Step 7**:
```bash
cd api
uvicorn main:app --reload --port 8000
```

*(You don't need to install packages or setup database again)*

---

## ❌ Common Problems & Easy Fixes

### Problem 1: "python is not recognized"
**Fix**: Python is not installed or not in PATH
- Download Python from python.org
- **Important**: Check ✅ "Add Python to PATH" during installation
- Restart terminal

### Problem 2: "pip is not recognized"
**Fix**: Use this instead:
```bash
python -m pip install -r requirements.txt
```

### Problem 3: "docker is not recognized"
**Fix**: Docker Desktop is not running
- Open Docker Desktop app
- Wait for it to start (whale icon in system tray)
- Try again

### Problem 4: "Port 8000 is already in use"
**Fix**: Something else is using port 8000
- Use a different port:
```bash
uvicorn main:app --reload --port 8001
```
- Then access: http://localhost:8001

### Problem 5: "ModuleNotFoundError"
**Fix**: Packages not installed
```bash
cd api
pip install -r requirements.txt
```

### Problem 6: "Connection refused" or "database error"
**Fix**: Database not running
```bash
# Go back to project root
cd ..
# Start database
docker compose up -d postgres redis
# Wait 10 seconds
# Go back to api folder
cd api
# Try starting backend again
uvicorn main:app --reload --port 8000
```

---

## 📋 Quick Command Cheat Sheet

### Start Everything (First Time)
```bash
# 1. Start database
docker compose up -d postgres redis

# 2. Go to api folder
cd api

# 3. Install packages (first time only)
pip install -r requirements.txt

# 4. Setup database (first time only)
alembic upgrade head

# 5. Start backend
uvicorn main:app --reload --port 8000
```

### Start Backend (After First Time)
```bash
cd api
uvicorn main:app --reload --port 8000
```

### Stop Backend
```
Press Ctrl + C
```

### Check if Backend is Running
Open browser: http://localhost:8000/docs

---

## 🎓 What Each Command Does (Simple Explanation)

| Command | What It Does |
|---------|--------------|
| `docker compose up -d postgres redis` | Starts the database (like starting a storage room) |
| `cd api` | Goes into the backend folder |
| `pip install -r requirements.txt` | Downloads all tools needed |
| `alembic upgrade head` | Creates tables in database |
| `uvicorn main:app --reload --port 8000` | Starts the backend server |

---

## ✅ Checklist

Before starting, make sure:
- [ ] Docker Desktop is running
- [ ] Python is installed (`python --version` works)
- [ ] You're in the project folder
- [ ] Terminal/PowerShell is open

---

## 🎯 Success Indicators

You'll know it's working when:
- ✅ Terminal shows "Uvicorn running on http://0.0.0.0:8000"
- ✅ Browser shows API docs at http://localhost:8000/docs
- ✅ Health check shows `{"status": "healthy"}`

---

## 💡 Pro Tips

1. **Keep terminal open**: The server runs in the terminal window
2. **Auto-reload**: With `--reload`, changes auto-restart the server
3. **Check terminal**: Errors show up in the terminal
4. **Database first**: Always start database before backend
5. **One terminal**: Keep the backend running in one terminal, use another for other commands

---

## 🆘 Still Stuck?

1. **Check the error message** - it usually tells you what's wrong
2. **Make sure Docker is running** - check system tray for Docker icon
3. **Try restarting** - close terminal, reopen, try again
4. **Check Python version** - should be 3.11 or higher
5. **Read error carefully** - most errors have simple fixes

---

## 📞 Quick Help

**Backend not starting?**
- Check if database is running: `docker compose ps`
- Check if port 8000 is free
- Check terminal for error messages

**Can't install packages?**
- Try: `python -m pip install -r requirements.txt`
- Make sure Python is installed correctly

**Database errors?**
- Make sure Docker Desktop is running
- Run: `docker compose up -d postgres redis`
- Wait 10 seconds before trying again

---

## 🎉 That's It!

Follow these steps and your backend will be running in no time!

**Remember**: 
- First time setup takes 5-10 minutes
- After that, starting takes just 10 seconds
- Keep the terminal open while backend is running

---

**Good luck! 🚀**

