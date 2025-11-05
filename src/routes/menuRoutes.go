package routes

import (
	"titik-rindang/src/controllers"
	"titik-rindang/src/middlewares"

	"github.com/gin-gonic/gin"
)

func MenuRoutes(router *gin.Engine) {
	menu := router.Group("/menu")

	menu.GET("/", controllers.GetAllMenu)
	menu.GET("/:id", controllers.GetMenuByID)
	menu.POST("/", middlewares.AuthMiddleware(), middlewares.AdminMiddleware(), controllers.CreateMenu)
	menu.PUT("/:id", middlewares.AuthMiddleware(), middlewares.AdminMiddleware(), controllers.UpdateMenu)
	menu.DELETE("/:id", middlewares.AuthMiddleware(), middlewares.AdminMiddleware(), controllers.DeleteMenu)
}
