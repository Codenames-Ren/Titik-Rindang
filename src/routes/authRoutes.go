package routes

import (
	"titik-rindang/src/controllers"
	"titik-rindang/src/middlewares"

	"github.com/gin-gonic/gin"
)

func AuthRoutes(router *gin.Engine) {

	authGroup := router.Group("/auth")
	{
		//Endpoint for login
		authGroup.POST("/login", controllers.Login)

		//Endpoint where needs auth
		authGroup.GET("/profile", middlewares.AuthMiddleware(), func(c *gin.Context) {
			username, _ := c.Get("username")
			c.JSON(200, gin.H{
				"message": "Welcome to your profile!",
				"user"	: username,
			})
		})

		authGroup.GET("/check-login", middlewares.AuthMiddleware(), func (c *gin.Context) {
			username, _ := c.Get("username")
			role, _ := c.Get("role")
			c.JSON(200, gin.H{
				"isLoggedIn": true,
				"username": username,
				"role": role,
			})
		})

		authGroup.POST("/logout", middlewares.AuthMiddleware(), func(c *gin.Context) {
			c.JSON(200, gin.H{"message": "Logout successful"})
		})
	}

	//admin
	AdminGroup := router.Group("/admin", middlewares.AuthMiddleware(), middlewares.AdminMiddleware())
	{
		
		AdminGroup.POST("/register", controllers.Register) //Endpoint for Register
		AdminGroup.GET("/users", controllers.GetAllUsers)
		AdminGroup.GET("/users/:id", controllers.GetAllUsersById)
		AdminGroup.PUT("/users/:id", controllers.UpdateUser)
		AdminGroup.DELETE("/users/:id", controllers.DeleteUser)
		AdminGroup.GET("/dashboard", func(c *gin.Context) {
			username, _ := c.Get("username")
			c.JSON(200, gin.H{
				"message": "Welcome!",
				"admin" : username,
			})
		})
	}
}