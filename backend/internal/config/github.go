package config

import (
	"os"
)

type GithubConfig struct {
	Token      string
	Owner      string
	Repository string
	Branch     string
}

func NewGithubConfig() GithubConfig {
	cfg := GithubConfig{
		Token:      os.Getenv("GITHUB_TOKEN"),
		Owner:      os.Getenv("GITHUB_OWNER"),
		Repository: os.Getenv("GITHUB_REPOSITORY"),
		Branch:     os.Getenv("GITHUB_BRANCH"),
	}

	if cfg.Branch == "" {
		cfg.Branch = "main"
	}

	return cfg
}

func (c *GithubConfig) IsConfigured() bool {
	return c.Token != "" &&
		c.Owner != "" &&
		c.Repository != ""
}
