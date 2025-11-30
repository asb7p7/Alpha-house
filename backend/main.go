package main

import (
	"context"
	"log"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
)

var DB *pgxpool.Pool

type Influencer struct {
	ID          int       `json:"id"`
	Name        string    `json:"name"`
	Description string    `json:"desc"`
	DP          string    `json:"dp"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type InfluProduct struct {
	ID         int        `json:"id"`
	InfluID    int        `json:"influ_id"`
	Poster     string     `json:"poster"`
	Name       string     `json:"name"`
	CreatedAt  time.Time  `json:"created_at"`
	UpdatedAt  time.Time  `json:"updated_at"`
	Influencer *Influencer `json:"influencer,omitempty"`
}

type Product struct {
	ID             int           `json:"id"`
	InfluProductID int           `json:"influ_product_id"`
	Image          string        `json:"image"`
	Description    string        `json:"description"`
	Price          float64       `json:"price"`
	Likes          int           `json:"like"`
	Name           string        `json:"name"`
	CreatedAt      time.Time     `json:"created_at"`
	UpdatedAt      time.Time     `json:"updated_at"`
	InfluProduct   *InfluProduct `json:"influ_product,omitempty"`
}

func InitDB() {
	// Load environment variables
	err := godotenv.Load()
	if err != nil {
		log.Println("Warning: .env file not found, using environment variables")
	}

	connStr := os.Getenv("DATABASE_URL")
	if connStr == "" {
		log.Fatal("DATABASE_URL environment variable is not set")
	}

	// Create connection pool
	config, err := pgxpool.ParseConfig(connStr)
	if err != nil {
		log.Fatal("Unable to parse DATABASE_URL:", err)
	}

	// Set pool settings
	config.MaxConns = 10
	config.MinConns = 2

	DB, err = pgxpool.NewWithConfig(context.Background(), config)
	if err != nil {
		log.Fatal("Unable to connect to database:", err)
	}

	// Test connection
	err = DB.Ping(context.Background())
	if err != nil {
		log.Fatal("Unable to ping database:", err)
	}

	// Create tables if they don't exist
	err = createTables()
	if err != nil {
		log.Fatal("Failed to create tables:", err)
	}

	log.Println("Database connected successfully!")
}

func createTables() error {
	ctx := context.Background()

	// Create influencer table
	_, err := DB.Exec(ctx, `
		CREATE TABLE IF NOT EXISTS influencers (
			id SERIAL PRIMARY KEY,
			name TEXT NOT NULL,
			description TEXT,
			dp TEXT,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)
	`)
	if err != nil {
		return err
	}

	// Create influ_products table
	_, err = DB.Exec(ctx, `
		CREATE TABLE IF NOT EXISTS influ_products (
			id SERIAL PRIMARY KEY,
			influ_id INTEGER REFERENCES influencers(id) ON DELETE CASCADE,
			poster TEXT,
			name TEXT NOT NULL,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)
	`)
	if err != nil {
		return err
	}

	// Create products table
	_, err = DB.Exec(ctx, `
		CREATE TABLE IF NOT EXISTS products (
			id SERIAL PRIMARY KEY,
			influ_product_id INTEGER REFERENCES influ_products(id) ON DELETE CASCADE,
			image TEXT,
			description TEXT,
			price REAL DEFAULT 0,
			likes INTEGER DEFAULT 0,
			name TEXT NOT NULL,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)
	`)
	if err != nil {
		return err
	}

	log.Println("Tables created/verified successfully!")
	return nil
}

func GetProfiles(c *gin.Context) {
	ctx := context.Background()
	var influencers []Influencer

	rows, err := DB.Query(ctx, `
		SELECT id, name, description, dp, created_at, updated_at 
		FROM influencers 
		ORDER BY id
	`)
	if err != nil {
		log.Printf("Error fetching profiles: %v", err)
		c.JSON(500, gin.H{"error": "Failed to fetch influencer profiles"})
		return
	}
	defer rows.Close()

	for rows.Next() {
		var inf Influencer
		err := rows.Scan(&inf.ID, &inf.Name, &inf.Description, &inf.DP, &inf.CreatedAt, &inf.UpdatedAt)
		if err != nil {
			log.Printf("Error scanning profile: %v", err)
			continue
		}
		influencers = append(influencers, inf)
	}

	if influencers == nil {
		influencers = []Influencer{}
	}

	c.JSON(200, gin.H{
		"success": true,
		"data":    influencers,
	})
}

func GetInfluProducts(c *gin.Context) {
	ctx := context.Background()
	var influProducts []InfluProduct

	rows, err := DB.Query(ctx, `
		SELECT 
			ip.id, ip.influ_id, ip.poster, ip.name, ip.created_at, ip.updated_at,
			i.id, i.name, i.description, i.dp, i.created_at, i.updated_at
		FROM influ_products ip
		LEFT JOIN influencers i ON ip.influ_id = i.id
		ORDER BY ip.id
	`)
	if err != nil {
		log.Printf("Error fetching influ products: %v", err)
		c.JSON(500, gin.H{"error": "Failed to fetch influencer products"})
		return
	}
	defer rows.Close()

	for rows.Next() {
		var ip InfluProduct
		var inf Influencer
		err := rows.Scan(
			&ip.ID, &ip.InfluID, &ip.Poster, &ip.Name, &ip.CreatedAt, &ip.UpdatedAt,
			&inf.ID, &inf.Name, &inf.Description, &inf.DP, &inf.CreatedAt, &inf.UpdatedAt,
		)
		if err != nil {
			log.Printf("Error scanning influ product: %v", err)
			continue
		}
		ip.Influencer = &inf
		influProducts = append(influProducts, ip)
	}

	if influProducts == nil {
		influProducts = []InfluProduct{}
	}

	c.JSON(200, gin.H{
		"success": true,
		"data":    influProducts,
	})
}

func GetProductsByInfluProductID(c *gin.Context) {
	ctx := context.Background()
	influProductID := c.Param("influ_product_id")
	var products []Product

	rows, err := DB.Query(ctx, `
		SELECT 
			p.id, p.influ_product_id, p.image, p.description, p.price, p.likes, p.name, p.created_at, p.updated_at,
			ip.id, ip.influ_id, ip.poster, ip.name, ip.created_at, ip.updated_at,
			i.id, i.name, i.description, i.dp, i.created_at, i.updated_at
		FROM products p
		LEFT JOIN influ_products ip ON p.influ_product_id = ip.id
		LEFT JOIN influencers i ON ip.influ_id = i.id
		WHERE p.influ_product_id = $1
		ORDER BY p.id
	`, influProductID)
	if err != nil {
		log.Printf("Error fetching products: %v", err)
		c.JSON(500, gin.H{"error": "Failed to fetch products"})
		return
	}
	defer rows.Close()

	for rows.Next() {
		var p Product
		var ip InfluProduct
		var inf Influencer
		err := rows.Scan(
			&p.ID, &p.InfluProductID, &p.Image, &p.Description, &p.Price, &p.Likes, &p.Name, &p.CreatedAt, &p.UpdatedAt,
			&ip.ID, &ip.InfluID, &ip.Poster, &ip.Name, &ip.CreatedAt, &ip.UpdatedAt,
			&inf.ID, &inf.Name, &inf.Description, &inf.DP, &inf.CreatedAt, &inf.UpdatedAt,
		)
		if err != nil {
			log.Printf("Error scanning product: %v", err)
			continue
		}
		ip.Influencer = &inf
		p.InfluProduct = &ip
		products = append(products, p)
	}

	if products == nil {
		products = []Product{}
	}

	c.JSON(200, gin.H{
		"success": true,
		"data":    products,
	})
}

func GetProductByID(c *gin.Context) {
	ctx := context.Background()
	productID := c.Param("id")
	var p Product
	var ip InfluProduct
	var inf Influencer

	err := DB.QueryRow(ctx, `
		SELECT 
			p.id, p.influ_product_id, p.image, p.description, p.price, p.likes, p.name, p.created_at, p.updated_at,
			ip.id, ip.influ_id, ip.poster, ip.name, ip.created_at, ip.updated_at,
			i.id, i.name, i.description, i.dp, i.created_at, i.updated_at
		FROM products p
		LEFT JOIN influ_products ip ON p.influ_product_id = ip.id
		LEFT JOIN influencers i ON ip.influ_id = i.id
		WHERE p.id = $1
	`, productID).Scan(
		&p.ID, &p.InfluProductID, &p.Image, &p.Description, &p.Price, &p.Likes, &p.Name, &p.CreatedAt, &p.UpdatedAt,
		&ip.ID, &ip.InfluID, &ip.Poster, &ip.Name, &ip.CreatedAt, &ip.UpdatedAt,
		&inf.ID, &inf.Name, &inf.Description, &inf.DP, &inf.CreatedAt, &inf.UpdatedAt,
	)

	if err == pgx.ErrNoRows {
		c.JSON(404, gin.H{"error": "Product not found"})
		return
	}
	if err != nil {
		log.Printf("Error fetching product: %v", err)
		c.JSON(500, gin.H{"error": "Failed to fetch product"})
		return
	}

	ip.Influencer = &inf
	p.InfluProduct = &ip

	c.JSON(200, gin.H{
		"success": true,
		"data":    p,
	})
}

func main() {
	InitDB()
	defer DB.Close()

	r := gin.Default()

	// Enable CORS
	r.Use(func(c *gin.Context) {
		origin := c.Request.Header.Get("Origin")
		if origin != "" {
			c.Writer.Header().Set("Access-Control-Allow-Origin", origin)
		} else {
			// Fallback for non-browser requests or when Origin is missing
			c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		}
		
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With, ngrok-skip-browser-warning")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	api := r.Group("/api")
	{
		api.GET("/profiles", GetProfiles)
		api.GET("/influ-products", GetInfluProducts)
		api.GET("/products/:influ_product_id", GetProductsByInfluProductID)
		api.GET("/product/:id", GetProductByID)
	}

	log.Println("Server starting on port 8080...")
	if err := r.Run(":8080"); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
