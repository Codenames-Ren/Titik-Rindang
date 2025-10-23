package controllers

import (
	"net/http"
	"titik-rindang/src/database"
	"titik-rindang/src/helper"
	"titik-rindang/src/models"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

func GetAllUsers(c *gin.Context) {
	var users []models.Auth

	//Get all users from Database
	if err := database.DB.Find(&users).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fecth users"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"users": users})
}

func GetAllUsersById(c *gin.Context) {
	id := c.Param("id")

	var user []models.Auth
	if err := database.DB.First(&user, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found!"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"id": id,
		"users": user,
	})	
}

func DeleteUser(c *gin.Context) {
	id := c.Param("id")

	var user models.Auth
	if err := database.DB.First(&user, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found!"})
		return
	}

	if err := database.DB.Delete(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User deleted successfully!"})
}

// controllers/user_controller.go
func UpdateUser(c *gin.Context) {
	id := c.Param("id")

	var input struct {
		Username string `json:"username"`
		Email    string `json:"email"`
		Password string `json:"password,omitempty"`
		Role     string `json:"role"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	var user models.Auth
	if err := database.DB.Where("id = ?", id).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	user.Username = input.Username
	user.Email = input.Email
	user.Role = input.Role

	if input.Password != "" {
		hashed, _ := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
		user.Password = string(hashed)
	}

	if err := database.DB.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User updated successfully"})
}

func UpdateUserPassword(c *gin.Context) {
	var input struct {
		Oldpassword string `json:"old_password"`
		Newpassword string `json:"new_password"`
		Confirmnewpassword string `json:"confirm_new_password"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	//check new password and confirm password match or not
	if input.Newpassword != input.Confirmnewpassword {
		c.JSON(http.StatusBadRequest, gin.H{"error": "New password and confirm password doesn't match!"})
		return
	}

	//validate new password
	if valid, message := helper.ValidatePassword(input.Newpassword); !valid {
		c.JSON(http.StatusBadRequest, gin.H{"error": message})
		return
	}

	//get user from JWT token
	username, exists := c.Get("username")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	//search user by username
	var user models.Auth
	if err := database.DB.Where("username = ?", username).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	//checking old password
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Oldpassword)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Old password is incorrect"})
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Newpassword), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash new password"})
		return
	}

	//Updating password in database
	if err := database.DB.Model(&user).Update("password", string(hashedPassword)).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update password"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Password updated successfuly!"})
}