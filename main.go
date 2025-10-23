package main

import (
	"log"
	"os"
	"titik-rindang/src/database"
	"titik-rindang/src/models"
	"titik-rindang/src/routes"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("Link Start!")
	}

	//db connection
	database.ConnectDB()

	//automigrate
	database.DB.AutoMigrate(
		&models.Auth{},
		&models.Invoice{},
		&models.Menu{},
		&models.OrderItem{},
		&models.Reservation{},
		&models.Table{},
	)

	router := gin.Default()

	//CORS
	router.Use(func (c *gin.Context)  {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, Authorization")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	//routes
	routes.ReservationRoutes(router)
	routes.MenuRoutes(router)
	routes.TableRoutes(router)
	routes.AuthRoutes(router)

	//Server berjalan di port 8080
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	// router.Run(":" + port)
	router.Run("0.0.0.0:" + port)
}
