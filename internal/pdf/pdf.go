package pdf

import (
	"fmt"
	"os"
	"path/filepath"

	"github.com/jung-kurt/gofpdf"
)

// creates a PDF report from the Ollama feedback and opens it
func GenerateReport(taskType, feedback string) (string, error) {
	// getting user's desktop path dynamically
	homeDir, err := os.UserHomeDir()
	if err != nil {
		return "", fmt.Errorf("Failed to get user home directory: %v", err)
	}

	desktopPath := filepath.Join(homeDir, "Desktop")
	fileName := fmt.Sprintf("ThinkInk_Feedback_%s.pdf", taskType)
	filePath := filepath.Join(desktopPath, fileName)

	// creating new pdf document
	pdf := gofpdf.New("P", "mm", "A4", "")
	pdf.SetMargins(15, 15, 15)
	pdf.SetFont("Arial", "", 12)
	pdf.AddPage()

	// title styles
	pdf.SetFont("Arial", "B", 16)
	pdf.Cell(40, 10, "ThinkInk - Writing Feedback")
	pdf.Ln(10)

	// selected task styles
	pdf.SetFont("Arial", "B", 14)
	pdf.Cell(40, 10, fmt.Sprintf("Task: %s", taskType))
	pdf.Ln(10)

	// feedback content styles
	pdf.SetFont("Arial", "", 12)
	pdf.MultiCell(0, 7, feedback, "", "L", false)

	// saving the pdf
	err = pdf.OutputFileAndClose(filePath)
	if err != nil {
		return "", fmt.Errorf("Failed to save PDF: %v", err)
	}

	return filePath, nil
}
