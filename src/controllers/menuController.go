package controllers

import (
	"net/http"

	"titik-rindang/src/database"
	"titik-rindang/src/models"

	"github.com/gin-gonic/gin"
)

//Get all menu
func GetAllMenu(c *gin.Context) {
	var menu []models.Menu

	if err := database.DB.Find(&menu).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get product menu data"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"message": "Data product menu loaded successfully!",
		"data": menu,
	})
}

//Get menu by-ID
func GetMenuByID(c *gin.Context) {
	id := c.Param("id")
	var menu models.Menu

	if err := database.DB.First(&menu, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "product menu not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"message": "details product menu loaded successfully!",
		"data": menu,
	})
}

//Create product menu
func CreateMenu(c *gin.Context) {
	var input struct {
		Name			string		`json:"name" binding:"required"`
		Tagline			string		`json:"tagline"`
		ImageURL		string		`json:"image_url"`
		Price			float64		`json:"price" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	menu := models.Menu{
		Name: 		input.Name,
		Tagline: 	input.Tagline,
		ImageURL: 	input.ImageURL,
		Price: 		input.Price,
	}

	if err := database.DB.Create(&menu).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create product menu"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"status": "success",
		"message": "Product menu created successfully!",
		"data": menu,
	})
}

//Update product menu
func UpdateMenu(c *gin.Context) {
	id := c.Param("id")
	var menu models.Menu

	if err := database.DB.First(&menu, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "product menu not found"})
		return
	}

	var input struct {
		Name		string		`json:"name"`
		Tagline		string		`json:"tagline"`
		ImageURL	string		`json:"image_url"`
		Price		float64		`json:"price"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	menu.Name = input.Name
	menu.Tagline = input.Tagline
	menu.ImageURL = input.ImageURL
	menu.Price = input.Price

	if err := database.DB.Save(&menu).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to updating product menu"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"message": "Product menu updated successfully!",
		"data": menu,
	})
}

//Delete product menu

func DeleteMenu(c *gin.Context) {
	id := c.Param("id")
	var menu models.Menu

	if err := database.DB.First(&menu, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product menu not found"})
		return
	}

	if err := database.DB.Delete(&menu).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete product menu"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"message": "Product menu deleted successfully!",
	})
}