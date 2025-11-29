package main

import (
	"fmt"
	"log"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

const (
	IS_LOCAL = true

	LOCAL_HOST     = "localhost"
	LOCAL_PORT     = 5432
	LOCAL_USERNAME = "aura"
	LOCAL_PASSWORD = "aura@123"
	LOCAL_DATABASE = "alpha"
	LOCAL_SSL_MODE = "disable"

	NEON_HOST     = "ep-rapid-violet-a1of4m1u-pooler.ap-southeast-1.aws.neon.tech"
	NEON_PORT     = 5432
	NEON_USERNAME = "neondb_owner"
	NEON_PASSWORD = "npg_BP2geflmQKv0"
	NEON_DATABASE = "neondb"
	NEON_SSL_MODE = "require"

	MAX_OPEN_CONNECTIONS = 10
	MAX_IDLE_CONNECTIONS = 5
)

var DB *gorm.DB

type Influencer struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	Name        string    `json:"name"`
	Description string    `json:"desc"`
	DP          string    `json:"dp"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type InfluProduct struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	InfluID   uint      `json:"influ_id"`
	Poster    string    `json:"poster"`
	Name      string    `json:"name"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`

	Influencer Influencer `gorm:"foreignKey:InfluID" json:"influencer,omitempty"`
}

type Product struct {
	ID             uint         `gorm:"primaryKey" json:"id"`
	InfluProductID uint         `json:"influ_product_id"` // Foreign key to InfluProduct
	Image          string       `json:"image"`
	Description    string       `json:"description"`
	Price          float64      `json:"price"`
	Likes          int          `json:"like"`
	Name           string       `json:"name"`
	CreatedAt      time.Time    `json:"created_at"`
	UpdatedAt      time.Time    `json:"updated_at"`
	InfluProduct   InfluProduct `gorm:"foreignKey:InfluProductID" json:"influ_product,omitempty"`
}

func InitDB() {
	var dsn string

	if IS_LOCAL {
		dsn = fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%d sslmode=%s",
			LOCAL_HOST, LOCAL_USERNAME, LOCAL_PASSWORD, LOCAL_DATABASE, LOCAL_PORT, LOCAL_SSL_MODE)
		log.Println("Connecting to LOCAL PostgreSQL database...")
	} else {
		dsn = fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%d sslmode=%s",
			NEON_HOST, NEON_USERNAME, NEON_PASSWORD, NEON_DATABASE, NEON_PORT, NEON_SSL_MODE)
		log.Println("Connecting to NEON PostgreSQL database...")
	}

	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	sqlDB, err := DB.DB()
	if err != nil {
		log.Fatal("Failed to get database instance:", err)
	}

	sqlDB.SetMaxOpenConns(MAX_OPEN_CONNECTIONS)
	sqlDB.SetMaxIdleConns(MAX_IDLE_CONNECTIONS)

	err = DB.AutoMigrate(&Influencer{}, &InfluProduct{}, &Product{})
	if err != nil {
		log.Fatal("Failed to migrate database:", err)
	}

	log.Println("Database connected and migrated successfully!")
}

func GetProfiles(c *gin.Context) {
	var influencers []Influencer

	if err := DB.Find(&influencers).Error; err != nil {
		c.JSON(500, gin.H{"error": "Failed to fetch influencer profiles"})
		return
	}

	c.JSON(200, gin.H{
		"success": true,
		"data":    influencers,
	})
}

func GetInfluProducts(c *gin.Context) {
	var influProducts []InfluProduct

	if err := DB.Preload("Influencer").Find(&influProducts).Error; err != nil {
		c.JSON(500, gin.H{"error": "Failed to fetch influencer products"})
		return
	}

	c.JSON(200, gin.H{
		"success": true,
		"data":    influProducts,
	})
}

func GetProductsByInfluProductID(c *gin.Context) {
	influProductID := c.Param("influ_product_id")
	var products []Product

	if err := DB.Preload("InfluProduct.Influencer").Where("influ_product_id = ?", influProductID).Find(&products).Error; err != nil {
		c.JSON(500, gin.H{"error": "Failed to fetch products"})
		return
	}

	c.JSON(200, gin.H{
		"success": true,
		"data":    products,
	})
}

func GetProductByID(c *gin.Context) {
	productID := c.Param("id")
	var product Product

	if err := DB.Preload("InfluProduct.Influencer").First(&product, productID).Error; err != nil {
		c.JSON(404, gin.H{"error": "Product not found"})
		return
	}

	c.JSON(200, gin.H{
		"success": true,
		"data":    product,
	})
}

func main() {
	InitDB()

	r := gin.Default()

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
