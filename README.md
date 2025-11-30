# 🏛️ Alpha House

> **A Modern Fashion E-Commerce Platform with AI-Powered Virtual Try-On**

Alpha House is a full-stack influencer-driven fashion marketplace that combines social media browsing with AI-powered virtual try-on technology. Users can discover fashion collections curated by influencers, watch live streams, and virtually try on products before purchasing.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16.0-black)
![Go](https://img.shields.io/badge/Go-1.21+-00ADD8)
![Python](https://img.shields.io/badge/Python-3.9+-3776AB)

---

## ✨ Features

### 🎯 Core Features
- **📱 Social Fashion Feed**: Browse curated collections from fashion influencers
- **👗 Product Discovery**: Explore products with detailed information and pricing
- **🤖 AI Virtual Try-On**: See how clothes look on you using Google Gemini AI
- **📺 Live Streaming**: Watch influencers showcase products in real-time
- **❤️ Social Interactions**: Like and save favorite products
- **🎨 Elegant UI**: Premium gold & cream themed design with smooth animations

### �️ Technical Features
- **Full-Stack Architecture**: Next.js frontend, Go backend, Python AI service
- **RESTful API**: Clean API design with PostgreSQL database
- **Responsive Design**: Mobile-first with seamless desktop experience
- **Real-time Updates**: Live streaming with interactive chat
- **Image Processing**: AI-powered clothing overlay and virtual try-on
- **Fallback System**: Demo mode when AI service is unavailable

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (Next.js)                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   Feed   │  │ Products │  │ Streaming│  │ Try-On  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
         │                │                          │
         ▼                ▼                          ▼
┌─────────────────┐  ┌──────────────────────────────────────┐
│   Backend (Go)  │  │      Python Service (FastAPI)        │
│   ┌──────────┐ │  │  ┌────────────────────────────────┐  │
│   │   API    │ │  │  │  Google Gemini AI Virtual     │  │
│   │ Handlers │ │  │  │  Try-On Image Generation      │  │
│   └──────────┘ │  │  └────────────────────────────────┘  │
└─────────────────┘  └──────────────────────────────────────┘
         │
         ▼
┌─────────────────┐
│   PostgreSQL    │
│   (Neon Cloud)  │
└─────────────────┘
```

---

## 📦 Tech Stack

### Frontend
- **Framework**: Next.js 16.0 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4
- **UI**: React 19.2 with hooks
- **State Management**: React hooks (useState, useCallback)

### Backend
- **Language**: Go 1.21+
- **Framework**: Gin (HTTP router)
- **Database Driver**: pgx/v5 (PostgreSQL)
- **Database**: Neon PostgreSQL (Serverless)

### Python AI Service
- **Framework**: FastAPI
- **AI**: Google Gemini 2.0 (Image Generation)
- **Image Processing**: Pillow (PIL)
- **Server**: Uvicorn (ASGI)

---

## 🚀 Quick Start

### Prerequisites

Make sure you have the following installed:
- **Node.js** 18+ ([Download](https://nodejs.org/))
- **Go** 1.21+ ([Download](https://go.dev/))
- **Python** 3.9+ ([Download](https://python.org/))
- **PostgreSQL Database** ([Neon](https://neon.tech/) recommended)

### One-Command Setup

```bash
# Clone the repository
git clone https://github.com/asb7p7/Alpha-house.git
cd Alpha-house

# Start all services
./start-all.sh
```

The script will:
1. ✅ Clear ports 3000, 8080, 8001
2. ✅ Start Backend (Go) on port 8080
3. ✅ Start Python service on port 8001
4. ✅ Start Frontend (Next.js) on port 3000

**Access the app**: http://localhost:3000

---

## ⚙️ Configuration

### 1. Backend Configuration

Create `backend/.env`:

```env
DATABASE_URL='postgresql://username:password@host/database?sslmode=require'
```

**Get your database URL from [Neon](https://console.neon.tech/)**

### 2. Python Service Configuration

Create `python/.env`:

```env
GOOGLE_API_KEY=your_google_gemini_api_key_here
```

**Get your API key from [Google AI Studio](https://aistudio.google.com/app/apikey)**

> **Note**: The virtual try-on feature has a fallback demo mode and will work even without a valid API key.

### 3. Frontend Configuration (Optional)

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

---

## � Project Structure

```
Alpha-house/
├── frontend/                 # Next.js frontend application
│   ├── app/                 # Next.js 16 App Router
│   │   ├── feed/           # Main fashion feed page
│   │   ├── products/       # Product listing & detail pages
│   │   ├── streaming/      # Live streaming page
│   │   └── api/            # API proxy routes
│   ├── components/          # Reusable React components
│   │   ├── BottomNavigation.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── ErrorMessage.tsx
│   │   └── VirtualTryOnModal.tsx
│   └── lib/                # API client & utilities
│
├── backend/                 # Go backend API
│   ├── main.go             # Main server with API routes
│   ├── go.mod              # Go dependencies
│   └── .env                # Database configuration
│
├── python/                  # Python AI service
│   ├── main.py             # FastAPI app with try-on endpoint
│   ├── pyproject.toml      # Python dependencies
│   ├── fallback-try-on.png # Demo fallback image
│   └── .env                # Google API key
│
├── logs/                    # Service logs
├── start-all.sh            # Unified startup script
├── STARTUP.md              # Detailed setup guide
└── README.md               # This file
```

---

## 🌐 API Endpoints

### Backend (Go) - Port 8080

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/profiles` | Get all influencers |
| GET | `/api/influ-products` | Get all influencer collections |
| GET | `/api/products/:influ_product_id` | Get products by collection |
| GET | `/api/product/:id` | Get single product details |

### Python Service - Port 8001

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/try-on/` | Generate virtual try-on image |
| GET | `/docs` | FastAPI interactive documentation |

**Virtual Try-On Request:**
```json
{
  "user_image": "base64_encoded_image",
  "clothing_image": "base64_encoded_image"
}
```

---

## 🎨 Design System

### Color Palette

```css
/* Primary Colors */
--cream-bg: #FFF8F0;        /* Main background */
--gold-primary: #D4AF37;     /* Primary accent */
--gold-secondary: #C5A059;   /* Secondary accent */
--green-cta: #005834;        /* Call-to-action buttons */

/* Text Colors */
--text-primary: #1A1A1A;     /* Main text */
--text-secondary: #666666;   /* Secondary text */
```

### Typography
- **Primary Font**: System fonts (optimized for performance)
- **Weights**: Regular (400), Medium (500), Semibold (600), Bold (700)

---

## 🔧 Development

### Running Services Individually

**Frontend:**
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:3000
```

**Backend:**
```bash
cd backend
go mod download
go run main.go
# Runs on http://localhost:8080
```

**Python Service:**
```bash
cd python
pip install -e .
uvicorn main:app --host 0.0.0.0 --port 8001 --reload
# Runs on http://localhost:8001
```

### Database Setup

The backend automatically creates tables on first run:
- `influencers` - Fashion influencer profiles
- `influ_products` - Influencer collections/posters
- `products` - Individual products with pricing

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill processes on specific ports
lsof -ti:3000 | xargs kill -9  # Frontend
lsof -ti:8080 | xargs kill -9  # Backend
lsof -ti:8001 | xargs kill -9  # Python
```

### Database Connection Error
- Verify `DATABASE_URL` in `backend/.env`
- Check database is accessible
- For Neon: Ensure `?sslmode=require` is in the connection string

### Virtual Try-On Not Working
- Check `GOOGLE_API_KEY` in `python/.env`
- **Fallback mode**: A demo image will be shown if API fails
- View logs in `logs/python_*.log`

### Frontend Build Errors
```bash
cd frontend
rm -rf .next node_modules
npm install
npm run dev
```

---

## 📊 Database Schema

```sql
-- Influencers
CREATE TABLE influencers (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    dp TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Influencer Collections
CREATE TABLE influ_products (
    id SERIAL PRIMARY KEY,
    influ_id INTEGER REFERENCES influencers(id),
    poster TEXT,
    name TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Individual Products
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    influ_product_id INTEGER REFERENCES influ_products(id),
    image TEXT,
    description TEXT,
    price REAL DEFAULT 0,
    likes INTEGER DEFAULT 0,
    name TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## � License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

- **Yaswanth Bonumaddi** - [GitHub](https://github.com/asb7p7)

---

## 🙏 Acknowledgments

- **Google Gemini AI** for virtual try-on capabilities
- **Neon** for serverless PostgreSQL hosting
- **Next.js** team for the amazing framework
- **TailwindCSS** for the utility-first CSS framework

---

## � Support

For support, email yaswanthbonumaddi@example.com or open an issue on GitHub.

---

**Made with ❤️ for fashion enthusiasts**
