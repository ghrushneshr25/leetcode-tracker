package loader

import (
	"encoding/json"
	"os"

	"github.com/ghrushneshr25/nexus"
)

type Question struct {
	ID                 int        `json:"id"`
	QuestionFrontendID string     `json:"questionFrontendId"`
	Title              string     `json:"title"`
	TitleSlug          string     `json:"titleSlug"`
	Difficulty         string     `json:"difficulty"`
	Status             string     `json:"status"`
	Description        string     `json:"description"`
	TopicTags          []TopicTag `json:"topicTags"`
}

type TopicTag struct {
	Name string `json:"name"`
	Slug string `json:"slug"`
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
