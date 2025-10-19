package services

import (
	"errors"
	"time"

	"titik-rindang/src/models"

	"gorm.io/gorm"
)

type ReservationService struct {
	DB *gorm.DB
}

func NewReservationService(db *gorm.DB) *ReservationService {
	return &ReservationService{DB: db}
}

// Create Reservation
func (s *ReservationService) CreateReservation(reservation *models.Reservation) error {
	// Set default status
	reservation.Status = "pending"
	reservation.CreatedAt = time.Now()
	reservation.UpdatedAt = time.Now()

	// Pastikan meja masih available
	var table models.Table
	if err := s.DB.First(&table, reservation.TableID).Error; err != nil {
		return errors.New("table not found")
	}
	if table.Status != "available" {
		return errors.New("table is not available")
	}

	// Tandai meja jadi booked
	table.Status = "booked"
	if err := s.DB.Save(&table).Error; err != nil {
		return err
	}

	return s.DB.Create(reservation).Error
}

// Get All Reservations
func (s *ReservationService) GetAllReservations() ([]models.Reservation, error) {
	var reservations []models.Reservation
	err := s.DB.Preload("Table").Find(&reservations).Error
	return reservations, err
}

// Get Reservation by ID
func (s *ReservationService) GetReservationByID(id uint) (*models.Reservation, error) {
	var reservation models.Reservation
	err := s.DB.Preload("Table").First(&reservation, id).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("reservation not found")
		}
		return nil, err
	}
	return &reservation, nil
}

// Update Reservation
func (s *ReservationService) UpdateReservation(id uint, updatedData *models.Reservation) (*models.Reservation, error) {
	reservation, err := s.GetReservationByID(id)
	if err != nil {
		return nil, err
	}

	// Update status jika ada
	if updatedData.Status != "" {
		reservation.Status = updatedData.Status

		// Jika reservation completed/cancelled, meja harus available lagi
		if updatedData.Status == "completed" || updatedData.Status == "cancelled" {
			var table models.Table
			if err := s.DB.First(&table, reservation.TableID).Error; err == nil {
				table.Status = "available"
				s.DB.Save(&table)
			}
		}
	}

	// Update meja jika dipindah
	if updatedData.TableID != 0 && updatedData.TableID != reservation.TableID {
		var newTable models.Table
		if err := s.DB.First(&newTable, updatedData.TableID).Error; err != nil {
			return nil, errors.New("new table not found")
		}
		if newTable.Status != "available" {
			return nil, errors.New("new table is not available")
		}

		// Bebaskan meja lama
		var oldTable models.Table
		_ = s.DB.First(&oldTable, reservation.TableID)
		oldTable.Status = "available"
		s.DB.Save(&oldTable)

		// Pakai meja baru
		newTable.Status = "booked"
		s.DB.Save(&newTable)

		reservation.TableID = updatedData.TableID
	}

	reservation.UpdatedAt = time.Now()
	if err := s.DB.Save(reservation).Error; err != nil {
		return nil, err
	}
	return reservation, nil
}

// Delete Reservation
func (s *ReservationService) DeleteReservation(id uint) error {
	// Delete juga harus buka meja lagi
	reservation, err := s.GetReservationByID(id)
	if err != nil {
		return err
	}

	var table models.Table
	if err := s.DB.First(&table, reservation.TableID).Error; err == nil {
		table.Status = "available"
		s.DB.Save(&table)
	}

	result := s.DB.Delete(&models.Reservation{}, id)
	if result.RowsAffected == 0 {
		return errors.New("reservation not found")
	}
	return result.Error
}
