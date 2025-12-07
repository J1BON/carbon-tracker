# 🔧 Frontend Docker Fix - Complete Solution

## Problems Found:

1. **CORS not configured** - Backend wasn't allowing requests from frontend container
2. **Frontend Dockerfile** - Using production build instead of dev server
3. **API URL** - Frontend needs to access API correctly

## ✅ Fixes Applied:

### 1. Added CORS_ORIGINS to docker-compose.yml
Added `http://web:3000` to CORS origins so frontend container can access API.

### 2. Updated web service command
Changed to run dev server instead of production build.

---

## 🚀 How to Fix and Run:

### Option 1: Run Frontend Locally (Easiest - Recommended)

**Don't run frontend in Docker, run it locally:**

```bash
# 1. Start only database and backend in Docker
docker compose up -d postgres redis api

# 2. Wait 15 seconds for services to start

# 3. Run frontend locally (in new terminal)
cd web
npm install
npm run dev
```

**Access**: http://localhost:3000

**Why this works**: Frontend on your machine can access `http://localhost:8000` which Docker exposes.

---

### Option 2: Run Everything in Docker (Fixed)

**After the fixes I made:**

```bash
# 1. Rebuild and start all services
docker compose up --build -d

# 2. Check all services are running
docker compose ps

# 3. Access frontend
# Open browser: http://localhost:3000
```

**Note**: The frontend container now runs dev server and can access API at `http://api:8000` internally, but your browser accesses it via `http://localhost:8000` (which Docker maps correctly).

---

## 🔍 Verify It's Working:

### 1. Check Services
```bash
docker compose ps
```

Should show:
- `carbon-tracker-db` (postgres) - Up
- `carbon-tracker-redis` (redis) - Up  
- `carbon-tracker-api` (api) - Up
- `carbon-tracker-web` (web) - Up

### 2. Check Backend
Open: http://localhost:8000/health

Should see:
```json
{"status": "healthy", "database": "connected"}
```

### 3. Check Frontend
Open: http://localhost:3000

Should load the app.

### 4. Check Browser Console
Press F12, check Console tab:
- Should see: `🌐 Using localhost (development mode)`
- Should see: `🌐 API Configuration: {baseURL: "http://localhost:8000", ...}`

### 5. Check Network Tab
Press F12 → Network tab:
- Try logging in or making an API call
- Should see requests to `http://localhost:8000/api/v1/...`
- Should get responses (not CORS errors)

---

## 🐛 Troubleshooting:

### Problem: "CORS error" in browser console

**Fix**: Make sure CORS_ORIGINS includes your frontend URL

Check `docker-compose.yml` has:
```yaml
CORS_ORIGINS: http://localhost:3000,http://localhost:5173,http://127.0.0.1:3000,http://127.0.0.1:5173,http://web:3000
```

Then restart:
```bash
docker compose restart api
```

### Problem: "Cannot connect to API" or "Network Error"

**Fix**: Check API is running

```bash
# Check API is up
curl http://localhost:8000/health

# Check API logs
docker compose logs api

# Restart API if needed
docker compose restart api
```

### Problem: Frontend shows blank page

**Fix**: Check frontend logs

```bash
# Check frontend logs
docker compose logs web

# Restart frontend
docker compose restart web
```

### Problem: "Connection refused" to localhost:8000

**Fix**: API not exposed or not running

```bash
# Check if API container is running
docker compose ps api

# Check if port 8000 is exposed
docker compose ps
# Should show: 0.0.0.0:8000->8000/tcp

# Restart API
docker compose restart api
```

---

## 📝 Quick Commands:

### Start Everything
```bash
docker compose up --build -d
```

### Stop Everything
```bash
docker compose down
```

### View Logs
```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f api
docker compose logs -f web
```

### Restart Service
```bash
docker compose restart api
docker compose restart web
```

### Rebuild After Changes
```bash
docker compose up --build -d
```

---

## ✅ Success Checklist:

- [ ] All Docker services running (`docker compose ps`)
- [ ] Backend health check works (http://localhost:8000/health)
- [ ] Frontend loads (http://localhost:3000)
- [ ] Browser console shows API URL: `http://localhost:8000`
- [ ] No CORS errors in browser console
- [ ] Can make API calls (try login/register)

---

## 🎯 Recommended Setup:

**For Development**: Run frontend locally, backend in Docker
- Faster development (hot reload)
- Easier debugging
- Less Docker complexity

**For Production**: Run everything in Docker
- Consistent environment
- Easy deployment
- Isolated services

---

**The fixes are applied! Try running again and let me know if it works!** 🚀

