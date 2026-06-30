package dto

type GithubSolution struct {
	Name string `json:"name"`
	Code string `json:"code"`
}

type GithubSolutionsResponse struct {
	Solutions map[string][]GithubSolution `json:"solutions"`
}
