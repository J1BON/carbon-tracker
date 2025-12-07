# ⚡ Quick Deployment Guide - Fly.io + Netlify

Fast deployment steps for MyCarbonFootprint.

---

## 🚀 Backend Deployment (Fly.io)

### 1. Install Fly CLI
```powershell
# Windows PowerShell
powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"
```

### 2. Login
```bash
fly auth login
```

### 3. Navigate to API
```bash
cd api
```

### 4. Set Secrets (One-time setup)
```bash
fly secrets set SECRET_KEY="your-super-secret-key-here"
fly secrets set RESEND_API_KEY="re_your_key_here"
fly secrets set SMTP_FROM_EMAIL="noreply@yourdomain.com"
fly secrets set SMTP_FROM_NAME="MyCarbonFootprint"
fly secrets set FRONTEND_URL="https://your-app.netlify.app"
fly secrets set CORS_ORIGINS="https://your-app.netlify.app"
```

### 5. Deploy
```bash
fly deploy
```

**Your backend URL:** `https://api-broken-wind-9038.fly.dev` (or your app name)

---

## 🌐 Frontend Deployment (Netlify)

### Method 1: GitHub Auto-Deploy (Recommended)

1. **Push to GitHub:**
```bash
git add .
git commit -m "Deploy to production"
git push origin main
```

2. **In Netlify Dashboard:**
   - Go to https://app.netlify.com
   - Add site → Import from Git → GitHub
   - Select your repository
   - **Build settings:**
     - Base directory: `.` (root)
     - Build command: `npm install && npm run build --workspace=@carbon-tracker/shared-types && npm run build --workspace=@carbon-tracker/web`
     - Publish directory: `web/dist`
   - **Environment variables:**
     - `VITE_API_URL` = `https://api-broken-wind-9038.fly.dev`
     - `VITE_FRONTEND_URL` = `https://your-app.netlify.app`
   - Click "Deploy"

3. **Done!** Netlify will auto-deploy on every push.

### Method 2: Netlify CLI

```bash
# Install CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

---

## 🔄 Update Backend CORS After Netlify Deploy

After getting your Netlify URL:

```bash
cd api
fly secrets set CORS_ORIGINS="https://your-app.netlify.app"
fly secrets set FRONTEND_URL="https://your-app.netlify.app"
fly apps restart api-broken-wind-9038
```

---

## ✅ Quick Checklist

- [ ] Backend deployed to Fly.io
- [ ] Frontend deployed to Netlify
- [ ] Environment variables set
- [ ] CORS updated with Netlify URL
- [ ] Test registration
- [ ] Test API calls

---

**For detailed guide, see:** `DEPLOY_FLY_NETLIFY.md`

