package models

import (
	"time"

	"gorm.io/gorm"
)

type Auth struct {
	ID			uint			`gorm:"primaryKey"`
	Username	string			`gorm:"unique; not null"`
	Password	string			`gorm:"not null"`
	Role		string			`gorm:"type:enum('admin','staff');default:'admin'"`
	CreatedAt	time.Time
	UpdatedAt	time.Time
	DeletedAt	gorm.DeletedAt	`gorm:"index"`
}