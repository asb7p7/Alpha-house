# Alpha House - Startup Script

This script starts all three services for the Alpha House application.

## Services

1. **Frontend** (Next.js) - Port 3000
2. **Backend** (Go/Gin) - Port 8080  
3. **Python** (FastAPI) - Port 8001

## Quick Start

```bash
./start-all.sh
```

The script will:
- ✓ Clear any existing processes on required ports
- ✓ Check PostgreSQL connection
- ✓ Install dependencies if needed
- ✓ Start all services with proper logging
- ✓ Display service URLs and PIDs

## Prerequisites

### Backend (Go)
- Go 1.21+ installed
- PostgreSQL database (Neon or local)
- Create `.env` file in `/backend` directory with `DATABASE_URL`

### Python Service
- Python 3.9+ installed
- Create `.env` file in `/python` directory with:
  ```
  GOOGLE_API_KEY=your_google_api_key
  ```
- Supports `uv`, `poetry`, or `pip` for dependency management

### Frontend (Next.js)
- Node.js 18+ installed
- Package manager: `pnpm`, `yarn`, or `npm`

## Setup Database

The backend now uses **Neon PostgreSQL** (serverless) or any PostgreSQL via `DATABASE_URL`.

### Option 1: Neon PostgreSQL (Recommended)
1. Get your connection string from [Neon Console](https://console.neon.tech/)
2. Create `/backend/.env`:
   ```bash
   cd backend
   echo "DATABASE_URL='your-neon-connection-string'" > .env
   ```

### Option 2: Local PostgreSQL
If you prefer local PostgreSQL:
```bash
# Start PostgreSQL
brew services start postgresql@14

# Create database and user
psql postgres
CREATE DATABASE alpha;
CREATE USER aura WITH PASSWORD 'aura@123';
GRANT ALL PRIVILEGES ON DATABASE alpha TO aura;
\q

# Create .env file
cd backend
echo "DATABASE_URL='postgresql://aura:aura@123@localhost:5432/alpha?sslmode=disable'" > .env
```

## Environment Files

### Backend `.env`
Create `/backend/.env` with:
```
DATABASE_URL='postgresql://username:password@host/database?sslmode=require'
```

See setup instructions above for Neon or local PostgreSQL configuration.

### Frontend `.env.local`
Already configured in `/frontend/.env.local`

### Python `.env`
Create `/python/.env` with:
```
GOOGLE_API_KEY=your_google_api_key_here
```

Get your API key from: https://aistudio.google.com/


## Accessing Services

Once started, visit:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080/api/profiles
- **Python API Docs**: http://localhost:8001/docs

## Logs

Logs are saved in `/logs` directory with timestamps:
- `backend_YYYYMMDD_HHMMSS.log`
- `python_YYYYMMDD_HHMMSS.log`
- `frontend_YYYYMMDD_HHMMSS.log`

## Stopping Services

Press `Ctrl+C` in the terminal running the script. All services will be stopped gracefully.

## Manual Start (Individual Services)

### Backend
```bash
cd backend
go run main.go
```

### Python
```bash
cd python
# Using uv
uv run uvicorn main:app --host 0.0.0.0 --port 8001

# Using poetry
poetry run uvicorn main:app --host 0.0.0.0 --port 8001

# Using venv
source venv/bin/activate
uvicorn main:app --host 0.0.0.0 --port 8001
```

### Frontend
```bash
cd frontend
pnpm dev --port 3000  # or npm run dev -- --port 3000
```

## Troubleshooting

### PostgreSQL not running
```bash
brew services start postgresql@14
```

### Port already in use
The script automatically kills processes on required ports. If issues persist:
```bash
# Check what's using a port
lsof -i :3000
lsof -i :8080
lsof -i :8001

# Kill manually
kill -9 <PID>
```

### Python dependencies not installing
```bash
cd python
# Install uv (recommended)
curl -LsSf https://astral.sh/uv/install.sh | sh
uv pip install -e .

# Or use pip
pip install fastapi uvicorn python-multipart google-genai Pillow python-dotenv
```

### Frontend dependencies issues
```bash
cd frontend
rm -rf node_modules package-lock.json
pnpm install  # or npm install
```
