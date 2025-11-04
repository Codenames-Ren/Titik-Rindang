package helper

import (
	"os"
	"strconv"
)

func GetReservationFee() float64 {
	feeStr := os.Getenv("RESERVATION_FEE")
	fee, err := strconv.ParseFloat(feeStr, 64)
	if err != nil {
		return 0 //fallback if not setted
	}

	return  fee
}