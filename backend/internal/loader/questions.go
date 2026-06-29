package loader

import (
	"encoding/json"
	"os"

	"github.com/ghrushneshr25/nexus"
)

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

type Question struct {
	ID                 int    `json:"id"`
	QuestionFrontendID string `json:"questionFrontendId"`
	Title              string `json:"title"`
	TitleSlug          string `json:"titleSlug"`
	Difficulty         string `json:"difficulty"`
	Status             string `json:"status"`

	// Keep this only if your JSON still contains the raw description.
	Description string `json:"description,omitempty"`

	ParsedDescription string    `json:"parsedDescription,omitempty"`
	CustomJudge       string    `json:"customJudge,omitempty"`
	Examples          []Example `json:"examples,omitempty"`
	Constraints       string    `json:"constraints,omitempty"`
	FollowUp          string    `json:"followUp,omitempty"`

	TopicTags []TopicTag `json:"topicTags"`
}

type QuestionLoader interface {
	Questions() []Question
}

type questionLoader struct {
	questions []Question
}

func (l *questionLoader) Questions() []Question {
	return l.questions
}

func NewQuestionLoader() (QuestionLoader, error) {
	file, err := os.Open("data/questions.json")
	if err != nil {
		return nil, err
	}
	defer file.Close()

	var questions []Question

	if err := json.NewDecoder(file).Decode(&questions); err != nil {
		return nil, err
	}

	return &questionLoader{
		questions: questions,
	}, nil
}

func QuestionLoaderContract() nexus.Contract[QuestionLoader] {
	return nexus.ContractOf[QuestionLoader]()
}

func init() {
	nexus.MustDeclare(NewQuestionLoader)
}