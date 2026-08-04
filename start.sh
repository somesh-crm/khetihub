#!/bin/bash
# Start both backend and frontend for KhetiHub
set -e

# Install dependencies if missing
if [ ! -d "backend/node_modules" ]; then
  echo "Installing backend dependencies..."
  npm --prefix backend install
fi
if [ ! -d "frontend/node_modules" ]; then
  echo "Installing frontend dependencies..."
  npm --prefix frontend install
fi

# Seed database if empty
if [ ! -f "backend/data/khetihub.db" ]; then
  echo "Seeding database..."
  npm --prefix backend run seed
fi

# Start backend server in background
cd backend
node index.js &
BACKEND_PID=$!
cd ..

echo "Backend running on http://localhost:3001 (PID $BACKEND_PID)"

# Trap to clean up backend when frontend stops
trap "kill $BACKEND_PID 2>/dev/null || true" EXIT

# Start frontend (this is the exposed preview port)
cd frontend
npm run dev
