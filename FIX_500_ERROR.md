# 🔧 Fix 500 Internal Server Error - Registration

## 🔍 Problem:
Getting `500 (Internal Server Error)` when trying to register at `http://localhost:8000/api/v1/auth/register`

## 🎯 Most Likely Cause:
**Database tables don't exist** - migrations haven't been run!

---

## ✅ Quick Fix:

### Step 1: Check if Database is Running
```bash
docker compose ps
```

Should show `postgres` as "Up". If not:
```bash
docker compose up -d postgres redis
```

Wait 15 seconds for database to start.

### Step 2: Run Database Migrations

**If running backend in Docker:**
```bash
docker compose exec api alembic upgrade head
```

**If running backend locally:**
```bash
cd api
alembic upgrade head
```

**OR if python doesn't work:**
```bash
cd api
py -m alembic upgrade head
```

### Step 3: Verify Tables Were Created

**Check in Docker:**
```bash
docker compose exec postgres psql -U postgres -d carbon_tracker -c "\dt"
```

Should show tables: `users`, `carbon_logs`, `badges`, etc.

### Step 4: Restart Backend

**If in Docker:**
```bash
docker compose restart api
```

**If running locally:**
- Stop backend (Ctrl+C)
- Start again: `uvicorn main:app --reload --port 8000`

### Step 5: Test Again

Try registering again at: http://localhost:3000

---

## 🔍 Check Backend Logs for Exact Error:

### If Backend in Docker:
```bash
docker compose logs api
```

Look for error messages - they'll tell you exactly what's wrong.

### If Backend Running Locally:
Check the terminal where you ran `uvicorn` - errors will show there.

---

## 🐛 Common Issues & Fixes:

### Issue 1: "relation 'users' does not exist"
**Fix**: Run migrations (Step 2 above)

### Issue 2: "could not connect to server"
**Fix**: 
```bash
# Make sure database is running
docker compose up -d postgres

# Wait 15 seconds
# Check it's running
docker compose ps postgres
```

### Issue 3: "alembic: command not found"
**Fix**: Use python -m alembic
```bash
cd api
python -m alembic upgrade head
```

### Issue 4: "database does not exist"
**Fix**: Database might not be created. Check docker-compose.yml has:
```yaml
POSTGRES_DB: carbon_tracker
```

Then restart:
```bash
docker compose down
docker compose up -d postgres
# Wait 15 seconds
cd api
alembic upgrade head
```

### Issue 5: "column 'email_verified' does not exist"
**Fix**: Migrations not fully run. Run all migrations:
```bash
cd api
alembic upgrade head
```

---

## ✅ Complete Fresh Setup (If Nothing Works):

```bash
# 1. Stop everything
docker compose down

# 2. Remove database volume (⚠️ This deletes all data!)
docker volume rm root_postgres_data

# 3. Start database
docker compose up -d postgres redis

# 4. Wait 20 seconds for database to fully start

# 5. Run migrations
cd api
alembic upgrade head

# 6. Start backend
# If in Docker:
docker compose up -d api

# If locally:
uvicorn main:app --reload --port 8000

# 7. Test
curl http://localhost:8000/health
```

---

## 🎯 Quick Diagnostic Commands:

### Check Database Connection:
```bash
docker compose exec postgres psql -U postgres -d carbon_tracker -c "SELECT 1;"
```

### Check if Tables Exist:
```bash
docker compose exec postgres psql -U postgres -d carbon_tracker -c "\dt"
```

### Check Backend Can Connect:
```bash
curl http://localhost:8000/health
```

Should return: `{"status": "healthy", "database": "connected"}`

### Check API Logs:
```bash
docker compose logs api --tail=50
```

Look for error messages.

---

## 📝 Step-by-Step Fix (Copy & Paste):

```bash
# 1. Make sure database is running
docker compose up -d postgres redis

# 2. Wait 15 seconds

# 3. Go to api folder
cd api

# 4. Run migrations
python -m alembic upgrade head
# OR if that doesn't work:
py -m alembic upgrade head

# 5. Check if it worked (should see "Running upgrade...")
# If you see errors, share them

# 6. Restart backend
# If in Docker:
docker compose restart api

# If locally, stop (Ctrl+C) and restart:
uvicorn main:app --reload --port 8000

# 7. Test registration again
```

---

## 🆘 Still Not Working?

**Share these details:**

1. **What `alembic upgrade head` shows:**
   ```bash
   cd api
   python -m alembic upgrade head
   ```

2. **What backend logs show:**
   ```bash
   docker compose logs api --tail=20
   ```

3. **What database status shows:**
   ```bash
   docker compose ps
   ```

4. **What health check returns:**
   ```bash
   curl http://localhost:8000/health
   ```

---

## 💡 Most Common Solution:

**99% of the time, it's just missing migrations:**

```bash
cd api
python -m alembic upgrade head
docker compose restart api
```

**That's it!** 🚀

