# Carbon Tracker Development Startup Script

Write-Host "🌱 Starting Carbon Tracker..." -ForegroundColor Green

# Check if Docker is installed
if (Get-Command docker -ErrorAction SilentlyContinue) {
    Write-Host "✅ Docker found" -ForegroundColor Green
    Write-Host "Starting services with Docker Compose..." -ForegroundColor Cyan
    
    # Start all services
    docker compose up --build
    
} else {
    Write-Host "⚠️  Docker not found. Please install Docker Desktop:" -ForegroundColor Yellow
    Write-Host "   https://www.docker.com/products/docker-desktop/" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Alternatively, you can run services individually:" -ForegroundColor Yellow
    Write-Host "   1. Start PostgreSQL: docker compose up postgres -d" -ForegroundColor Gray
    Write-Host "   2. Start API: cd api; uvicorn main:app --reload" -ForegroundColor Gray
    Write-Host "   3. Start ML: cd ml; uvicorn main:app --reload --port 8001" -ForegroundColor Gray
    Write-Host "   4. Start Web: cd web; npm run dev" -ForegroundColor Gray
}

