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
	Model  string `json:"model"`
	Prompt string `json:"prompt"`
	Stream bool   `json:"stream"`
}

// Ollama Response structure
type OllamaResponse struct {
	Response string `json:"response"`
	Done     bool   `json:"done"`
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
		"Generate a writing task specifically for practicing **%s**. "+
			"The task must focus on writing a **%s**. Do not deviate from this topic.\n\n"+
			"- The task should be **clear, engaging, and achievable within 10 minutes**.\n"+
			"- **Do not** include examples, samples, or ask the user about time limits.\n"+
			"- The scenario must directly relate to the **%s** task. Do not generate a different type of task.\n"+
			"- **Do not** include internal reasoning, explanations, or thought processes.\n"+
			"- **Do not** introduce or justify the task before presenting it.\n"+
			"- Only return the final structured response.\n\n"+
			"**Output format:**\n"+
			"1. **Task Title**: Start and end the title with `***` (e.g., ***Persuasive Email to a Client***)\n"+
			"2. **Brief Task Description**: A short paragraph explaining what the user needs to do.\n"+
			"3. **Bullet Points for Tips** (if necessary): Provide short, **practical** tips to help the user complete the task.\n",
		skill, taskType, taskType)

	// preparing api request payload
	requestBody := OllamaRequest{
		Model:  model,
		Prompt: taskPrompt,
		Stream: false,
	}

	jsonData, err := json.Marshal(requestBody)
	if err != nil {
		return "", errors.New("Failed to parse json")
	}

	// sending request to Ollama
	resp, err := http.Post(url+"api/generate", "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		return "", errors.New("Failed to connect to Ollama. Ensure it's running with `ollama serve`")
	}

	defer resp.Body.Close()

	// reading response
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", errors.New("Failed to read response from Ollama")
	}

	var ollamaResp OllamaResponse
	if err := json.Unmarshal(body, &ollamaResp); err != nil {
		return "", errors.New("Failed to parse Ollama response")
	}

	// making sure response is not empty
	if ollamaResp.Response == "" {
		return "", errors.New("Ollama returned an empty response")
	}

	return ollamaResp.Response, nil
}

func EvaluateResponse(model, taskDetails, answer string) (string, error) {
	// composing a evaluation prompt for feedback report
	evaluationPrompt := fmt.Sprintf(
		"You are an expert writing evaluator. The user completed a writing task, and your job is to provide feedback.\n\n"+
			"**Task Description:**\n%s\n\n"+
			"**User's Response:**\n%s\n\n"+
			"Provide a structured evaluation covering:\n"+
			"- Clarity and conciseness\n"+
			"- Grammar and spelling\n"+
			"- Overall effectiveness\n"+
			"- Suggestions for improvement\n\n"+
			"**Format your response as follows:**\n"+
			"1. **Overall Feedback** - A brief summary of how well the response meets the task.\n"+
			"2. **Strengths** - List what the user did well.\n"+
			"3. **Areas for Improvement** - Suggest ways to enhance the writing.\n"+
			"4. **Revised Version (Optional)** - Provide a short improved version if needed.",
		taskDetails, answer)

	// preparing api request payload
	requestBody := OllamaRequest{
		Model:  model,
		Prompt: evaluationPrompt,
		Stream: false,
	}

	jsonData, err := json.Marshal(requestBody)
	if err != nil {
		return "", err
	}

	// sending request to Ollama
	resp, err := http.Post(url+"api/generate", "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		return "", errors.New("Failed to connect to Ollama. Ensure it's running with `ollama serve`.")
	}

	defer resp.Body.Close()

	// reading response
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", errors.New("Failed to read response from Ollama!")
	}

	var ollamaResp OllamaResponse
	if err := json.Unmarshal(body, &ollamaResp); err != nil {
		return "", errors.New("Failed to parse Ollama response")
	}

	// making sure response is not empty
	if ollamaResp.Response == "" {
		return "", errors.New("Ollama returned an empty response")
	}

	return ollamaResp.Response, nil
}
