package main

import (
	"fmt"

	"github.com/digvijay-tech/ThinkInk/internal/ollama"
)

func main() {
	if !ollama.IsOllamaRunning() {
		fmt.Println("`Ollama` is not running. Please make sure `Ollama` is installed and running!")
		return
	}

	models, err := ollama.GetOllamaModels()
	if err != nil {
		fmt.Println(err)
		return
	}

	fmt.Println("Available Models:")
	for i, model := range models {
		fmt.Printf("[%d] - %s\n", i+1, model)
	}
}
