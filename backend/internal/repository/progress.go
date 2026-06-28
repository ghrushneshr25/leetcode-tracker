package repository

import (
	"errors"
	"time"

	"github.com/ghrushneshr25/leetcode-tracker/backend/internal/database"
	"github.com/ghrushneshr25/leetcode-tracker/backend/internal/models"
	"github.com/ghrushneshr25/nexus"
	"gorm.io/gorm"
)

type Progress struct {
	CompletedAt    time.Time
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
	var completed []models.CompletedQuestion

	if err := r.db.DB().Find(&completed).Error; err != nil {
		return nil, err
	}

	result := make(map[int]Progress)

	for _, q := range completed {
		result[q.QuestionID] = Progress{
			CompletedAt:    q.CompletedAt.UTC(),
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

	// Mark Incomplete
	if completed != nil && !*completed {
		return r.db.DB().
			Where("question_id = ?", questionID).
			Delete(&models.CompletedQuestion{}).
			Error
	}

	var progress models.CompletedQuestion

	err := r.db.DB().
		Where("question_id = ?", questionID).
		First(&progress).
		Error

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			progress.QuestionID = questionID
		} else {
			return err
		}
	}

	if completed != nil && *completed {
		if completedAt != nil {
			progress.CompletedAt = completedAt.UTC()
		} else {
			progress.CompletedAt = time.Now().UTC()
		}
	}

	if needsReattempt != nil {
		progress.NeedsReattempt = *needsReattempt
	}

	return r.db.DB().Save(&progress).Error
}

func ProgressRepositoryContract() nexus.Contract[ProgressRepository] {
	return nexus.ContractOf[ProgressRepository]()
}

func init() {
	nexus.MustDeclare(NewProgressRepository)
}
