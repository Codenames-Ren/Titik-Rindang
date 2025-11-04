package models

import "time"

type Invoice struct {
	ID             uint        `gorm:"primaryKey"`
	ReservationID  uint        `gorm:"not null"`
	Reservation    Reservation `gorm:"foreignKey:ReservationID"`
	InvoiceNumber  string      `gorm:"unique;not null"`
	AmountPaid     float64     `gorm:"not null"`
	PaymentMethod  string      `gorm:"type:varchar(50)"`
	CreatedAt      time.Time
	UpdatedAt	   time.Time
}