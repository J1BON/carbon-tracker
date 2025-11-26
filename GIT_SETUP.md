# 🔧 Git Setup Guide - Fix "git is not recognized"

## ✅ Good News: Git IS Installed!

Git is installed at: `C:\Program Files\Git\bin\git.exe`

But it's not in your PATH, so PowerShell can't find it.

---

## 🚀 Quick Fix (Temporary - This Session Only)

Run this in PowerShell:

```powershell
$env:Path += ";C:\Program Files\Git\bin"
git --version
```

This adds Git to PATH for your current PowerShell session.

---

## ✅ Permanent Fix (Recommended)

### Option 1: Add Git to PATH Permanently

1. **Open Environment Variables:**
   - Press `Win + R`
   - Type: `sysdm.cpl`
   - Press Enter
   - Click "Advanced" tab
   - Click "Environment Variables"

2. **Edit PATH:**
   - Under "User variables" or "System variables", find "Path"
   - Click "Edit"
   - Click "New"
   - Add: `C:\Program Files\Git\bin`
   - Click "OK" on all windows

3. **Restart PowerShell:**
   - Close and reopen PowerShell
   - Test: `git --version`

### Option 2: Use Full Path (Quick Workaround)

Instead of `git`, use the full path:

```powershell
& "C:\Program Files\Git\bin\git.exe" --version
& "C:\Program Files\Git\bin\git.exe" config --global user.name "J1BON"
```

---

## 📝 Complete Git Setup

Once Git is working, run these commands:

### 1. Configure Git (First Time Only)

```powershell
# Add Git to PATH for this session
$env:Path += ";C:\Program Files\Git\bin"

# Set your name
git config --global user.name "J1BON"

# Set your email (use your GitHub email)
git config --global user.email "your.email@example.com"

# Verify
git config --global user.name
git config --global user.email
```

### 2. Initialize Repository (If Not Already Done)

```powershell
cd C:\Projects\root

# Check if Git is initialized
git status

# If you see "not a git repository", initialize it:
git init
```

### 3. Check What Will Be Committed

```powershell
# See what files will be added
git status

# Make sure .env files are NOT listed!
# If they are, check your .gitignore
```

### 4. Add and Commit Files

```powershell
# Add all files (except those in .gitignore)
git add .

# Check status again
git status

# Commit
git commit -m "Initial commit: Carbon Tracker project"
```

### 5. Connect to GitHub

```powershell
# Add remote (replace with your GitHub username and repo name)
git remote add origin https://github.com/yourusername/carbon-tracker.git

# Verify
git remote -v
```

### 6. Push to GitHub

```powershell
# Push to GitHub
git branch -M main
git push -u origin main
```

**Note:** You'll need a Personal Access Token (not password) when pushing.

---

## 🔑 Create GitHub Personal Access Token

1. Go to GitHub.com → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Name it: "My Computer"
4. Select scope: `repo` (full control)
5. Click "Generate token"
6. **COPY THE TOKEN** (you won't see it again!)
7. Use this token as your password when pushing

---

## ✅ Quick Test

After adding Git to PATH, test it:

```powershell
# Add to PATH (this session)
$env:Path += ";C:\Program Files\Git\bin"

# Test Git
git --version
# Should show: git version 2.x.x

# Configure
git config --global user.name "J1BON"
git config --global user.email "your.email@example.com"

# Verify
git config --global --list
```

---

## 🆘 Troubleshooting

### "git is not recognized" After Adding to PATH

1. **Restart PowerShell** (close and reopen)
2. **Check PATH:**
   ```powershell
   $env:Path -split ';' | Select-String "Git"
   ```
3. **If not found, add it again:**
   ```powershell
   $env:Path += ";C:\Program Files\Git\bin"
   ```

### Git Still Not Working

1. **Verify Git is installed:**
   ```powershell
   Test-Path "C:\Program Files\Git\bin\git.exe"
   ```
   Should return: `True`

2. **Use full path:**
   ```powershell
   & "C:\Program Files\Git\bin\git.exe" --version
   ```

3. **Reinstall Git if needed:**
   - Download from: https://git-scm.com/download/win
   - During install, check ✅ "Add Git to PATH"

---

## 📚 Next Steps

Once Git is working:

1. ✅ Configure Git (name and email)
2. ✅ Initialize repository (if needed)
3. ✅ Check `.env` files are ignored
4. ✅ Add and commit files
5. ✅ Connect to GitHub
6. ✅ Push your code

**You're almost there!** 🚀

