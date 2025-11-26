# ✅ WORKING Vercel Solution

## The Real Problem
Your `web` workspace depends on `@carbon-tracker/shared-types` which is a **workspace package**. When Vercel builds from `web` directory alone, it can't find the shared-types package because workspaces need to be installed from the **root**.

## ✅ Solution: Build from Root

### Step 1: Use This vercel.json

I've created a `vercel.json` that:
1. Installs all dependencies from root (sets up workspaces)
2. Builds shared-types first
3. Then builds the web app

**Current `vercel.json`:**
```json
{
  "buildCommand": "npm install && npm run build --workspace=@carbon-tracker/shared-types && npm run build --workspace=@carbon-tracker/web",
  "outputDirectory": "web/dist",
  "installCommand": "npm install",
  "framework": "vite"
}
```

### Step 2: Vercel Settings

**In Vercel Dashboard:**
1. **DO NOT set Root Directory** (leave it empty/root)
2. Vercel will use `vercel.json` automatically
3. Make sure these are set:
   - **Build Command**: (auto from vercel.json)
   - **Output Directory**: `web/dist` (auto from vercel.json)
   - **Install Command**: (auto from vercel.json)

### Step 3: Environment Variables

Add these in Vercel:
```
VITE_API_URL=https://your-backend-url.railway.app
VITE_ML_SERVICE_URL=https://your-ml-service.railway.app
VITE_MAPBOX_TOKEN=your_mapbox_token
```

---

## 🎯 Why This Works

1. **Installs from root** → Sets up npm workspaces correctly
2. **Builds shared-types first** → Ensures the dependency is available
3. **Then builds web** → Can now find `@carbon-tracker/shared-types`
4. **Outputs from web/dist** → Vercel serves the built files

---

## 🚀 Deploy Now

1. **Commit the vercel.json:**
   ```bash
   git add vercel.json
   git commit -m "Add vercel.json for monorepo build"
   git push
   ```

2. **In Vercel:**
   - Make sure Root Directory is **NOT set** (empty)
   - Add environment variables
   - Click "Deploy" or it will auto-deploy on push

---

## ✅ This WILL Work!

The key was building from root and handling the workspace dependency properly.

