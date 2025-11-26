# Quick Fix Script for Backend Dependencies
# Run this in PowerShell: .\install-deps.ps1

Write-Host "🔧 Fixing backend dependencies..." -ForegroundColor Cyan

# Step 1: Upgrade pip
Write-Host "`n📦 Upgrading pip..." -ForegroundColor Yellow
python -m pip install --upgrade pip setuptools wheel

# Step 2: Install everything except psycopg2-binary
Write-Host "`n📦 Installing dependencies (skipping psycopg2-binary for now)..." -ForegroundColor Yellow

# Create temporary requirements without psycopg2-binary
$requirements = Get-Content requirements.txt
$tempRequirements = $requirements | Where-Object { $_ -notmatch '^psycopg2-binary' }
$tempRequirements | Set-Content requirements-temp.txt

# Install everything else
python -m pip install -r requirements-temp.txt

# Step 3: Try to install psycopg2-binary with different methods
Write-Host "`n📦 Attempting to install psycopg2-binary..." -ForegroundColor Yellow

# Try method 1: Latest version with wheel-only
Write-Host "  Trying method 1: Latest version..." -ForegroundColor Gray
python -m pip install --only-binary :all: psycopg2-binary 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✅ Success with latest version!" -ForegroundColor Green
} else {
    # Try method 2: Specific version
    Write-Host "  Trying method 2: Version 2.9.9..." -ForegroundColor Gray
    python -m pip install --only-binary :all: psycopg2-binary==2.9.9 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✅ Success with version 2.9.9!" -ForegroundColor Green
    } else {
        # Try method 3: Without version pinning
        Write-Host "  Trying method 3: Any compatible version..." -ForegroundColor Gray
        python -m pip install --only-binary :all: "psycopg2-binary>=2.9.0" 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  ✅ Success!" -ForegroundColor Green
        } else {
            Write-Host "  ⚠️  psycopg2-binary installation failed, but other packages installed." -ForegroundColor Yellow
            Write-Host "  💡 You can use SQLite for local development (see instructions)" -ForegroundColor Cyan
        }
    }
}

# Clean up
Remove-Item requirements-temp.txt -ErrorAction SilentlyContinue

Write-Host "`n✅ Installation complete!" -ForegroundColor Green
Write-Host "`n📝 Next steps:" -ForegroundColor Cyan
Write-Host "  1. Check if psycopg2-binary installed: python -c 'import psycopg2; print(\"OK\")'" -ForegroundColor White
Write-Host "  2. If it failed, you can use SQLite for local dev (update .env file)" -ForegroundColor White
Write-Host "  3. Try running: python main.py" -ForegroundColor White

