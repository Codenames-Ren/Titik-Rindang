package controllers

import (
	"net/http"
	"strconv"

	"titik-rindang/src/database"
	"titik-rindang/src/models"

	"github.com/gin-gonic/gin"
)

// Get all menu
func GetAllMenu(c *gin.Context) {
	var menu []models.Menu

	if err := database.DB.Find(&menu).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "failed to load menu data"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "menu data loaded successfully",
		"data":    menu,
	})
}

// Get menu by ID
func GetMenuByID(c *gin.Context) {
	id := c.Param("id")
	var menu models.Menu

	if err := database.DB.First(&menu, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"status": "error", "message": "menu not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "menu details loaded successfully",
		"data":    menu,
	})
}

// Create new menu
func CreateMenu(c *gin.Context) {
	var input struct {
		Name     string  `json:"name" binding:"required"`
		Tagline  string  `json:"tagline"`
		ImageURL string  `json:"image_url"`
		Price    float64 `json:"price" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "invalid input format"})
		return
	}

	menu := models.Menu{
		Name:     input.Name,
		Tagline:  input.Tagline,
		ImageURL: input.ImageURL,
		Price:    input.Price,
	}

	if err := database.DB.Create(&menu).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "failed to create menu"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"status":  "success",
		"message": "menu created successfully",
		"data":    menu,
	})
}

// Update menu
func UpdateMenu(c *gin.Context) {
	id := c.Param("id")
	var menu models.Menu

	if err := database.DB.First(&menu, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"status": "error", "message": "menu not found"})
		return
	}

	var input struct {
		Name     string  `json:"name"`
		Tagline  string  `json:"tagline"`
		ImageURL string  `json:"image_url"`
		Price    float64 `json:"price"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "invalid input format"})
		return
	}

	// Only update fields that are sent
	if input.Name != "" {
		menu.Name = input.Name
	}
	if input.Tagline != "" {
		menu.Tagline = input.Tagline
	}
	if input.ImageURL != "" {
		menu.ImageURL = input.ImageURL
	}
	if input.Price != 0 {
		menu.Price = input.Price
	}

	if err := database.DB.Save(&menu).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "failed to update menu"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "menu updated successfully",
		"data":    menu,
	})
}

// Delete menu
func DeleteMenu(c *gin.Context) {
	id := c.Param("id")
	_, err := strconv.Atoi(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "invalid menu ID"})
		return
	}

	if err := database.DB.Delete(&models.Menu{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "failed to delete menu"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "menu deleted successfully",
	})
}
