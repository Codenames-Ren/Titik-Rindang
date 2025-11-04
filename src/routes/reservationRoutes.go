package routes

import (
	"titik-rindang/src/controllers"
	"titik-rindang/src/middlewares"

	"github.com/gin-gonic/gin"
)

func ReservationRoutes(router *gin.Engine) {
	reservation := router.Group("/reservation")

	reservation.GET("/", middlewares.AuthMiddleware(), controllers.GetAllReservations)
	reservation.GET("/:id", middlewares.AuthMiddleware(), controllers.GetReservationByID)
	reservation.POST("/", controllers.CreateReservation)
	reservation.POST("/confirm/:id", controllers.ConfirmReservation)
	reservation.PUT("/:id", middlewares.AuthMiddleware(), middlewares.CashierMiddleware(), controllers.UpdateReservation)
	reservation.DELETE("/:id", middlewares.AuthMiddleware(), middlewares.AdminMiddleware(), controllers.DeleteReservation)
}