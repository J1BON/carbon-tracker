#!/bin/sh
# Entrypoint script for Fly.io
# Ensures app listens on correct port

PORT=${PORT:-8000}
echo "Starting server on 0.0.0.0:${PORT}"

# Run migrations if needed
alembic upgrade head || echo "Migration skipped or failed"

# Start the server
exec uvicorn main:app --host 0.0.0.0 --port $PORT

