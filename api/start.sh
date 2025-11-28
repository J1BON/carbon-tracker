#!/bin/bash
# Start script for Render.com deployment
# This ensures the app binds to the correct port

PORT=${PORT:-10000}
echo "Starting server on port $PORT"

# Run migrations
alembic upgrade head || echo "Migration failed, continuing..."

# Start the server
uvicorn main:app --host 0.0.0.0 --port $PORT

