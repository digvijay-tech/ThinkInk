package main

import (
	"fmt"
	"strings"

	"github.com/digvijay-tech/ThinkInk/internal/ollama"
	"github.com/digvijay-tech/ThinkInk/internal/pdf"
	"github.com/digvijay-tech/ThinkInk/internal/ui"
)

func main() {
	if !ollama.IsOllamaRunning() {
		fmt.Println("`Ollama` is not running. Please make sure `Ollama` is installed and running!")
		return
	}

	// welcome message and model selection
	ui.PrintHeader("\n🚀 Welcome to ThinkInk\n")
	modelName, err := ui.SelectModel()

	if err != nil {
		fmt.Println(err.Error())
		return
	}

	// skill selection (Professional Writing, Critical Thinking, etc)
	selections := "\nSelected Model: " + modelName + "\n"
	ui.PrintHeader(selections)
	skillName, err := ui.SelectSkill()

	if err != nil {
		fmt.Println(err.Error())
		return
	}

	// task selection
	selections = "\nSelected Model: " + modelName + "\n" + "Selected Skill: " + skillName + "\n"
	ui.PrintHeader(selections)
	selectedTask, err := ui.SelectTask(skillName)

	if err != nil {
		fmt.Println(err.Error())
		return
	}

	// generate writing task
	selections = "\nSelected Model: " + modelName + "\n" + "Selected Skill: " + skillName + "\n" + "Selected Task : " + selectedTask + "\n"
	ui.PrintHeader(selections)

	task, err := ui.ShowLoader(
		"Generating writing exercise",
		func() (string, error) {
			return ollama.GenerateTask(modelName, skillName, selectedTask)
		},
	)

	if err != nil {
		fmt.Println(err)
		fmt.Println("Failed to receive reponse from Ollama!")
		return
	}

	// task received
	selections = "\nSelected Model: " + modelName + "\n" + "Selected Skill: " + skillName + "\n" + "Selected Task : " + selectedTask + "\n" + "\nPlease see the task below:\n"
	ui.PrintHeader(selections)
	fmt.Println(task)

	// waiting untill user reads the task
	fmt.Println("\nRead the task above carefully. When you're ready, press [Enter] to start writing or type 'exit' to quit:")
	var confirmation string
	fmt.Scanln(&confirmation)

	if strings.ToLower(strings.TrimSpace(confirmation)) == "exit" {
		fmt.Println("Goodbye!")
		return
	}

	// get answer from user
	userResponse := ui.GetUserInput("Write Your Response:")

	if strings.TrimSpace(userResponse) == "" {
		fmt.Println("Response is empty\nGood bye!")
		return
	}

	// generate feedback
	ui.PrintHeader("") // no selections display required
	feedback, err := ui.ShowLoader(
		"Generating feedback",
		func() (string, error) {
			return ollama.EvaluateResponse(modelName, task, userResponse)
		},
	)

	if err != nil {
		fmt.Println(err)
		fmt.Println("Failed to receive reponse from Ollama!")
		return
	}

	// generating feedback report
	ui.PrintHeader("")
	result, err := pdf.GenerateReport(selectedTask, feedback)
	if err != nil {
		fmt.Println(err)
		return
	}

	successMsg := fmt.Sprintf("Feedback report is saved at:\n%s", result)
	ui.PrintHeader(successMsg)
}
