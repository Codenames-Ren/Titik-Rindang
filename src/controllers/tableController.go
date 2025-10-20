package controllers

import (
	"net/http"
	"strconv"
	"titik-rindang/src/database"
	"titik-rindang/src/models"
	"titik-rindang/src/services"

	"github.com/gin-gonic/gin"
)

// Create Table
func CreateTable(c *gin.Context) {
	var input struct {
		TableNo int    `json:"table_no" binding:"required"`
		Status  string `json:"status"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid input. Please check your request body.",
		})
		return
	}

	table := models.Table{
		TableNo: input.TableNo,
		Status:  input.Status,
	}

	svc := services.NewTableService(database.DB)
	if err := svc.CreateTable(&table); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Failed to create table.",
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Table created successfully.",
		"data":    table,
	})
}

// Get All Tables
func GetAllTables(c *gin.Context) {
	svc := services.NewTableService(database.DB)
	tables, err := svc.GetAllTables()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to retrieve tables.",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Tables fetched successfully.",
		"data":    tables,
	})
}

// Get Table by ID
func GetTableByID(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid table ID.",
		})
		return
	}

	svc := services.NewTableService(database.DB)
	table, err := svc.GetTableByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"message": "Table not found.",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Table found.",
		"data":    table,
	})
}

// Update Table
func UpdateTable(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid table ID.",
		})
		return
	}

	var input struct {
		TableNo int    `json:"table_no"`
		Status  string `json:"status"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid input. Please check your request body.",
		})
		return
	}

	table := &models.Table{
		TableNo: input.TableNo,
		Status:  input.Status,
	}

	svc := services.NewTableService(database.DB)
	updated, err := svc.UpdateTable(uint(id), table)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Failed to update table.",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Table updated successfully.",
		"data":    updated,
	})
}

// Delete Table
func DeleteTable(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid table ID.",
		})
		return
	}

	svc := services.NewTableService(database.DB)
	if err := svc.DeleteTable(uint(id)); err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"message": "Table not found or could not be deleted.",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Table deleted successfully.",
	})
}
