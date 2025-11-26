# 🔧 Railway Monorepo Fix - package-lock.json Issue

## Problem
Railway is running `npm ci` in the `web/` directory, but this is a **monorepo** with workspaces. The `package-lock.json` is at the **root**, not in `web/`.

## Solution Options

### Option 1: Configure Railway to Use Root Directory (Recommended)

In Railway, update your service settings:

1. **Go to Railway Dashboard** → Your Web Service → Settings
2. **Root Directory**: Change from `web` to `.` (root)
3. **Build Command**: Change to `npm run build --workspace=@carbon-tracker/web`
4. **Start Command**: Update if needed

**Railway Settings:**
```
Root Directory: . (or leave empty for root)
Build Command: npm ci && npm run build --workspace=@carbon-tracker/web
Start Command: (your start command)
```

### Option 2: Use npm install Instead of npm ci

If Railway allows, change the build command:

**Build Command:**
```bash
npm install && npm run build --workspace=@carbon-tracker/web
```

This will work even if package-lock.json is slightly out of sync.

### Option 3: Create package-lock.json in web/ (Not Recommended)

This breaks monorepo structure, but if Railway requires it:

```bash
cd web
npm install --package-lock-only
```

Then commit `web/package-lock.json`. But this creates duplicate lock files.

---

## ✅ Recommended: Option 1

**Update Railway Service Settings:**

1. **Root Directory**: `.` (root of repository)
2. **Build Command**: 
   ```bash
   npm ci && npm run build --workspace=@carbon-tracker/web
   ```
3. **Output Directory**: `web/dist` (where Vite builds to)

---

## 📋 Current Status

- ✅ Root `package-lock.json` exists and includes MUI packages
- ✅ MUI packages are in `web/package.json`
- ⚠️ Railway is configured to build from `web/` directory
- ⚠️ Railway needs root `package-lock.json` for monorepo

---

## 🚀 Quick Fix Steps

1. **Go to Railway Dashboard**
2. **Select your Web Service**
3. **Go to Settings tab**
4. **Update:**
   - **Root Directory**: `.` (or empty for root)
   - **Build Command**: `npm ci && npm run build --workspace=@carbon-tracker/web`
5. **Save and Redeploy**

---

## ✅ Verify

After updating Railway settings:
- Railway will run `npm ci` from root
- Will find root `package-lock.json`
- Will install all workspace dependencies
- Will build the web workspace
- Build should succeed! 🎉

---

**The root package-lock.json is ready - just need to configure Railway correctly!**

