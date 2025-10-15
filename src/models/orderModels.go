package models

type OrderItem struct {
	ID				uint		`gorm:"primaryKey"`
	ReservationID	uint		`gorm:"not null"`
	ProductID		uint		`gorm:"not null"`
	Menu			Menu		`gorm:"foreignKey:ProductID"`
	Quantity		int			`gorm:"not null"`
	Subtotal		float64		`gorm:"not null"`
}