# Alpha House Backend API

A Go backend application using Gin framework and pgx/v5 for managing influencer products.

## Technologies
- **Go** - Programming language
- **Gin** - Web framework
- **pgx/v5** - PostgreSQL driver with connection pooling
- **Neon PostgreSQL** - Serverless PostgreSQL database

## Database Configuration

The application uses environment variables for database configuration:
- Create a `.env` file in the backend directory
- Add your `DATABASE_URL` connection string

Example `.env`:
```
DATABASE_URL='postgresql://username:password@host/database?sslmode=require'
```

The application uses **Neon PostgreSQL** (serverless) for production and can connect to any PostgreSQL database via the `DATABASE_URL` environment variable.


## Database Schema

### 1. Influencer Table
- `id` (integer, primary key)
- `name` (string)
- `desc` (string) - Description
- `dp` (string) - Display picture URL
- `created_at` (timestamp)
- `updated_at` (timestamp)

### 2. InfluProduct Table
- `id` (integer, primary key)
- `influ_id` (integer) - Foreign key to Influencer
- `poster` (string) - Image link
- `name` (string)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### 3. Product Table
- `id` (integer, primary key)
- `influ_product_id` (integer) - Foreign key to InfluProduct
- `image` (string)
- `description` (string)
- `price` (float)
- `like` (integer)
- `name` (string)
- `created_at` (timestamp)
- `updated_at` (timestamp)

## API Endpoints

### 1. Get All Influencer Profiles
```
GET /api/profiles
```
Returns all influencer profiles.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Influencer Name",
      "desc": "Description",
      "dp": "https://example.com/image.jpg",
      "created_at": "2025-11-29T10:00:00Z",
      "updated_at": "2025-11-29T10:00:00Z"
    }
  ]
}
```

### 2. Get All Influencer Products
```
GET /api/influ-products
```
Returns all influencer products with their associated influencer data.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "influ_id": 1,
      "poster": "https://example.com/poster.jpg",
      "name": "Product Name",
      "created_at": "2025-11-29T10:00:00Z",
      "updated_at": "2025-11-29T10:00:00Z",
      "influencer": {
        "id": 1,
        "name": "Influencer Name",
        "desc": "Description",
        "dp": "https://example.com/image.jpg"
      }
    }
  ]
}
```

### 3. Get Products by Influencer Product ID
```
GET /api/products/:influ_product_id
```
Returns all products for a specific influencer product.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "influ_product_id": 1,
      "image": "https://example.com/product.jpg",
      "description": "Product description",
      "price": 99.99,
      "like": 150,
      "name": "Product Name",
      "created_at": "2025-11-29T10:00:00Z",
      "updated_at": "2025-11-29T10:00:00Z",
      "influ_product": {
        "id": 1,
        "influ_id": 1,
        "poster": "https://example.com/poster.jpg",
        "name": "Influencer Product"
      }
    }
  ]
}
```

## Setup Instructions

### Prerequisites
1. Go 1.21 or higher installed
2. PostgreSQL database (Neon or local)
3. Database connection string

### Configure Environment
Create a `.env` file in the `backend` directory:
```bash
cd backend
cp .env.example .env
# Edit .env and add your DATABASE_URL
```

For **Neon PostgreSQL**, get your connection string from [Neon Console](https://console.neon.tech/).

For **Local PostgreSQL**:
```sql
CREATE DATABASE alpha;
CREATE USER aura WITH PASSWORD 'aura@123';
GRANT ALL PRIVILEGES ON DATABASE alpha TO aura;
```

Then use: `DATABASE_URL='postgresql://aura:aura@123@localhost:5432/alpha?sslmode=disable'`

### Install Dependencies
```bash
cd backend
go mod tidy
```

### Run the Application
```bash
go run main.go
```

Or build and run:

```bash
go build -o server
./server
```

The server will start on **http://localhost:8080**

## Testing the API

### Using curl:

```bash
# Get all influencer profiles
curl http://localhost:8080/api/profiles

# Get all influencer products
curl http://localhost:8080/api/influ-products

# Get products by influencer product ID
curl http://localhost:8080/api/products/1
```

### Using browser:
- http://localhost:8080/api/profiles
- http://localhost:8080/api/influ-products
- http://localhost:8080/api/products/1

## Features
- ✅ RESTful API design
- ✅ Database connection pooling
- ✅ Auto-migration of database schemas
- ✅ Foreign key relationships
- ✅ Preloading of related data
- ✅ JSON responses
- ✅ Error handling

## Project Structure
```
backend/
├── main.go       # Main application file with all logic
├── go.mod        # Go module dependencies
└── go.sum        # Dependency checksums
```

