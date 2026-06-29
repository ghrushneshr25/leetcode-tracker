package dto

import "time"

type TopicTag struct {
	Name string `json:"name"`
	Slug string `json:"slug"`
}

type Example struct {
	Number      int      `json:"number"`
	Images      []string `json:"images,omitempty"`
	Input       string   `json:"input,omitempty"`
	Output      string   `json:"output,omitempty"`
	Explanation string   `json:"explanation,omitempty"`
	Notes       []string `json:"notes,omitempty"`
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

	TopicTags []TopicTag `json:"topicTags"`

	// Keep if you still want the original raw description.
	// Otherwise remove it.
	Description string `json:"description,omitempty"`

	ParsedDescription string    `json:"parsedDescription,omitempty"`
	CustomJudge       string    `json:"customJudge,omitempty"`
	Examples          []Example `json:"examples,omitempty"`
	Constraints       string    `json:"constraints,omitempty"`
	FollowUp          string    `json:"followUp,omitempty"`
}

type UpdateProgressRequest struct {
	Completed      *bool      `json:"completed,omitempty"`
	CompletedAt    *time.Time `json:"completedAt,omitempty"`
	NeedsReattempt *bool      `json:"needsReattempt,omitempty"`
}