package services

import (
	"time"

	"github.com/ghrushneshr25/leetcode-tracker/backend/internal/dto"
	"github.com/ghrushneshr25/leetcode-tracker/backend/internal/loader"
	"github.com/ghrushneshr25/leetcode-tracker/backend/internal/repository"
	"github.com/ghrushneshr25/nexus"
)

type QuestionService interface {
	GetQuestions() ([]dto.QuestionResponse, error)

	UpdateProgress(
		questionID int,
		completed *bool,
		completedAt *time.Time,
		needsReattempt *bool,
	) error
}

type questionService struct {
	loader     loader.QuestionLoader
	repository repository.ProgressRepository
}

func NewQuestionService(
	loader loader.QuestionLoader,
	repository repository.ProgressRepository,
) QuestionService {
	return &questionService{
		loader:     loader,
		repository: repository,
	}
}

func (s *questionService) GetQuestions() ([]dto.QuestionResponse, error) {

	progressMap, err := s.repository.GetProgress()
	if err != nil {
		return nil, err
	}

	questions := s.loader.Questions()

	response := make([]dto.QuestionResponse, 0, len(questions))

	for _, question := range questions {

		tags := make([]dto.TopicTag, len(question.TopicTags))

		for i, tag := range question.TopicTags {
			tags[i] = dto.TopicTag{
				Name: tag.Name,
				Slug: tag.Slug,
			}
		}

		progress, exists := progressMap[question.ID]

		var completedAt *time.Time

		if exists {
			t := progress.CompletedAt
			completedAt = &t
		}

		response = append(response, dto.QuestionResponse{
			ID:                 question.ID,
			QuestionFrontendID: question.QuestionFrontendID,
			Title:              question.Title,
			TitleSlug:          question.TitleSlug,
			Difficulty:         question.Difficulty,

			Completed:      exists,
			CompletedAt:    completedAt,
			NeedsReattempt: exists && progress.NeedsReattempt,

			TopicTags:   tags,
			Description: question.Description,
		})
	}

	return response, nil
}

func (s *questionService) UpdateProgress(
	id int,
	completed *bool,
	completedAt *time.Time,
	needsReattempt *bool,
) error {

	if completed != nil && *completed {
		if completedAt == nil {
			now := time.Now().UTC()
			completedAt = &now
		}
	}

	return s.repository.UpdateProgress(
		id,
		completed,
		completedAt,
		needsReattempt,
	)
}

func QuestionServiceContract() nexus.Contract[QuestionService] {
	return nexus.ContractOf[QuestionService]()
}

func init() {
	nexus.MustDeclare(NewQuestionService)
}
