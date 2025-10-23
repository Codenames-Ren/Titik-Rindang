package database

import (
	"fmt"

	"os"

	"titik-rindang/src/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() (*gorm.DB, error) {
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
	os.Getenv("DB_HOST"),
	os.Getenv("DB_USER"),
	os.Getenv("DB_PASSWORD"),
	os.Getenv("DB_NAME"),
	os.Getenv("DB_PORT"),
	)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	db.AutoMigrate(
		&models.Auth{}, 
		models.Invoice{}, 
		models.Menu{},
		models.OrderItem{},
		models.Reservation{},
		models.Table{})

	DB = db
	fmt.Println("Database connected successfully!")

	return  db, nil
}