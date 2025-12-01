#!/bin/bash

# Alpha House - Startup Script for All Services
# This script starts Frontend (Next.js), Backend (Go), and Python (FastAPI) services

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get the script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Log file
LOG_DIR="${SCRIPT_DIR}/logs"
mkdir -p "$LOG_DIR"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Alpha House - Starting All Services  ${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Function to check if a port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# Function to kill process on a port
kill_port() {
    local port=$1
    echo -e "${YELLOW}Checking if port $port is in use...${NC}"
    if check_port $port; then
        echo -e "${YELLOW}Port $port is in use. Killing existing process...${NC}"
        lsof -ti:$port | xargs kill -9 2>/dev/null
        sleep 2
    fi
}

# Cleanup function
cleanup() {
    echo -e "\n${YELLOW}Shutting down all services...${NC}"
    jobs -p | xargs -r kill 2>/dev/null
    wait
    echo -e "${GREEN}All services stopped.${NC}"
    exit 0
}

# Trap Ctrl+C and call cleanup
trap cleanup SIGINT SIGTERM

# Clear ports
echo -e "${BLUE}Step 1: Clearing ports...${NC}"
kill_port 3000  # Frontend
kill_port 8080  # Backend
kill_port 8001  # Python API
echo -e "${GREEN}✓ Ports cleared${NC}\n"

# Check Backend .env file
echo -e "${BLUE}Step 2: Checking Backend configuration...${NC}"
if [ ! -f "${SCRIPT_DIR}/backend/.env" ]; then
    echo -e "${YELLOW}⚠ Warning: backend/.env file not found${NC}"
    echo -e "${YELLOW}  Backend needs DATABASE_URL environment variable${NC}"
    echo -e "${YELLOW}  See STARTUP.md for setup instructions${NC}\n"
else
    echo -e "${GREEN}✓ Backend .env file found${NC}\n"
fi


# Start Backend (Go)
echo -e "${BLUE}Step 3: Starting Backend (Go on port 8080)...${NC}"
cd "${SCRIPT_DIR}/backend"
if [ ! -f "main.go" ]; then
    echo -e "${RED}✗ Backend main.go not found!${NC}"
    exit 1
fi

# Check Go dependencies
if [ ! -d "vendor" ] && [ -f "go.mod" ]; then
    echo -e "${YELLOW}Installing Go dependencies...${NC}"
    go mod download
fi

# Start backend in background
go run main.go > "${LOG_DIR}/backend_${TIMESTAMP}.log" 2>&1 &
BACKEND_PID=$!
echo -e "${GREEN}✓ Backend started (PID: $BACKEND_PID)${NC}"
echo -e "  Log: ${LOG_DIR}/backend_${TIMESTAMP}.log\n"

# Wait for backend to start
sleep 3
if ! ps -p $BACKEND_PID > /dev/null; then
    echo -e "${RED}✗ Backend failed to start. Check logs.${NC}"
    cat "${LOG_DIR}/backend_${TIMESTAMP}.log"
    exit 1
fi

# Start Python Service (FastAPI)
echo -e "${BLUE}Step 4: Starting Python Service (FastAPI on port 8001)...${NC}"
cd "${SCRIPT_DIR}/python"
if [ ! -f "main.py" ]; then
    echo -e "${RED}✗ Python main.py not found!${NC}"
    exit 1
fi

# Check for .env file
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠ Warning: .env file not found in python directory${NC}"
    echo -e "${YELLOW}  Create .env with GOOGLE_API_KEY for virtual try-on to work${NC}\n"
fi

# Check Python dependencies using uv or poetry
if command -v uv &> /dev/null; then
    echo -e "${YELLOW}Using uv for Python dependencies...${NC}"
    if [ ! -d ".venv" ]; then
        uv venv
    fi
    uv pip install -e . > /dev/null 2>&1
    # Start Python service on port 8001 to avoid conflict with frontend
    uv run uvicorn main:app --host 0.0.0.0 --port 8001 > "${LOG_DIR}/python_${TIMESTAMP}.log" 2>&1 &
elif command -v poetry &> /dev/null; then
    echo -e "${YELLOW}Using poetry for Python dependencies...${NC}"
    poetry install --no-interaction > /dev/null 2>&1
    poetry run uvicorn main:app --host 0.0.0.0 --port 8001 > "${LOG_DIR}/python_${TIMESTAMP}.log" 2>&1 &
else
    echo -e "${YELLOW}Using pip for Python dependencies...${NC}"
    if [ ! -d "venv" ]; then
        python3 -m venv venv
    fi
    source venv/bin/activate
    pip install -q -r <(cat pyproject.toml | grep -A 20 'dependencies' | grep -E '^\s+"' | sed 's/[",]//g') 2>/dev/null || pip install -q fastapi uvicorn python-multipart google-genai Pillow python-dotenv
    uvicorn main:app --host 0.0.0.0 --port 8001 > "${LOG_DIR}/python_${TIMESTAMP}.log" 2>&1 &
fi

PYTHON_PID=$!
echo -e "${GREEN}✓ Python service started (PID: $PYTHON_PID)${NC}"
echo -e "  Log: ${LOG_DIR}/python_${TIMESTAMP}.log\n"

# Wait for Python service to start
sleep 3
if ! ps -p $PYTHON_PID > /dev/null; then
    echo -e "${RED}✗ Python service failed to start. Check logs.${NC}"
    cat "${LOG_DIR}/python_${TIMESTAMP}.log"
    exit 1
fi

# Start Frontend (Next.js)
echo -e "${BLUE}Step 5: Starting Frontend (Next.js on port 3000)...${NC}"
cd "${SCRIPT_DIR}/frontend"
if [ ! -f "package.json" ]; then
    echo -e "${RED}✗ Frontend package.json not found!${NC}"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing frontend dependencies...${NC}"
    if command -v pnpm &> /dev/null; then
        pnpm install
    elif command -v yarn &> /dev/null; then
        yarn install
    else
        npm install
    fi
fi

# Update the dev script to use port 3000 instead of 8000
if command -v pnpm &> /dev/null; then
    pnpm start --port 3000 > "${LOG_DIR}/frontend_${TIMESTAMP}.log" 2>&1 &
elif command -v yarn &> /dev/null; then
    yarn start --port 3000 > "${LOG_DIR}/frontend_${TIMESTAMP}.log" 2>&1 &
else
    npm run start -- --port 3000 > "${LOG_DIR}/frontend_${TIMESTAMP}.log" 2>&1 &
fi

FRONTEND_PID=$!
echo -e "${GREEN}✓ Frontend started (PID: $FRONTEND_PID)${NC}"
echo -e "  Log: ${LOG_DIR}/frontend_${TIMESTAMP}.log\n"

# Wait for frontend to start
sleep 5

# Summary
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}  🚀 All Services Started Successfully!  ${NC}"
echo -e "${BLUE}========================================${NC}\n"

echo -e "${GREEN}Service Status:${NC}"
echo -e "  Frontend:  ${GREEN}http://localhost:3000${NC} (Next.js)"
echo -e "  Backend:   ${GREEN}http://localhost:8080${NC} (Go/Gin)"
echo -e "  Python:    ${GREEN}http://localhost:8001${NC} (FastAPI)"
echo -e "  API Docs:  ${GREEN}http://localhost:8001/docs${NC} (FastAPI Swagger)\n"

echo -e "${GREEN}Process IDs:${NC}"
echo -e "  Backend:  ${BACKEND_PID}"
echo -e "  Python:   ${PYTHON_PID}"
echo -e "  Frontend: ${FRONTEND_PID}\n"

echo -e "${BLUE}Logs Directory:${NC} ${LOG_DIR}\n"

echo -e "${YELLOW}Press Ctrl+C to stop all services${NC}\n"

# Wait for all background jobs
wait
