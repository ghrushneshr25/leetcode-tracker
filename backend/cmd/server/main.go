package main

import (
	"log"

	"github.com/ghrushneshr25/leetcode-tracker/backend/internal/config"
	"github.com/ghrushneshr25/leetcode-tracker/backend/internal/routes"
	"github.com/ghrushneshr25/nexus"
)

func main() {
	config.Load()

	if err := nexus.Validate(); err != nil {
		log.Fatal(err)
	}

	router := nexus.MustGet(routes.RouterContract)

	log.Println("Server listening on :8080")

	if err := router.Engine().Run(":8080"); err != nil {
		log.Fatal(err)
	}
}
