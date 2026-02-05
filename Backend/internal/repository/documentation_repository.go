package repository

import (
	"context"
	"fmt"

	"github.com/afonsopaiva/portfolio-api/internal/database"
	"github.com/afonsopaiva/portfolio-api/internal/models"
)

// DocumentationRepository handles documentation database operations
type DocumentationRepository struct{}

func NewDocumentationRepository() *DocumentationRepository {
	return &DocumentationRepository{}
}

// GetAll returns all documentation entries (with optional published filter)
func (r *DocumentationRepository) GetAll(ctx context.Context, publishedOnly bool) ([]models.Documentation, error) {
	query := `
		SELECT id, slug, title_en, title_pt, content_en, content_pt,
			   category, published, display_order, created_at, updated_at
		FROM documentation
	`
	
	if publishedOnly {
		query += " WHERE published = true"
	}
	
	query += " ORDER BY display_order ASC, created_at DESC"

	rows, err := database.Pool.Query(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var docs []models.Documentation
	for rows.Next() {
		var doc models.Documentation
		var titleEn, titlePt, contentEn, contentPt string

		err := rows.Scan(
			&doc.ID, &doc.Slug, &titleEn, &titlePt, &contentEn, &contentPt,
			&doc.Category, &doc.Published, &doc.Order, &doc.CreatedAt, &doc.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}

		doc.Title = models.LocalizedText{En: titleEn, Pt: titlePt}
		doc.Content = models.LocalizedText{En: contentEn, Pt: contentPt}

		docs = append(docs, doc)
	}

	return docs, nil
}

// GetByID returns a documentation entry by ID
func (r *DocumentationRepository) GetByID(ctx context.Context, id int) (*models.Documentation, error) {
	var doc models.Documentation
	var titleEn, titlePt, contentEn, contentPt string

	err := database.Pool.QueryRow(ctx, `
		SELECT id, slug, title_en, title_pt, content_en, content_pt,
			   category, published, display_order, created_at, updated_at
		FROM documentation WHERE id = $1
	`, id).Scan(
		&doc.ID, &doc.Slug, &titleEn, &titlePt, &contentEn, &contentPt,
		&doc.Category, &doc.Published, &doc.Order, &doc.CreatedAt, &doc.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}

	doc.Title = models.LocalizedText{En: titleEn, Pt: titlePt}
	doc.Content = models.LocalizedText{En: contentEn, Pt: contentPt}

	return &doc, nil
}

// GetBySlug returns a documentation entry by slug
func (r *DocumentationRepository) GetBySlug(ctx context.Context, slug string) (*models.Documentation, error) {
	var doc models.Documentation
	var titleEn, titlePt, contentEn, contentPt string

	err := database.Pool.QueryRow(ctx, `
		SELECT id, slug, title_en, title_pt, content_en, content_pt,
			   category, published, display_order, created_at, updated_at
		FROM documentation WHERE slug = $1
	`, slug).Scan(
		&doc.ID, &doc.Slug, &titleEn, &titlePt, &contentEn, &contentPt,
		&doc.Category, &doc.Published, &doc.Order, &doc.CreatedAt, &doc.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}

	doc.Title = models.LocalizedText{En: titleEn, Pt: titlePt}
	doc.Content = models.LocalizedText{En: contentEn, Pt: contentPt}

	return &doc, nil
}

// GetByCategory returns all documentation entries in a category
func (r *DocumentationRepository) GetByCategory(ctx context.Context, category string, publishedOnly bool) ([]models.Documentation, error) {
	query := `
		SELECT id, slug, title_en, title_pt, content_en, content_pt,
			   category, published, display_order, created_at, updated_at
		FROM documentation WHERE category = $1
	`
	
	if publishedOnly {
		query += " AND published = true"
	}
	
	query += " ORDER BY display_order ASC, created_at DESC"

	rows, err := database.Pool.Query(ctx, query, category)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var docs []models.Documentation
	for rows.Next() {
		var doc models.Documentation
		var titleEn, titlePt, contentEn, contentPt string

		err := rows.Scan(
			&doc.ID, &doc.Slug, &titleEn, &titlePt, &contentEn, &contentPt,
			&doc.Category, &doc.Published, &doc.Order, &doc.CreatedAt, &doc.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}

		doc.Title = models.LocalizedText{En: titleEn, Pt: titlePt}
		doc.Content = models.LocalizedText{En: contentEn, Pt: contentPt}

		docs = append(docs, doc)
	}

	return docs, nil
}

// Create creates a new documentation entry
func (r *DocumentationRepository) Create(ctx context.Context, input models.CreateDocumentationInput) (*models.Documentation, error) {
	var doc models.Documentation
	var titleEn, titlePt, contentEn, contentPt string

	err := database.Pool.QueryRow(ctx, `
		INSERT INTO documentation (slug, title_en, title_pt, content_en, content_pt,
								   category, published, display_order, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
		RETURNING id, slug, title_en, title_pt, content_en, content_pt,
				  category, published, display_order, created_at, updated_at
	`, input.Slug, input.TitleEn, input.TitlePt, input.ContentEn, input.ContentPt,
		input.Category, input.Published, input.Order).Scan(
		&doc.ID, &doc.Slug, &titleEn, &titlePt, &contentEn, &contentPt,
		&doc.Category, &doc.Published, &doc.Order, &doc.CreatedAt, &doc.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}

	doc.Title = models.LocalizedText{En: titleEn, Pt: titlePt}
	doc.Content = models.LocalizedText{En: contentEn, Pt: contentPt}

	return &doc, nil
}

// Update updates a documentation entry
func (r *DocumentationRepository) Update(ctx context.Context, id int, input models.UpdateDocumentationInput) (*models.Documentation, error) {
	// Build dynamic UPDATE query
	query := "UPDATE documentation SET updated_at = NOW()"
	args := []interface{}{}
	argPos := 1

	if input.Slug != nil {
		query += fmt.Sprintf(", slug = $%d", argPos)
		args = append(args, *input.Slug)
		argPos++
	}
	if input.TitleEn != nil {
		query += fmt.Sprintf(", title_en = $%d", argPos)
		args = append(args, *input.TitleEn)
		argPos++
	}
	if input.TitlePt != nil {
		query += fmt.Sprintf(", title_pt = $%d", argPos)
		args = append(args, *input.TitlePt)
		argPos++
	}
	if input.ContentEn != nil {
		query += fmt.Sprintf(", content_en = $%d", argPos)
		args = append(args, *input.ContentEn)
		argPos++
	}
	if input.ContentPt != nil {
		query += fmt.Sprintf(", content_pt = $%d", argPos)
		args = append(args, *input.ContentPt)
		argPos++
	}
	if input.Category != nil {
		query += fmt.Sprintf(", category = $%d", argPos)
		args = append(args, *input.Category)
		argPos++
	}
	if input.Published != nil {
		query += fmt.Sprintf(", published = $%d", argPos)
		args = append(args, *input.Published)
		argPos++
	}
	if input.Order != nil {
		query += fmt.Sprintf(", display_order = $%d", argPos)
		args = append(args, *input.Order)
		argPos++
	}

	query += fmt.Sprintf(" WHERE id = $%d", argPos)
	args = append(args, id)
	argPos++

	query += ` RETURNING id, slug, title_en, title_pt, content_en, content_pt,
			   category, published, display_order, created_at, updated_at`

	var doc models.Documentation
	var titleEn, titlePt, contentEn, contentPt string

	err := database.Pool.QueryRow(ctx, query, args...).Scan(
		&doc.ID, &doc.Slug, &titleEn, &titlePt, &contentEn, &contentPt,
		&doc.Category, &doc.Published, &doc.Order, &doc.CreatedAt, &doc.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}

	doc.Title = models.LocalizedText{En: titleEn, Pt: titlePt}
	doc.Content = models.LocalizedText{En: contentEn, Pt: contentPt}

	return &doc, nil
}

// Delete deletes a documentation entry
func (r *DocumentationRepository) Delete(ctx context.Context, id int) error {
	result, err := database.Pool.Exec(ctx, "DELETE FROM documentation WHERE id = $1", id)
	if err != nil {
		return err
	}

	rowsAffected := result.RowsAffected()
	if rowsAffected == 0 {
		return fmt.Errorf("documentation not found")
	}

	return nil
}
