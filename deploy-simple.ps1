# Simple Deployment Script for Windows
# This builds locally and gives you options to deploy

Write-Host "🚀 Building your app locally..." -ForegroundColor Green

# Build
npm install
npm run build --workspace=@carbon-tracker/shared-types
npm run build --workspace=@carbon-tracker/web

if (Test-Path "web/dist/index.html") {
    Write-Host "✅ Build successful! Your files are in web/dist" -ForegroundColor Green
    Write-Host ""
    Write-Host "📦 Deploy Options:" -ForegroundColor Yellow
    Write-Host "1. Netlify Drop: Go to https://app.netlify.com/drop and drag web/dist folder" -ForegroundColor Cyan
    Write-Host "2. Surge.sh: Run 'cd web/dist && surge' (install surge first: npm install -g surge)" -ForegroundColor Cyan
    Write-Host "3. Cloudflare Pages: Connect GitHub and use build command from SIMPLE_DEPLOY.md" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Your built files are ready in: web/dist" -ForegroundColor Green
} else {
    Write-Host "❌ Build failed. Check errors above." -ForegroundColor Red
}

