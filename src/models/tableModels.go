package models

import "time"

type Table struct {
	ID			uint	`gorm:"primaryKey"`
	TableNo		int		`gorm:"unique;not null"`
	Status		string	`gorm:"type:varchar(20); default:'available'"`
	//available, booked, in_use
	CreatedAt	time.Time
	UpdatedAt	time.Time
}