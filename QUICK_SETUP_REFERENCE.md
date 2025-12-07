# ⚡ Quick Setup Reference Card

**For when you just need the commands!**

---

## 🚀 First Time Setup (New Laptop)

```bash
# 1. Install Prerequisites
# - Docker Desktop: https://www.docker.com/products/docker-desktop/
# - Node.js 18+: https://nodejs.org/
# - Python 3.11+: https://www.python.org/downloads/
# - Git: https://git-scm.com/downloads

# 2. Get Project
git clone <your-repo-url>
cd carbon-tracker

# 3. Start Database
docker compose up -d postgres redis

# 4. Setup Backend (Terminal 1)
cd api
pip install -r requirements.txt
alembic upgrade head
uvicorn main:app --reload --port 8000

# 5. Setup Frontend (Terminal 2)
cd packages/shared-types
npm install && npm run build
cd ../../web
npm install
npm run dev
```

---

## 🔄 Daily Startup (After First Setup)

```bash
# Terminal 1: Start Database (if needed)
docker compose up -d postgres redis

# Terminal 2: Start Backend
cd api
uvicorn main:app --reload --port 8000

# Terminal 3: Start Frontend
cd web
npm run dev
```

---

## ✅ Verify It's Working

- **Backend**: http://localhost:8000/docs
- **Frontend**: http://localhost:3000
- **Health**: http://localhost:8000/health

---

## 🛑 Stop Everything

```bash
# Stop Backend/Frontend: Ctrl+C in terminals

# Stop Database
docker compose down
```

---

## 🐛 Quick Fixes

**Port in use?**
```bash
# Windows: Find and kill process
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

**Database error?**
```bash
docker compose restart postgres
```

**Module not found?**
```bash
# Backend
cd api && pip install -r requirements.txt

# Frontend
cd web && npm install
```

---

**Full guide**: See `SETUP_ON_NEW_MACHINE.md`

