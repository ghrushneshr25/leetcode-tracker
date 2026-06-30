package repository

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"strings"

	"github.com/ghrushneshr25/leetcode-tracker/backend/internal/config"
	"github.com/ghrushneshr25/nexus"
)

type GithubRepository interface {
	PushSolution(
		path string,
		content []byte,
		commitMessage string,
	) (*PushSolutionResponse, error)

	ListSolutions(
		path string,
	) ([]GithubFile, error)

	GetSolution(
		path string,
	) (*GithubSolution, error)
}

type PushSolutionResponse struct {
	Path string
	SHA  string
	URL  string
}

type GithubSolution struct {
	Path string
	Code string
}

type GithubFile struct {
	Name    string `json:"name"`
	Path    string `json:"path"`
	Type    string `json:"type"`
	HTMLURL string `json:"html_url"`
	SHA     string `json:"sha"`
	URL     string `json:"url"`
}

type githubRepository struct {
	config config.GithubConfig
	client *http.Client
}

func NewGithubRepository() GithubRepository {
	return &githubRepository{
		config: config.NewGithubConfig(),
		client: &http.Client{},
	}
}

type githubGetResponse struct {
	Path    string `json:"path"`
	Content string `json:"content"`
}

type githubPutRequest struct {
	Message string `json:"message"`
	Content string `json:"content"`
	Branch  string `json:"branch"`
	SHA     string `json:"sha,omitempty"`
}

type githubPutResponse struct {
	Content GithubFile `json:"content"`
}

func (r *githubRepository) PushSolution(
	path string,
	content []byte,
	commitMessage string,
) (*PushSolutionResponse, error) {

	if !r.config.IsConfigured() {
		return nil, errors.New("github integration is not configured")
	}

	sha, err := r.getSHA(path)
	if err != nil {
		return nil, err
	}

	payload := githubPutRequest{
		Message: commitMessage,
		Content: base64.StdEncoding.EncodeToString(content),
		Branch:  r.config.Branch,
		SHA:     sha,
	}

	body, err := json.Marshal(payload)
	if err != nil {
		return nil, err
	}

	url := fmt.Sprintf(
		"https://api.github.com/repos/%s/%s/contents/%s",
		r.config.Owner,
		r.config.Repository,
		path,
	)

	req, err := http.NewRequest(
		http.MethodPut,
		url,
		bytes.NewReader(body),
	)
	if err != nil {
		return nil, err
	}

	req.Header.Set(
		"Authorization",
		"Bearer "+r.config.Token,
	)

	req.Header.Set(
		"Accept",
		"application/vnd.github+json",
	)

	req.Header.Set(
		"Content-Type",
		"application/json",
	)

	res, err := r.client.Do(req)
	if err != nil {
		return nil, err
	}

	defer res.Body.Close()

	if res.StatusCode >= 300 {
		body, _ := io.ReadAll(res.Body)

		return nil, fmt.Errorf(
			"github push failed: %s",
			string(body),
		)
	}

	var response githubPutResponse

	if err := json.NewDecoder(res.Body).Decode(&response); err != nil {
		return nil, err
	}

	return &PushSolutionResponse{
		Path: response.Content.Path,
		SHA:  response.Content.SHA,
		URL:  response.Content.HTMLURL,
	}, nil
}

func (r *githubRepository) ListSolutions(
	path string,
) ([]GithubFile, error) {

	if !r.config.IsConfigured() {
		return nil, errors.New("github integration is not configured")
	}

	url := fmt.Sprintf(
		"https://api.github.com/repos/%s/%s/contents/%s?ref=%s",
		r.config.Owner,
		r.config.Repository,
		path,
		r.config.Branch,
	)

	req, err := http.NewRequest(
		http.MethodGet,
		url,
		nil,
	)
	if err != nil {
		return nil, err
	}

	req.Header.Set(
		"Authorization",
		"Bearer "+r.config.Token,
	)

	req.Header.Set(
		"Accept",
		"application/vnd.github+json",
	)

	res, err := r.client.Do(req)
	if err != nil {
		return nil, err
	}

	defer res.Body.Close()

	if res.StatusCode == http.StatusNotFound {
		return []GithubFile{}, nil
	}

	if res.StatusCode >= 300 {
		body, _ := io.ReadAll(res.Body)

		return nil, fmt.Errorf(
			"github list failed: %s",
			string(body),
		)
	}

	var files []GithubFile

	if err := json.NewDecoder(res.Body).Decode(&files); err != nil {
		return nil, err
	}

	return files, nil
}

func (r *githubRepository) GetSolution(
	path string,
) (*GithubSolution, error) {

	if !r.config.IsConfigured() {
		return nil, errors.New("github integration is not configured")
	}

	url := fmt.Sprintf(
		"https://api.github.com/repos/%s/%s/contents/%s?ref=%s",
		r.config.Owner,
		r.config.Repository,
		path,
		r.config.Branch,
	)

	req, err := http.NewRequest(
		http.MethodGet,
		url,
		nil,
	)
	if err != nil {
		return nil, err
	}

	req.Header.Set(
		"Authorization",
		"Bearer "+r.config.Token,
	)

	req.Header.Set(
		"Accept",
		"application/vnd.github+json",
	)

	res, err := r.client.Do(req)
	if err != nil {
		return nil, err
	}

	defer res.Body.Close()

	if res.StatusCode == http.StatusNotFound {
		return nil, nil
	}

	if res.StatusCode >= 300 {
		body, _ := io.ReadAll(res.Body)

		return nil, fmt.Errorf(
			"github lookup failed: %s",
			string(body),
		)
	}

	var response githubGetResponse

	if err := json.NewDecoder(res.Body).Decode(&response); err != nil {
		return nil, err
	}

	content, err := base64.StdEncoding.DecodeString(
		strings.ReplaceAll(response.Content, "\n", ""),
	)
	if err != nil {
		return nil, err
	}

	return &GithubSolution{
		Path: response.Path,
		Code: string(content),
	}, nil
}

func (r *githubRepository) getSHA(
	path string,
) (string, error) {

	url := fmt.Sprintf(
		"https://api.github.com/repos/%s/%s/contents/%s?ref=%s",
		r.config.Owner,
		r.config.Repository,
		path,
		r.config.Branch,
	)

	req, err := http.NewRequest(
		http.MethodGet,
		url,
		nil,
	)
	if err != nil {
		return "", err
	}

	req.Header.Set(
		"Authorization",
		"Bearer "+r.config.Token,
	)

	req.Header.Set(
		"Accept",
		"application/vnd.github+json",
	)

	res, err := r.client.Do(req)
	if err != nil {
		return "", err
	}

	defer res.Body.Close()

	if res.StatusCode == http.StatusNotFound {
		return "", nil
	}

	if res.StatusCode >= 300 {
		body, _ := io.ReadAll(res.Body)

		return "", fmt.Errorf(
			"github lookup failed: %s",
			string(body),
		)
	}

	var file GithubFile

	if err := json.NewDecoder(res.Body).Decode(&file); err != nil {
		return "", err
	}

	return file.SHA, nil
}

func GithubRepositoryContract() nexus.Contract[GithubRepository] {
	return nexus.ContractOf[GithubRepository]()
}

func init() {
	nexus.MustDeclare(NewGithubRepository)
}
