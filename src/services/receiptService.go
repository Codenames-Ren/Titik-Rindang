package services

import (
	"fmt"
	"os"

	"titik-rindang/src/models"

	"github.com/signintech/gopdf"
)

type ReceiptService struct{}

func NewReceiptService() *ReceiptService {
	return &ReceiptService{}
}

func (s *ReceiptService) GenerateReceipt(order *models.Order) (string, error) {

	pdf := &gopdf.GoPdf{}
	pdf.Start(gopdf.Config{PageSize: *gopdf.PageSizeA4})
	pdf.AddPage()

	pageWidth := gopdf.PageSizeA4.W
	leftMargin := 50.0
	rightMargin := 50.0
	contentWidth := pageWidth - leftMargin - rightMargin

	fontPath := "src/fonts/Roboto-Regular.ttf"
	boldPath := "src/fonts/Roboto-Bold.ttf"
	_ = pdf.AddTTFFont("regular", fontPath)
	_ = pdf.AddTTFFont("bold", boldPath)

	pdf.SetMargins(leftMargin, 40, rightMargin, 0)

	pdf.SetFont("bold", "", 20)
	pdf.SetX(leftMargin)
	pdf.CellWithOption(
		&gopdf.Rect{W: contentWidth, H: 20},
		"☕ TITIK RINDANG CAFE",
		gopdf.CellOption{Align: gopdf.Center},
	)
	pdf.Br(24)

	pdf.SetFont("regular", "", 12)

	pdf.SetX(leftMargin)
	pdf.CellWithOption(
		&gopdf.Rect{W: contentWidth, H: 14},
		"Jl. Rindang Hijau No. 123",
		gopdf.CellOption{Align: gopdf.Center},
	)
	pdf.Br(14)

	pdf.SetX(leftMargin)
	pdf.CellWithOption(
		&gopdf.Rect{W: contentWidth, H: 14},
		"Puncak Pass, Kab. Bogor, Jawa Barat",
		gopdf.CellOption{Align: gopdf.Center},
	)
	pdf.Br(24)

	drawLine(pdf, leftMargin, pageWidth-rightMargin)
	pdf.Br(16)

	pdf.SetFont("regular", "", 12)

	drawKeyValue(pdf, leftMargin, "Order ID", fmt.Sprintf("%d", order.ID))
	drawKeyValue(pdf, leftMargin, "Tanggal", order.CreatedAt.Format("02 Jan 2006 15:04"))

	tableNumber := "-"
	if order.Table.TableNo != 0 {
		tableNumber = fmt.Sprintf("%d", order.Table.TableNo)
	}
	drawKeyValue(pdf, leftMargin, "Meja", tableNumber)

	drawKeyValue(pdf, leftMargin, "Customer", order.Customer)
	pdf.Br(10)

	pdf.SetFont("bold", "", 12)

	colWidths := []float64{200, 80, 100, 100}
	tableStartX := leftMargin
	tableStartY := pdf.GetY()

	drawTableHeader(pdf, tableStartX, tableStartY, colWidths)

	pdf.SetFont("regular", "", 12)

	y := tableStartY + 20
	rowHeight := 20.0

	for _, item := range order.OrderItems {
		drawTableRow(pdf, tableStartX, y, colWidths, rowHeight, []string{
			truncate(item.Menu.Name, 25),
			fmt.Sprintf("%d", item.Quantity),
			fmt.Sprintf("Rp %.0f", item.Menu.Price),
			fmt.Sprintf("Rp %.0f", item.Subtotal),
		})
		y += rowHeight
	}

	drawLineAt(pdf, leftMargin, pageWidth-rightMargin, y)
	y += 12

	pdf.SetY(y + 10)
	pdf.SetFont("bold", "", 14)

	pdf.SetX(leftMargin + colWidths[0] + colWidths[1] + 30)
	pdf.Cell(nil, "TOTAL :")

	pdf.SetX(leftMargin + colWidths[0] + colWidths[1] + colWidths[2])
	pdf.Cell(nil, fmt.Sprintf("Rp %.0f", order.Total))
	pdf.Br(24)

	drawLine(pdf, leftMargin, pageWidth-rightMargin)
	pdf.Br(20)

	pdf.SetFont("regular", "", 12)
	pdf.SetX(leftMargin)
	pdf.CellWithOption(
		&gopdf.Rect{W: contentWidth, H: 20},
		"✨ Terima kasih telah berkunjung ✨",
		gopdf.CellOption{Align: gopdf.Center},
	)

	folder := "src/uploads/receipts"
	_ = os.MkdirAll(folder, os.ModePerm)
	filename := fmt.Sprintf("%s/receipt_%d.pdf", folder, order.ID)

	if err := pdf.WritePdf(filename); err != nil {
		return "", err
	}

	return fmt.Sprintf("uploads/receipts/receipt_%d.pdf", order.ID), nil
}

func drawLine(pdf *gopdf.GoPdf, x1, x2 float64) {
	y := pdf.GetY()
	pdf.SetLineWidth(0.3)
	pdf.Line(x1, y, x2, y)
}

func drawLineAt(pdf *gopdf.GoPdf, x1, x2, y float64) {
	pdf.SetLineWidth(0.3)
	pdf.Line(x1, y, x2, y)
}

func drawTableHeader(pdf *gopdf.GoPdf, startX, startY float64, widths []float64) {
	headers := []string{"Item", "Qty", "Harga", "Subtotal"}
	rowHeight := 20.0

	x := startX
	pdf.SetY(startY)
	for i, h := range headers {
		pdf.RectFromUpperLeftWithStyle(x, startY, widths[i], rowHeight, "D")
		pdf.SetX(x + 5)
		pdf.SetY(startY + 5)
		pdf.Cell(nil, h)
		x += widths[i]
	}
}

func drawTableRow(pdf *gopdf.GoPdf, startX, y float64, widths []float64, height float64, values []string) {
	x := startX
	for i, v := range values {
		pdf.RectFromUpperLeftWithStyle(x, y, widths[i], height, "D")
		pdf.SetX(x + 5)
		pdf.SetY(y + 5)
		pdf.Cell(nil, v)
		x += widths[i]
	}
}

func drawKeyValue(pdf *gopdf.GoPdf, x float64, key string, value string) {
	labelWidth := 70.0      // kolom label
	separatorWidth := 10.0  // kolom titik dua
	valueWidth := 200.0     // kolom value

	pdf.SetX(x)
	pdf.Cell(&gopdf.Rect{W: labelWidth, H: 14}, key)

	pdf.SetX(x + labelWidth)
	pdf.Cell(&gopdf.Rect{W: separatorWidth, H: 14}, ":")

	pdf.SetX(x + labelWidth + separatorWidth + 5)
	pdf.Cell(&gopdf.Rect{W: valueWidth, H: 14}, value)

	pdf.Br(14)
}

func truncate(s string, max int) string {
	if len(s) > max-3 {
		return s[:max-3] + "..."
	}
	return s
}
