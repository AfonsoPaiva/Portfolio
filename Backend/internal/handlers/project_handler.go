package handlers

import (
	"net/http"
	"strconv"

	"github.com/afonsopaiva/portfolio-api/internal/models"
	"github.com/afonsopaiva/portfolio-api/internal/repository"
	"github.com/gin-gonic/gin"
)

type ProjectHandler struct {
	repo *repository.ProjectRepository
}

func NewProjectHandler() *ProjectHandler {
	return &ProjectHandler{
		repo: repository.NewProjectRepository(),
	}
}

// GetAll returns all projects (public endpoint)
func (h *ProjectHandler) GetAll(c *gin.Context) {
	projects, err := h.repo.GetAll(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.APIResponse{
			Success: false,
			Error:   "Failed to fetch projects: " + err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Data:    projects,
	})
}

// GetByID returns a single project (public endpoint)
func (h *ProjectHandler) GetByID(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, models.APIResponse{
			Success: false,
			Error:   "Invalid project ID",
		})
		return
	}

	project, err := h.repo.GetByID(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusNotFound, models.APIResponse{
			Success: false,
			Error:   "Project not found",
		})
		return
	}

	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Data:    project,
	})
}

// Create creates a new project (protected endpoint)
func (h *ProjectHandler) Create(c *gin.Context) {
	var input models.CreateProjectInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, models.APIResponse{
			Success: false,
			Error:   "Invalid input: " + err.Error(),
		})
		return
	}

	project, err := h.repo.Create(c.Request.Context(), input)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.APIResponse{
			Success: false,
			Error:   "Failed to create project: " + err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, models.APIResponse{
		Success: true,
		Message: "Project created successfully",
		Data:    project,
	})
}

// Update updates a project (protected endpoint)
func (h *ProjectHandler) Update(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, models.APIResponse{
			Success: false,
			Error:   "Invalid project ID",
		})
		return
	}

	var input models.CreateProjectInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, models.APIResponse{
			Success: false,
			Error:   "Invalid input: " + err.Error(),
		})
		return
	}

	project, err := h.repo.Update(c.Request.Context(), id, input)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.APIResponse{
			Success: false,
			Error:   "Failed to update project: " + err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Message: "Project updated successfully",
		Data:    project,
	})
}

// Delete deletes a project (protected endpoint)
func (h *ProjectHandler) Delete(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, models.APIResponse{
			Success: false,
			Error:   "Invalid project ID",
		})
		return
	}

	if err := h.repo.Delete(c.Request.Context(), id); err != nil {
		c.JSON(http.StatusInternalServerError, models.APIResponse{
			Success: false,
			Error:   "Failed to delete project: " + err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Message: "Project deleted successfully",
	})
}
