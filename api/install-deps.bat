@echo off
REM Quick Fix Script for Backend Dependencies
REM Run this: install-deps.bat

echo 🔧 Fixing backend dependencies...

REM Step 1: Upgrade pip
echo.
echo 📦 Upgrading pip...
python -m pip install --upgrade pip setuptools wheel

REM Step 2: Install everything except psycopg2-binary
echo.
echo 📦 Installing dependencies (skipping psycopg2-binary for now)...

REM Create temporary requirements without psycopg2-binary
findstr /V "psycopg2-binary" requirements.txt > requirements-temp.txt

REM Install everything else
python -m pip install -r requirements-temp.txt

REM Step 3: Try to install psycopg2-binary
echo.
echo 📦 Attempting to install psycopg2-binary...
python -m pip install --only-binary :all: psycopg2-binary 2>nul
if %ERRORLEVEL% EQU 0 (
    echo   ✅ Success!
) else (
    python -m pip install --only-binary :all: psycopg2-binary==2.9.9 2>nul
    if %ERRORLEVEL% EQU 0 (
        echo   ✅ Success with version 2.9.9!
    ) else (
        echo   ⚠️  psycopg2-binary installation failed, but other packages installed.
        echo   💡 You can use SQLite for local development
    )
)

REM Clean up
del requirements-temp.txt 2>nul

echo.
echo ✅ Installation complete!
echo.
echo 📝 Next steps:
echo   1. Try running: python main.py
echo   2. If psycopg2-binary failed, update .env to use SQLite

