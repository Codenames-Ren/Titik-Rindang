package controllers

import (
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"

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
	name := c.PostForm("name")
	tagline := c.PostForm("tagline")
	priceStr := c.PostForm("price")

	if name == "" || priceStr == "" {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "name and price are required"})
		return
	}

	price, err := strconv.ParseFloat(priceStr, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "invalid price format"})
		return
	}

	file, err := c.FormFile("image")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "image file is required"})
		return
	}

	uploadFolder := "src/uploads/menu"
	if err := os.MkdirAll(uploadFolder, os.ModePerm); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "failed to create upload folder"})
		return
	}

	filename := time.Now().Format("20060102150405") + "_" + filepath.Base(file.Filename)
	filePath := filepath.Join(uploadFolder, filename)

	if err := c.SaveUploadedFile(file, filePath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "failed to save image"})
		return
	}

	imageURL := "/uploads/menu/" + filename

	menu := models.Menu{
		Name:     name,
		Tagline:  tagline,
		ImageURL: imageURL,
		Price: price,
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

    name := c.PostForm("name")
    tagline := c.PostForm("tagline")
    priceStr := c.PostForm("price")

    if name != "" {
        menu.Name = name
    }
    if tagline != "" {
        menu.Tagline = tagline
    }
    if priceStr != "" {
        price, err := strconv.ParseFloat(priceStr, 64)
        if err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "invalid price format"})
            return
        }
        menu.Price = price
    }

    file, err := c.FormFile("image")
    if err == nil {
        if menu.ImageURL != "" {
            oldPath := "." + menu.ImageURL // contoh: ./uploads/menu/xxxxx.jpg
            _ = os.Remove(oldPath)
        }

        uploadFolder := "src/uploads/menu"
        if err := os.MkdirAll(uploadFolder, os.ModePerm); err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "failed to create upload folder"})
            return
        }

        filename := time.Now().Format("20060102150405") + "_" + filepath.Base(file.Filename)
        filePath := filepath.Join(uploadFolder, filename)

        if err := c.SaveUploadedFile(file, filePath); err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "failed to save image"})
            return
        }

        menu.ImageURL = "/uploads/menu/" + filename
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
	var menu models.Menu

	if err := database.DB.First(&menu, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"status":  "error",
			"message": "menu not found",
		})
		return
	}

	if menu.ImageURL != "" {
		filePath := strings.TrimPrefix(menu.ImageURL, "/")

		if _, err := os.Stat(filePath); err == nil {
			if err := os.Remove(filePath); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{
					"status":  "error",
					"message": "failed to delete image file",
				})
				return
			}
		}
	}

	if err := database.DB.Delete(&menu).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  "error",
			"message": "failed to delete menu",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "menu deleted successfully",
	})
}