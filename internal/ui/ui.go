package ui

import (
	"errors"
	"fmt"
	"time"

	"github.com/common-nighthawk/go-figure"
	"github.com/digvijay-tech/ThinkInk/internal/ollama"
	"github.com/digvijay-tech/ThinkInk/utils"
	"github.com/manifoldco/promptui"
)

func PrintHeader(headline string) {
	// clear terminal
	utils.ClearTerminal()

	// displaying ascii art
	asciiArt := figure.NewFigure("Think-Ink", "banner3-D", true)
	asciiArt.Print()

	fmt.Println(headline)
}

func SelectModel() (string, error) {
	models, err := ollama.GetOllamaModels()
	if err != nil {
		return "", errors.New("Failed to fetch available models!")
	}

	if len(models) == 0 {
		return "", errors.New("No models found. Try `ollama pull <model>` to download one")
	}

	prompt := promptui.Select{
		Label: "Select a Model:",
		Items: models,
	}

	// running model selection prompt
	_, selectedModel, err := prompt.Run()
	if err != nil {
		return "", errors.New("Model selection canceled!")
	}

	return selectedModel, nil
}

func SelectSkill() (string, error) {
	skills := []string{
		"Professional Writing",
		"Critical Thinking & Behavioral Writing",
		"Creative & Persuasive Writing",
		"Academic & Technical Writing",
	}

	prompt := promptui.Select{
		Label: "What would you like to practice today?",
		Items: skills,
	}

	// running task selection prompt
	_, selectedSkill, err := prompt.Run()
	if err != nil {
		return "", errors.New("Skill selection canceled!")
	}

	return selectedSkill, nil
}

func SelectTask(selectedSkill string) (string, error) {
	tasksMap := map[string][]string{
		"Professional Writing": {
			"Short Memo",
			"Performance Review Feedback",
			"Meeting Summary",
			"Project Proposal",
			"Resignation Letter",
			"Cover Letter",
			"Customer Support Response",
			"Apology Letter",
			"Company Announcement",
			"Fundraising Request",
		},
		"Critical Thinking & Behavioral Writing": {
			"Ethical Dilemma Response",
			"Crisis Management Statement",
			"Negotiation Email",
			"Diversity & Inclusion Statement",
			"Conflict Resolution Response",
			"Decision Justification",
			"Team Motivation Message",
			"Public Apology Statement",
		},
		"Creative & Persuasive Writing": {
			"Product Review",
			"Persuasive Argumen",
			"Storytelling Exercise",
			"Speech Drafting",
		},
		"Academic & Technical Writing": {
			"Technical Documentation",
			"Case Study Report",
			"Lesson Plan",
			"Policy Drafting",
		},
	}

	prompt := promptui.Select{
		Label: "Select a task from below:",
		Items: tasksMap[selectedSkill],
	}

	// running task selection prompt
	_, selectedTask, err := prompt.Run()
	if err != nil {
		return "", errors.New("Task selection canceled!")
	}

	return selectedTask, nil
}

func ShowLoader(taskDescription string, operation func() (string, error)) (string, error) {
	// spinner characters to create animation
	spinner := []string{"⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"}

	// channel to signal when operation is complete
	done := make(chan bool)
	var result string
	var err error

	// run the operation in a goroutine
	go func() {
		result, err = operation()
		done <- true
	}()

	// spinner loop
	i := 0
	ticker := time.NewTicker(100 * time.Millisecond)
	defer ticker.Stop()

	for {
		select {
		case <-done:
			// clear the line and show completion
			fmt.Print("\r\033[K") // clear line

			if err != nil {
				fmt.Printf("%s Failed!\n", taskDescription)
				return "", err
			}

			fmt.Printf("%s Done!\n", taskDescription)
			return result, nil
		case <-ticker.C:
			// updating spinner
			fmt.Print("\r\033[K") // clear line

			cursorText := fmt.Sprintf("%s %s", spinner[i%len(spinner)], taskDescription)
			fmt.Print(cursorText)
			i++
		}
	}
}
