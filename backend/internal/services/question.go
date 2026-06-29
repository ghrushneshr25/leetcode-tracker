package services

import (
	"strings"
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

	GetQuestionNotes(id int) (*dto.QuestionNotesResponse, error)

	UpdateQuestionNotes(
		id int,
		request dto.UpdateQuestionNotesRequest,
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

		// Topic Tags
		tags := make([]dto.TopicTag, len(question.TopicTags))
		for i, tag := range question.TopicTags {
			tags[i] = dto.TopicTag{
				Name: tag.Name,
				Slug: tag.Slug,
			}
		}

		examples := make([]dto.Example, len(question.Examples))
		for i, ex := range question.Examples {
			examples[i] = dto.Example{
				Number:      ex.Number,
				Images:      ex.Images,
				Input:       normalizeNewlines(ex.Input),
				Output:      normalizeNewlines(ex.Output),
				Explanation: normalizeNewlines(ex.Explanation),
				Notes:       ex.Notes,
			}
		}

		progress := progressMap[question.ID]

		response = append(response, dto.QuestionResponse{
			ID:                 question.ID,
			QuestionFrontendID: question.QuestionFrontendID,
			Title:              question.Title,
			TitleSlug:          question.TitleSlug,
			Difficulty:         question.Difficulty,

			Completed:      progress.Completed,
			CompletedAt:    progress.CompletedAt,
			NeedsReattempt: progress.NeedsReattempt,

			TopicTags:         tags,
			ParsedDescription: normalizeNewlines(question.ParsedDescription),
			CustomJudge:       normalizeNewlines(question.CustomJudge),
			Examples:          examples,
			Constraints:       normalizeNewlines(question.Constraints),
			FollowUp:          normalizeNewlines(question.FollowUp),
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

	if completed != nil && *completed && completedAt == nil {
		now := time.Now().UTC()
		completedAt = &now
	}

	return s.repository.UpdateProgress(
		id,
		completed,
		completedAt,
		needsReattempt,
	)
}

func (s *questionService) GetQuestionNotes(
	id int,
) (*dto.QuestionNotesResponse, error) {

	progress, err := s.repository.GetQuestionNotes(id)
	if err != nil {
		return nil, err
	}

	return &dto.QuestionNotesResponse{
		Algorithm:       progress.Algorithm,
		TimeComplexity:  progress.TimeComplexity,
		SpaceComplexity: progress.SpaceComplexity,
		Notes:           progress.Notes,
	}, nil
}

func (s *questionService) UpdateQuestionNotes(
	id int,
	request dto.UpdateQuestionNotesRequest,
) error {

	return s.repository.UpdateQuestionNotes(id, request)
}

func QuestionServiceContract() nexus.Contract[QuestionService] {
	return nexus.ContractOf[QuestionService]()
}

func init() {
	nexus.MustDeclare(NewQuestionService)
}

func normalizeNewlines(s string) string {
	for strings.Contains(s, "\n\n") {
		s = strings.ReplaceAll(s, "\n\n", "\n")
	}
	return s
}
