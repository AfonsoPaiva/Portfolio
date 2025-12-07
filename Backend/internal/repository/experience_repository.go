package repository

import (
	"context"
	"time"

	"github.com/afonsopaiva/portfolio-api/internal/database"
	"github.com/afonsopaiva/portfolio-api/internal/models"
)

// ExperienceRepository handles experience database operations
type ExperienceRepository struct{}

func NewExperienceRepository() *ExperienceRepository {
	return &ExperienceRepository{}
}

// GetAll returns all experiences
func (r *ExperienceRepository) GetAll(ctx context.Context) ([]models.Experience, error) {
	rows, err := database.Pool.Query(ctx, `
		SELECT id, logo, company_en, company_pt, role_en, role_pt,
			   period_en, period_pt, description_en, description_pt,
			   tech, achievements_en, achievements_pt, created_at, updated_at
		FROM experiences
		ORDER BY created_at DESC
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var experiences []models.Experience
	for rows.Next() {
		var e models.Experience
		var logo *string
		var companyEn, companyPt, roleEn, rolePt string
		var periodEn, periodPt, descEn, descPt string
		var tech, achievementsEn, achievementsPt []string

		err := rows.Scan(
			&e.ID, &logo, &companyEn, &companyPt, &roleEn, &rolePt,
			&periodEn, &periodPt, &descEn, &descPt,
			&tech, &achievementsEn, &achievementsPt,
			&e.CreatedAt, &e.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}

		if logo != nil {
			e.Logo = *logo
		}
		e.Company = models.LocalizedText{En: companyEn, Pt: companyPt}
		e.Role = models.LocalizedText{En: roleEn, Pt: rolePt}
		e.Period = models.LocalizedText{En: periodEn, Pt: periodPt}
		e.Description = models.LocalizedText{En: descEn, Pt: descPt}
		e.Tech = tech

		// Build achievements from parallel arrays
		achievements := make([]models.Achievement, 0)
		for i := 0; i < len(achievementsEn) && i < len(achievementsPt); i++ {
			achievements = append(achievements, models.Achievement{
				En: achievementsEn[i],
				Pt: achievementsPt[i],
			})
		}
		e.Achievements = achievements

		experiences = append(experiences, e)
	}

	return experiences, nil
}

// GetByID returns an experience by ID
func (r *ExperienceRepository) GetByID(ctx context.Context, id int) (*models.Experience, error) {
	var e models.Experience
	var logo *string
	var companyEn, companyPt, roleEn, rolePt string
	var periodEn, periodPt, descEn, descPt string
	var tech, achievementsEn, achievementsPt []string

	err := database.Pool.QueryRow(ctx, `
		SELECT id, logo, company_en, company_pt, role_en, role_pt,
			   period_en, period_pt, description_en, description_pt,
			   tech, achievements_en, achievements_pt, created_at, updated_at
		FROM experiences WHERE id = $1
	`, id).Scan(
		&e.ID, &logo, &companyEn, &companyPt, &roleEn, &rolePt,
		&periodEn, &periodPt, &descEn, &descPt,
		&tech, &achievementsEn, &achievementsPt,
		&e.CreatedAt, &e.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}

	if logo != nil {
		e.Logo = *logo
	}
	e.Company = models.LocalizedText{En: companyEn, Pt: companyPt}
	e.Role = models.LocalizedText{En: roleEn, Pt: rolePt}
	e.Period = models.LocalizedText{En: periodEn, Pt: periodPt}
	e.Description = models.LocalizedText{En: descEn, Pt: descPt}
	e.Tech = tech

	achievements := make([]models.Achievement, 0)
	for i := 0; i < len(achievementsEn) && i < len(achievementsPt); i++ {
		achievements = append(achievements, models.Achievement{
			En: achievementsEn[i],
			Pt: achievementsPt[i],
		})
	}
	e.Achievements = achievements

	return &e, nil
}

// Create creates a new experience
func (r *ExperienceRepository) Create(ctx context.Context, input models.CreateExperienceInput) (*models.Experience, error) {
	var id int
	var createdAt, updatedAt time.Time

	// Extract achievements into parallel arrays
	achievementsEn := make([]string, len(input.Achievements))
	achievementsPt := make([]string, len(input.Achievements))
	for i, a := range input.Achievements {
		achievementsEn[i] = a.En
		achievementsPt[i] = a.Pt
	}

	err := database.Pool.QueryRow(ctx, `
		INSERT INTO experiences (logo, company_en, company_pt, role_en, role_pt,
			period_en, period_pt, description_en, description_pt,
			tech, achievements_en, achievements_pt)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
		RETURNING id, created_at, updated_at
	`,
		input.Logo, input.CompanyEn, input.CompanyPt, input.RoleEn, input.RolePt,
		input.PeriodEn, input.PeriodPt, input.DescriptionEn, input.DescriptionPt,
		input.Tech, achievementsEn, achievementsPt,
	).Scan(&id, &createdAt, &updatedAt)

	if err != nil {
		return nil, err
	}

	return &models.Experience{
		ID:           id,
		Logo:         input.Logo,
		Company:      models.LocalizedText{En: input.CompanyEn, Pt: input.CompanyPt},
		Role:         models.LocalizedText{En: input.RoleEn, Pt: input.RolePt},
		Period:       models.LocalizedText{En: input.PeriodEn, Pt: input.PeriodPt},
		Description:  models.LocalizedText{En: input.DescriptionEn, Pt: input.DescriptionPt},
		Tech:         input.Tech,
		Achievements: input.Achievements,
		CreatedAt:    createdAt,
		UpdatedAt:    updatedAt,
	}, nil
}

// Update updates an experience
func (r *ExperienceRepository) Update(ctx context.Context, id int, input models.CreateExperienceInput) (*models.Experience, error) {
	achievementsEn := make([]string, len(input.Achievements))
	achievementsPt := make([]string, len(input.Achievements))
	for i, a := range input.Achievements {
		achievementsEn[i] = a.En
		achievementsPt[i] = a.Pt
	}

	_, err := database.Pool.Exec(ctx, `
		UPDATE experiences SET 
			logo = $2, company_en = $3, company_pt = $4, role_en = $5, role_pt = $6,
			period_en = $7, period_pt = $8, description_en = $9, description_pt = $10,
			tech = $11, achievements_en = $12, achievements_pt = $13, updated_at = NOW()
		WHERE id = $1
	`,
		id, input.Logo, input.CompanyEn, input.CompanyPt, input.RoleEn, input.RolePt,
		input.PeriodEn, input.PeriodPt, input.DescriptionEn, input.DescriptionPt,
		input.Tech, achievementsEn, achievementsPt,
	)

	if err != nil {
		return nil, err
	}

	return r.GetByID(ctx, id)
}

// Delete deletes an experience
func (r *ExperienceRepository) Delete(ctx context.Context, id int) error {
	_, err := database.Pool.Exec(ctx, "DELETE FROM experiences WHERE id = $1", id)
	return err
}
