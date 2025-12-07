package handlers

import (
	"log"
	"net/http"
	"strconv"

	"github.com/afonsopaiva/portfolio-api/internal/models"
	"github.com/afonsopaiva/portfolio-api/internal/repository"
	"github.com/afonsopaiva/portfolio-api/internal/services"
	"github.com/gin-gonic/gin"
)

type ContactHandler struct {
	repo         *repository.ContactRepository
	emailService *services.EmailService
}

func NewContactHandler() *ContactHandler {
	return &ContactHandler{
		repo:         repository.NewContactRepository(),
		emailService: services.NewEmailService(),
	}
}

// Submit handles contact form submission (public endpoint - stores and sends email)
func (h *ContactHandler) Submit(c *gin.Context) {
	var input models.ContactInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, models.APIResponse{
			Success: false,
			Error:   "Invalid input: " + err.Error(),
		})
		return
	}

	// Save to database
	message, err := h.repo.Create(c.Request.Context(), input)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.APIResponse{
			Success: false,
			Error:   "Failed to save message: " + err.Error(),
		})
		return
	}

	// Send email notification (async, don't block response)
	go func() {
		if err := h.emailService.SendContactNotification(message); err != nil {
			log.Printf("Failed to send email notification: %v", err)
		} else {
			log.Printf("Email notification sent for message ID %d", message.ID)
		}
	}()

	c.JSON(http.StatusCreated, models.APIResponse{
		Success: true,
		Message: "Message sent successfully! I'll get back to you soon.",
		Data:    map[string]int{"id": message.ID},
	})
}

// GetAll returns all contact messages (protected endpoint)
func (h *ContactHandler) GetAll(c *gin.Context) {
	messages, err := h.repo.GetAll(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.APIResponse{
			Success: false,
			Error:   "Failed to fetch messages: " + err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Data:    messages,
	})
}

// GetUnread returns unread contact messages (protected endpoint)
func (h *ContactHandler) GetUnread(c *gin.Context) {
	messages, err := h.repo.GetUnread(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.APIResponse{
			Success: false,
			Error:   "Failed to fetch messages: " + err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Data:    messages,
	})
}

// GetByID returns a single message (protected endpoint)
func (h *ContactHandler) GetByID(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, models.APIResponse{
			Success: false,
			Error:   "Invalid message ID",
		})
		return
	}

	message, err := h.repo.GetByID(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusNotFound, models.APIResponse{
			Success: false,
			Error:   "Message not found",
		})
		return
	}

	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Data:    message,
	})
}

// MarkAsRead marks a message as read (protected endpoint)
func (h *ContactHandler) MarkAsRead(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, models.APIResponse{
			Success: false,
			Error:   "Invalid message ID",
		})
		return
	}

	if err := h.repo.MarkAsRead(c.Request.Context(), id); err != nil {
		c.JSON(http.StatusInternalServerError, models.APIResponse{
			Success: false,
			Error:   "Failed to mark message as read: " + err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Message: "Message marked as read",
	})
}

// Delete deletes a contact message (protected endpoint)
func (h *ContactHandler) Delete(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, models.APIResponse{
			Success: false,
			Error:   "Invalid message ID",
		})
		return
	}

	if err := h.repo.Delete(c.Request.Context(), id); err != nil {
		c.JSON(http.StatusInternalServerError, models.APIResponse{
			Success: false,
			Error:   "Failed to delete message: " + err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Message: "Message deleted successfully",
	})
}

// TestEmail sends a test email (protected endpoint)
func (h *ContactHandler) TestEmail(c *gin.Context) {
	if err := h.emailService.SendTestEmail(); err != nil {
		c.JSON(http.StatusInternalServerError, models.APIResponse{
			Success: false,
			Error:   "Failed to send test email: " + err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Message: "Test email sent successfully",
	})
}
