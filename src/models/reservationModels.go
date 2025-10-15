package models

import "time"

type Reservation struct {
	ID          uint      `gorm:"primaryKey"`
	Name        string    `gorm:"type:varchar(100);not null"`
	Phone       string    `gorm:"type:varchar(20);not null"`
	Email       string    `gorm:"type:varchar(100);not null"`
	Type        string    `gorm:"type:varchar(20);not null"` // "reservation" atau "dine-in"
	TableID     *uint     // boleh null kalau dine-in belum pilih meja
	Table       Table     `gorm:"foreignKey:TableID"`
	Date        time.Time `gorm:"not null"`
	TableFee    float64   `gorm:"default:0"` // kalau reservasi = 50000, kalau dine-in = 0
	TotalPrice  float64   `gorm:"not null"`
	Status      string    `gorm:"type:varchar(20);default:'paid'"` // paid, completed, cancelled
	CreatedAt   time.Time
	UpdatedAt   time.Time
	OrderItems  []OrderItem `gorm:"foreignKey:ReservationID"`
}