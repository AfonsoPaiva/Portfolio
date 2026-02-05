package services

import (
	"context"
	"fmt"
	"regexp"
	"strings"

	"github.com/afonsopaiva/portfolio-api/internal/models"
	"github.com/afonsopaiva/portfolio-api/internal/repository"
)

// DocumentationService handles business logic for documentation
type DocumentationService struct {
	repo *repository.DocumentationRepository
}

func NewDocumentationService() *DocumentationService {
	return &DocumentationService{
		repo: repository.NewDocumentationRepository(),
	}
}

// GetAll returns all documentation entries
func (s *DocumentationService) GetAll(ctx context.Context, publishedOnly bool) ([]models.Documentation, error) {
	return s.repo.GetAll(ctx, publishedOnly)
}

// GetByID returns a documentation entry by ID
func (s *DocumentationService) GetByID(ctx context.Context, id int) (*models.Documentation, error) {
	return s.repo.GetByID(ctx, id)
}

// GetBySlug returns a documentation entry by slug
func (s *DocumentationService) GetBySlug(ctx context.Context, slug string) (*models.Documentation, error) {
	return s.repo.GetBySlug(ctx, slug)
}

// GetByCategory returns all documentation entries in a category
func (s *DocumentationService) GetByCategory(ctx context.Context, category string, publishedOnly bool) ([]models.Documentation, error) {
	return s.repo.GetByCategory(ctx, category, publishedOnly)
}

// Create creates a new documentation entry with validation
func (s *DocumentationService) Create(ctx context.Context, input models.CreateDocumentationInput) (*models.Documentation, error) {
	// Validate slug format (alphanumeric and hyphens only)
	if !isValidSlug(input.Slug) {
		return nil, fmt.Errorf("invalid slug format: must contain only lowercase letters, numbers, and hyphens")
	}

	// Normalize slug
	input.Slug = normalizeSlug(input.Slug)

	// Check if slug already exists
	existing, err := s.repo.GetBySlug(ctx, input.Slug)
	if err == nil && existing != nil {
		return nil, fmt.Errorf("documentation with slug '%s' already exists", input.Slug)
	}

	return s.repo.Create(ctx, input)
}

// Update updates a documentation entry with validation
func (s *DocumentationService) Update(ctx context.Context, id int, input models.UpdateDocumentationInput) (*models.Documentation, error) {
	// Check if documentation exists
	_, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("documentation not found")
	}

	// Validate and normalize slug if provided
	if input.Slug != nil {
		if !isValidSlug(*input.Slug) {
			return nil, fmt.Errorf("invalid slug format: must contain only lowercase letters, numbers, and hyphens")
		}
		normalizedSlug := normalizeSlug(*input.Slug)
		input.Slug = &normalizedSlug

		// Check if new slug conflicts with existing documentation
		existing, err := s.repo.GetBySlug(ctx, *input.Slug)
		if err == nil && existing != nil && existing.ID != id {
			return nil, fmt.Errorf("documentation with slug '%s' already exists", *input.Slug)
		}
	}

	return s.repo.Update(ctx, id, input)
}

// Delete deletes a documentation entry
func (s *DocumentationService) Delete(ctx context.Context, id int) error {
	return s.repo.Delete(ctx, id)
}

// RenderMarkdown converts markdown content to HTML (basic implementation)
// For production, consider using a proper markdown library like github.com/gomarkdown/markdown
func (s *DocumentationService) RenderMarkdown(content string) string {
	// This is a placeholder. In production, use a proper markdown renderer
	// like: github.com/gomarkdown/markdown or github.com/russross/blackfriday
	return content
}

// Helper functions

// isValidSlug checks if a slug contains only valid characters
func isValidSlug(slug string) bool {
	// Slug should contain only lowercase letters, numbers, and hyphens
	match, _ := regexp.MatchString(`^[a-z0-9-]+$`, slug)
	return match
}

// normalizeSlug normalizes a slug to lowercase and replaces spaces with hyphens
func normalizeSlug(slug string) string {
	// Convert to lowercase
	slug = strings.ToLower(slug)
	
	// Replace spaces with hyphens
	slug = strings.ReplaceAll(slug, " ", "-")
	
	// Remove any characters that aren't alphanumeric or hyphens
	reg := regexp.MustCompile(`[^a-z0-9-]+`)
	slug = reg.ReplaceAllString(slug, "")
	
	// Remove multiple consecutive hyphens
	reg = regexp.MustCompile(`-+`)
	slug = reg.ReplaceAllString(slug, "-")
	
	// Trim hyphens from start and end
	slug = strings.Trim(slug, "-")
	
	return slug
}

// ValidateMarkdown performs basic validation on markdown content
func (s *DocumentationService) ValidateMarkdown(content string) error {
	if strings.TrimSpace(content) == "" {
		return fmt.Errorf("content cannot be empty")
	}
	
	// Could add more validation rules here:
	// - Check for broken links
	// - Validate code blocks
	// - Check heading structure
	
	return nil
}
