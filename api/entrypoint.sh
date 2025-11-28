#!/bin/sh
# Entrypoint script for Fly.io
# Fly.io internal_port is 8000 (from fly.toml)

# Use PORT if set, otherwise use 8000 (matches fly.toml internal_port)
PORT=${PORT:-8000}

echo "=========================================="
echo "Starting Carbon Tracker API"
echo "Port: $PORT"
echo "Host: 0.0.0.0"
echo "=========================================="

# Set DATABASE_URL if not set (use SQLite as fallback)
# Use /data directory which is mounted as persistent volume
if [ -z "$DATABASE_URL" ]; then
    # Ensure /data directory exists and is writable
    mkdir -p /data
    chmod 755 /data
    export DATABASE_URL="sqlite:////data/carbon_tracker.db"
    echo "=========================================="
    echo "DATABASE_URL: $DATABASE_URL"
    echo "Checking /data directory..."
    ls -la /data || echo "WARNING: /data directory not accessible"
    echo "=========================================="
fi

# Always log the DATABASE_URL being used
echo "Using DATABASE_URL: $DATABASE_URL"

# Run migrations only for PostgreSQL (SQLite uses create_all in startup)
if echo "$DATABASE_URL" | grep -q "postgresql"; then
    echo "Running database migrations for PostgreSQL..."
    alembic upgrade head || echo "Migration skipped or failed - continuing anyway"
else
    echo "Skipping migrations for SQLite (tables will be created on startup via create_all)"
fi

# Start the server - MUST listen on 0.0.0.0, not 127.0.0.1
echo "Starting uvicorn server..."
exec uvicorn main:app --host 0.0.0.0 --port $PORT --no-access-log

