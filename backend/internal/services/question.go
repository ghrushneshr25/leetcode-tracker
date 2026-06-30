package services

import (
	"errors"
	"fmt"
	"path/filepath"
	"strings"
	"time"

	"github.com/ghrushneshr25/leetcode-tracker/backend/internal/dto"
	"github.com/ghrushneshr25/leetcode-tracker/backend/internal/loader"
	"github.com/ghrushneshr25/leetcode-tracker/backend/internal/repository"
	"github.com/ghrushneshr25/nexus"
	"github.com/gosimple/slug"
)

type QuestionService interface {
	GetQuestions() ([]dto.QuestionResponse, error)

	UpdateProgress(
		questionID int,
		completed *bool,
		completedAt *time.Time,
		needsReattempt *bool,
	) error

	GetQuestionNotes(
		id int,
	) (*dto.QuestionNotesResponse, error)

	UpdateQuestionNotes(
		id int,
		request dto.UpdateQuestionNotesRequest,
	) error

	PushSolutionToGithub(
		questionID int,
		request dto.PushGithubRequest,
	) (*dto.PushGithubResponse, error)

	GetSolutionsFromGithub(
		questionID int,
	) (*dto.GithubSolutionsResponse, error)
}

type questionService struct {
	loader           loader.QuestionLoader
	repository       repository.ProgressRepository
	githubRepository repository.GithubRepository
}

func NewQuestionService(
	loader loader.QuestionLoader,
	repository repository.ProgressRepository,
	githubRepository repository.GithubRepository,
) QuestionService {
	return &questionService{
		loader:           loader,
		repository:       repository,
		githubRepository: githubRepository,
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
			Completed:          progress.Completed,
			CompletedAt:        progress.CompletedAt,
			NeedsReattempt:     progress.NeedsReattempt,
			TopicTags:          tags,
			ParsedDescription:  normalizeNewlines(question.ParsedDescription),
			CustomJudge:        normalizeNewlines(question.CustomJudge),
			Examples:           examples,
			Constraints:        normalizeNewlines(question.Constraints),
			FollowUp:           normalizeNewlines(question.FollowUp),
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

	return s.repository.UpdateQuestionNotes(
		id,
		request,
	)
}
func (s *questionService) PushSolutionToGithub(
	questionID int,
	request dto.PushGithubRequest,
) (*dto.PushGithubResponse, error) {

	question := s.loader.GetQuestionById(questionID)
	if question == nil {
		return nil, errors.New("question not found")
	}

	path := fmt.Sprintf(
		"%s/%s%s",
		question.TitleSlug,
		slug.Make(request.Name),
		extension(request.Language),
	)

	commit := githubCommitMessage(
		question.Title,
		request.Name,
		request.Language,
	)

	response, err := s.githubRepository.PushSolution(
		path,
		[]byte(request.Code),
		commit,
	)
	if err != nil {
		return nil, err
	}

	return &dto.PushGithubResponse{
		Path: response.Path,
		SHA:  response.SHA,
		URL:  response.URL,
	}, nil
}

func (s *questionService) GetSolutionsFromGithub(
	questionID int,
) (*dto.GithubSolutionsResponse, error) {

	question := s.loader.GetQuestionById(questionID)
	if question == nil {
		return nil, errors.New("question not found")
	}

	files, err := s.githubRepository.ListSolutions(
		question.TitleSlug,
	)
	if err != nil {
		return nil, err
	}

	response := &dto.GithubSolutionsResponse{
		Solutions: make(map[string][]dto.GithubSolution),
	}

	for _, file := range files {

		if file.Type != "file" {
			continue
		}

		language := languageFromExtension(file.Name)
		if language == "" {
			continue
		}

		solution, err := s.githubRepository.GetSolution(file.Path)
		if err != nil {
			return nil, err
		}

		if solution == nil {
			continue
		}

		response.Solutions[language] = append(
			response.Solutions[language],
			dto.GithubSolution{
				Name: displaySolutionName(file.Name),
				Code: solution.Code,
			},
		)
	}

	return response, nil
}

func normalizeNewlines(s string) string {
	for strings.Contains(s, "\n\n") {
		s = strings.ReplaceAll(s, "\n\n", "\n")
	}
	return s
}

func githubCommitMessage(
	questionTitle string,
	solutionName string,
	language string,
) string {

	return fmt.Sprintf(
		"Add %s solution for %s (%s)",
		solutionName,
		questionTitle,
		displayLanguage(language),
	)
}

func displayLanguage(language string) string {
	switch strings.ToLower(language) {
	case "go":
		return "Go"

	case "java":
		return "Java"

	case "cpp":
		return "C++"

	case "python":
		return "Python"

	case "javascript":
		return "JavaScript"

	case "typescript":
		return "TypeScript"

	default:
		return language
	}
}

func extension(language string) string {
	switch strings.ToLower(language) {
	case "go":
		return ".go"

	case "java":
		return ".java"

	case "cpp":
		return ".cpp"

	case "python":
		return ".py"

	case "javascript":
		return ".js"

	case "typescript":
		return ".ts"

	default:
		return ".txt"
	}
}

func languageFromExtension(filename string) string {
	switch strings.ToLower(filepath.Ext(filename)) {

	case ".go":
		return "go"

	case ".java":
		return "java"

	case ".cpp":
		return "cpp"

	case ".py":
		return "python"

	case ".js":
		return "javascript"

	case ".ts":
		return "typescript"

	default:
		return ""
	}
}

func displaySolutionName(filename string) string {

	name := strings.TrimSuffix(
		filepath.Base(filename),
		filepath.Ext(filename),
	)

	parts := strings.Split(name, "-")

	for i := range parts {
		parts[i] = strings.Title(parts[i])
	}

	return strings.Join(parts, " ")
}

func QuestionServiceContract() nexus.Contract[QuestionService] {
	return nexus.ContractOf[QuestionService]()
}

func init() {
	nexus.MustDeclare(NewQuestionService)
}
