# 🚀 QUICK FIX - Get Your Backend Running NOW

## Option 1: Run the Fix Script (Easiest!)

### Windows PowerShell:
```powershell
cd C:\Projects\root\api
.\install-deps.ps1
```

### Windows Command Prompt:
```cmd
cd C:\Projects\root\api
install-deps.bat
```

This script will:
1. ✅ Upgrade pip
2. ✅ Install all dependencies (except psycopg2-binary)
3. ✅ Try multiple methods to install psycopg2-binary
4. ✅ Tell you if it worked

---

## Option 2: Manual Fix (If Script Doesn't Work)

### Step 1: Install Everything Except psycopg2-binary

```bash
cd C:\Projects\root\api

# Upgrade pip
python -m pip install --upgrade pip setuptools wheel

# Temporarily remove psycopg2-binary from requirements
# Open requirements.txt, comment out this line:
# psycopg2-binary==2.9.9
# Change to:
# # psycopg2-binary==2.9.9

# Install everything else
python -m pip install -r requirements.txt
```

### Step 2: Try Installing psycopg2-binary

```bash
# Try these in order:
python -m pip install --only-binary :all: psycopg2-binary
# If that fails:
python -m pip install --only-binary :all: psycopg2-binary==2.9.9
# If that fails:
python -m pip install --only-binary :all: "psycopg2-binary>=2.9.0"
```

### Step 3: Use SQLite Instead (If psycopg2-binary Still Fails)

**Update your `api/.env` file:**

```env
# Change from PostgreSQL to SQLite
DATABASE_URL=sqlite:///./carbon_tracker.db
```

**SQLite works for local development!** You can switch to PostgreSQL later for production.

---

## Option 3: Use SQLite (Fastest - No PostgreSQL Needed!)

If you just want to get running quickly:

1. **Update `api/.env`:**
   ```env
   DATABASE_URL=sqlite:///./carbon_tracker.db
   ```

2. **Install dependencies (skip psycopg2-binary):**
   ```bash
   cd C:\Projects\root\api
   
   # Comment out psycopg2-binary in requirements.txt
   # Then:
   python -m pip install --upgrade pip
   python -m pip install -r requirements.txt
   ```

3. **Run migrations:**
   ```bash
   alembic upgrade head
   ```

4. **Start the server:**
   ```bash
   python main.py
   # Or:
   uvicorn main:app --reload
   ```

---

## Test If It Works

```bash
# Test if FastAPI is installed
python -c "import fastapi; print('✅ FastAPI OK')"

# Test if psycopg2 is installed (optional)
python -c "import psycopg2; print('✅ PostgreSQL OK')" 2>nul || echo "⚠️  Using SQLite instead"

# Start the server
python main.py
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
```

Visit: http://localhost:8000/docs

---

## Still Having Issues?

1. **Make sure Python is installed:**
   ```bash
   python --version
   ```

2. **Make sure you're in the right folder:**
   ```bash
   cd C:\Projects\root\api
   ```

3. **Check if .env file exists:**
   ```bash
   # Windows PowerShell
   Test-Path .env
   ```

4. **Create .env if missing:**
   ```env
   DATABASE_URL=sqlite:///./carbon_tracker.db
   SECRET_KEY=your-secret-key-here
   CORS_ORIGINS=http://localhost:5173,http://localhost:3000
   ```

---

## Summary

**Fastest way to get running:**
1. Use SQLite (no PostgreSQL needed)
2. Update `.env` with `DATABASE_URL=sqlite:///./carbon_tracker.db`
3. Install dependencies (skip psycopg2-binary)
4. Run: `python main.py`

**You're done!** 🎉

