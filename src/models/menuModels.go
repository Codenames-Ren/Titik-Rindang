package models

import "time"

type Menu struct {
	ID			uint		`gorm:"primarykey"`
	Name		string		`gorm:"type:varchar(100);not null"`
	Tagline		string		`gorm:"type:varchar(150)"`
	ImageURL	string		`gorm:"type:text"`
	Price		float64		`gorm:"not null"`
	CreatedAt	time.Time
	UpdatedAt	time.Time
}