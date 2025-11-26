# 🚀 Git Quick Start - Every Time You Open PowerShell

## ⚠️ Important: Add Git to PATH First!

**Every time you open a new PowerShell window**, run this first:

```powershell
$env:Path += ";C:\Program Files\Git\bin"
```

**Or use the helper script:**
```powershell
.\QUICK_GIT_COMMANDS.ps1
```

---

## ✅ Make Git Permanent (Do This Once!)

So you don't have to add it every time:

1. **Press `Win + R`**, type `sysdm.cpl`, press Enter
2. Click **"Advanced"** tab → **"Environment Variables"**
3. Under **"User variables"**, find **"Path"** → Click **"Edit"**
4. Click **"New"** → Add: `C:\Program Files\Git\bin`
5. Click **"OK"** on all windows
6. **Restart PowerShell**

Now Git will work in every new PowerShell window! 🎉

---

## 📋 Common Git Commands

### Every Session (Add Git to PATH):
```powershell
$env:Path += ";C:\Program Files\Git\bin"
```

### Check Status:
```powershell
git status
```

### Add Files:
```powershell
git add .
```

### Commit:
```powershell
git commit -m "Your commit message"
```

### Push to GitHub:
```powershell
git push origin main
```

---

## 🎯 Complete Workflow

```powershell
# 1. Add Git to PATH (every new session)
$env:Path += ";C:\Program Files\Git\bin"

# 2. Navigate to project
cd C:\Projects\root

# 3. Check status
git status

# 4. Add files
git add .

# 5. Commit
git commit -m "Update: description of changes"

# 6. Push
git push origin main
```

---

## 🔍 Verify Git is Working

```powershell
# Add to PATH
$env:Path += ";C:\Program Files\Git\bin"

# Test
git --version
# Should show: git version 2.x.x

# Check config
git config --global --list
# Should show your name and email
```

---

## 💡 Pro Tip

Create a PowerShell profile to auto-add Git:

```powershell
# Check if profile exists
Test-Path $PROFILE

# If not, create it
New-Item -Path $PROFILE -Type File -Force

# Add Git to PATH automatically
Add-Content $PROFILE '$env:Path += ";C:\Program Files\Git\bin"'
```

Now Git will be available in every PowerShell session automatically!

---

## ✅ Current Status

- ✅ Git installed: `C:\Program Files\Git\bin\git.exe`
- ✅ Git configured: Name and email set
- ✅ Repository initialized: Ready to commit
- ⚠️ PATH: Need to add manually each session (or make permanent)

**You're all set!** Just remember to add Git to PATH each time, or make it permanent! 🚀

