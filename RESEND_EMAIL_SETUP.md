# 📧 Resend API Email Setup Guide

**Step-by-step guide to set up Resend API for email verification**

---

## 🚀 Quick Setup (5 minutes)

### Step 1: Create Resend Account

1. **Go to**: https://resend.com
2. **Click** "Sign Up" (top right)
3. **Sign up** with your email (or use GitHub/Google)
4. **Verify your email** (check inbox)

### Step 2: Get API Key

1. **After login**, you'll see the dashboard
2. **Click** "API Keys" in the left sidebar
3. **Click** "Create API Key" button
4. **Name it**: "Carbon Tracker" (or any name)
5. **Select permissions**: "Sending access" (default)
6. **Click** "Add"
7. **COPY THE API KEY** - it looks like: `re_1234567890abcdef...`
   - ⚠️ **You can only see it once!** Copy it now!

### Step 3: Add Domain (Required for Production)

**For localhost/testing**, you can use Resend's test domain first:

1. **Go to** "Domains" in sidebar
2. You'll see a default domain like: `resend.dev` (for testing)
3. **For production**, add your own domain:
   - Click "Add Domain"
   - Enter your domain (e.g., `yourdomain.com`)
   - Follow DNS setup instructions
   - Wait for verification (usually 5-10 minutes)

**For now, use the test domain** - it works for development!

### Step 4: Configure in Your Project

**Option A: Using Docker Compose (Recommended)**

Edit `docker-compose.yml`:

```yaml
api:
  environment:
    # ... existing environment variables ...
    RESEND_API_KEY: re_your_api_key_here
    SMTP_FROM_EMAIL: onboarding@resend.dev  # Use Resend's test domain
    SMTP_FROM_NAME: Carbon Tracker
```

**Option B: Using .env File**

Create or edit `api/.env`:

```env
# Resend API Configuration
RESEND_API_KEY=re_your_api_key_here
SMTP_FROM_EMAIL=onboarding@resend.dev
SMTP_FROM_NAME=Carbon Tracker

# Frontend URL (for verification links)
FRONTEND_URL=http://localhost:3000
```

### Step 5: Restart Backend

```bash
# If using Docker
docker compose restart api

# If running locally
# Stop backend (Ctrl+C) and restart:
cd api
uvicorn main:app --reload --port 8000
```

---

## ✅ Test It

### 1. Register a New User

Go to: http://localhost:3000/register

Fill in:
- Name
- Email (use your real email to test)
- Password

Click "Register"

### 2. Check Your Email

- Check your inbox (and spam folder)
- You should receive a verification email from Resend
- Click the "Verify Email Address" button

### 3. Check Backend Logs

```bash
docker compose logs api -f
```

You should see:
```
✅ Verification email sent to your-email@example.com via Resend
```

---

## 🔧 Configuration Details

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `RESEND_API_KEY` | Your Resend API key | `re_1234567890abcdef` |
| `SMTP_FROM_EMAIL` | Sender email address | `onboarding@resend.dev` (test) or `noreply@yourdomain.com` (production) |
| `SMTP_FROM_NAME` | Sender name | `Carbon Tracker` |
| `FRONTEND_URL` | Your frontend URL | `http://localhost:3000` (dev) or `https://yourdomain.com` (prod) |

### Using Test Domain (Resend.dev)

**For development/testing:**
- Use: `onboarding@resend.dev` or `noreply@resend.dev`
- Works immediately
- No domain setup needed
- Limited to 100 emails/day (free tier)

### Using Your Own Domain (Production)

**For production:**
1. Add domain in Resend dashboard
2. Add DNS records (SPF, DKIM, DMARC)
3. Wait for verification
4. Use: `noreply@yourdomain.com`

---

## 🐛 Troubleshooting

### Problem: "Invalid API key"

**Fix:**
- Check API key is correct (starts with `re_`)
- Make sure no extra spaces
- Copy from Resend dashboard again

### Problem: "Invalid from email"

**Fix:**
- For testing: Use `onboarding@resend.dev`
- For production: Use email from verified domain
- Check domain is verified in Resend dashboard

### Problem: "Email not sending"

**Check:**
```bash
# Check backend logs
docker compose logs api | Select-String -Pattern "email|Resend"

# Should see either:
# ✅ Verification email sent to ... via Resend
# OR
# ❌ Failed to send email via Resend: ...
```

**Common issues:**
- API key wrong
- From email not from verified domain
- Rate limit exceeded (100/day on free tier)

### Problem: "Emails going to spam"

**Fix:**
- Use your own verified domain (not resend.dev)
- Set up SPF, DKIM, DMARC records
- Use a proper from address (not no-reply)

---

## 📋 Quick Reference

### Resend Dashboard
- **URL**: https://resend.com
- **API Keys**: https://resend.com/api-keys
- **Domains**: https://resend.com/domains
- **Logs**: https://resend.com/emails (see sent emails)

### Free Tier Limits
- **100 emails/day**
- **3,000 emails/month**
- **Test domain included**

### Upgrade (if needed)
- **Pro Plan**: $20/month
- **10,000 emails/month**
- **Custom domain**
- **Better deliverability**

---

## 🎯 Complete Setup Example

### docker-compose.yml
```yaml
api:
  environment:
    DATABASE_URL: postgresql://postgres:postgres@postgres:5432/carbon_tracker
    SECRET_KEY: your-secret-key
    RESEND_API_KEY: re_your_actual_api_key_here
    SMTP_FROM_EMAIL: onboarding@resend.dev
    SMTP_FROM_NAME: Carbon Tracker
    FRONTEND_URL: http://localhost:3000
```

### Or api/.env
```env
RESEND_API_KEY=re_your_actual_api_key_here
SMTP_FROM_EMAIL=onboarding@resend.dev
SMTP_FROM_NAME=Carbon Tracker
FRONTEND_URL=http://localhost:3000
```

---

## ✅ Verification Checklist

- [ ] Resend account created
- [ ] API key generated and copied
- [ ] API key added to docker-compose.yml or .env
- [ ] SMTP_FROM_EMAIL set (use resend.dev for testing)
- [ ] Backend restarted
- [ ] Test registration
- [ ] Check email inbox
- [ ] Click verification link
- [ ] Email verified successfully

---

## 🆘 Still Having Issues?

1. **Check Resend Dashboard**:
   - Go to https://resend.com/emails
   - See if emails are being sent
   - Check for errors

2. **Check Backend Logs**:
   ```bash
   docker compose logs api -f
   ```

3. **Test API Key**:
   - Go to Resend dashboard
   - Try sending a test email
   - If that works, API key is correct

4. **Check Email Service Code**:
   - File: `api/app/services/email_service.py`
   - Should use Resend if `RESEND_API_KEY` is set

---

**That's it! Your email verification should now work!** 📧✅

