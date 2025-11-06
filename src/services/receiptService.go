package services

import (
	"fmt"
	"os"
	"time"

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

    // Gunakan konstanta ukuran A4 dari paket gopdf
    pageWidth := gopdf.PageSizeA4.W

    fontPath := "src/fonts/Roboto-Regular.ttf"
    boldPath := "src/fonts/Roboto-Bold.ttf"

    if err := pdf.AddTTFFont("regular", fontPath); err != nil {
        return "", err
    }
    if err := pdf.AddTTFFont("bold", boldPath); err != nil {
        return "", err
    }

    // HEADER
    pdf.SetFont("bold", "", 18)
    pdf.CellWithOption(&gopdf.Rect{W: pageWidth, H: 22}, "TITIK RINDANG CAFE", gopdf.CellOption{Align: gopdf.Center})
    pdf.Br(26)

    pdf.SetFont("regular", "", 12)
    pdf.CellWithOption(&gopdf.Rect{W: pageWidth, H: 18}, "Jl. Bintang No. 17, Tangerang Selatan", gopdf.CellOption{Align: gopdf.Center})
    pdf.Br(18)

    pdf.CellWithOption(&gopdf.Rect{W: pageWidth, H: 12}, "-------------------------------------------------------------", gopdf.CellOption{Align: gopdf.Center})
    pdf.Br(20)

    // ORDER INFO
    pdf.SetFont("regular", "", 12)
    pdf.Cell(nil, fmt.Sprintf("Order ID : %d", order.ID))
    pdf.Br(14)
    pdf.Cell(nil, fmt.Sprintf("Tanggal  : %s", time.Now().Format("02 Jan 2006 15:04")))
    pdf.Br(14)
    pdf.Cell(nil, fmt.Sprintf("Meja     : %d", order.TableID))
    pdf.Br(14)
    pdf.Cell(nil, fmt.Sprintf("Customer : %s", order.Customer))
    pdf.Br(20)

    // TABLE HEADER
    pdf.Cell(nil, "Item                     Qty     Harga      Subtotal")
    pdf.Br(12)
    pdf.Cell(nil, "-------------------------------------------------------------")
    pdf.Br(14)

    // ITEMS
    pdf.SetFont("regular", "", 12)
    for _, item := range order.OrderItems {
        pdf.Cell(nil, fmt.Sprintf("%-24s %-5d %-10.0f %-10.0f",
            item.Menu.Name, item.Quantity, item.Menu.Price, item.Subtotal))
        pdf.Br(12)
    }

    // TOTAL
    pdf.Br(10)
    pdf.Cell(nil, "-------------------------------------------------------------")
    pdf.Br(16)

    pdf.SetFont("bold", "", 14)
    pdf.Cell(nil, fmt.Sprintf("TOTAL: Rp %.0f", order.Total))
    pdf.Br(30)

    // FOOTER
    pdf.SetFont("regular", "", 12)
    pdf.CellWithOption(&gopdf.Rect{W: pageWidth, H: 20}, "Terima kasih telah berkunjung ✨", gopdf.CellOption{Align: gopdf.Center})

    // SAVE
    folder := "src/uploads/receipts"
    _ = os.MkdirAll(folder, os.ModePerm)

    filename := fmt.Sprintf("%s/receipt_%d.pdf", folder, order.ID)
    if err := pdf.WritePdf(filename); err != nil {
        return "", err
    }
    return filename, nil
}