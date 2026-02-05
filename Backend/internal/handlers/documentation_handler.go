package handlers

import (
	"net/http"
	"strconv"

	"github.com/afonsopaiva/portfolio-api/internal/models"
	"github.com/afonsopaiva/portfolio-api/internal/services"
	"github.com/gin-gonic/gin"
)

type DocumentationHandler struct {
	service *services.DocumentationService
}

func NewDocumentationHandler() *DocumentationHandler {
	return &DocumentationHandler{
		service: services.NewDocumentationService(),
	}
}

// GetAll returns all documentation entries (public: published only, admin: all)
func (h *DocumentationHandler) GetAll(c *gin.Context) {
	// Check if user is admin (has API key)
	_, hasAPIKey := c.Get("authenticated")
	publishedOnly := !hasAPIKey

	docs, err := h.service.GetAll(c.Request.Context(), publishedOnly)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.APIResponse{
			Success: false,
			Error:   "Failed to fetch documentation: " + err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Data:    docs,
	})
}

// GetByID returns a single documentation entry by ID
func (h *DocumentationHandler) GetByID(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, models.APIResponse{
			Success: false,
			Error:   "Invalid documentation ID",
		})
		return
	}

	doc, err := h.service.GetByID(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusNotFound, models.APIResponse{
			Success: false,
			Error:   "Documentation not found",
		})
		return
	}

	// Check if user can access unpublished docs
	_, hasAPIKey := c.Get("authenticated")
	if !doc.Published && !hasAPIKey {
		c.JSON(http.StatusNotFound, models.APIResponse{
			Success: false,
			Error:   "Documentation not found",
		})
		return
	}

	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Data:    doc,
	})
}

// GetBySlug returns a single documentation entry by slug (public endpoint)
func (h *DocumentationHandler) GetBySlug(c *gin.Context) {
	slug := c.Param("slug")

	doc, err := h.service.GetBySlug(c.Request.Context(), slug)
	if err != nil {
		c.JSON(http.StatusNotFound, models.APIResponse{
			Success: false,
			Error:   "Documentation not found",
		})
		return
	}

	// Check if user can access unpublished docs
	_, hasAPIKey := c.Get("authenticated")
	if !doc.Published && !hasAPIKey {
		c.JSON(http.StatusNotFound, models.APIResponse{
			Success: false,
			Error:   "Documentation not found",
		})
		return
	}

	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Data:    doc,
	})
}

// GetByCategory returns all documentation entries in a category
func (h *DocumentationHandler) GetByCategory(c *gin.Context) {
	category := c.Param("category")

	// Check if user is admin (has API key)
	_, hasAPIKey := c.Get("authenticated")
	publishedOnly := !hasAPIKey

	docs, err := h.service.GetByCategory(c.Request.Context(), category, publishedOnly)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.APIResponse{
			Success: false,
			Error:   "Failed to fetch documentation: " + err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Data:    docs,
	})
}

// Create creates a new documentation entry (protected endpoint)
func (h *DocumentationHandler) Create(c *gin.Context) {
	var input models.CreateDocumentationInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, models.APIResponse{
			Success: false,
			Error:   "Invalid input: " + err.Error(),
		})
		return
	}

	doc, err := h.service.Create(c.Request.Context(), input)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.APIResponse{
			Success: false,
			Error:   "Failed to create documentation: " + err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, models.APIResponse{
		Success: true,
		Message: "Documentation created successfully",
		Data:    doc,
	})
}

// Update updates a documentation entry (protected endpoint)
func (h *DocumentationHandler) Update(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, models.APIResponse{
			Success: false,
			Error:   "Invalid documentation ID",
		})
		return
	}

	var input models.UpdateDocumentationInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, models.APIResponse{
			Success: false,
			Error:   "Invalid input: " + err.Error(),
		})
		return
	}

	doc, err := h.service.Update(c.Request.Context(), id, input)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.APIResponse{
			Success: false,
			Error:   "Failed to update documentation: " + err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Message: "Documentation updated successfully",
		Data:    doc,
	})
}

// Delete deletes a documentation entry (protected endpoint)
func (h *DocumentationHandler) Delete(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, models.APIResponse{
			Success: false,
			Error:   "Invalid documentation ID",
		})
		return
	}

	if err := h.service.Delete(c.Request.Context(), id); err != nil {
		c.JSON(http.StatusInternalServerError, models.APIResponse{
			Success: false,
			Error:   "Failed to delete documentation: " + err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Message: "Documentation deleted successfully",
	})
}
