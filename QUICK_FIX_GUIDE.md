# ⚡ Quick Fix Guide - Frontend Not Working

## 🔍 Problems Found & Fixed:

1. ✅ **CORS Configuration** - Added `http://web:3000` to backend CORS origins
2. ✅ **Dev Dockerfile** - Created `Dockerfile.dev` for development
3. ✅ **Docker Compose** - Updated to use dev Dockerfile

---

## 🚀 EASIEST SOLUTION (Recommended):

### Run Frontend Locally, Backend in Docker

**This is the easiest and fastest way:**

```bash
# 1. Start database and backend in Docker
docker compose up -d postgres redis api

# 2. Wait 15 seconds

# 3. In a NEW terminal, run frontend locally
cd web
npm install
npm run dev
```

**Then open**: http://localhost:3000

**Why this works**: 
- Frontend on your computer can access `http://localhost:8000` (which Docker exposes)
- Hot reload works perfectly
- Easier to debug
- No Docker networking issues

---

## 🐳 Alternative: Run Everything in Docker

**After my fixes, you can run everything in Docker:**

```bash
# 1. Rebuild with new configuration
docker compose up --build -d

# 2. Check all services are running
docker compose ps

# 3. Open browser
# http://localhost:3000
```

**Note**: First build takes 2-3 minutes (downloads Node.js, installs packages).

---

## ✅ Verify It's Working:

### Check Backend:
```bash
# Open in browser or use curl
http://localhost:8000/health
```

Should see:
```json
{"status": "healthy", "database": "connected"}
```

### Check Frontend:
```bash
# Open in browser
http://localhost:3000
```

Should load the app.

### Check Browser Console (F12):
- Should see: `🌐 Using localhost (development mode)`
- Should see: `🌐 API Configuration: {baseURL: "http://localhost:8000"}`
- **No CORS errors**

### Test API Connection:
- Try to register/login
- Check Network tab (F12) - should see API calls to `http://localhost:8000/api/v1/...`
- Should get responses (not errors)

---

## 🐛 If Still Not Working:

### Problem: CORS Error

**Check**: Open browser console (F12), look for CORS error

**Fix**:
```bash
# Restart API to apply CORS changes
docker compose restart api

# Check CORS is set correctly
docker compose exec api env | grep CORS
```

### Problem: Frontend Can't Connect to API

**Check**: 
```bash
# Is API running?
curl http://localhost:8000/health

# Check API logs
docker compose logs api
```

**Fix**:
```bash
# Restart API
docker compose restart api

# Wait 10 seconds, try again
```

### Problem: Frontend Shows Blank Page

**Check**:
```bash
# Check frontend logs
docker compose logs web
```

**Fix**:
```bash
# Rebuild frontend
docker compose up --build web -d
```

### Problem: Port 3000 Already in Use

**Fix**:
```bash
# Find what's using port 3000
netstat -ano | findstr :3000

# Kill it (replace <PID> with number)
taskkill /PID <PID> /F

# Or use different port in docker-compose.yml
# Change: "3000:3000" to "3001:3000"
```

---

## 📋 Quick Commands:

### Start Backend Only (Recommended)
```bash
docker compose up -d postgres redis api
cd web
npm run dev
```

### Start Everything in Docker
```bash
docker compose up --build -d
```

### Check Status
```bash
docker compose ps
```

### View Logs
```bash
docker compose logs -f api
docker compose logs -f web
```

### Restart Services
```bash
docker compose restart api
docker compose restart web
```

### Stop Everything
```bash
docker compose down
```

---

## 🎯 What I Fixed:

1. **docker-compose.yml**:
   - Added `CORS_ORIGINS` environment variable to API service
   - Updated web service to use dev Dockerfile
   - Fixed volume mounts

2. **web/Dockerfile.dev** (NEW):
   - Created development Dockerfile
   - Runs Vite dev server instead of production build
   - Supports hot reload

3. **web/src/lib/api.ts**:
   - Added better comments
   - API URL detection works correctly

---

## ✅ Success Checklist:

- [ ] Backend health check works: http://localhost:8000/health
- [ ] Frontend loads: http://localhost:3000
- [ ] Browser console shows: `🌐 Using localhost (development mode)`
- [ ] No CORS errors in browser console
- [ ] Can make API calls (try login/register)
- [ ] Network tab shows successful API requests

---

## 💡 Recommendation:

**For Development**: Use Option 1 (Frontend locally, Backend in Docker)
- ✅ Faster
- ✅ Easier debugging
- ✅ Hot reload works perfectly
- ✅ No Docker networking complexity

**For Production/Demo**: Use Option 2 (Everything in Docker)
- ✅ Consistent environment
- ✅ Easy to share
- ✅ Production-like setup

---

**Try the easiest solution first (frontend locally)!** 🚀

If you still have issues, share:
1. What error you see (browser console)
2. What `docker compose ps` shows
3. What `curl http://localhost:8000/health` returns

