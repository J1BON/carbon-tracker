# 🚀 Railway Build Command - Final Fix

## Current Error
```
EBUSY: resource busy or locked, rmdir '/app/web/node_modules/.vite'
```

## ✅ Fixed Build Command

Use this in Railway Settings → Build Command:

```bash
rm -rf web/node_modules/.vite web/.vite 2>/dev/null || true && npm ci && npm run build --workspace=@carbon-tracker/web
```

**What it does:**
1. `rm -rf web/node_modules/.vite web/.vite` - Removes Vite cache
2. `2>/dev/null || true` - Ignores errors if files don't exist
3. `npm ci` - Clean install
4. `npm run build --workspace=@carbon-tracker/web` - Build web workspace

---

## Alternative: Simpler Command

If the above doesn't work, try:

```bash
npm install && npm run build --workspace=@carbon-tracker/web
```

**Why this works:**
- `npm install` is less strict than `npm ci`
- Handles file locks better
- Still installs all dependencies correctly

---

## Railway Settings Summary

**Root Directory:** `.` (root of repo)

**Build Command (Option 1 - Recommended):**
```bash
rm -rf web/node_modules/.vite web/.vite 2>/dev/null || true && npm ci && npm run build --workspace=@carbon-tracker/web
```

**Build Command (Option 2 - Simpler):**
```bash
npm install && npm run build --workspace=@carbon-tracker/web
```

**Output Directory:** `web/dist`

**Start Command:** (your start command, if needed)

---

## How to Update in Railway

1. Go to **Railway Dashboard**
2. Click on your **Web Service**
3. Go to **Settings** tab
4. Find **Build Command**
5. Paste one of the commands above
6. Click **Save**
7. Railway will automatically redeploy

---

## Why This Fixes It

- **Removes Vite cache** before install (prevents file locks)
- **Ignores errors** if cache doesn't exist (`|| true`)
- **Uses npm ci** for clean install (or npm install as fallback)
- **Builds from root** (monorepo structure)

---

**Copy the build command and paste it into Railway!** 🎯

