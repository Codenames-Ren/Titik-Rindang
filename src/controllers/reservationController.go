package controllers

import (
	"errors"
	"net/http"
	"strconv"
	"time"

	"titik-rindang/src/database"
	"titik-rindang/src/helper"
	"titik-rindang/src/models"
	"titik-rindang/src/services"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// Create Reservation
func CreateReservation(c *gin.Context) {
	var input struct {
		Name            string `json:"name" binding:"required"`
		Phone           string `json:"phone" binding:"required"`
		Email           string `json:"email" binding:"required,email"`
		TableID         uint   `json:"table_id" binding:"required"`
		ReservationDate string `json:"reservation_date" binding:"required"`
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
		Status: "Unpaid",
	}

	svc := services.NewReservationService(database.DB)
	if err := svc.CreateReservation(&reservation); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Table not available, failed to create reservations"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"status":  "success",
		"message": "reservation created successfully",
		"data":    reservation,
	})
}

//Confirm Reservation
func ConfirmReservation(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"message": "invalid reservation ID",
		})
		return
	}

	svc := services.NewReservationService(database.DB)
	reservation, err := svc.GetReservationByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"status":  "error",
			"message": "reservation not found",
		})
		return
	}

	// Update status reservation to "paid"
	reservation.Status = "Paid"
	if err := database.DB.Save(reservation).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  "error",
			"message": "failed to confirm reservation",
		})
		return
	}

	var invoice models.Invoice
	err = database.DB.Where("reservation_id = ?", reservation.ID).First(&invoice).Error

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			invoiceSvc := services.NewInvoiceService(database.DB)
			newInvoice, err := invoiceSvc.CreateInvoice(reservation)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{
					"status":  "error",
					"message": "failed to create invoice",
				})
				return
			}
			invoice = *newInvoice
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{
				"status":  "error",
				"message": "failed to fetch invoice data",
			})
			return
		}
	}

	invoice.PaymentMethod = "Paid"
	if err := database.DB.Save(&invoice).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  "error",
			"message": "failed to update invoice status",
		})
		return
	}


	if err := helper.SendInvoiceEmail(reservation.Email, &invoice); err != nil {
		c.JSON(http.StatusOK, gin.H{
			"status":  "success",
			"message": "reservation confirmed, but failed to send invoice email",
			"data": gin.H{
				"reservation": reservation,
				"invoice":     invoice,
			},
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "reservation confirmed & invoice sent successfully",
		"data": gin.H{
			"reservation": reservation,
			"invoice":     invoice,
		},
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
