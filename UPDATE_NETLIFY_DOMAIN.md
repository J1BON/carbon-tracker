# How to Update Netlify Domain Name in Fly.io

This guide will help you update your Netlify domain name and configure it properly in Fly.io.

## Step 1: Update Netlify Domain

1. Go to your Netlify dashboard
2. Navigate to your site settings
3. Go to **Domain settings**
4. Update your domain name (e.g., from `personalcarbontracker.netlify.app` to `your-new-domain.netlify.app`)
5. Note down your new domain URL

## Step 2: Update Fly.io Environment Variables

You need to set the following environment variables in Fly.io:

### Option A: Using Fly.io CLI (Recommended)

```bash
# Set the new Netlify URL
fly secrets set NETLIFY_URL=https://your-new-domain.netlify.app -a api-broken-wind-9038

# Set the frontend URL for email links
fly secrets set FRONTEND_URL=https://your-new-domain.netlify.app -a api-broken-wind-9038

# Set CORS origins (comma-separated list)
fly secrets set CORS_ORIGINS="https://your-new-domain.netlify.app,http://localhost:3000,http://localhost:5173" -a api-broken-wind-9038
```

### Option B: Using Fly.io Dashboard

1. Go to https://fly.io/dashboard
2. Select your app: `api-broken-wind-9038`
3. Go to **Secrets** tab
4. Add/Update these secrets:
   - `NETLIFY_URL` = `https://your-new-domain.netlify.app`
   - `FRONTEND_URL` = `https://your-new-domain.netlify.app`
   - `CORS_ORIGINS` = `https://your-new-domain.netlify.app,http://localhost:3000,http://localhost:5173`

## Step 3: Restart Fly.io App

After setting the secrets, restart your app:

```bash
fly apps restart api-broken-wind-9038
```

Or use the dashboard:
1. Go to your app in Fly.io dashboard
2. Click **Restart** button

## Step 4: Verify Configuration

1. Check that your API is running: `https://api-broken-wind-9038.fly.dev/health`
2. Test CORS by making a request from your new Netlify domain
3. Check the browser console for any CORS errors

## Step 5: Update Code (Optional - Already Done)

The code has been updated to:
- Read `NETLIFY_URL` from environment variable (defaults to old URL if not set)
- Use `FRONTEND_URL` from config for email links
- Support `CORS_ORIGINS` environment variable

## Troubleshooting

### CORS Errors

If you see CORS errors:
1. Verify `CORS_ORIGINS` includes your new Netlify URL
2. Make sure the URL includes `https://` protocol
3. Check that there are no trailing slashes
4. Restart the Fly.io app after updating secrets

### Email Links Not Working

If email verification links don't work:
1. Verify `FRONTEND_URL` is set correctly
2. Check that it matches your Netlify domain exactly
3. Make sure it includes `https://` protocol

### Check Current Configuration

To see what environment variables are set:

```bash
fly secrets list -a api-broken-wind-9038
```

## Example Commands

Replace `your-new-domain.netlify.app` with your actual new domain:

```bash
# Set all required secrets
fly secrets set \
  NETLIFY_URL=https://your-new-domain.netlify.app \
  FRONTEND_URL=https://your-new-domain.netlify.app \
  CORS_ORIGINS="https://your-new-domain.netlify.app,http://localhost:3000,http://localhost:5173" \
  -a api-broken-wind-9038

# Restart the app
fly apps restart api-broken-wind-9038

# Verify secrets are set
fly secrets list -a api-broken-wind-9038
```

## Notes

- The frontend automatically detects production and uses the Fly.io API URL
- No changes needed in the frontend code
- The old domain will still work until you remove it from CORS_ORIGINS
- You can have multiple domains in CORS_ORIGINS (comma-separated)

