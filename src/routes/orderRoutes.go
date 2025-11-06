package routes

import (
	"titik-rindang/src/controllers"
	"titik-rindang/src/middlewares"

	"github.com/gin-gonic/gin"
)

func OrderRoutes(router *gin.Engine) {
	order := router.Group("/order")

	//public endpoint for users
	order.POST("/", controllers.CreateOrder)
	order.PUT("/:id/confirm", controllers.ConfirmOrder)

	// Login required (staff/cashier/admin)
	orderAuth := order.Group("/")
	orderAuth.Use(middlewares.AuthMiddleware())

	orderAuth.GET("/", controllers.GetAllOrders)
	orderAuth.GET("/:id", controllers.GetOrderByID)
	orderAuth.GET("/:id/receipt", controllers.PrintReceipt)

	// Only Admin
	orderAuth.DELETE("/:id",
		middlewares.AdminMiddleware(),
		controllers.DeleteOrder,
	)
}
