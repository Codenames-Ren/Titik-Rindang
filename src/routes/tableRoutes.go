package routes

import (
	"titik-rindang/src/controllers"

	"github.com/gin-gonic/gin"
)

func TableRoutes(router *gin.Engine) {
	reservation := router.Group("/table")

	reservation.GET("/", controllers.GetAllTables)
	reservation.POST("/", controllers.CreateTable)
}