package ollama

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
)

// Ollama Port
const url = "http://localhost:11434/"

// Response structure for /api/tags
type OllamaModelsReponse struct {
	Models []OllamaModel `json:"models"`
}

type OllamaModel struct {
	Name string `json:"name"`
}

// Ollama Request structure
type OllamaRequest struct {
	Model    string              `json:"model"`
	Messages []map[string]string `json:"messages"`
}

// Ollama Response structure
type OllamaResponse struct {
	Response string `json:"response"`
}

func IsOllamaRunning() bool {
	resp, err := http.Get(url)
	if err != nil {
		return false
	}

	defer resp.Body.Close()

	return resp.StatusCode == http.StatusOK
}

func GetOllamaModels() ([]string, error) {
	// making request to ollama api
	resp, err := http.Get(url + "api/tags")
	if err != nil {
		return nil, errors.New("failed to connect with `Ollama`. Ensure it's running with `ollama serve`")
	}

	defer resp.Body.Close()

	// reading body
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, errors.New("failed to read response from `ollama`")
	}

	// parsing response
	var modelResponse OllamaModelsReponse
	if err := json.Unmarshal(body, &modelResponse); err != nil {
		return nil, errors.New("failed to parse `ollama` response")
	}

	var modelnames []string
	for _, model := range modelResponse.Models {
		modelnames = append(modelnames, model.Name)
	}

	if len(modelnames) == 0 {
		return nil, errors.New("no models found in Ollama. Try `ollama pull <model>` to download one")
	}

	return modelnames, nil
}

func GenerateTask(model, skill, taskType string) (string, error) {
	// composing a task prompt
	taskPrompt := fmt.Sprintf(
		"Create a short writing exercise that helps user practice their %s "+
			"by writing a short %s. "+
			"Make sure the task is clear, engaging, and can be completed within 10 minutes.",
		skill,
		taskType,
	)

	// preparing api request payload
	requestBody := OllamaRequest{
		Model: model,
		Messages: []map[string]string{
			{
				"role":    "user",
				"content": taskPrompt,
			},
		},
	}

	jsonData, err := json.Marshal(requestBody)
	if err != nil {
		return "", errors.New("Failed to parse json")
	}

	// sending request to Ollama
	resp, err := http.Post(url+"api/chat", "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		return "", errors.New("Failed to connect to Ollama. Ensure it's running with `ollama serve`")
	}

	defer resp.Body.Close()

	// reading response
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", errors.New("Failed to read response from Ollama")
	}

	fmt.Println(string(body))

	var ollamaResp OllamaResponse
	if err := json.Unmarshal(body, &ollamaResp); err != nil {
		fmt.Println(err)
		return "", errors.New("Failed to parse Ollama response")
	}

	// making sure response is not empty
	if ollamaResp.Response == "" {
		return "", errors.New("Ollama returned an empty response")
	}

	return ollamaResp.Response, nil
}
