# 🔧 Railway EBUSY Error Fix

## Problem
```
npm error EBUSY: resource busy or locked, rmdir '/app/web/node_modules/.vite'
```

This happens when Vite's cache files are locked during the build process.

## Solutions

### Solution 1: Add Clean Step (Recommended)

Update Railway build command to clean before install:

**New Build Command:**
```bash
rm -rf web/node_modules/.vite && npm ci && npm run build --workspace=@carbon-tracker/web
```

### Solution 2: Use npm install Instead

Change from `npm ci` to `npm install`:

**Build Command:**
```bash
npm install && npm run build --workspace=@carbon-tracker/web
```

### Solution 3: Add Clean Script

Add to `web/package.json`:
```json
"scripts": {
  "clean:cache": "rm -rf node_modules/.vite",
  "prebuild": "npm run clean:cache"
}
```

Then build command:
```bash
npm ci && npm run build --workspace=@carbon-tracker/web
```

### Solution 4: Ignore Vite Cache (Quick Fix)

Add to Railway build command:
```bash
npm ci --ignore-scripts && npm run build --workspace=@carbon-tracker/web
```

---

## ✅ Recommended Fix

**Update Railway Build Command to:**

```bash
rm -rf web/node_modules/.vite web/.vite 2>/dev/null || true && npm ci && npm run build --workspace=@carbon-tracker/web
```

This:
1. Removes Vite cache (ignores errors if it doesn't exist)
2. Runs npm ci
3. Builds the workspace

---

## 🚀 Quick Fix Steps

1. **Go to Railway Dashboard**
2. **Select your Web Service**
3. **Go to Settings**
4. **Update Build Command:**
   ```
   rm -rf web/node_modules/.vite web/.vite 2>/dev/null || true && npm ci && npm run build --workspace=@carbon-tracker/web
   ```
5. **Save and Redeploy**

---

## Alternative: Use npm install

If `npm ci` keeps failing, use `npm install`:

**Build Command:**
```bash
npm install && npm run build --workspace=@carbon-tracker/web
```

Less strict than `npm ci` but more forgiving with file locks.

---

**Try Solution 1 first - it should fix the EBUSY error!** 🎉

