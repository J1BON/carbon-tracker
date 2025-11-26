# 🚀 Deploy to Vercel - Quick Guide

## ✅ Everything is Ready!

All fixes are in place:
- ✅ `turbo.json` updated for Turbo 2.0
- ✅ `vite.config.ts` has `vite-tsconfig-paths` plugin
- ✅ `vercel.json` configured correctly
- ✅ All path aliases fixed

---

## 🎯 Deploy in 3 Steps

### Step 1: Commit & Push

```bash
git add .
git commit -m "Fix: Add vite-tsconfig-paths and update Turbo config for Vercel"
git push origin main
```

### Step 2: Deploy on Vercel

1. **Go to** [vercel.com](https://vercel.com)
2. **Click** "Add New Project" (or select your existing project)
3. **Import** your GitHub repository
4. **Configure:**
   - **Root Directory**: `web` ⚠️ IMPORTANT!
   - **Framework Preset**: Vite (auto-detected)
   - **Build Command**: Leave default (or `npm run build`)
   - **Output Directory**: `dist` (auto-detected)
   - **Install Command**: Leave default (or `npm install`)

5. **Add Environment Variables:**
   ```
   VITE_API_URL=https://your-backend-url.railway.app
   VITE_ML_SERVICE_URL=https://your-ml-service.railway.app (if needed)
   VITE_MAPBOX_TOKEN=your_mapbox_token (if needed)
   ```

6. **Click** "Deploy"

### Step 3: Update Backend CORS

Once Vercel gives you a URL (e.g., `your-app.vercel.app`):

1. Go to Railway (or your backend provider)
2. Update `CORS_ORIGINS` environment variable:
   ```
   CORS_ORIGINS=https://your-app.vercel.app,https://your-app-username.vercel.app
   ```

---

## ✅ That's It!

Your app will be live in ~2-3 minutes!

---

## 🆘 If Build Fails

**Check these:**
1. ✅ Root Directory is set to `web` in Vercel settings
2. ✅ All environment variables are set
3. ✅ Check Vercel build logs for specific errors
4. ✅ Make sure `vercel.json` is in the root directory

**Common Issues:**
- **Path errors**: Make sure Root Directory = `web`
- **Missing env vars**: Add all `VITE_*` variables
- **Build timeout**: Vercel free tier has limits, but should be fine

---

**Ready to deploy!** 🚀

