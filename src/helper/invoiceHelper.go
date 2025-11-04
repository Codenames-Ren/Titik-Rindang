package helper

import (
	"bytes"
	"fmt"
	"html/template"
	"os"
	"titik-rindang/src/models"

	"gopkg.in/gomail.v2"
)


func SendInvoiceEmail(to string, invoice *models.Invoice) error {
	tmpl, err := template.ParseFiles("src/templates/invoiceEmail.gohtml")
	if err != nil {
		return err
	}

	data := struct {
		Invoice *models.Invoice
	}{
		Invoice: invoice,
	}

	body := ""
	buf := &bytes.Buffer{}
	if err := tmpl.Execute(buf, data); err != nil {
		return err
	}
	body = buf.String()

	m := gomail.NewMessage()
	m.SetHeader("From", os.Getenv("SMTP_EMAIL"))
	m.SetHeader("To", to)
	m.SetHeader("Subject", fmt.Sprintf("Invoice #%s - Titik Rindang", invoice.InvoiceNumber))
	m.SetBody("text/html", body)

	d := gomail.NewDialer(
		os.Getenv("SMTP_HOST"),
		587,
		os.Getenv("SMTP_EMAIL"),
		os.Getenv("SMTP_PASSWORD"),
	)

	return d.DialAndSend(m)
}