package database

import (
	"fmt"

	"github.com/ghrushneshr25/leetcode-tracker/backend/internal/config"
	"github.com/ghrushneshr25/leetcode-tracker/backend/internal/models"
	"github.com/ghrushneshr25/nexus"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type Database interface {
	DB() *gorm.DB
}

type database struct {
	db *gorm.DB
}

func (d *database) DB() *gorm.DB {
	return d.db
}

func NewDatabase(cfg config.Config) (Database, error) {
	dsn := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		cfg.DBHost,
		cfg.DBPort,
		cfg.DBUser,
		cfg.DBPassword,
		cfg.DBName,
	)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	if err := db.AutoMigrate(&models.CompletedQuestion{}); err != nil {
		return nil, err
	}

	return &database{
		db: db,
	}, nil
}

func DatabaseContract() nexus.Contract[Database] {
	return nexus.ContractOf[Database]()
}

func init() {
	nexus.MustDeclare(NewDatabase)
}
