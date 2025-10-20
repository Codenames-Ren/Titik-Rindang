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
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "invalid input"})
		return
	}

	resDate, err := time.Parse(time.RFC3339, input.ReservationDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "invalid reservation date format"})
		return
	}

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
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "failed to create reservation"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"status":  "success",
		"message": "reservation created successfully",
		"data":    reservation,
	})
}

// Get All Reservations
func GetAllReservations(c *gin.Context) {
	svc := services.NewReservationService(database.DB)
	reservations, err := svc.GetAllReservations()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "failed to load reservations"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "reservations data loaded successfully",
		"data":    reservations,
	})
}

// Get Reservation by ID
func GetReservationByID(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "invalid reservation ID"})
		return
	}

	svc := services.NewReservationService(database.DB)
	reservation, err := svc.GetReservationByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"status": "error", "message": "reservation not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "reservation details loaded successfully",
		"data":    reservation,
	})
}

// Update Reservation
func UpdateReservation(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "invalid reservation ID"})
		return
	}

	var input struct {
		Status  string `json:"status"`
		TableID *uint  `json:"table_id"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "invalid input"})
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
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "failed to update reservation"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "reservation updated successfully",
		"data":    updatedReservation,
	})
}

// Delete Reservation
func DeleteReservation(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "invalid reservation ID"})
		return
	}

	svc := services.NewReservationService(database.DB)
	if err := svc.DeleteReservation(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "failed to delete reservation"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "reservation deleted successfully",
	})
}
