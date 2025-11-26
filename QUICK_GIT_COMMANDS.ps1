# Quick Git Commands - Run this script to add Git to PATH and run common commands
# Usage: .\QUICK_GIT_COMMANDS.ps1

# Add Git to PATH for this session
$env:Path += ";C:\Program Files\Git\bin"

Write-Host "✅ Git added to PATH for this session" -ForegroundColor Green
Write-Host ""

# Check Git version
Write-Host "Git version:" -ForegroundColor Cyan
git --version
Write-Host ""

# Check if repository is initialized
if (Test-Path .git) {
    Write-Host "✅ Repository initialized" -ForegroundColor Green
    Write-Host ""
    Write-Host "Current status:" -ForegroundColor Cyan
    git status --short | Select-Object -First 10
} else {
    Write-Host "⚠️  Repository not initialized" -ForegroundColor Yellow
    Write-Host "Run: git init" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "Common commands:" -ForegroundColor Cyan
Write-Host "  git status          - Check what files are ready" -ForegroundColor Gray
Write-Host "  git add .           - Add all files" -ForegroundColor Gray
Write-Host "  git commit -m 'msg' - Commit changes" -ForegroundColor Gray
Write-Host "  git push            - Push to GitHub" -ForegroundColor Gray

