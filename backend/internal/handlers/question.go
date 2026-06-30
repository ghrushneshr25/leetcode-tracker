package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"

	"github.com/ghrushneshr25/leetcode-tracker/backend/internal/dto"
	"github.com/ghrushneshr25/leetcode-tracker/backend/internal/services"
	"github.com/ghrushneshr25/nexus"
)

type QuestionHandler interface {
	GetQuestions(c *gin.Context)
	UpdateProgress(c *gin.Context)

	GetQuestionNotes(c *gin.Context)
	UpdateQuestionNotes(c *gin.Context)

	PushSolutionToGithub(c *gin.Context)
	GetSolutionsFromGithub(c *gin.Context)
}

type questionHandler struct {
	service services.QuestionService
}

func NewQuestionHandler(
	service services.QuestionService,
) QuestionHandler {
	return &questionHandler{
		service: service,
	}
}

func (h *questionHandler) GetQuestions(c *gin.Context) {
	questions, err := h.service.GetQuestions()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, questions)
}

func (h *questionHandler) UpdateProgress(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid question id",
		})
		return
	}

	var request dto.UpdateProgressRequest

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	if err := h.service.UpdateProgress(
		id,
		request.Completed,
		request.CompletedAt,
		request.NeedsReattempt,
	); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
	})
}

func (h *questionHandler) GetQuestionNotes(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid question id",
		})
		return
	}

	notes, err := h.service.GetQuestionNotes(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, notes)
}

func (h *questionHandler) UpdateQuestionNotes(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid question id",
		})
		return
	}

	var request dto.UpdateQuestionNotesRequest

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	if err := h.service.UpdateQuestionNotes(id, request); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
	})
}

func (h *questionHandler) PushSolutionToGithub(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid question id",
		})
		return
	}

	var request dto.PushGithubRequest

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	response, err := h.service.PushSolutionToGithub(
		id,
		request,
	)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, response)
}

func (h *questionHandler) GetSolutionsFromGithub(
	c *gin.Context,
) {

	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid question id",
		})
		return
	}

	response, err := h.service.GetSolutionsFromGithub(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, response)
}

func QuestionHandlerContract() nexus.Contract[QuestionHandler] {
	return nexus.ContractOf[QuestionHandler]()
}

func init() {
	nexus.MustDeclare(NewQuestionHandler)
}
