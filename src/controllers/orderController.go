package controllers

import (
	"net/http"
	"strconv"

	"titik-rindang/src/database"
	"titik-rindang/src/models"
	"titik-rindang/src/services"

	"github.com/gin-gonic/gin"
)

//create order
func CreateOrder(c *gin.Context) {
	var input struct {
		TableID  uint `json:"table_id" binding:"required"`
		Customer string `json:"customer"`
		Items []struct {
			MenuID uint `json:"menu_id"`
			Qty    int  `json:"qty"`
		} `json:"items" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "invalid JSON"})
		return
	}

	svc := services.NewOrderService(database.DB)

	orderItems := []services.OrderItemInput{}
	for _, item := range input.Items {
		orderItems = append(orderItems, services.OrderItemInput{
			MenuID: item.MenuID,
			Qty:    item.Qty,
		})
	}

	order, err := svc.CreateOrder(input.TableID, input.Customer, orderItems)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"status": "success",
		"message": "order created",
		"data": order,
	})
}

//Get all orders
func GetAllOrders(c *gin.Context) {
	var orders []models.Order

	if err := database.DB.
		Preload("Table").
		Preload("OrderItems.Menu").
		Find(&orders).Error; err != nil {

		c.JSON(http.StatusInternalServerError, gin.H{
			"status": "error",
			"message": "failed to load orders",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   orders,
	})
}

//Get orders by id
func GetOrderByID(c *gin.Context) {
	id := c.Param("id")

	var order models.Order
	if err := database.DB.
		Preload("Table").
		Preload("OrderItems.Menu").
		First(&order, id).Error; err != nil {

		c.JSON(http.StatusNotFound, gin.H{
			"status": "error",
			"message": "order not found",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   order,
	})
}

//confirm order
func ConfirmOrder(c *gin.Context) {
	idStr := c.Param("id")
	idInt, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "invalid order ID"})
		return
	}

	svc := services.NewOrderService(database.DB)

	order, err := svc.ConfirmOrder(uint(idInt))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"message": "order confirmed",
		"data": order,
	})
}

//delete order
func DeleteOrder(c *gin.Context) {
	idStr := c.Param("id")
	idInt, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "invalid order ID"})
		return
	}

	var order models.Order
	if err := database.DB.First(&order, idInt).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"status": "error", "message": "order not found"})
		return
	}

	database.DB.Where("order_id = ?", idInt).Delete(&models.OrderItem{})

	if err := database.DB.Delete(&models.Order{}, idInt).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "failed to delete order"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"message": "order deleted",
	})
}

//print receipt
func PrintReceipt(c *gin.Context) {
	idStr := c.Param("id")
	id, _ := strconv.Atoi(idStr)

	var order models.Order
	if err := database.DB.
		Preload("Table").
		Preload("OrderItems.Menu").
		First(&order, id).Error; err != nil {

		c.JSON(http.StatusNotFound, gin.H{"error": "order not found"})
		return
	}

	receiptSvc := services.NewReceiptService()
	path, err := receiptSvc.GenerateReceipt(&order)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to generate receipt"})
		return
	}

	c.JSON(200, gin.H{
		"status":  "success",
		"receipt": path,
	})
}
