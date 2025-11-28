# 🚀 Frontend Deployment Guide (Netlify)

Quick guide to deploy your frontend changes to Netlify.

---

## 📋 Prerequisites

- Node.js and npm installed
- Netlify account (free tier works)
- Your project code updated

---

## 🎯 Method 1: Build & Drag & Drop (Easiest)

### Step 1: Build the Frontend

```bash
cd web
npm run build
```

This creates a `dist` folder with your production-ready files.

### Step 2: Deploy to Netlify

1. **Go to Netlify Dashboard**: https://app.netlify.com
2. **Find your site** (or create a new one)
3. **Go to Site Settings** → **Build & deploy** → **Deploy settings**
4. **Scroll down to "Deploy manually"** section
5. **Drag and drop the `web/dist` folder** onto the deploy area
6. **Wait for deployment** (usually 10-30 seconds)
7. **Your site is live!** 🎉

---

## 🎯 Method 2: Netlify CLI (Recommended for Regular Deploys)

### Step 1: Install Netlify CLI (if not installed)

```bash
npm install -g netlify-cli
```

### Step 2: Login to Netlify

```bash
netlify login
```

This opens your browser to authenticate.

### Step 3: Build and Deploy

```bash
cd web
npm run build
netlify deploy --prod --dir=dist
```

**That's it!** Your site is deployed. 🚀

---

## 🎯 Method 3: Git-Based Auto-Deploy (Best for Continuous Deployment)

If your project is connected to GitHub/GitLab/Bitbucket:

1. **Push your changes to Git**:
   ```bash
   git add .
   git commit -m "Update email verification flow"
   git push
   ```

2. **Netlify automatically deploys** when you push to your main branch!

   - Go to Netlify Dashboard → Your Site → **Deploys** tab
   - You'll see the new deployment in progress
   - Wait for it to complete (usually 1-2 minutes)

---

## ⚙️ Verify Netlify Configuration

Make sure your `web/netlify.toml` file exists and has:

```toml
[build]
  base = "web"
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

If you're using Git-based deployment, Netlify will use this config automatically.

---

## 🔍 Check Your Deployment

After deploying:

1. **Visit your Netlify URL** (e.g., `https://your-site.netlify.app`)
2. **Open Browser DevTools** (F12) → **Network tab**
3. **Check API calls** - Should show your Fly.io API URL, not `localhost`
4. **Test the email verification flow**:
   - Register a new account
   - Check email for verification link
   - Click the link
   - Should reload and take you to homepage (if logged in) or show login button

---

## 🐛 Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
cd web
rm -rf node_modules dist
npm install
npm run build
```

### Still Seeing `localhost` in Network Tab

1. **Check environment variable** in Netlify:
   - Go to **Site Settings** → **Environment variables**
   - Make sure `VITE_API_URL` is set to: `https://api-broken-wind-9038.fly.dev`

2. **Rebuild and redeploy** (the code auto-detects production domains, but env var is preferred)

### Changes Not Showing

1. **Hard refresh** your browser: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. **Clear browser cache**
3. **Check Netlify deploy logs** for errors

---

## 📝 Quick Deploy Commands

**One-liner for quick deploy:**
```bash
cd web && npm run build && netlify deploy --prod --dir=dist
```

**Or if using drag & drop:**
```bash
cd web && npm run build
# Then drag web/dist folder to Netlify dashboard
```

---

## ✅ Deployment Checklist

- [ ] Code changes committed
- [ ] Frontend built successfully (`npm run build`)
- [ ] `dist` folder created
- [ ] Deployed to Netlify (drag & drop or CLI)
- [ ] Site loads without errors
- [ ] API calls go to Fly.io (not localhost)
- [ ] Email verification flow works
- [ ] Verify page reloads correctly after verification

---

**Your frontend is now live!** 🎉

