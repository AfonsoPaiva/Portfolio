package repository

import (
	"context"
	"time"

	"github.com/afonsopaiva/portfolio-api/internal/database"
	"github.com/afonsopaiva/portfolio-api/internal/models"
)

// ProjectRepository handles project database operations
type ProjectRepository struct{}

func NewProjectRepository() *ProjectRepository {
	return &ProjectRepository{}
}

// GetAll returns all projects
func (r *ProjectRepository) GetAll(ctx context.Context) ([]models.Project, error) {
	rows, err := database.Pool.Query(ctx, `
		SELECT id, status_text, status_color, image, title_en, title_pt, 
			   short_desc_en, short_desc_pt, full_desc_en, full_desc_pt,
			   features_en, features_pt, tech, link, created_at, updated_at
		FROM projects
		ORDER BY created_at DESC
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var projects []models.Project
	for rows.Next() {
		var p models.Project
		var statusText, statusColor string
		var titleEn, titlePt, shortDescEn, shortDescPt string
		var fullDescEn, fullDescPt *string
		var featuresEn, featuresPt, tech []string

		err := rows.Scan(
			&p.ID, &statusText, &statusColor, &p.Image,
			&titleEn, &titlePt, &shortDescEn, &shortDescPt,
			&fullDescEn, &fullDescPt, &featuresEn, &featuresPt,
			&tech, &p.Link, &p.CreatedAt, &p.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}

		p.Status = models.Status{Text: statusText, Color: statusColor}
		p.Title = models.LocalizedText{En: titleEn, Pt: titlePt}
		p.ShortDescription = models.LocalizedText{En: shortDescEn, Pt: shortDescPt}

		fullEn, fullPt := "", ""
		if fullDescEn != nil {
			fullEn = *fullDescEn
		}
		if fullDescPt != nil {
			fullPt = *fullDescPt
		}
		p.FullDescription = models.LocalizedText{En: fullEn, Pt: fullPt}
		p.Features = models.LocalizedList{En: featuresEn, Pt: featuresPt}
		p.Tech = tech

		projects = append(projects, p)
	}

	return projects, nil
}

// GetByID returns a project by ID
func (r *ProjectRepository) GetByID(ctx context.Context, id int) (*models.Project, error) {
	var p models.Project
	var statusText, statusColor string
	var titleEn, titlePt, shortDescEn, shortDescPt string
	var fullDescEn, fullDescPt *string
	var featuresEn, featuresPt, tech []string

	err := database.Pool.QueryRow(ctx, `
		SELECT id, status_text, status_color, image, title_en, title_pt, 
			   short_desc_en, short_desc_pt, full_desc_en, full_desc_pt,
			   features_en, features_pt, tech, link, created_at, updated_at
		FROM projects WHERE id = $1
	`, id).Scan(
		&p.ID, &statusText, &statusColor, &p.Image,
		&titleEn, &titlePt, &shortDescEn, &shortDescPt,
		&fullDescEn, &fullDescPt, &featuresEn, &featuresPt,
		&tech, &p.Link, &p.CreatedAt, &p.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}

	p.Status = models.Status{Text: statusText, Color: statusColor}
	p.Title = models.LocalizedText{En: titleEn, Pt: titlePt}
	p.ShortDescription = models.LocalizedText{En: shortDescEn, Pt: shortDescPt}

	fullEn, fullPt := "", ""
	if fullDescEn != nil {
		fullEn = *fullDescEn
	}
	if fullDescPt != nil {
		fullPt = *fullDescPt
	}
	p.FullDescription = models.LocalizedText{En: fullEn, Pt: fullPt}
	p.Features = models.LocalizedList{En: featuresEn, Pt: featuresPt}
	p.Tech = tech

	return &p, nil
}

// Create creates a new project
func (r *ProjectRepository) Create(ctx context.Context, input models.CreateProjectInput) (*models.Project, error) {
	var id int
	var createdAt, updatedAt time.Time

	err := database.Pool.QueryRow(ctx, `
		INSERT INTO projects (status_text, status_color, image, title_en, title_pt,
			short_desc_en, short_desc_pt, full_desc_en, full_desc_pt,
			features_en, features_pt, tech, link)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
		RETURNING id, created_at, updated_at
	`,
		input.StatusText, input.StatusColor, input.Image,
		input.TitleEn, input.TitlePt, input.ShortDescEn, input.ShortDescPt,
		input.FullDescEn, input.FullDescPt, input.FeaturesEn, input.FeaturesPt,
		input.Tech, input.Link,
	).Scan(&id, &createdAt, &updatedAt)

	if err != nil {
		return nil, err
	}

	return &models.Project{
		ID:               id,
		Status:           models.Status{Text: input.StatusText, Color: input.StatusColor},
		Image:            input.Image,
		Title:            models.LocalizedText{En: input.TitleEn, Pt: input.TitlePt},
		ShortDescription: models.LocalizedText{En: input.ShortDescEn, Pt: input.ShortDescPt},
		FullDescription:  models.LocalizedText{En: input.FullDescEn, Pt: input.FullDescPt},
		Features:         models.LocalizedList{En: input.FeaturesEn, Pt: input.FeaturesPt},
		Tech:             input.Tech,
		Link:             input.Link,
		CreatedAt:        createdAt,
		UpdatedAt:        updatedAt,
	}, nil
}

// Update updates a project
func (r *ProjectRepository) Update(ctx context.Context, id int, input models.CreateProjectInput) (*models.Project, error) {
	var updatedAt time.Time

	err := database.Pool.QueryRow(ctx, `
		UPDATE projects SET 
			status_text = $2, status_color = $3, image = $4,
			title_en = $5, title_pt = $6, short_desc_en = $7, short_desc_pt = $8,
			full_desc_en = $9, full_desc_pt = $10, features_en = $11, features_pt = $12,
			tech = $13, link = $14, updated_at = NOW()
		WHERE id = $1
		RETURNING updated_at
	`,
		id, input.StatusText, input.StatusColor, input.Image,
		input.TitleEn, input.TitlePt, input.ShortDescEn, input.ShortDescPt,
		input.FullDescEn, input.FullDescPt, input.FeaturesEn, input.FeaturesPt,
		input.Tech, input.Link,
	).Scan(&updatedAt)

	if err != nil {
		return nil, err
	}

	return r.GetByID(ctx, id)
}

// Delete deletes a project
func (r *ProjectRepository) Delete(ctx context.Context, id int) error {
	_, err := database.Pool.Exec(ctx, "DELETE FROM projects WHERE id = $1", id)
	return err
}
