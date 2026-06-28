package models

import "time"

type CompletedQuestion struct {
	QuestionID     int       `gorm:"primaryKey"`
	CompletedAt    time.Time `gorm:"not null;"`
	NeedsReattempt bool      `gorm:"default:false"`
}

func (CompletedQuestion) TableName() string {
	return "completed_questions"
}
