# 🔧 Vercel Build Fix

## The Problem
Vercel is trying to run `cd web && npm install` which fails because:
1. It's a monorepo with workspaces
2. Dependencies need to be installed from root first

## ✅ Solution: Two Options

### Option 1: Set Root Directory to `web` (RECOMMENDED)

**In Vercel Dashboard:**
1. Go to your project → Settings → General
2. Set **Root Directory** to: `web`
3. **Remove** or **ignore** `vercel.json` (or delete it)
4. Vercel will automatically:
   - Install: `npm install` (from web directory)
   - Build: `npm run build` (from web directory)
   - Output: `dist` (from web directory)

**This is the simplest approach!**

---

### Option 2: Build from Root (Current vercel.json)

If you want to keep `vercel.json`:

1. **Don't set Root Directory** in Vercel (leave it empty/root)
2. Vercel will use `vercel.json` which:
   - Installs from root: `npm install` (installs all workspaces)
   - Builds web workspace: `npm run build --workspace=@carbon-tracker/web`
   - Outputs from: `web/dist`

**Current `vercel.json`:**
```json
{
  "buildCommand": "npm run build --workspace=@carbon-tracker/web",
  "outputDirectory": "web/dist",
  "installCommand": "npm install",
  "framework": "vite"
}
```

---

## 🎯 Recommended: Option 1

**Just set Root Directory = `web` in Vercel UI and delete `vercel.json`**

This is what Vercel is designed for - simple, automatic, no config needed!

---

## 🆘 If Still Failing

1. **Check Vercel build logs** - they're very detailed
2. **Make sure** `package-lock.json` is committed
3. **Verify** Node version in Vercel (should be 18+)
4. **Check** that all dependencies are in `package.json`

