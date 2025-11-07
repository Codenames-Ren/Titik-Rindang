package main

import (
	"log"
	"os"
	"time"
	"titik-rindang/src/database"
	"titik-rindang/src/models"
	"titik-rindang/src/routes"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("Link Start!")
	}

	// DB connection
	database.ConnectDB()

	// Automigrate
	database.DB.AutoMigrate(
		&models.Auth{},
		&models.Invoice{},
		&models.Menu{},
		&models.Order{},
		&models.OrderItem{},
		&models.Reservation{},
		&models.Table{},
	)

	router := gin.Default()

	// ✅ FIX: CORS config
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Routes
	routes.ReservationRoutes(router)
	routes.MenuRoutes(router)
	routes.TableRoutes(router)
	routes.AuthRoutes(router)
	routes.OrderRoutes(router)

	router.Static("/uploads/menu", "./src/uploads/menu")
	router.Static("/uploads/receipts", "./src/uploads/receipts")

	// Server berjalan di port 8080
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("🚀 Backend running at http://localhost:%s", port)
	router.Run("0.0.0.0:" + port)
}
