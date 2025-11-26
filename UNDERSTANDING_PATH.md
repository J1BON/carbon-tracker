# 📚 Understanding PATH and Git Setup

## What is PATH?

**PATH** is like a list of folders on your computer where Windows looks for programs.

Think of it like this:
- When you type `git` in PowerShell, Windows searches through all folders in PATH
- If it finds `git.exe` in one of those folders, it runs it
- If it doesn't find it, you get: `'git' is not recognized`

---

## What Does This Command Do?

```powershell
$env:Path += ";C:\Program Files\Git\bin"
```

**In simple terms:**
- This adds the Git folder to your PATH **for this PowerShell session only**
- After running this, you can type `git` and it will work
- When you close PowerShell and open a new one, you'll need to run it again

**Breaking it down:**
- `$env:Path` = The PATH variable (list of folders)
- `+=` = Add to the list
- `";C:\Program Files\Git\bin"` = The Git folder location

---

## Visual Example

**Before running the command:**
```
PATH = [
  "C:\Windows\System32",
  "C:\Program Files\Python\...",
  ...other folders...
]
```
When you type `git`, Windows searches these folders → **Not found!** ❌

**After running the command:**
```
PATH = [
  "C:\Windows\System32",
  "C:\Program Files\Python\...",
  ...other folders...,
  "C:\Program Files\Git\bin"  ← NEW!
]
```
When you type `git`, Windows searches these folders → **Found in Git\bin!** ✅

---

## Why Do You Need This?

Git is installed at: `C:\Program Files\Git\bin\git.exe`

But Windows doesn't know to look there unless you:
1. **Add it to PATH** (what we're doing)
2. **OR** use the full path every time: `C:\Program Files\Git\bin\git.exe`

---

## Two Ways to Use Git

### Option 1: Add to PATH Each Time (Temporary)
```powershell
# Every time you open PowerShell:
$env:Path += ";C:\Program Files\Git\bin"
git --version  # Now this works!
```

**Pros:** Quick, no permanent changes  
**Cons:** Have to do it every time you open PowerShell

### Option 2: Add to PATH Permanently (Recommended)
Add it once, and it works forever!

**Steps:**
1. Press `Win + R`
2. Type: `sysdm.cpl`
3. Press Enter
4. Click **"Advanced"** tab
5. Click **"Environment Variables"**
6. Under **"User variables"**, find **"Path"**
7. Click **"Edit"**
8. Click **"New"**
9. Type: `C:\Program Files\Git\bin`
10. Click **"OK"** on all windows
11. **Restart PowerShell**

**Now Git works in every PowerShell window!** ✅

---

## Quick Test

After adding to PATH (temporary or permanent):

```powershell
# Test if Git works
git --version

# Should show: git version 2.x.x
```

If you see a version number → **It works!** ✅  
If you see an error → Git is not in PATH yet

---

## Real-World Analogy

Think of PATH like a **phone book**:
- **Without PATH:** You have to know the exact address (full path) to find someone
- **With PATH:** You just type their name, and the phone book (PATH) finds them

**Example:**
- **Without PATH:** `C:\Program Files\Git\bin\git.exe --version` (long!)
- **With PATH:** `git --version` (short and easy!)

---

## Summary

| Command | What It Does | When It Works |
|---------|--------------|---------------|
| `$env:Path += ";C:\Program Files\Git\bin"` | Adds Git to PATH | **This PowerShell session only** |
| Add via Environment Variables | Adds Git to PATH | **Forever (all sessions)** |

**Recommendation:** Add it permanently so you don't have to remember to run the command every time!

---

## Still Confused?

**Simple answer:**
- This command tells Windows: "Hey, when I type `git`, look in this folder: `C:\Program Files\Git\bin`"
- It only works for the current PowerShell window
- To make it permanent, use the Environment Variables method above

**That's it!** 🎉

