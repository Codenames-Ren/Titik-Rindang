package routes

import (
	"titik-rindang/src/controllers"

	"github.com/gin-gonic/gin"
)

func ReservationRoutes(router *gin.Engine) {
	reservation := router.Group("/reservation")

	reservation.GET("/", controllers.GetAllReservations)
	reservation.POST("/", controllers.CreateReservation)
}