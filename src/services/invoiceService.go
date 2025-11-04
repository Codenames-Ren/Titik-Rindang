package services

import (
	"fmt"
	"time"

	"titik-rindang/src/models"

	"gorm.io/gorm"
)

type InvoiceService struct {
	DB *gorm.DB
}

func NewInvoiceService(db *gorm.DB) *InvoiceService {
	return  &InvoiceService{DB: db}
}

func (s *InvoiceService) CreateInvoice(reservation *models.Reservation) (*models.Invoice, error) {
    // Deny duplicate invoice
    var existing models.Invoice
    if err := s.DB.Where("reservation_id = ?", reservation.ID).First(&existing).Error; err == nil {
        return &existing, nil
    }

    paymentStatus := "Unpaid"
    if reservation.Status == "Paid" {
        paymentStatus = "Paid"
    }

    invoice := models.Invoice{
        ReservationID:  reservation.ID,
        InvoiceNumber:  fmt.Sprintf("INV-%d%02d%02d-%03d", time.Now().Year(), time.Now().Month(), time.Now().Day(), reservation.ID),
        AmountPaid:     reservation.TableFee,
        PaymentMethod:  paymentStatus,
        CreatedAt:      time.Now(),
    }

    if err := s.DB.Create(&invoice).Error; err != nil {
        return nil, err
    }

    return &invoice, nil
}