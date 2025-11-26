# 🚀 Complete Deployment Guide - Carbon Tracker

A beginner-friendly, step-by-step guide to deploy your Carbon Tracker application to a live web server.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Understanding .env Files - Complete Beginner Guide](#understanding-env-files---complete-beginner-guide)
4. [GitHub Setup & Deployment Guide - Step by Step](#github-setup--deployment-guide---step-by-step)
5. [Deployment Options](#deployment-options)
6. [Option 1: Vercel (Frontend) + Railway (Backend) - Recommended](#option-1-vercel-frontend--railway-backend---recommended)
7. [Option 2: Full Docker Deployment (VPS/Cloud)](#option-2-full-docker-deployment-vpscloud)
8. [Option 3: Netlify (Frontend) + Render (Backend)](#option-3-netlify-frontend--render-backend)
9. [Post-Deployment Checklist](#post-deployment-checklist)
10. [Troubleshooting](#troubleshooting)
11. [Maintenance & Updates](#maintenance--updates)

---

## 📖 Overview

This guide will help you deploy your Carbon Tracker application to a live server so it's accessible on the internet (not just localhost). We'll cover:

- **Frontend**: React application (web interface)
- **Backend**: FastAPI server (API)
- **Database**: PostgreSQL
- **ML Service**: Python ML service
- **Redis**: Caching service

---

## ✅ Prerequisites

Before starting, make sure you have:

- ✅ A GitHub account (for code hosting)
- ✅ Basic understanding of command line/terminal
- ✅ Your project code committed to Git
- ✅ A credit card (for some services, though many have free tiers)

**Recommended Services:**
- **Frontend**: Vercel (free) or Netlify (free)
- **Backend**: Railway (free tier) or Render (free tier)
- **Database**: Railway PostgreSQL (free) or Supabase (free)
- **Domain**: Namecheap, GoDaddy, or Google Domains (optional)

---

## 📝 Understanding .env Files - Complete Beginner Guide

### What is a .env File?

A `.env` file (short for "environment") is a simple text file that stores configuration settings and secrets for your application. Think of it as a **settings file** that your app reads to know:
- Where to connect to the database
- What secret keys to use
- Which API URLs to call
- Other important configuration

**Why use .env files?**
- ✅ Keeps secrets out of your code
- ✅ Easy to change settings without editing code
- ✅ Different settings for development vs production
- ✅ Never commit secrets to GitHub (security!)

### How .env Files Work

```
Your Code → Reads .env file → Gets settings → Runs app
```

**Example:**
```env
DATABASE_URL=postgresql://user:pass@localhost:5432/mydb
SECRET_KEY=my-secret-key-123
```

Your code reads these values and uses them.

---

### Step-by-Step: Creating .env Files

#### Step 1: Understand Your Project Structure

Your Carbon Tracker project has **two places** that need `.env` files:

```
carbon-tracker/
├── api/          ← Backend needs .env here
├── web/          ← Frontend needs .env here
└── ml/           ← ML service needs .env here (optional)
```

#### Step 2: Create Backend .env File (api/.env)

1. **Open your project folder** in File Explorer (Windows) or Finder (Mac)
2. **Navigate to the `api` folder**
3. **Create a new file** named exactly `.env` (with the dot at the start!)
   - **Windows**: Right-click → New → Text Document → Rename to `.env`
   - **Mac/Linux**: Create file named `.env`

4. **Open `.env` in a text editor** (Notepad, VS Code, etc.)

5. **Copy and paste this template:**
   ```env
   # Database Connection
   # This tells your backend where to find the database
   DATABASE_URL=postgresql://postgres:password@localhost:5432/carbon_tracker
   
   # Secret Key for JWT Tokens
   # Generate a random string (see instructions below)
   SECRET_KEY=your-super-secret-key-change-this-immediately
   
   # CORS Settings (which websites can access your API)
   # For local development, use:
   CORS_ORIGINS=http://localhost:5173,http://localhost:3000
   
   # Port (where API runs)
   PORT=8000
   ```

6. **Replace the values:**
   - `DATABASE_URL`: Update with your database credentials
   - `SECRET_KEY`: Generate a secure key (see below)
   - `CORS_ORIGINS`: Add your frontend URLs

7. **Save the file**

#### Step 3: Generate a Secure SECRET_KEY

**Option A: Using Command Line (Recommended)**
```bash
# Windows (PowerShell)
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})

# Mac/Linux
openssl rand -hex 32

# Or use Python
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

**Option B: Online Generator**
- Visit: https://randomkeygen.com/
- Copy a "CodeIgniter Encryption Keys" value
- Paste into `SECRET_KEY=`

**Example result:**
```
SECRET_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
```

#### Step 4: Create Frontend .env File (web/.env)

1. **Navigate to the `web` folder**
2. **Create a new file** named `.env`
3. **Open it in a text editor**
4. **Copy and paste this template:**
   ```env
   # Backend API URL
   # This tells your frontend where to find the backend API
   VITE_API_URL=http://localhost:8000
   
   # ML Service URL (optional)
   VITE_ML_SERVICE_URL=http://localhost:8001
   
   # Mapbox Token (if using maps)
   # Get from: https://account.mapbox.com/access-tokens/
   VITE_MAPBOX_TOKEN=your_mapbox_token_here
   ```

5. **Update the values:**
   - `VITE_API_URL`: Your backend URL (localhost for dev, production URL for deployment)
   - `VITE_ML_SERVICE_URL`: Your ML service URL (if using)
   - `VITE_MAPBOX_TOKEN`: Your Mapbox token (if using maps)

6. **Save the file**

---

### Important Rules for .env Files

#### ✅ DO:
- ✅ Create `.env` files in the correct folders (`api/` and `web/`)
- ✅ Use exact variable names (case-sensitive!)
- ✅ Put each variable on its own line
- ✅ No spaces around the `=` sign
- ✅ Use quotes only if the value has spaces
- ✅ Keep `.env` files private (never commit to GitHub!)

#### ❌ DON'T:
- ❌ Don't put spaces around `=` (wrong: `KEY = value`, correct: `KEY=value`)
- ❌ Don't use quotes unless needed (most values don't need quotes)
- ❌ Don't commit `.env` to GitHub (security risk!)
- ❌ Don't share your `.env` file with others
- ❌ Don't use the same `SECRET_KEY` in production as development

---

### Understanding Each Variable

#### Backend Variables (api/.env)

| Variable | What It Does | Example |
|----------|---------------|---------|
| `DATABASE_URL` | Tells backend where database is | `postgresql://user:pass@host:5432/dbname` |
| `SECRET_KEY` | Used to encrypt JWT tokens | `a1b2c3d4e5f6...` (random string) |
| `CORS_ORIGINS` | Which websites can access API | `http://localhost:5173,https://myapp.com` |
| `PORT` | Port number API runs on | `8000` |

#### Frontend Variables (web/.env)

| Variable | What It Does | Example |
|----------|---------------|---------|
| `VITE_API_URL` | Where frontend finds backend | `http://localhost:8000` |
| `VITE_ML_SERVICE_URL` | Where ML service is located | `http://localhost:8001` |
| `VITE_MAPBOX_TOKEN` | Token for map features | `pk.eyJ1Ijoi...` |

**Note:** Frontend variables MUST start with `VITE_` for Vite to read them!

---

### Creating .env.example Files (Template for Others)

`.env.example` files are **templates** that show what variables are needed, but without real values. These ARE safe to commit to GitHub.

**Create `api/.env.example`:**
```env
# Database Connection
DATABASE_URL=postgresql://user:password@host:5432/dbname

# Secret Key (generate your own!)
SECRET_KEY=your-secret-key-here

# CORS Settings
CORS_ORIGINS=http://localhost:5173,https://your-app.vercel.app

# Port
PORT=8000
```

**Create `web/.env.example`:**
```env
# Backend API URL
VITE_API_URL=http://localhost:8000

# ML Service URL
VITE_ML_SERVICE_URL=http://localhost:8001

# Mapbox Token
VITE_MAPBOX_TOKEN=your_mapbox_token_here
```

**Why .env.example?**
- Shows what variables are needed
- Safe to commit to GitHub (no secrets!)
- Helps other developers set up the project

---

### ⚠️ IMPORTANT: Set Up Your Development Environment First!

**Before testing your .env files or running your app, you MUST install all dependencies!**

#### Step 1: Install Backend Dependencies

**First, check if Python is installed:**
```bash
python --version
# Or try:
python3 --version
# Or:
py --version
```

**If Python is NOT installed:**
1. Download Python from [python.org](https://www.python.org/downloads/)
2. **IMPORTANT:** During installation, check ✅ **"Add Python to PATH"**
3. Restart your terminal/PowerShell after installation

**Install all Python dependencies:**

```bash
# Navigate to api folder
cd api

# IMPORTANT: Upgrade pip first (prevents many installation issues!)
python -m pip install --upgrade pip

# Then install dependencies (try these methods in order):

# Method 1: Use python -m pip (recommended - works even if pip isn't in PATH)
python -m pip install -r requirements.txt

# Method 2: Standard pip (if pip is in PATH)
pip install -r requirements.txt

# Method 3: Try python3 (Mac/Linux)
python3 -m pip install -r requirements.txt

# Method 4: Try py launcher (Windows)
py -m pip install -r requirements.txt
```

**If you get "pg_config executable not found" error:**
- See the troubleshooting section below for detailed fixes
- Quick fix: Install psycopg2-binary separately first: `python -m pip install psycopg2-binary==2.9.9`

**This will install:**
- FastAPI (web framework)
- python-dotenv (for reading .env files)
- PostgreSQL driver
- All other required packages

**Expected output:**
```
Collecting fastapi==0.109.0
Collecting python-dotenv==1.0.0
...
Successfully installed fastapi-0.109.0 python-dotenv-1.0.0 ...
```

**If you get permission errors:**
```bash
# Windows: Run PowerShell as Administrator
# Or use:
python -m pip install --user -r requirements.txt

# Mac/Linux: Use sudo (not recommended) or create virtual environment
```

#### Step 2: Install Frontend Dependencies

```bash
# Navigate to web folder
cd web

# Install all Node.js dependencies
npm install
```

**Expected output:**
```
added 1234 packages in 2m
```

#### Step 3: Verify Installation

**Test Backend:**
```bash
cd api
python -c "import fastapi; print('FastAPI installed successfully!')"
```

**Test Frontend:**
```bash
cd web
npm list --depth=0  # Should show installed packages
```

---

### 🔧 Troubleshooting: "pip is not recognized"

If you see `'pip' is not recognized as an internal or external command`, follow these steps:

#### Solution 1: Use `python -m pip` (Easiest - Works Immediately!)

Instead of `pip`, use `python -m pip`:

```bash
cd api
python -m pip install -r requirements.txt
```

**Why this works:** This tells Python to run pip as a module, which works even if pip isn't in your PATH.

**Alternative commands to try:**
```bash
# Windows - try Python launcher
py -m pip install -r requirements.txt

# Mac/Linux - try python3
python3 -m pip install -r requirements.txt
```

#### Solution 2: Check if Python is Installed

```bash
# Try these commands:
python --version
py --version      # Windows
python3 --version # Mac/Linux
```

**If none work, Python is not installed:**
1. Go to [python.org/downloads](https://www.python.org/downloads/)
2. Download Python 3.11 or newer
3. **IMPORTANT:** During installation, check ✅ **"Add Python to PATH"**
4. Click "Install Now"
5. **Restart your terminal/PowerShell** after installation
6. Try again: `python -m pip install -r requirements.txt`

#### Solution 3: Add Python to PATH Manually (Windows)

If Python is installed but still not recognized:

1. **Find Python installation:**
   - Usually: `C:\Users\YourName\AppData\Local\Programs\Python\Python3xx`
   - Or: `C:\Python3xx`

2. **Add to PATH:**
   - Press `Win + R`, type `sysdm.cpl`, press Enter
   - Click "Advanced" tab → "Environment Variables"
   - Under "System variables", find "Path" → Click "Edit"
   - Click "New" and add:
     - `C:\Python3xx` (replace with your Python path)
     - `C:\Python3xx\Scripts`
   - Click "OK" on all windows
   - **Restart terminal/PowerShell**

3. **Verify:**
   ```bash
   python --version
   python -m pip --version
   ```

#### Solution 4: Reinstall Python with PATH Option

1. Uninstall Python (Control Panel → Programs)
2. Download fresh from [python.org](https://www.python.org/downloads/)
3. **During installation:**
   - Check ✅ "Add Python to PATH"
   - Choose "Install for all users" (optional)
4. Restart terminal
5. Test: `python -m pip install -r requirements.txt`

#### Quick Test Commands

Run these to diagnose the issue:

```bash
# Check Python
python --version
py --version
python3 --version

# Check pip (try all methods)
pip --version
python -m pip --version
py -m pip --version
python3 -m pip --version

# Find Python location (Windows)
where python
where py

# Find Python location (Mac/Linux)
which python
which python3
```

**Once you find which command works, use that for all pip commands!**

For example, if `py -m pip --version` works, always use:
```bash
py -m pip install -r requirements.txt
```

#### Common Installation Issues

| Problem | Solution |
|---------|----------|
| `'pip' is not recognized` or `pip: command not found` | **Try these solutions:**<br>1. Use `python -m pip` instead of `pip`<br>2. Install Python from [python.org](https://www.python.org/downloads/) and check ✅ "Add Python to PATH"<br>3. Restart terminal after installing Python<br>4. Try `py -m pip` (Windows Python launcher) |
| `'python' is not recognized` | **Install Python:**<br>1. Download from [python.org](https://www.python.org/downloads/)<br>2. During install, check ✅ "Add Python to PATH"<br>3. Restart terminal<br>4. Try `py` command (Windows) or `python3` (Mac/Linux) |
| `npm: command not found` | Install Node.js from [nodejs.org](https://nodejs.org/) |
| `Permission denied` | Use `python -m pip install --user -r requirements.txt` or create a virtual environment |
| `ModuleNotFoundError` | Make sure you're in the correct folder (`api/` or `web/`) and dependencies are installed |
| `Package installation fails` | Update pip: `python -m pip install --upgrade pip` |
| `Python not in PATH` | **Windows:** Add Python to PATH manually:<br>1. Search "Environment Variables" in Windows<br>2. Edit "Path" variable<br>3. Add: `C:\Python3x` and `C:\Python3x\Scripts`<br>4. Restart terminal |
| `Error: pg_config executable not found` (psycopg2-binary) | **Windows fix:**<br>1. Upgrade pip: `python -m pip install --upgrade pip`<br>2. Install psycopg2-binary separately: `python -m pip install psycopg2-binary`<br>3. Then install other packages: `python -m pip install -r requirements.txt`<br>**OR** Install Microsoft C++ Build Tools (see detailed fix below) |

---

### 🔧 Troubleshooting: "pg_config executable not found" (psycopg2-binary Error)

If you see this error when installing `psycopg2-binary` on Windows, try these solutions:

#### Solution 1: Force Pre-built Wheels (Try This First!)

```bash
cd api

# Step 1: Upgrade pip to latest version (CRITICAL!)
python -m pip install --upgrade pip

# Step 2: Force pip to use ONLY pre-built wheels (no building from source)
python -m pip install --only-binary :all: --upgrade pip setuptools wheel

# Step 3: Install psycopg2-binary with wheel-only flag
python -m pip install --only-binary :all: psycopg2-binary==2.9.9

# Step 4: Now install the rest of the requirements
python -m pip install -r requirements.txt
```

**If Solution 1 still fails, try this alternative:**

```bash
cd api

# Upgrade pip
python -m pip install --upgrade pip setuptools wheel

# Try installing with specific Python version compatibility
python -m pip install psycopg2-binary==2.9.9 --no-build-isolation

# If that fails, try without version pinning
python -m pip install psycopg2-binary --only-binary :all:

# Then install rest
python -m pip install -r requirements.txt
```

**Why this works:** The `--only-binary :all:` flag forces pip to use pre-built wheels and prevents building from source.

#### Solution 2: Skip psycopg2-binary Temporarily (Most Reliable!)

This method installs everything else first, then adds psycopg2-binary:

```bash
cd api

# Step 1: Create a temporary requirements file without psycopg2-binary
# Open requirements.txt in a text editor
# Find the line: psycopg2-binary==2.9.9
# Add a # at the start to comment it out: # psycopg2-binary==2.9.9
# Save the file

# Step 2: Install everything else
python -m pip install --upgrade pip
python -m pip install -r requirements.txt

# Step 3: Now try to install psycopg2-binary separately with wheel-only
python -m pip install --only-binary :all: psycopg2-binary==2.9.9

# Step 4: If that fails, try without version pinning
python -m pip install --only-binary :all: psycopg2-binary

# Step 5: Uncomment the line in requirements.txt (remove the #)
# This ensures future installs include it
```

**Quick PowerShell command to comment out the line:**
```powershell
cd api
(Get-Content requirements.txt) -replace '^psycopg2-binary', '# psycopg2-binary' | Set-Content requirements.txt
```

**After installation, restore it:**
```powershell
(Get-Content requirements.txt) -replace '^# psycopg2-binary', 'psycopg2-binary' | Set-Content requirements.txt
```

#### Solution 3: Install Microsoft Visual C++ Build Tools (If Solutions 1 & 2 Don't Work)

If the above doesn't work, you need C++ build tools:

1. **Download Visual Studio Build Tools:**
   - Go to: https://visualstudio.microsoft.com/downloads/
   - Scroll down to "Tools for Visual Studio"
   - Download "Build Tools for Visual Studio 2022"

2. **Install:**
   - Run the installer
   - Select "Desktop development with C++" workload
   - Click "Install"
   - Wait for installation (this takes 10-20 minutes)

3. **Restart your terminal/PowerShell**

4. **Try installing again:**
   ```bash
   cd api
   python -m pip install --upgrade pip
   python -m pip install -r requirements.txt
   ```

#### Solution 4: Try Different psycopg2-binary Versions

Sometimes a different version has better Windows wheel support:

```bash
cd api
python -m pip install --upgrade pip

# Try latest version (might have better wheel support)
python -m pip install --only-binary :all: psycopg2-binary

# Or try a slightly older version
python -m pip install --only-binary :all: psycopg2-binary==2.9.8

# Or try newest 2.9.x
python -m pip install --only-binary :all: "psycopg2-binary>=2.9.0,<3.0.0"

# Then install rest
python -m pip install -r requirements.txt
```

#### Solution 5: Use Pre-built Wheel with Specific Python Version

```bash
cd api

# Check your Python version
python --version

# Upgrade pip and tools
python -m pip install --upgrade pip setuptools wheel

# Install with explicit platform tag (Windows 64-bit)
python -m pip install psycopg2-binary==2.9.9 --platform win_amd64 --only-binary :all: --no-deps

# Then install dependencies
python -m pip install -r requirements.txt
```

#### Solution 6: Install PostgreSQL Client (Alternative)

If you have PostgreSQL installed, add it to PATH:

1. **Find PostgreSQL installation:**
   - Usually: `C:\Program Files\PostgreSQL\15\bin` (version may vary)

2. **Add to PATH:**
   - Press `Win + R`, type `sysdm.cpl`, press Enter
   - Click "Advanced" → "Environment Variables"
   - Edit "Path" → Add PostgreSQL bin folder
   - Restart terminal

3. **Try installing again:**
   ```bash
   python -m pip install -r requirements.txt
   ```

---

### 🎯 Recommended Solution Order

**Try these in order until one works:**

1. **Solution 1** - Force pre-built wheels (most common fix)
2. **Solution 2** - Skip psycopg2-binary temporarily, install rest, then add it
3. **Solution 4** - Try different psycopg2-binary versions
4. **Solution 3** - Install Microsoft Visual C++ Build Tools (if you have time)
5. **Solution 5** - Use platform-specific wheel installation

**Most users succeed with Solution 1 or Solution 2!**

### ⚠️ If All Solutions Fail

If none of the above work, you can temporarily work without psycopg2-binary for local development:

1. Comment out `psycopg2-binary==2.9.9` in `requirements.txt`
2. Install other dependencies
3. Use SQLite for local development (modify `DATABASE_URL` in `.env`)
4. Install psycopg2-binary later when deploying to production (Railway/Render handle this automatically)

**For production deployment:** Railway and Render automatically handle psycopg2-binary installation, so this is mainly a local development issue.

#### Quick Test After Installation

```bash
# Test if psycopg2-binary is installed
python -c "import psycopg2; print('psycopg2-binary installed successfully!')"
```

**Expected output:**
```
psycopg2-binary installed successfully!
```

#### Why Does This Happen?

- `psycopg2-binary` sometimes tries to build from source on Windows
- Building from source requires C++ compiler and PostgreSQL development tools
- The solution is to use pre-built wheels (which Solution 1 does by upgrading pip)

**Most users find Solution 1 works!** Try that first before installing build tools.

---

#### Using a Virtual Environment (Recommended for Python)

**Why use a virtual environment?**
- Keeps project dependencies separate
- Avoids conflicts between projects
- Best practice for Python development

**Set up virtual environment:**

```bash
# Navigate to api folder
cd api

# Create virtual environment
python -m venv venv

# Activate it:
# Windows (PowerShell):
.\venv\Scripts\Activate.ps1

# Windows (Command Prompt):
venv\Scripts\activate.bat

# Mac/Linux:
source venv/bin/activate

# Now install dependencies
python -m pip install -r requirements.txt
# Or: py -m pip install -r requirements.txt (Windows)
# Or: python3 -m pip install -r requirements.txt (Mac/Linux)
```

**You'll know it's activated when you see `(venv)` in your terminal prompt.**

**To deactivate later:**
```bash
deactivate
```

---

### Testing Your .env Files

#### Method 1: Install Dependencies First (Recommended)

If you get `ModuleNotFoundError: No module named 'dotenv'`, you need to install the project dependencies:

```bash
# Navigate to api folder
cd api

# Install all dependencies (python-dotenv is included in requirements.txt)
python -m pip install -r requirements.txt
# Or try: py -m pip install -r requirements.txt (Windows)
# Or try: python3 -m pip install -r requirements.txt (Mac/Linux)

# Or install just python-dotenv:
python -m pip install python-dotenv
```

**Note:** `python-dotenv` is already in your `requirements.txt` file, so running `pip install -r requirements.txt` will install it along with all other dependencies.

**Then test:**
```bash
# Test if .env file is being read
python -c "import os; from dotenv import load_dotenv; load_dotenv(); print('SECRET_KEY:', os.getenv('SECRET_KEY'))"
```

**Expected output:**
```
SECRET_KEY: your-secret-key-here
```

If you see `None`, your `.env` file might not be in the right location or the variable name is wrong.

#### Method 2: Simple File Check (No Installation Needed)

**Easiest way - just check if the file exists:**

```bash
# Windows (PowerShell)
cd api
Test-Path .env  # Should return: True

# Mac/Linux
cd api
ls -la .env  # Should show the file
```

**Then manually open the file** in a text editor to verify the contents.

#### Method 3: Test by Running Your App

**The best test is to actually run your application:**

**⚠️ IMPORTANT: Make sure you've installed dependencies first!** (See section above)

**Backend:**
```bash
cd api

# Make sure dependencies are installed
python -m pip install -r requirements.txt
# Or: py -m pip install -r requirements.txt (Windows)

# Then run the app
python main.py
# Or
uvicorn main:app --reload
```

**If you see `ModuleNotFoundError: No module named 'fastapi'`:**
- You need to install dependencies first: `pip install -r requirements.txt`
- See "Setting Up Your Development Environment" section above

**If the app starts without errors**, your `.env` file is working! 

**If you see "DATABASE_URL not found" or similar errors**, check your `.env` file location and variable names.

**Frontend:**
```bash
cd web
npm run dev
```

Open your browser and check the console (F12). If you see API calls working, your `.env` file is correct!

#### Method 4: Quick Python Test (If dotenv is Installed)

```bash
cd api

# Create a test file
python -c "
import os
from dotenv import load_dotenv

# Load .env file
load_dotenv()

# Test variables
print('DATABASE_URL:', 'SET' if os.getenv('DATABASE_URL') else 'NOT SET')
print('SECRET_KEY:', 'SET' if os.getenv('SECRET_KEY') else 'NOT SET')
print('CORS_ORIGINS:', os.getenv('CORS_ORIGINS', 'NOT SET'))
"
```

**Expected output:**
```
DATABASE_URL: SET
SECRET_KEY: SET
CORS_ORIGINS: http://localhost:5173,http://localhost:3000
```

#### Troubleshooting Test Failures

| Error | Solution |
|-------|----------|
| `ModuleNotFoundError: No module named 'dotenv'` | Run `pip install python-dotenv` |
| `None` returned | Check `.env` file is in `api/` folder, not project root |
| File not found | Make sure file is named exactly `.env` (with the dot!) |
| Variables show `None` | Check spelling matches exactly (case-sensitive!) |

---

### Common Mistakes & Fixes

| Problem | Solution |
|---------|----------|
| `ModuleNotFoundError: No module named 'fastapi'` | **Install dependencies first:** `cd api && pip install -r requirements.txt` |
| `ModuleNotFoundError: No module named 'dotenv'` | **Install dependencies:** `cd api && pip install -r requirements.txt` |
| "Variable not found" | Check spelling, make sure file is named `.env` (not `env.txt`) |
| "Can't connect to database" | Check `DATABASE_URL` format and credentials |
| "CORS error" | Add your frontend URL to `CORS_ORIGINS` |
| Frontend variables not working | Make sure they start with `VITE_` |
| File not found | Make sure `.env` is in the correct folder (`api/` or `web/`) |
| `npm: command not found` | Install Node.js from nodejs.org |
| `pip: command not found` | Install Python from python.org (check "Add to PATH") |

---

## 🐙 GitHub Setup & Deployment Guide - Step by Step

### What is GitHub?

GitHub is a website where you can:
- Store your code online (like Google Drive for code)
- Share your code with others
- Deploy your app automatically
- Track changes to your code

Think of it as a **cloud backup** for your code that also helps you deploy!

---

### Step 1: Create a GitHub Account

1. **Go to** [github.com](https://github.com)
2. **Click** "Sign up" (top right)
3. **Enter** your email, create a password
4. **Verify** your email address
5. **Complete** the setup wizard

**That's it!** You now have a GitHub account.

---

### Step 2: Install Git on Your Computer

Git is the tool that talks to GitHub. You need it installed.

#### Windows:
1. **Download Git:** https://git-scm.com/download/win
2. **Run the installer** (click "Next" through all steps)
3. **Open PowerShell** or Command Prompt
4. **Test installation:**
   ```bash
   git --version
   ```
   Should show something like: `git version 2.40.0`

#### Mac:
```bash
# Open Terminal and run:
git --version
# If not installed, it will prompt you to install Xcode Command Line Tools
```

#### Linux:
```bash
sudo apt update
sudo apt install git
git --version
```

---

### Step 3: Configure Git (First Time Only)

Tell Git who you are:

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

**Replace with your actual name and email!**

**Verify:**
```bash
git config --global user.name
git config --global user.email
```

---

### Step 4: Create a New Repository on GitHub

1. **Log in** to GitHub.com
2. **Click** the "+" icon (top right) → "New repository"
3. **Fill in:**
   - **Repository name**: `carbon-tracker` (or your project name)
   - **Description**: "Personal Carbon Footprint Tracker"
   - **Visibility**: Choose "Public" (free) or "Private" (if you have GitHub Pro)
   - **DO NOT** check "Initialize with README" (you already have code)
4. **Click** "Create repository"

**You'll see a page with instructions - DON'T follow them yet!** We'll do it step by step.

---

### Step 5: Prepare Your Local Code

Before pushing to GitHub, make sure your code is ready:

#### 5.1 Check if Git is Already Initialized

```bash
# Navigate to your project folder
cd C:\Projects\root  # or wherever your project is

# Check if Git is initialized
ls -a  # Mac/Linux
dir /a  # Windows (shows hidden files)
```

**If you see a `.git` folder**, Git is already initialized. Skip to Step 6.

**If you DON'T see a `.git` folder**, continue to Step 5.2.

#### 5.2 Initialize Git (If Not Already Done)

```bash
# Make sure you're in your project root folder
cd C:\Projects\root

# Initialize Git
git init
```

You should see: `Initialized empty Git repository in...`

#### 5.3 Create .gitignore File

This file tells Git which files to **ignore** (don't upload to GitHub).

**Create `.gitignore` in your project root:**

```gitignore
# Environment variables (NEVER commit these!)
.env
.env.local
.env.production
api/.env
web/.env
ml/.env

# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
venv/
env/
ENV/

# Node
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
dist/
build/

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log

# Database
*.db
*.sqlite
```

**Why .gitignore?**
- Keeps secrets safe (`.env` files)
- Reduces repository size (excludes `node_modules/`)
- Prevents conflicts (excludes build files)

---

### Step 6: Add Your Code to Git

This tells Git which files to track:

```bash
# Make sure you're in project root
cd C:\Projects\root

# Add all files (except those in .gitignore)
git add .

# Check what will be committed
git status
```

**You should see a list of files that will be added.**

**Important:** Make sure `.env` files are NOT in the list! If they are, check your `.gitignore`.

---

### Step 7: Commit Your Code

A "commit" is like saving a snapshot of your code:

```bash
# Create your first commit
git commit -m "Initial commit: Carbon Tracker project"
```

**The `-m` flag** is the commit message (description of what you're saving).

**You should see:** `[main (or master) xxxxxxx] Initial commit...`

---

### Step 8: Connect to GitHub Repository

Now link your local code to the GitHub repository you created:

```bash
# Replace 'yourusername' with your GitHub username
# Replace 'carbon-tracker' with your repository name
git remote add origin https://github.com/yourusername/carbon-tracker.git

# Verify it's connected
git remote -v
```

**You should see:**
```
origin  https://github.com/yourusername/carbon-tracker.git (fetch)
origin  https://github.com/yourusername/carbon-tracker.git (push)
```

---

### Step 9: Push Your Code to GitHub

This uploads your code to GitHub:

```bash
# Push to GitHub (first time)
git branch -M main  # Rename branch to 'main' (if needed)
git push -u origin main
```

**You'll be asked to log in:**
- **Username**: Your GitHub username
- **Password**: Use a **Personal Access Token** (not your GitHub password!)

#### Creating a Personal Access Token:

1. **Go to** GitHub.com → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. **Click** "Generate new token (classic)"
3. **Name it**: "My Computer" or "Local Development"
4. **Select scopes**: Check `repo` (full control)
5. **Click** "Generate token"
6. **COPY THE TOKEN** (you won't see it again!)
7. **Use this token** as your password when pushing

**After successful push, you should see:**
```
Enumerating objects: X, done.
Writing objects: 100% (X/X), done.
```

---

### Step 10: Verify on GitHub

1. **Go to** your GitHub repository: `https://github.com/yourusername/carbon-tracker`
2. **Refresh the page**
3. **You should see all your files!** 🎉

---

### Step 11: Making Changes and Updating GitHub

Whenever you make changes to your code:

```bash
# 1. Check what changed
git status

# 2. Add changed files
git add .

# 3. Commit with a message
git commit -m "Added new feature: carbon calculator"

# 4. Push to GitHub
git push
```

**That's it!** Your changes are now on GitHub.

---

### Step 12: Setting Up Automatic Deployment

Once your code is on GitHub, you can set up automatic deployment:

#### For Railway (Backend):
1. **Go to** Railway.app
2. **Click** "New Project"
3. **Select** "Deploy from GitHub repo"
4. **Choose** your repository
5. **Railway will automatically deploy** whenever you push to GitHub!

#### For Vercel (Frontend):
1. **Go to** Vercel.com
2. **Click** "Add New" → "Project"
3. **Import** your GitHub repository
4. **Configure** settings (see Option 1 section)
5. **Vercel will automatically deploy** on every push!

---

### Common Git Commands Cheat Sheet

| Command | What It Does |
|---------|--------------|
| `git status` | See what files changed |
| `git add .` | Add all changes |
| `git add filename` | Add specific file |
| `git commit -m "message"` | Save changes with message |
| `git push` | Upload to GitHub |
| `git pull` | Download from GitHub |
| `git log` | See commit history |
| `git clone URL` | Download repository |

---

### Troubleshooting GitHub Issues

#### Problem: "Repository not found"
**Solution:** Check your repository URL and make sure you're logged in.

#### Problem: "Permission denied"
**Solution:** Use a Personal Access Token instead of password.

#### Problem: "Failed to push"
**Solution:** 
```bash
# Pull latest changes first
git pull origin main --rebase

# Then push again
git push
```

#### Problem: "Branch is behind"
**Solution:**
```bash
git pull origin main
git push
```

---

### Security Checklist

Before pushing to GitHub, make sure:

- ✅ `.env` files are in `.gitignore`
- ✅ No passwords or API keys in code
- ✅ `.gitignore` is working (check `git status`)
- ✅ Using Personal Access Token (not password)
- ✅ Repository is Private (if it contains sensitive code)

---

## 🎯 Deployment Options

### Quick Comparison

| Option | Difficulty | Cost | Best For |
|--------|-----------|------|----------|
| **Option 1: Vercel + Railway** | ⭐ Easy | Free | Beginners, quick deployment |
| **Option 2: Docker on VPS** | ⭐⭐⭐ Advanced | $5-20/month | Full control, production |
| **Option 3: Netlify + Render** | ⭐⭐ Medium | Free | Alternative to Option 1 |

**We recommend Option 1 for beginners!**

---

## 🎯 Option 1: Vercel (Frontend) + Railway (Backend) - Recommended

This is the easiest and fastest way to deploy. Perfect for beginners!

### Step 1: Prepare Your Code

1. **Push your code to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Create a `.env.example` file** in your project root:
   ```env
   # Frontend (.env.example in web/)
   VITE_API_URL=https://your-api-url.railway.app
   VITE_ML_SERVICE_URL=https://your-ml-service.railway.app
   VITE_MAPBOX_TOKEN=your_mapbox_token

   # Backend (.env.example in api/)
   DATABASE_URL=postgresql://user:password@host:5432/dbname
   SECRET_KEY=your-secret-key-here
   CORS_ORIGINS=https://your-frontend.vercel.app,https://www.yourdomain.com
   ```

### Step 2: Deploy Backend to Railway

#### 2.1 Create Railway Account

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your Carbon Tracker repository

#### 2.2 Set Up PostgreSQL Database

1. In your Railway project, click **"+ New"**
2. Select **"Database"** → **"Add PostgreSQL"**
3. Wait for database to provision
4. Click on the database service
5. Go to **"Variables"** tab
6. Copy the `DATABASE_URL` value (you'll need this later)

#### 2.3 Deploy API Service

1. In Railway project, click **"+ New"**
2. Select **"GitHub Repo"** → Choose your repo
3. Railway will detect it's a Python project
4. **Configure the service:**
   - **Root Directory**: `api`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Build Command**: `pip install -r requirements.txt`

5. **Add Environment Variables** (click on service → Variables):
   ```env
   DATABASE_URL=<paste from PostgreSQL service>
   SECRET_KEY=<generate a random string, e.g., openssl rand -hex 32>
   CORS_ORIGINS=https://your-app.vercel.app
   PORT=8000
   ```

6. **Run Database Migrations:**
   - Click on API service → **"Deployments"** → **"View Logs"**
   - Click **"Shell"** tab
   - Run: `alembic upgrade head`

7. **Get Your API URL:**
   - Click on API service → **"Settings"** → **"Generate Domain"**
   - Copy the URL (e.g., `carbon-tracker-api.railway.app`)

#### 2.4 Deploy ML Service (Optional)

1. In Railway project, click **"+ New"**
2. Select **"GitHub Repo"** → Choose your repo
3. **Configure:**
   - **Root Directory**: `ml`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Build Command**: `pip install -r requirements.txt`

4. **Add Environment Variables:**
   ```env
   PORT=8001
   ```

5. **Generate Domain** and copy the URL

### Step 3: Deploy Frontend to Vercel

#### 3.1 Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click **"Add New"** → **"Project"**
4. Import your GitHub repository

#### 3.2 Configure Frontend

1. **Project Settings:**
   - **Framework Preset**: Vite
   - **Root Directory**: `web`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

2. **Environment Variables** (click "Environment Variables"):
   ```env
   VITE_API_URL=https://your-api-url.railway.app
   VITE_ML_SERVICE_URL=https://your-ml-service.railway.app
   VITE_MAPBOX_TOKEN=your_mapbox_token_here
   ```

3. **Update CORS in Backend:**
   - Go back to Railway API service
   - Add your Vercel URL to `CORS_ORIGINS`:
     ```env
     CORS_ORIGINS=https://your-app.vercel.app,https://your-app-username.vercel.app
     ```

4. Click **"Deploy"**

5. **Get Your Frontend URL:**
   - After deployment, Vercel will give you a URL like: `your-app.vercel.app`

### Step 4: Update API CORS Settings

1. Go to Railway → API service → Variables
2. Update `CORS_ORIGINS`:
   ```env
   CORS_ORIGINS=https://your-app.vercel.app,https://your-app-username.vercel.app
   ```
3. Railway will automatically redeploy

### Step 5: Test Your Deployment

1. Visit your Vercel URL: `https://your-app.vercel.app`
2. Try logging in
3. Check browser console (F12) for errors
4. Test API: `https://your-api-url.railway.app/health`

---

## 🐳 Option 2: Full Docker Deployment (VPS/Cloud)

For advanced users who want full control. Deploy everything on a VPS (DigitalOcean, AWS EC2, etc.).

### Step 1: Choose a VPS Provider

**Recommended:**
- **DigitalOcean**: $6/month (Droplet)
- **AWS EC2**: Free tier available
- **Linode**: $5/month
- **Vultr**: $6/month

### Step 2: Set Up Your Server

#### 2.1 Create a Droplet/Instance

1. Create account on your chosen provider
2. Create a new server:
   - **OS**: Ubuntu 22.04 LTS
   - **Size**: 2GB RAM minimum (4GB recommended)
   - **Region**: Choose closest to your users

#### 2.2 Connect to Your Server

```bash
ssh root@your-server-ip
```

### Step 3: Install Docker & Docker Compose

```bash
# Update system
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
apt install docker-compose -y

# Verify installation
docker --version
docker-compose --version
```

### Step 4: Clone Your Repository

```bash
# Install Git
apt install git -y

# Clone your repo
git clone https://github.com/yourusername/carbon-tracker.git
cd carbon-tracker
```

### Step 5: Configure Environment Variables

```bash
# Create .env file
nano .env
```

Add these variables:
```env
# Database
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_password_here
POSTGRES_DB=carbon_tracker

# API
SECRET_KEY=your_secret_key_here
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Frontend (for Docker build)
VITE_API_URL=https://api.yourdomain.com
VITE_ML_SERVICE_URL=https://ml.yourdomain.com
```

### Step 6: Update docker-compose.yml for Production

Create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: carbon-tracker-db
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - carbon-tracker-network
    restart: unless-stopped

  api:
    build:
      context: ./api
      dockerfile: Dockerfile
    container_name: carbon-tracker-api
    environment:
      DATABASE_URL: postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}
      SECRET_KEY: ${SECRET_KEY}
      CORS_ORIGINS: ${CORS_ORIGINS}
    depends_on:
      - postgres
    networks:
      - carbon-tracker-network
    restart: unless-stopped

  ml-service:
    build:
      context: ./ml
      dockerfile: Dockerfile
    container_name: carbon-tracker-ml
    networks:
      - carbon-tracker-network
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    container_name: carbon-tracker-redis
    volumes:
      - redis_data:/data
    networks:
      - carbon-tracker-network
    restart: unless-stopped

  web:
    build:
      context: ./web
      dockerfile: Dockerfile.prod
    container_name: carbon-tracker-web
    environment:
      VITE_API_URL: ${VITE_API_URL}
    networks:
      - carbon-tracker-network
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    container_name: carbon-tracker-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - api
      - web
    networks:
      - carbon-tracker-network
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:

networks:
  carbon-tracker-network:
    driver: bridge
```

### Step 7: Set Up Nginx Reverse Proxy

Create `nginx.conf`:

```nginx
events {
    worker_connections 1024;
}

http {
    upstream api {
        server api:8000;
    }

    upstream web {
        server web:3000;
    }

    server {
        listen 80;
        server_name yourdomain.com www.yourdomain.com;

        # Redirect HTTP to HTTPS
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name yourdomain.com www.yourdomain.com;

        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;

        # Frontend
        location / {
            proxy_pass http://web;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }

        # API
        location /api {
            proxy_pass http://api;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
    }
}
```

### Step 8: Set Up SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
apt install certbot python3-certbot-nginx -y

# Get certificate (replace with your domain)
certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Copy certificates to project
mkdir -p ssl
cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem ssl/cert.pem
cp /etc/letsencrypt/live/yourdomain.com/privkey.pem ssl/key.pem
```

### Step 9: Deploy

```bash
# Build and start services
docker-compose -f docker-compose.prod.yml up -d --build

# Run migrations
docker-compose -f docker-compose.prod.yml exec api alembic upgrade head

# Check logs
docker-compose -f docker-compose.prod.yml logs -f
```

### Step 10: Set Up Domain DNS

1. Go to your domain registrar
2. Add DNS records:
   - **A Record**: `@` → Your server IP
   - **A Record**: `www` → Your server IP

---

## 🌐 Option 3: Netlify (Frontend) + Render (Backend)

Alternative to Option 1, similar process.

### Step 1: Deploy Backend to Render

1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. **Create PostgreSQL Database:**
   - Click "New" → "PostgreSQL"
   - Name it "carbon-tracker-db"
   - Copy the connection string

4. **Create Web Service (API):**
   - Click "New" → "Web Service"
   - Connect your GitHub repo
   - **Settings:**
     - **Name**: carbon-tracker-api
     - **Root Directory**: `api`
     - **Build Command**: `pip install -r requirements.txt`
     - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Environment Variables:**
     ```env
     DATABASE_URL=<paste from PostgreSQL>
     SECRET_KEY=<generate random string>
     CORS_ORIGINS=https://your-app.netlify.app
     PORT=8000
     ```

5. **Run Migrations:**
   - Go to service → "Shell"
   - Run: `alembic upgrade head`

### Step 2: Deploy Frontend to Netlify

1. Go to [netlify.com](https://netlify.com)
2. Sign up with GitHub
3. Click "Add new site" → "Import an existing project"
4. Connect your GitHub repo
5. **Build settings:**
   - **Base directory**: `web`
   - **Build command**: `npm run build`
   - **Publish directory**: `web/dist`
6. **Environment variables:**
   ```env
   VITE_API_URL=https://your-api.onrender.com
   VITE_ML_SERVICE_URL=https://your-ml-service.onrender.com
   ```
7. Click "Deploy site"

---

## ✅ Post-Deployment Checklist

After deployment, verify everything works:

- [ ] Frontend loads at your URL
- [ ] Can register a new account
- [ ] Can log in
- [ ] API health check works: `https://your-api-url/health`
- [ ] Database migrations ran successfully
- [ ] CORS is configured correctly
- [ ] Environment variables are set
- [ ] SSL/HTTPS is working (if using custom domain)
- [ ] Admin panel is accessible (if you set up admin user)

### Test Your Deployment

```bash
# Test API
curl https://your-api-url.railway.app/health

# Test Frontend
# Open https://your-frontend.vercel.app in browser
```

---

## 🔧 Troubleshooting

### Common Issues

#### 1. "Network Error" or "Cannot connect to API"

**Solution:**
- Check API URL in frontend environment variables
- Verify CORS settings include your frontend URL
- Check API service is running (Railway/Render dashboard)
- Test API directly: `curl https://your-api-url/health`

#### 2. "Database connection failed"

**Solution:**
- Verify `DATABASE_URL` is correct
- Check database service is running
- Ensure migrations ran: `alembic upgrade head`
- Check database credentials

#### 3. "CORS error" in browser console

**Solution:**
- Add your frontend URL to `CORS_ORIGINS` in backend
- Include both `https://your-app.vercel.app` and `https://www.yourdomain.com`
- Restart backend service after updating

#### 4. Frontend shows "404" or blank page

**Solution:**
- Check build succeeded (Vercel/Netlify logs)
- Verify `VITE_API_URL` is set correctly
- Check browser console for errors
- Ensure `dist` folder is being deployed

#### 5. "Module not found" errors

**Solution:**
- Rebuild shared-types package
- Check all dependencies in `package.json`
- Clear build cache and rebuild

#### 6. API returns 500 errors

**Solution:**
- Check API logs (Railway/Render logs)
- Verify all environment variables are set
- Check database connection
- Review error logs for specific issues

### Getting Help

1. **Check Logs:**
   - Railway: Service → Deployments → View Logs
   - Vercel: Deployments → Click deployment → View Function Logs
   - Render: Logs tab in dashboard

2. **Test API Directly:**
   ```bash
   curl https://your-api-url/health
   curl https://your-api-url/api/v1/auth/login
   ```

3. **Check Browser Console:**
   - Press F12 in browser
   - Look for errors in Console tab
   - Check Network tab for failed requests

---

## 🔄 Maintenance & Updates

### Updating Your Deployment

1. **Make changes locally**
2. **Test locally** first
3. **Commit and push to GitHub:**
   ```bash
   git add .
   git commit -m "Update feature"
   git push origin main
   ```
4. **Automatic deployment:**
   - Railway/Render will auto-deploy on push
   - Vercel/Netlify will auto-deploy on push

### Database Backups

**Railway:**
- Go to PostgreSQL service → Settings → Backups
- Enable automatic backups

**Render:**
- Go to Database → Backups tab
- Schedule regular backups

**Manual Backup:**
```bash
# Export database
pg_dump $DATABASE_URL > backup.sql

# Restore database
psql $DATABASE_URL < backup.sql
```

### Monitoring

**Free Monitoring Tools:**
- **UptimeRobot**: Monitor API uptime (free)
- **Sentry**: Error tracking (free tier)
- **Railway Metrics**: Built-in (Railway dashboard)
- **Vercel Analytics**: Built-in (Vercel dashboard)

### Scaling

**When to Scale:**
- High traffic
- Slow response times
- Database connection limits

**How to Scale:**
- **Railway**: Upgrade plan for more resources
- **Vercel**: Automatically scales (Pro plan for more)
- **VPS**: Upgrade server size or add load balancer

---

## 📚 Additional Resources

### Documentation Links

- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Netlify Documentation](https://docs.netlify.com)
- [Render Documentation](https://render.com/docs)
- [Docker Documentation](https://docs.docker.com)
- [Nginx Documentation](https://nginx.org/en/docs/)

### Security Best Practices

1. **Never commit `.env` files** to Git
2. **Use strong passwords** for database
3. **Enable HTTPS/SSL** (automatic on Vercel/Netlify)
4. **Keep dependencies updated**
5. **Use environment variables** for secrets
6. **Enable 2FA** on hosting accounts
7. **Regular backups** of database

### Cost Estimation

**Free Tier (Option 1):**
- Vercel: Free (hobby plan)
- Railway: $5/month free credit
- Total: **~$0-5/month**

**VPS (Option 2):**
- DigitalOcean Droplet: $6/month
- Domain: $10-15/year
- Total: **~$7-8/month**

---

## 🎉 Congratulations!

You've successfully deployed your Carbon Tracker application! Your app is now live on the internet.

### Next Steps

1. **Set up a custom domain** (optional)
2. **Configure email notifications** (if needed)
3. **Set up monitoring** (UptimeRobot, Sentry)
4. **Create admin user** (see ADMIN_GUIDE.md)
5. **Share your app** with users!

---

## 📞 Need Help?

If you encounter issues:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review service logs (Railway, Vercel, etc.)
3. Check browser console for errors
4. Verify all environment variables are set
5. Test API endpoints directly

**Remember:** Deployment can be tricky the first time, but once set up, updates are automatic!

---

**Last Updated:** January 2025
**Version:** 1.0

