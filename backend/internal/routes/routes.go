package routes

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	"github.com/ghrushneshr25/leetcode-tracker/backend/internal/handlers"
	"github.com/ghrushneshr25/nexus"
)

type Router interface {
	Engine() *gin.Engine
}

type router struct {
	engine *gin.Engine
}

func (r *router) Engine() *gin.Engine {
	return r.engine
}

func NewRouter(
	handler handlers.QuestionHandler,
) Router {

	engine := gin.Default()

	engine.Use(cors.Default())

	api := engine.Group("/api")

	{
		api.GET("/questions", handler.GetQuestions)
		api.PATCH("/questions/:id", handler.UpdateProgress)
		api.PATCH("/questions/:id/notes", handler.UpdateQuestionNotes)
		api.GET("/questions/:id/notes", handler.GetQuestionNotes)
		api.POST("/questions/:id/github", handler.PushSolutionToGithub)
		api.GET("/questions/:id/github", handler.GetSolutionsFromGithub)
	}

	return &router{
		engine: engine,
	}
}

func RouterContract() nexus.Contract[Router] {
	return nexus.ContractOf[Router]()
}

func init() {
	nexus.MustDeclare(NewRouter)
}
