package main

import (
	"fmt"

	"github.com/digvijay-tech/ThinkInk/internal/ollama"
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

	task, err := ollama.GenerateTask(modelName, skillName, selectedTask)

	if err != nil {
		fmt.Println(err)
		fmt.Println("Failed to receive reponse from Ollama!")
		return
	}

	// task received
	ui.PrintHeader("\nPlease see the task below:\n\n")
	fmt.Println(task)
}
