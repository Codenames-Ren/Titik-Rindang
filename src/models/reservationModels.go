package models

import "time"

type Reservation struct {
	ID         uint      `gorm:"primaryKey"`
	Name       string    `gorm:"type:varchar(100);not null"`
	Phone      string    `gorm:"type:varchar(20);not null"`
	Email      string    `gorm:"type:varchar(100);not null"`
	TableID    uint      `gorm:"not null"`
	Table      Table     `gorm:"foreignKey:TableID"`
	Date       time.Time `gorm:"not null"`       // tanggal & jam reservasi
	TotalPrice float64   `gorm:"not null"`       // total dibayar full
	Status     string    `gorm:"type:varchar(20);default:'paid'"` // paid, completed, cancelled
	CreatedAt  time.Time
	UpdatedAt  time.Time
}