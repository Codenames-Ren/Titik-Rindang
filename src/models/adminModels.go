package models

import "time"

type Admin struct {
	ID			uint	`gorm:"primaryKey"`
	Username	string	`gorm:"unique; not null"`
	Password	string	`gorm:"not null"`
	Role		string	`gorm:"type:varchar(20);default:'admin'"`
	CreatedAt	time.Time
	UpdatedAt	time.Time
}