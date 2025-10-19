package controllers

import (
	"net/http"
	"strconv"
	"time"

	"titik-rindang/src/database"
	"titik-rindang/src/models"
	"titik-rindang/src/services"

	"github.com/gin-gonic/gin"
)

// Create Reservation
func CreateReservation(c *gin.Context) {
	var input struct {
		Name            string  `json:"name" binding:"required"`
		Phone           string  `json:"phone" binding:"required"`
		Email           string  `json:"email"`
		TableID         uint    `json:"table_id" binding:"required"`
		ReservationDate string  `json:"reservation_date" binding:"required"`
		TableFee        float64 `json:"table_fee" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input", "details": err.Error()})
		return
	}

	// Parse tanggal
	resDate, err := time.Parse(time.RFC3339, input.ReservationDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid reservation_date format. Use RFC3339"})
		return
	}

	// Create model
	reservation := models.Reservation{
		Name:            input.Name,
		Phone:           input.Phone,
		Email:           input.Email,
		TableID:         input.TableID,
		ReservationDate: resDate,
		TableFee:        input.TableFee,
		Status:          "pending",
	}

	svc := services.NewReservationService(database.DB)
	if err := svc.CreateReservation(&reservation); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Reservation created successfully",
		"data":    reservation,
	})
}

// Get All Reservations
func GetAllReservations(c *gin.Context) {
	svc := services.NewReservationService(database.DB)
	reservations, err := svc.GetAllReservations()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch reservations"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": reservations})
}

// Get Reservation by ID
func GetReservationByIDHandler(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	svc := services.NewReservationService(database.DB)
	reservation, err := svc.GetReservationByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": reservation})
}

// Update Reservation
func UpdateReservation(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var input struct {
		Status  string `json:"status"`
		TableID *uint  `json:"table_id"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input", "details": err.Error()})
		return
	}

	updatedData := &models.Reservation{}
	if input.Status != "" {
		updatedData.Status = input.Status
	}
	if input.TableID != nil {
		updatedData.TableID = *input.TableID
	}

	svc := services.NewReservationService(database.DB)
	updatedReservation, err := svc.UpdateReservation(uint(id), updatedData)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Reservation updated successfully",
		"data":    updatedReservation,
	})
}

// Delete Reservation
func DeleteReservation(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	svc := services.NewReservationService(database.DB)
	if err := svc.DeleteReservation(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Reservation deleted successfully"})
}
