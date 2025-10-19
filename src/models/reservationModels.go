package models

import "time"

type Reservation struct {
	ID               uint      `gorm:"primaryKey"`
	Name             string    `gorm:"type:varchar(100);not null"`
	Phone            string    `gorm:"type:varchar(20);not null"`
	Email            string    `gorm:"type:varchar(100)"`
	TableID          uint      `gorm:"not null"`
	Table            Table     `gorm:"foreignKey:TableID"`
	ReservationDate  time.Time `gorm:"not null"`
	TableFee         float64   `gorm:"not null"`
	Status           string    `gorm:"type:varchar(20);default:'pending'"` // pending, paid, cancelled
	CreatedAt        time.Time
	UpdatedAt        time.Time
}
