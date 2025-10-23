package controllers

import (
	"fmt"
	"log"
	"net/http"
	"strings"
	"titik-rindang/src/database"
	"titik-rindang/src/helper"
	"titik-rindang/src/models"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

//Register User
func Register(c *gin.Context) {
	var input struct {
		Username 	string `json:"username" binding:"required"`
		Email 		string `json:"email" binding:"required,email"`
		Password 	string `json:"password" binding:"required"`
		Role	 	string `json:"role"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	//Password Validation
	if valid, message := helper.ValidatePassword(input.Password); !valid {
		c.JSON(http.StatusBadRequest, gin.H{"error": message})
		return
	}

	if input.Role == "" {
		input.Role = "staff"
	}

	//Check user has been used or not
	var existingUser models.Auth
	if err := database.DB.Unscoped().Where("email = ? OR username = ?", input.Email, input.Username).First(&existingUser).Error;
	err == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Email or username already in use!"})
		return
	}

	//prefix id by role
	prefix := "STF"
	if input.Role == "cashier" {
		prefix = "CAS"
	}


	//search id by prefix
	var lastUser models.Auth
	var lastID string
	if err := database.DB.Unscoped().
	Where("id LIKE ?", prefix+"-%").
	Order("id DESC").
	First(&lastUser).
	Error; err == nil {
		lastID = lastUser.ID
	}

	//Generate new ID
	newNumber := 1
	if lastID != "" {
		var lastNumber int
		if _, err := fmt.Sscanf(lastID, prefix+"-%03d", &lastNumber); err == nil {
			newNumber = lastNumber + 1
		}
	}

	//set new ID
	newUserID := fmt.Sprintf("%s-%03d", prefix, newNumber)

	//hashpassword for temporary user
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H {"error": "Failed to hash password"})
		return
	}

	user := models.Auth{
		ID: 			newUserID,
		Username: 		strings.TrimSpace(input.Username),
		Email: 			strings.TrimSpace(input.Email),
		Password: 		string(hashedPassword),
		Role: 			input.Role,
		Status: 		"active",
	}
	
	if err := database.DB.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
	"message": "User registered successfully",
	"username": user.Username,
	"email": user.Email,
	"id": user.ID,
	})
	
	log.Printf("User %s registered successfully", user.ID)
}