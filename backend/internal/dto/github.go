package dto

type PushGithubRequest struct {
	Language string `json:"language" binding:"required"`
	Name     string `json:"name" binding:"required"`
	Code     string `json:"code" binding:"required"`
}

type PushGithubResponse struct {
	Path string `json:"path"`
	SHA  string `json:"sha"`
	URL  string `json:"url"`
}
