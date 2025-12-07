# 🚀 Deployment Guide: Fly.io (Backend) + Netlify (Frontend)

Complete step-by-step guide to deploy MyCarbonFootprint to production.

---

## 📋 Prerequisites

- ✅ Git repository with all changes committed
- ✅ Fly.io account (free tier available)
- ✅ Netlify account (free tier available)
- ✅ GitHub account (for automatic deployments)

---

## 🔧 Part 1: Deploy Backend to Fly.io

### Step 1: Install Fly.io CLI

**Windows (PowerShell):**
```powershell
powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"
```

**Mac/Linux:**
```bash
curl -L https://fly.io/install.sh | sh
```

**Verify installation:**
```bash
fly version
```

### Step 2: Login to Fly.io

```bash
fly auth login
```

This will open your browser to login. After login, return to terminal.

### Step 3: Navigate to API Directory

```bash
cd api
```

### Step 4: Set Environment Variables (Secrets)

Set all required environment variables as Fly.io secrets:

```bash
# Database (if using PostgreSQL)
fly secrets set DATABASE_URL="postgresql://user:password@host:5432/dbname"

# Security
fly secrets set SECRET_KEY="your-super-secret-key-change-this-in-production"

# Email Configuration (Resend API)
fly secrets set RESEND_API_KEY="re_your_resend_api_key_here"
fly secrets set SMTP_FROM_EMAIL="noreply@yourdomain.com"
fly secrets set SMTP_FROM_NAME="MyCarbonFootprint"

# Frontend URL (for CORS and email links)
fly secrets set FRONTEND_URL="https://your-app.netlify.app"

# CORS Origins (comma-separated)
fly secrets set CORS_ORIGINS="https://your-app.netlify.app,https://www.yourdomain.com"

# Optional: Other settings
fly secrets set DEBUG="False"
```

**To view all secrets:**
```bash
fly secrets list
```

**To remove a secret:**
```bash
fly secrets unset SECRET_NAME
```

### Step 5: Deploy to Fly.io

**First time deployment:**
```bash
fly deploy
```

**For subsequent deployments (after making changes):**
```bash
# Make sure you're in the api directory
cd api

# Deploy
fly deploy
```

### Step 6: Check Deployment Status

```bash
# View app status
fly status

# View logs
fly logs

# Open app in browser
fly open
```

### Step 7: Get Your Backend URL

After deployment, Fly.io will give you a URL like:
```
https://api-broken-wind-9038.fly.dev
```

**Save this URL** - you'll need it for the frontend configuration!

---

## 🌐 Part 2: Deploy Frontend to Netlify

### Step 1: Prepare Frontend for Deployment

**Option A: Build Locally First (Recommended for Testing)**

```bash
# Navigate to project root
cd ..

# Install dependencies
npm install

# Build shared types
npm run build --workspace=@carbon-tracker/shared-types

# Build frontend
cd web
npm run build
```

**Option B: Let Netlify Build (Recommended for Production)**

Netlify will build automatically if configured correctly.

### Step 2: Create Netlify Configuration

Create or update `netlify.toml` in the **project root**:

```toml
[build]
  base = "."
  publish = "web/dist"
  command = "npm install && npm run build --workspace=@carbon-tracker/shared-types && npm run build --workspace=@carbon-tracker/web"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Step 3: Create Environment Variables File

Create `web/.env.production` in the `web` directory:

```env
VITE_API_URL=https://api-broken-wind-9038.fly.dev
VITE_FRONTEND_URL=https://your-app.netlify.app
```

**Important:** Replace `api-broken-wind-9038.fly.dev` with your actual Fly.io backend URL!

### Step 4: Deploy to Netlify

**Method 1: Netlify CLI (Recommended)**

1. **Install Netlify CLI:**
```bash
npm install -g netlify-cli
```

2. **Login to Netlify:**
```bash
netlify login
```

3. **Navigate to project root:**
```bash
cd /path/to/your/project
```

4. **Initialize Netlify (first time only):**
```bash
netlify init
```
   - Choose "Create & configure a new site"
   - Choose a site name (or use default)
   - Build command: `npm install && npm run build --workspace=@carbon-tracker/shared-types && npm run build --workspace=@carbon-tracker/web`
   - Publish directory: `web/dist`

5. **Set Environment Variables:**
```bash
netlify env:set VITE_API_URL "https://api-broken-wind-9038.fly.dev"
netlify env:set VITE_FRONTEND_URL "https://your-app.netlify.app"
```

6. **Deploy:**
```bash
netlify deploy --prod
```

**Method 2: GitHub Integration (Recommended for Auto-Deploy)**

1. **Push code to GitHub:**
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Go to Netlify Dashboard:**
   - Visit https://app.netlify.com
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub
   - Select your repository

3. **Configure Build Settings:**
   - **Base directory:** Leave empty (or `./`)
   - **Build command:** `npm install && npm run build --workspace=@carbon-tracker/shared-types && npm run build --workspace=@carbon-tracker/web`
   - **Publish directory:** `web/dist`

4. **Set Environment Variables:**
   - Go to Site settings → Environment variables
   - Add:
     - `VITE_API_URL` = `https://api-broken-wind-9038.fly.dev`
     - `VITE_FRONTEND_URL` = `https://your-app.netlify.app`

5. **Deploy:**
   - Click "Deploy site"
   - Netlify will automatically build and deploy

### Step 5: Update Backend CORS Settings

After getting your Netlify URL, update Fly.io secrets:

```bash
cd api
fly secrets set CORS_ORIGINS="https://your-app.netlify.app,https://www.yourdomain.com"
fly secrets set FRONTEND_URL="https://your-app.netlify.app"
```

**Restart the app to apply changes:**
```bash
fly apps restart api-broken-wind-9038
```

---

## 🔄 Part 3: Updating Deployments

### Updating Backend (Fly.io)

```bash
# Navigate to api directory
cd api

# Make your changes and commit
git add .
git commit -m "Your changes"
git push

# Deploy
fly deploy

# Check logs if needed
fly logs
```

### Updating Frontend (Netlify)

**If using GitHub integration:**
- Just push to GitHub:
```bash
git add .
git commit -m "Frontend updates"
git push origin main
```
- Netlify will automatically deploy!

**If using CLI:**
```bash
# Build and deploy
netlify deploy --prod
```

---

## ✅ Post-Deployment Checklist

- [ ] Backend is accessible at Fly.io URL
- [ ] Frontend is accessible at Netlify URL
- [ ] Frontend can connect to backend (check browser console)
- [ ] CORS is configured correctly
- [ ] Environment variables are set correctly
- [ ] Email service is configured (Resend API key)
- [ ] Database is accessible (if using external DB)
- [ ] Test user registration
- [ ] Test email verification
- [ ] Test carbon calculator
- [ ] Test dashboard

---

## 🐛 Troubleshooting

### Backend Issues

**Problem: Deployment fails**
```bash
# Check logs
fly logs

# Check app status
fly status

# View detailed logs
fly logs --app api-broken-wind-9038
```

**Problem: Environment variables not working**
```bash
# List all secrets
fly secrets list

# Set missing secrets
fly secrets set KEY="value"
```

**Problem: Database connection issues**
- Check DATABASE_URL is correct
- Verify database is accessible
- Check firewall rules

### Frontend Issues

**Problem: Build fails on Netlify**
- Check build logs in Netlify dashboard
- Verify Node version (should be 18+)
- Check that all dependencies are in package.json

**Problem: API calls failing**
- Check VITE_API_URL is set correctly
- Verify CORS settings in backend
- Check browser console for errors
- Verify backend URL is accessible

**Problem: Environment variables not working**
- Netlify requires `VITE_` prefix for Vite apps
- Rebuild after setting environment variables
- Check in Netlify dashboard → Site settings → Environment variables

---

## 📝 Quick Reference Commands

### Fly.io Commands

```bash
# Login
fly auth login

# Deploy
fly deploy

# View logs
fly logs

# Set secret
fly secrets set KEY="value"

# List secrets
fly secrets list

# View status
fly status

# Open app
fly open

# SSH into app
fly ssh console
```

### Netlify Commands

```bash
# Login
netlify login

# Deploy production
netlify deploy --prod

# Deploy draft
netlify deploy

# View logs
netlify logs

# Open site
netlify open

# Set environment variable
netlify env:set KEY "value"
```

---

## 🔐 Security Checklist

- [ ] SECRET_KEY is strong and unique
- [ ] Database credentials are secure
- [ ] API keys are stored as secrets, not in code
- [ ] CORS is configured to only allow your frontend domain
- [ ] HTTPS is enabled (automatic on Fly.io and Netlify)
- [ ] Environment variables are not committed to Git

---

## 📚 Additional Resources

- **Fly.io Docs:** https://fly.io/docs/
- **Netlify Docs:** https://docs.netlify.com/
- **Vite Environment Variables:** https://vitejs.dev/guide/env-and-mode.html

---

## 🎉 Success!

Once deployed, your app will be live at:
- **Frontend:** https://your-app.netlify.app
- **Backend:** https://api-broken-wind-9038.fly.dev

Users can now access MyCarbonFootprint from anywhere in the world!

---

**Last Updated:** January 2025

