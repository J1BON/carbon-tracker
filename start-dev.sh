#!/bin/bash

# Carbon Tracker Development Startup Script

echo "🌱 Starting Carbon Tracker..."

# Check if Docker is installed
if command -v docker &> /dev/null; then
    echo "✅ Docker found"
    echo "Starting services with Docker Compose..."
    
    # Start all services
    docker compose up --build
    
else
    echo "⚠️  Docker not found. Please install Docker:"
    echo "   https://www.docker.com/products/docker-desktop/"
    echo ""
    echo "Alternatively, you can run services individually:"
    echo "   1. Start PostgreSQL: docker compose up postgres -d"
    echo "   2. Start API: cd api && uvicorn main:app --reload"
    echo "   3. Start ML: cd ml && uvicorn main:app --reload --port 8001"
    echo "   4. Start Web: cd web && npm run dev"
fi

