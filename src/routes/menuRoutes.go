package routes

import (
	"titik-rindang/src/controllers"

	"github.com/gin-gonic/gin"
)

func MenuRoutes(router *gin.Engine) {
	reservation := router.Group("/menu")

	reservation.GET("/", controllers.GetAllMenu)
	reservation.POST("/", controllers.CreateMenu)
}