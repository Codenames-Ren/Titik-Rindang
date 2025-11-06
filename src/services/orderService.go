package services

import (
	"errors"
	"time"

	"titik-rindang/src/models"

	"gorm.io/gorm"
)

type OrderService struct {
	DB *gorm.DB
}

func NewOrderService(db *gorm.DB) *OrderService {
	return &OrderService{DB: db}
}

type OrderItemInput struct {
	MenuID uint
	Qty    int
}

// 🔹 Create Order 
func (s *OrderService) CreateOrder(tableID uint, customer string, items []OrderItemInput) (*models.Order, error) {
	var table models.Table
	if err := s.DB.First(&table, tableID).Error; err != nil {
		return nil, errors.New("table not found")
	}

	var upcoming models.Reservation
	err := s.DB.Where("table_id = ? AND reservation_date > ?", tableID, time.Now()).
		Order("reservation_date ASC").
		First(&upcoming).Error

	if err == nil {
		cutoff := upcoming.ReservationDate.Add(-30 * time.Minute)
		if time.Now().After(cutoff) {
			return nil, errors.New("meja akan dipakai reservasi pukul " +
				upcoming.ReservationDate.Format("15:04") +
				", tidak bisa dine-in sekarang")
		}
	}

	order := models.Order{
		TableID:   tableID,
		Customer:  customer,
		Status:    "unpaid",
		CreatedAt: time.Now(),
	}

	if err := s.DB.Create(&order).Error; err != nil {
		return nil, err
	}

	total := float64(0)
	var orderItems []models.OrderItem

	for _, item := range items {
		var menu models.Menu
		if err := s.DB.First(&menu, item.MenuID).Error; err != nil {
			return nil, errors.New("menu not found")
		}

		subtotal := float64(item.Qty) * menu.Price
		total += subtotal

		orderItems = append(orderItems, models.OrderItem{
			OrderID:  order.ID,
			MenuID:   item.MenuID,
			Quantity: item.Qty,
			Subtotal: subtotal,
		})
	}

	if err := s.DB.Create(&orderItems).Error; err != nil {
		return nil, err
	}

	order.Total = total
	order.UpdatedAt = time.Now()
	s.DB.Save(&order)

	s.DB.Model(&models.Table{}).Where("id = ?", tableID).Update("status", "in_use")

	var fullOrder models.Order
	s.DB.Preload("OrderItems.Menu").Preload("Table").First(&fullOrder, order.ID)

	return &fullOrder, nil
}

// 🔹 Confirm Order
func (s *OrderService) ConfirmOrder(id uint, paymentMethod string) (*models.Order, error) {
	var order models.Order
	if err := s.DB.First(&order, id).Error; err != nil {
		return nil, errors.New("order not found")
	}

	order.Status = "paid"
	order.PaymentMethod = paymentMethod
	order.UpdatedAt = time.Now()

	if err := s.DB.Save(&order).Error; err != nil {
		return nil, err
	}

	var fullOrder models.Order
	s.DB.Preload("OrderItems.Menu").Preload("Table").First(&fullOrder, order.ID)

	return &fullOrder, nil
}
