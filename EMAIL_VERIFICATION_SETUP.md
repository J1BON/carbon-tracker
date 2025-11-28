# 📧 Email Verification Setup Guide - Resend

This guide explains how to set up email verification using Resend API for your Carbon Tracker application.

## ✅ What's Been Implemented

1. **Database Fields**: Added `email_verified`, `verification_token`, and `verification_token_expires` to User model
2. **Email Service**: Created email service using Resend API
3. **API Endpoints**:
   - Registration automatically sends verification email
   - `/api/v1/auth/verify-email?token=...` - Verify email with token
   - `/api/v1/auth/resend-verification` - Resend verification email (requires auth)
4. **Frontend**:
   - Email verification page at `/verify-email`
   - Verification status shown in profile menu
   - Resend verification button for unverified users

---

## 🔧 Resend API Setup

**Resend** is a modern email API service with a generous free tier (3,000 emails/month free).

### Step 1: Sign Up and Get API Key

1. **Sign up** at [resend.com](https://resend.com) (free account)
2. **Go to API Keys** in the dashboard
3. **Create a new API key**:
   - Click "Create API Key"
   - Give it a name (e.g., "Carbon Tracker Production")
   - Copy the API key (starts with `re_`)

### Step 2: Verify Your Domain (Required)

**Important**: You must verify a domain to send emails. You have two options:

#### Option A: Use Your Own Domain (Recommended for Production)

1. **Add Domain** in Resend dashboard:
   - Go to "Domains" → "Add Domain"
   - Enter your domain (e.g., `yourdomain.com`)
2. **Add DNS records**:
   - Resend will show you DNS records to add
   - Add them to your domain's DNS settings:
     - **SPF record** (TXT)
     - **DKIM record** (TXT)
     - **DMARC record** (TXT - optional but recommended)
3. **Wait for verification** (usually takes a few minutes)
4. **Verify status** shows "Verified" ✅

#### Option B: Use Resend Test Domain (For Quick Testing)

1. **Go to "Domains"** in Resend dashboard
2. **Use the test domain** provided (e.g., `onboarding.resend.dev`)
3. **No DNS setup needed** - works immediately for testing
4. **Note**: Test domain emails may go to spam, use only for initial testing

---

## 🚀 Deployment Steps

### Backend Deployment (Fly.io)

1. **Set Resend secrets on Fly.io**:
   ```bash
   cd api
   
   # Set all required secrets
   fly secrets set RESEND_API_KEY=re_xxxxxxxxxxxxx
   fly secrets set SMTP_FROM_EMAIL=onboarding@yourdomain.com
   fly secrets set SMTP_FROM_NAME="Carbon Tracker"
   fly secrets set FRONTEND_URL=https://your-netlify-url.netlify.app
   ```

   **Replace**:
   - `re_xxxxxxxxxxxxx` with your actual Resend API key
   - `onboarding@yourdomain.com` with your verified domain email (must be a FULL email like `onboarding@yourdomain.com`, NOT just `yourdomain.com`)
   - `https://your-netlify-url.netlify.app` with your actual Netlify URL
   
   **⚠️ IMPORTANT**: The email must be in format `something@domain.com` - NOT just the domain name!

2. **Verify secrets are set**:
   ```bash
   fly secrets list
   ```
   You should see:
   - `RESEND_API_KEY` ✅
   - `SMTP_FROM_EMAIL` ✅
   - `SMTP_FROM_NAME` ✅
   - `FRONTEND_URL` ✅

3. **Commit and push your code** (if not already done):
   ```bash
   git add .
   git commit -m "Add email verification with Resend"
   git push
   ```

4. **Deploy to Fly.io**:
   ```bash
   cd api
   fly deploy
   ```

5. **Check deployment logs**:
   ```bash
   fly logs
   ```
   Look for: `✅ Verification email sent to... via Resend`

### Frontend Deployment (Netlify)

**CRITICAL: Set API URL Environment Variable in Netlify!**

**⚠️ IMPORTANT: Make sure the value is the Fly.io URL, NOT localhost!**

1. **Go to Netlify Dashboard** → Your site → **Site settings**
2. **Click "Environment variables"** (under Build & deploy)
3. **Find `VITE_API_URL`** in the list
4. **Click to edit it** (or delete and recreate if it's wrong)
5. **Set the value to**:
   ```
   https://api-broken-wind-9038.fly.dev
   ```
   **NOT** `http://localhost:8000` ❌
6. **Click "Save"**
7. **Redeploy your site** (the environment variable only applies to new builds):
   - Build locally: `cd web && npm run build`
   - Deploy: Drag `dist` folder to Netlify, or use `netlify deploy --prod --dir=dist`

**To verify it's working after redeploy:**
- Open browser console (F12)
- Check the logs - you should see: `🌐 Using VITE_API_URL: https://api-broken-wind-9038.fly.dev`
- Or check `window.__API_BASE_URL__` in console - should show the Fly.io URL

**Important**: Make sure you have the `netlify.toml` file in your `web` folder. If not, it's been created for you - commit it first!

#### Fix Netlify Build Settings (If Getting Errors)

If you see errors about wrong deploy path, fix it in Netlify Dashboard:

1. **Go to Netlify Dashboard** → Your site → **Site settings**
2. **Click "Build & deploy"** (under Configuration)
3. **Scroll to "Build settings"**
4. **Click "Edit settings"**
5. **Set these values**:
   - **Base directory**: `web`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. **Save**

Or use the `netlify.toml` file (already created in `web` folder) - just commit and push it.

---

#### Method 1: Push to GitHub (Recommended - Automatic Deploy)

**This is the easiest and most reliable method:**

1. **Make sure your code is committed**:
   ```bash
   git add .
   git commit -m "Add email verification UI"
   ```

2. **Push to GitHub**:
   ```bash
   git push
   ```

3. **Netlify will automatically deploy**:
   - Go to your Netlify dashboard
   - Click "Deploys" tab
   - You should see a new deployment starting automatically
   - Wait 2-3 minutes for it to complete
   - Status will change from "Building" to "Published" ✅

**If auto-deploy is off**, you can trigger it with an empty commit:
```bash
git commit --allow-empty -m "Trigger Netlify rebuild"
git push
```

---

#### Method 2: Using Netlify CLI (Manual Deploy)

**Step-by-step instructions:**

1. **Install Netlify CLI** (if not already installed):
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**:
   ```bash
   netlify login
   ```
   (This will open your browser - click "Authorize")

3. **Navigate to your web folder**:
   ```bash
   cd web
   ```

4. **Build your project first**:
   ```bash
   npm install
   npm run build
   ```
   This creates the `dist` folder with your built files.

5. **Link to your Netlify site** (first time only):
   ```bash
   netlify link
   ```
   - Select "Use an existing site"
   - Choose your site from the list (personalcarbontracker)

6. **Deploy to production**:
   ```bash
   netlify deploy --prod --dir=dist
   ```

7. **Verify deployment**:
   - Go to your Netlify dashboard
   - Check "Deploys" tab - you should see the new deployment
   - Visit your site URL to confirm it's live

**For future deployments**, just run:
```bash
cd web
npm run build
netlify deploy --prod --dir=dist
```

---

#### Method 2: Drag & Drop Deploy (Easiest - No CLI Needed)

**This is the easiest method - no CLI needed:**

1. **Build your frontend locally**:
   ```bash
   cd web
   npm install
   npm run build
   ```
   This creates the `dist` folder.

2. **Go to Netlify Dashboard**:
   - Visit [app.netlify.com](https://app.netlify.com)
   - Go to your site (personalcarbontracker)
   - Click "Deploys" tab

3. **Drag and drop the dist folder**:
   - Look for the drag-and-drop area (usually shows "Want to deploy a new version without connecting to Git? Drag and drop your site output folder here")
   - Drag the entire `web/dist` folder onto it
   - Wait for upload and deploy (usually 1-2 minutes)

4. **Verify deployment**:
   - You'll see the new deployment in the list
   - Status will show "Published" when done
   - Visit your site URL to confirm

**Note**: You'll need to do this every time you want to deploy. The `dist` folder gets rebuilt each time.

---

#### Method 3: Connect to GitHub (Optional - For Automatic Deploys)

**If you want automatic deploys in the future:**

1. **Push your code to GitHub** (if not already):
   ```bash
   git add .
   git commit -m "Add email verification"
   git push
   ```

2. **In Netlify Dashboard**:
   - Go to **Site settings** → **Build & deploy**
   - Scroll to **Continuous Deployment**
   - Click **Link to Git provider**
   - Select **GitHub** and authorize
   - Select your repository
   - Configure build settings:
     - **Base directory**: `web`
     - **Build command**: `npm run build`
     - **Publish directory**: `dist`
   - Click **Deploy site**

3. **Future deployments**:
   - Just push to GitHub: `git push`
   - Netlify will automatically deploy

---

#### Fix Netlify Build Settings (If Getting Errors)

If you see errors about wrong deploy path, fix it in Netlify Dashboard:

1. **Go to Netlify Dashboard** → Your site → **Site settings**
2. **Click "Build & deploy"** (under Configuration)
3. **Scroll to "Build settings"**
4. **Click "Edit settings"**
5. **Set these values**:
   - **Base directory**: `web`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist` (not `web/dist` or `web/web/dist`)
6. **Save**

1. **Go to Site Settings**:
   - In Netlify dashboard, click "Site settings" (left sidebar)
   - Click "Build & deploy" (under Configuration)

2. **Check Build hooks**:
   - Scroll down to "Build hooks"
   - If you have a build hook, you can trigger it with:
     ```bash
     curl -X POST -d {} https://api.netlify.com/build_hooks/YOUR_BUILD_HOOK_ID
     ```

3. **Check Continuous Deployment**:
   - Make sure "Stop auto publishing" is NOT enabled
   - If it says "Lock to stop auto publishing", don't click it

---

## ✅ Recommended: Use Method 2 (Drag & Drop)

**Since your site isn't connected to GitHub, the easiest way is drag & drop:**

```bash
# Build your project
cd web
npm run build
```

Then drag the `web/dist` folder to Netlify dashboard → Deploys tab.

**Or use Method 1 (Netlify CLI)** for a more automated workflow.

---

4. **Verify frontend is live**:
   - Visit your Netlify URL
   - Test the registration flow

---

## 🧪 Testing After Deployment

1. **Register a new user**:
   - Go to your Netlify site
   - Click "Register" or "Sign Up"
   - Fill in the registration form
   - Submit

2. **Check Resend dashboard**:
   - Go to [resend.com/dashboard](https://resend.com/dashboard)
   - Click "Emails" tab
   - You should see the verification email that was sent
   - Check delivery status

3. **Check your email inbox**:
   - Look for email from "Carbon Tracker"
   - Click the verification link
   - You should be redirected to `/verify-email` page
   - Should see "Email Verified!" message

4. **Verify in profile**:
   - Login to your account
   - Click your profile menu
   - Should see "Verified" badge if email is verified
   - Should see "Unverified" badge if not verified yet

---

## 📝 How It Works

1. **Registration**:
   - User registers → Verification token generated
   - Email sent via Resend with verification link
   - User account created with `email_verified=false`

2. **Verification**:
   - User clicks link in email → Goes to `/verify-email?token=...`
   - Frontend calls `/api/v1/auth/verify-email?token=...`
   - Backend verifies token and sets `email_verified=true`

3. **Resend**:
   - Unverified users can click "Resend Verification Email" in profile menu
   - New token generated and email sent via Resend

---

## 🎨 Frontend Features

- **Verification Page**: `/verify-email` - Shows success/error status
- **Profile Menu**: Shows verification badge (Verified/Unverified)
- **Resend Button**: Appears for unverified users in profile menu
- **Registration**: Shows alert after successful registration

---

## ⚙️ Configuration Options

All settings are in `api/app/config.py`:

- `VERIFICATION_TOKEN_EXPIRE_HOURS`: Token expiry time (default: 24 hours)
- `RESEND_API_KEY`: Resend API key (set via Fly.io secrets)
- `FRONTEND_URL`: Base URL for verification links (set via Fly.io secrets)
- `SMTP_FROM_EMAIL`: Sender email address (set via Fly.io secrets)
- `SMTP_FROM_NAME`: Sender name (set via Fly.io secrets)

---

## 🚨 Troubleshooting

### Emails Not Sending

1. **Check Fly.io logs**:
   ```bash
   fly logs
   ```
   Look for: `✅ Verification email sent to... via Resend` or error messages

2. **Verify secrets are set correctly**:
   ```bash
   fly secrets list
   ```
   Must have: `RESEND_API_KEY`, `SMTP_FROM_EMAIL`, `SMTP_FROM_NAME`, `FRONTEND_URL`

3. **Check Resend Dashboard**:
   - Go to [resend.com/dashboard](https://resend.com/dashboard)
   - Check "Emails" tab for sent emails and delivery status
   - Check "Domains" tab - domain must show "Verified" ✅
   - Check "API Keys" - make sure your key is active

4. **Common Issues**:
   - **Domain not verified**: Email must be from a verified domain
   - **Invalid API key**: Make sure you copied the full key (starts with `re_`)
   - **Rate limit**: Free tier = 100 emails/day, 3,000/month
   - **Test domain**: If using `@resend.dev`, emails may go to spam folder
   - **Invalid `from` field**: Make sure `SMTP_FROM_EMAIL` is a valid email (e.g., `onboarding@yourdomain.com`) and `SMTP_FROM_NAME` doesn't have special characters
     ```bash
     # Fix the from field format
     fly secrets set SMTP_FROM_EMAIL=onboarding@yourdomain.com
     fly secrets set SMTP_FROM_NAME="Carbon Tracker"
     # Then redeploy
     fly deploy
     ```

5. **Test API key manually**:
   ```bash
   curl -X POST https://api.resend.com/emails \
     -H "Authorization: Bearer re_YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{
       "from": "onboarding@resend.dev",
       "to": "your-email@example.com",
       "subject": "Test",
       "html": "<p>Test email</p>"
     }'
   ```

### Verification Link Not Working

1. **Check token expiry**: Tokens expire after 24 hours (configurable)
2. **Verify FRONTEND_URL**: Must match your actual Netlify URL exactly
3. **Check token format**: Should be URL-safe base64
4. **Check browser console**: Look for API errors

### Database Migration Issues

The database migration runs automatically on startup for SQLite. If you're using PostgreSQL:

```bash
fly ssh console -a api-broken-wind-9038
alembic upgrade head
exit
```

---

## 📚 API Endpoints

### Verify Email
```
GET /api/v1/auth/verify-email?token=<verification_token>
```

### Resend Verification
```
POST /api/v1/auth/resend-verification
Headers: Authorization: Bearer <token>
```

---

## 📊 Resend Dashboard Features

- **Email Logs**: See all sent emails with delivery status
- **Analytics**: Track opens, clicks, bounces
- **Webhooks**: Set up webhooks for delivery events (optional)
- **Rate Limits**: Free tier = 3,000 emails/month, 100 emails/day

---

## ✅ Complete Setup Checklist

- [ ] Signed up for Resend account
- [ ] Created API key in Resend dashboard
- [ ] Verified domain in Resend (or using test domain)
- [ ] Set `RESEND_API_KEY` secret on Fly.io
- [ ] Set `SMTP_FROM_EMAIL` secret on Fly.io
- [ ] Set `SMTP_FROM_NAME` secret on Fly.io
- [ ] Set `FRONTEND_URL` secret on Fly.io (your Netlify URL)
- [ ] Deployed backend to Fly.io
- [ ] Deployed frontend to Netlify
- [ ] Tested registration flow
- [ ] Verified email received in inbox
- [ ] Clicked verification link successfully
- [ ] Confirmed verification status in profile menu

---

**Email verification with Resend is now fully integrated!** 🎉
