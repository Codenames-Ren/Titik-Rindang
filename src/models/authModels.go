package models

import (
	"time"

	"gorm.io/gorm"
)

type Auth struct {
	ID				string			`gorm:"primaryKey"`
	Username		string			`gorm:"unique; not null"`
	Email			string			`gorm:"unique"`
	Password		string			`gorm:"not null"`
	Role			string			`gorm:"default:cashier"`
	Status			string
	ResetAllowed	bool			`gorm:"default:false"`
	CreatedAt		time.Time
	UpdatedAt		time.Time
	DeletedAt		gorm.DeletedAt	`gorm:"index"`
}