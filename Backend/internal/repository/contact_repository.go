package repository

import (
	"context"

	"github.com/afonsopaiva/portfolio-api/internal/database"
	"github.com/afonsopaiva/portfolio-api/internal/models"
)

// ContactRepository handles contact message database operations
type ContactRepository struct{}

func NewContactRepository() *ContactRepository {
	return &ContactRepository{}
}

// GetAll returns all contact messages
func (r *ContactRepository) GetAll(ctx context.Context) ([]models.ContactMessage, error) {
	rows, err := database.Pool.Query(ctx, `
		SELECT id, name, email, message, read, created_at
		FROM contact_messages
		ORDER BY created_at DESC
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var messages []models.ContactMessage
	for rows.Next() {
		var m models.ContactMessage
		err := rows.Scan(&m.ID, &m.Name, &m.Email, &m.Message, &m.Read, &m.CreatedAt)
		if err != nil {
			return nil, err
		}
		messages = append(messages, m)
	}

	return messages, nil
}

// GetUnread returns all unread contact messages
func (r *ContactRepository) GetUnread(ctx context.Context) ([]models.ContactMessage, error) {
	rows, err := database.Pool.Query(ctx, `
		SELECT id, name, email, message, read, created_at
		FROM contact_messages
		WHERE read = FALSE
		ORDER BY created_at DESC
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var messages []models.ContactMessage
	for rows.Next() {
		var m models.ContactMessage
		err := rows.Scan(&m.ID, &m.Name, &m.Email, &m.Message, &m.Read, &m.CreatedAt)
		if err != nil {
			return nil, err
		}
		messages = append(messages, m)
	}

	return messages, nil
}

// GetByID returns a contact message by ID
func (r *ContactRepository) GetByID(ctx context.Context, id int) (*models.ContactMessage, error) {
	var m models.ContactMessage
	err := database.Pool.QueryRow(ctx, `
		SELECT id, name, email, message, read, created_at
		FROM contact_messages WHERE id = $1
	`, id).Scan(&m.ID, &m.Name, &m.Email, &m.Message, &m.Read, &m.CreatedAt)
	if err != nil {
		return nil, err
	}
	return &m, nil
}

// Create creates a new contact message
func (r *ContactRepository) Create(ctx context.Context, input models.ContactInput) (*models.ContactMessage, error) {
	var m models.ContactMessage
	err := database.Pool.QueryRow(ctx, `
		INSERT INTO contact_messages (name, email, message)
		VALUES ($1, $2, $3)
		RETURNING id, name, email, message, read, created_at
	`, input.Name, input.Email, input.Message).Scan(
		&m.ID, &m.Name, &m.Email, &m.Message, &m.Read, &m.CreatedAt,
	)
	if err != nil {
		return nil, err
	}
	return &m, nil
}

// MarkAsRead marks a message as read
func (r *ContactRepository) MarkAsRead(ctx context.Context, id int) error {
	_, err := database.Pool.Exec(ctx, "UPDATE contact_messages SET read = TRUE WHERE id = $1", id)
	return err
}

// Delete deletes a contact message
func (r *ContactRepository) Delete(ctx context.Context, id int) error {
	_, err := database.Pool.Exec(ctx, "DELETE FROM contact_messages WHERE id = $1", id)
	return err
}
