package models

import "time"

type Order struct {
	ID        		uint       `gorm:"primaryKey"`
	TableID   		uint       `gorm:"not null"`                      // dine-in per meja
	Table     		Table      `gorm:"foreignKey:TableID"`
	Customer  		string	   `gorm:"type:varchar(100)"`
	Total     		float64    `gorm:"not null"`
	Status    		string     `gorm:"type:varchar(20);default:'unpaid'"` // unpaid, paid
	PaymentMethod	string	   `gorm:"type:varchar(50)"`	
	CreatedAt 		time.Time
	UpdatedAt 		time.Time
	OrderItems 		[]OrderItem `gorm:"foreignKey:OrderID"`
}

type OrderItem struct {
	ID        uint    `gorm:"primaryKey"`
	OrderID   uint    `gorm:"not null"`
	MenuID    uint    `gorm:"not null"`
	Menu      Menu    `gorm:"foreignKey:MenuID"`
	Quantity  int     `gorm:"not null"`
	Subtotal  float64 `gorm:"not null"`
}
