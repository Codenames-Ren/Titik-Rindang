package routes

import (
	"titik-rindang/src/controllers"
	"titik-rindang/src/middlewares"

	"github.com/gin-gonic/gin"
)

func TableRoutes(router *gin.Engine) {
	table := router.Group("/table")

	table.GET("/", controllers.GetAllTables)
	table.GET("/:id", controllers.GetTableByID)
	table.POST("/", middlewares.AuthMiddleware(), controllers.CreateTable)
	table.PUT("/:id", middlewares.AuthMiddleware(), controllers.UpdateTable)
	table.DELETE("/:id", middlewares.AuthMiddleware(), middlewares.AdminMiddleware(), controllers.DeleteTable)
}
