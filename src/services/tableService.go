package services

import (
	"errors"
	"titik-rindang/src/models"

	"gorm.io/gorm"
)

type TableService struct {
	DB *gorm.DB
}

func NewTableService(db *gorm.DB) *TableService {
	return &TableService{DB: db}
}

// Create Table
func (s *TableService) CreateTable(table *models.Table) error {
	if table.TableNo <= 0 {
		return errors.New("table number must be greater than 0")
	}
	table.Status = "available"
	return s.DB.Create(table).Error
}

// Get All Tables
func (s *TableService) GetAllTables() ([]models.Table, error) {
	var tables []models.Table
	err := s.DB.Find(&tables).Error
	return tables, err
}

// Get Table by ID
func (s *TableService) GetTableByID(id uint) (*models.Table, error) {
	var table models.Table
	err := s.DB.First(&table, id).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, errors.New("table not found")
	}
	return &table, err
}

// Update Table
func (s *TableService) UpdateTable(id uint, updatedData *models.Table) (*models.Table, error) {
	table, err := s.GetTableByID(id)
	if err != nil {
		return nil, err
	}

	if updatedData.TableNo > 0 {
		table.TableNo = updatedData.TableNo
	}
	if updatedData.Status != "" {
		table.Status = updatedData.Status
	}

	err = s.DB.Save(table).Error
	return table, err
}

// Delete Table
func (s *TableService) DeleteTable(id uint) error {
	result := s.DB.Delete(&models.Table{}, id)
	if result.RowsAffected == 0 {
		return errors.New("table not found")
	}
	return result.Error
}
