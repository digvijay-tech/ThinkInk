package ollama

import (
	"encoding/json"
	"errors"
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
