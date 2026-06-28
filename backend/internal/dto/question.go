package dto

import "time"

type TopicTag struct {
	Name string `json:"name"`
	Slug string `json:"slug"`
}

type QuestionResponse struct {
	ID                 int    `json:"id"`
	QuestionFrontendID string `json:"questionFrontendId"`
	Title              string `json:"title"`
	TitleSlug          string `json:"titleSlug"`
	Difficulty         string `json:"difficulty"`

	Completed   bool       `json:"completed"`
	CompletedAt *time.Time `json:"completedAt,omitempty"`

	NeedsReattempt bool `json:"needsReattempt"`

	TopicTags   []TopicTag `json:"topicTags"`
	Description string     `json:"description"`
}

type UpdateProgressRequest struct {
	Completed      *bool      `json:"completed,omitempty"`
	CompletedAt    *time.Time `json:"completedAt,omitempty"`
	NeedsReattempt *bool      `json:"needsReattempt,omitempty"`
}
