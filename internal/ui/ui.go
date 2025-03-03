package ui

import (
	"errors"
	"fmt"

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
	skills := []string{"Professional Writing", "Critical Thinking & Behavioral Writing", "Creative & Persuasive Writing", "Academic & Technical Writing"}

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
