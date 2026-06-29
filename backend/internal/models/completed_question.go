package models

import "time"

type CompletedQuestion struct {
	QuestionID int `gorm:"primaryKey;column:question_id"`

	Completed   bool `gorm:"not null;default:false"`
	CompletedAt *time.Time

	NeedsReattempt bool `gorm:"not null;default:false"`

	Algorithm       string `gorm:"type:text"`
	TimeComplexity  string
	SpaceComplexity string
	Notes           string `gorm:"type:text"`
}

func (CompletedQuestion) TableName() string {
	return "completed_questions"
}
