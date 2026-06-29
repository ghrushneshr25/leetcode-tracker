package repository

import (
	"errors"
	"time"

	"github.com/ghrushneshr25/leetcode-tracker/backend/internal/database"
	"github.com/ghrushneshr25/leetcode-tracker/backend/internal/dto"
	"github.com/ghrushneshr25/leetcode-tracker/backend/internal/models"
	"github.com/ghrushneshr25/nexus"
	"gorm.io/gorm"
)

type Progress struct {
	Completed      bool
	CompletedAt    *time.Time
	NeedsReattempt bool
}

type ProgressRepository interface {
	GetProgress() (map[int]Progress, error)

	UpdateProgress(
		questionID int,
		completed *bool,
		completedAt *time.Time,
		needsReattempt *bool,
	) error

	GetQuestionNotes(id int) (*models.CompletedQuestion, error)

	UpdateQuestionNotes(
		id int,
		request dto.UpdateQuestionNotesRequest,
	) error
}

type progressRepository struct {
	db database.Database
}

func NewProgressRepository(
	db database.Database,
) ProgressRepository {
	return &progressRepository{
		db: db,
	}
}

func (r *progressRepository) GetProgress() (map[int]Progress, error) {
	var progress []models.CompletedQuestion

	if err := r.db.DB().Find(&progress).Error; err != nil {
		return nil, err
	}

	result := make(map[int]Progress, len(progress))

	for _, q := range progress {
		result[q.QuestionID] = Progress{
			Completed:      q.Completed,
			CompletedAt:    q.CompletedAt,
			NeedsReattempt: q.NeedsReattempt,
		}
	}

	return result, nil
}

func (r *progressRepository) UpdateProgress(
	questionID int,
	completed *bool,
	completedAt *time.Time,
	needsReattempt *bool,
) error {

	var progress models.CompletedQuestion

	err := r.db.DB().
		Where("question_id = ?", questionID).
		First(&progress).
		Error

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			progress = models.CompletedQuestion{
				QuestionID: questionID,
			}
		} else {
			return err
		}
	}

	if completed != nil {
		progress.Completed = *completed

		if *completed {
			if completedAt != nil {
				progress.CompletedAt = completedAt
			} else {
				now := time.Now().UTC()
				progress.CompletedAt = &now
			}
		} else {
			progress.CompletedAt = nil
			progress.NeedsReattempt = false
		}
	}

	if needsReattempt != nil {
		progress.NeedsReattempt = *needsReattempt
	}

	return r.db.DB().Save(&progress).Error
}

func (r *progressRepository) GetQuestionNotes(
	id int,
) (*models.CompletedQuestion, error) {

	var progress models.CompletedQuestion

	err := r.db.DB().
		Where("question_id = ?", id).
		First(&progress).
		Error

	if errors.Is(err, gorm.ErrRecordNotFound) {
		return &models.CompletedQuestion{
			QuestionID: id,
		}, nil
	}

	if err != nil {
		return nil, err
	}

	return &progress, nil
}

func (r *progressRepository) UpdateQuestionNotes(
	id int,
	request dto.UpdateQuestionNotesRequest,
) error {

	var progress models.CompletedQuestion

	err := r.db.DB().
		Where("question_id = ?", id).
		First(&progress).
		Error

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			progress = models.CompletedQuestion{
				QuestionID: id,
			}
		} else {
			return err
		}
	}

	progress.Algorithm = request.Algorithm
	progress.TimeComplexity = request.TimeComplexity
	progress.SpaceComplexity = request.SpaceComplexity
	progress.Notes = request.Notes

	return r.db.DB().Save(&progress).Error
}

func ProgressRepositoryContract() nexus.Contract[ProgressRepository] {
	return nexus.ContractOf[ProgressRepository]()
}

func init() {
	nexus.MustDeclare(NewProgressRepository)
}
