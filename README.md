# Alpha House

A full-stack fashion e-commerce platform with AI-powered virtual try-on capabilities.

## 🚀 Quick Start

Start all services (Frontend, Backend, and Python) with one command:

```bash
./start-all.sh
```

See [STARTUP.md](./STARTUP.md) for detailed setup instructions.

## 📦 Project Structure

```
Alpha-house/
├── frontend/       # Next.js + React + TypeScript
├── backend/        # Go + Gin + GORM + PostgreSQL
├── python/         # FastAPI + Google Gemini (Virtual Try-On)
├── start-all.sh    # Startup script for all services
└── STARTUP.md      # Detailed documentation
```

## 🌐 Services

| Service | Technology | Port | Description |
|---------|-----------|------|-------------|
| Frontend | Next.js + React | 3000 | Fashion feed and product pages |
| Backend | Go + Gin + pgx/v5 | 8080 | REST API for products and influencers |
| Python | FastAPI + Gemini AI | 8001 | Virtual try-on service |

**Database**: Neon PostgreSQL (serverless) or any PostgreSQL via `DATABASE_URL`


## 📚 Documentation

- [Startup Guide](./STARTUP.md) - Complete setup and troubleshooting
- [Backend API](./backend/README.md) - API endpoints and database schema
- [Python Service](./python/README.md) - Virtual try-on API details

## 🔧 Prerequisites

- **Node.js** 18+
- **Go** 1.21+
- **Python** 3.9+
- **PostgreSQL Database** (Neon recommended)
- **Google API Key** for Gemini AI

## ⚙️ Quick Setup

1. **Clone and navigate:**
   ```bash
   cd Alpha-house
   ```

2. **Setup Backend Database:**
   ```bash
   cd backend
   # For Neon: Get your connection string from https://console.neon.tech/
   echo "DATABASE_URL='your-neon-connection-string'" > .env
   cd ..
   ```

3. **Configure Python service:**
   ```bash
   cd python
   echo "GOOGLE_API_KEY=your_key_here" > .env
   cd ..
   ```

4. **Start everything:**

   ```bash
   ./start-all.sh
   ```

## 🌟 Features

- ✨ Modern fashion social feed
- 🛍️ Product catalog with influencer collections
- 🤖 AI-powered virtual try-on
- 📱 Responsive design
- 🔄 Real-time updates
- 📊 RESTful API architecture

## 📝 License

MIT
