package handlers

import (
	"net/http"
	"strconv"

	"github.com/afonsopaiva/portfolio-api/internal/models"
	"github.com/afonsopaiva/portfolio-api/internal/repository"
	"github.com/gin-gonic/gin"
)

type ExperienceHandler struct {
	repo *repository.ExperienceRepository
}

func NewExperienceHandler() *ExperienceHandler {
	return &ExperienceHandler{
		repo: repository.NewExperienceRepository(),
	}
}

// GetAll returns all experiences (public endpoint)
func (h *ExperienceHandler) GetAll(c *gin.Context) {
	experiences, err := h.repo.GetAll(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.APIResponse{
			Success: false,
			Error:   "Failed to fetch experiences: " + err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Data:    experiences,
	})
}

// GetByID returns a single experience (public endpoint)
func (h *ExperienceHandler) GetByID(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, models.APIResponse{
			Success: false,
			Error:   "Invalid experience ID",
		})
		return
	}

	experience, err := h.repo.GetByID(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusNotFound, models.APIResponse{
			Success: false,
			Error:   "Experience not found",
		})
		return
	}

	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Data:    experience,
	})
}

// Create creates a new experience (protected endpoint)
func (h *ExperienceHandler) Create(c *gin.Context) {
	var input models.CreateExperienceInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, models.APIResponse{
			Success: false,
			Error:   "Invalid input: " + err.Error(),
		})
		return
	}

	experience, err := h.repo.Create(c.Request.Context(), input)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.APIResponse{
			Success: false,
			Error:   "Failed to create experience: " + err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, models.APIResponse{
		Success: true,
		Message: "Experience created successfully",
		Data:    experience,
	})
}

// Update updates an experience (protected endpoint)
func (h *ExperienceHandler) Update(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, models.APIResponse{
			Success: false,
			Error:   "Invalid experience ID",
		})
		return
	}

	var input models.CreateExperienceInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, models.APIResponse{
			Success: false,
			Error:   "Invalid input: " + err.Error(),
		})
		return
	}

	experience, err := h.repo.Update(c.Request.Context(), id, input)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.APIResponse{
			Success: false,
			Error:   "Failed to update experience: " + err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Message: "Experience updated successfully",
		Data:    experience,
	})
}

// Delete deletes an experience (protected endpoint)
func (h *ExperienceHandler) Delete(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, models.APIResponse{
			Success: false,
			Error:   "Invalid experience ID",
		})
		return
	}

	if err := h.repo.Delete(c.Request.Context(), id); err != nil {
		c.JSON(http.StatusInternalServerError, models.APIResponse{
			Success: false,
			Error:   "Failed to delete experience: " + err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Message: "Experience deleted successfully",
	})
}
