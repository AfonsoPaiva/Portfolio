package middleware

import (
	"net/http"
	"strings"

	"github.com/afonsopaiva/portfolio-api/internal/config"
	"github.com/afonsopaiva/portfolio-api/internal/models"
	"github.com/gin-gonic/gin"
)

// APIKeyAuth middleware validates the API key for protected routes
func APIKeyAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		apiKey := config.AppConfig.APIKey

		// If no API key is configured, reject all requests to protected routes
		if apiKey == "" {
			c.JSON(http.StatusInternalServerError, models.APIResponse{
				Success: false,
				Error:   "API key not configured on server",
			})
			c.Abort()
			return
		}

		// Check for API key in header
		providedKey := c.GetHeader("X-API-Key")

		// Also check Authorization header with Bearer scheme
		if providedKey == "" {
			authHeader := c.GetHeader("Authorization")
			if strings.HasPrefix(authHeader, "Bearer ") {
				providedKey = strings.TrimPrefix(authHeader, "Bearer ")
			}
		}

		// Also check query parameter (for debugging, not recommended for production)
		if providedKey == "" {
			providedKey = c.Query("api_key")
		}

		if providedKey == "" {
			c.JSON(http.StatusUnauthorized, models.APIResponse{
				Success: false,
				Error:   "API key required. Provide via X-API-Key header or Authorization: Bearer <key>",
			})
			c.Abort()
			return
		}

		if providedKey != apiKey {
			c.JSON(http.StatusForbidden, models.APIResponse{
				Success: false,
				Error:   "Invalid API key",
			})
			c.Abort()
			return
		}

		c.Next()
	}
}

// OptionalAPIKeyAuth allows both authenticated and unauthenticated requests
// Sets c.Get("authenticated") to true if valid API key provided
func OptionalAPIKeyAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		apiKey := config.AppConfig.APIKey

		providedKey := c.GetHeader("X-API-Key")
		if providedKey == "" {
			authHeader := c.GetHeader("Authorization")
			if strings.HasPrefix(authHeader, "Bearer ") {
				providedKey = strings.TrimPrefix(authHeader, "Bearer ")
			}
		}

		c.Set("authenticated", apiKey != "" && providedKey == apiKey)
		c.Next()
	}
}
