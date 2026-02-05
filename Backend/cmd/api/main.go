package main

import (
	"log"

	"github.com/afonsopaiva/portfolio-api/internal/config"
	"github.com/afonsopaiva/portfolio-api/internal/database"
	"github.com/afonsopaiva/portfolio-api/internal/handlers"
	"github.com/afonsopaiva/portfolio-api/internal/middleware"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	// Load configuration
	if err := config.Load(); err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	// Connect to database
	if err := database.Connect(config.AppConfig.DatabaseURL); err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer database.Close()

	// Run migrations
	if err := database.RunMigrations(); err != nil {
		log.Fatalf("Failed to run migrations: %v", err)
	}

	// Initialize handlers
	projectHandler := handlers.NewProjectHandler()
	experienceHandler := handlers.NewExperienceHandler()
	contactHandler := handlers.NewContactHandler()
	documentationHandler := handlers.NewDocumentationHandler()

	// Setup Gin router
	router := gin.Default()

	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":  "healthy",
			"service": "portfolio-api",
			"version": "1.0.0",
		})
	})

	// CORS configuration using gin-contrib/cors
	// Use permissive default that allows all origins for development
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization", "X-API-Key"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: false, // must be false when AllowOrigins contains "*"
	}))

	// API v1 routes
	v1 := router.Group("/api/v1")
	{
		// Health check
		v1.GET("/health", func(c *gin.Context) {
			c.JSON(200, gin.H{
				"status":  "healthy",
				"service": "portfolio-api",
				"version": "1.0.0",
			})
		})

		// PUBLIC ROUTES (read-only)
		// Projects - anyone can view
		v1.GET("/projects", projectHandler.GetAll)
		v1.GET("/projects/:id", projectHandler.GetByID)

		// Experience - anyone can view
		v1.GET("/experience", experienceHandler.GetAll)
		v1.GET("/experience/:id", experienceHandler.GetByID)

		// Documentation - anyone can view published docs
		v1.GET("/docs", documentationHandler.GetAll)
		v1.GET("/docs/:slug", documentationHandler.GetBySlug)
		v1.GET("/docs/category/:category", documentationHandler.GetByCategory)

		// Contact - anyone can submit a message
		v1.POST("/contact", contactHandler.Submit)

		// PROTECTED ROUTES (require API key)
		protected := v1.Group("")
		protected.Use(middleware.APIKeyAuth())
		{
			// Projects management
			protected.POST("/projects", projectHandler.Create)
			protected.PUT("/projects/:id", projectHandler.Update)
			protected.DELETE("/projects/:id", projectHandler.Delete)

			// Experience management
			protected.POST("/experience", experienceHandler.Create)
			protected.PUT("/experience/:id", experienceHandler.Update)
			protected.DELETE("/experience/:id", experienceHandler.Delete)

			// Documentation management
			protected.POST("/docs", documentationHandler.Create)
			protected.PUT("/docs/:id", documentationHandler.Update)
			protected.DELETE("/docs/:id", documentationHandler.Delete)
			protected.GET("/docs/:id", documentationHandler.GetByID) // Get by ID (including unpublished)

			// Contact messages management
			protected.GET("/messages", contactHandler.GetAll)
			protected.GET("/messages/unread", contactHandler.GetUnread)
			protected.GET("/messages/:id", contactHandler.GetByID)
			protected.PUT("/messages/:id/read", contactHandler.MarkAsRead)
			protected.DELETE("/messages/:id", contactHandler.Delete)

			// Email test
			protected.POST("/test-email", contactHandler.TestEmail)
		}
	}

	// Start server
	addr := ":" + config.AppConfig.Port
	log.Printf(" Portfolio API starting on http://localhost%s", addr)
	log.Printf(" API Documentation:")
	log.Printf("   Public endpoints:")
	log.Printf("     GET  /api/v1/projects     - List all projects")
	log.Printf("     GET  /api/v1/experience   - List all experience")
	log.Printf("     POST /api/v1/contact      - Submit contact form")
	log.Printf("   Protected endpoints (require X-API-Key header):")
	log.Printf("     POST/PUT/DELETE /api/v1/projects/:id")
	log.Printf("     POST/PUT/DELETE /api/v1/experience/:id")
	log.Printf("     GET/DELETE /api/v1/messages")

	if err := router.Run(addr); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
