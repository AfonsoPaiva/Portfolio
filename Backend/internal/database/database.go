package database

import (
	"context"
	"fmt"
	"log"

	"github.com/jackc/pgx/v5/pgxpool"
)

var Pool *pgxpool.Pool

// Connect establishes a connection pool to CockroachDB
func Connect(databaseURL string) error {
	var err error
	Pool, err = pgxpool.New(context.Background(), databaseURL)
	if err != nil {
		return fmt.Errorf("unable to connect to database: %v", err)
	}

	// Test the connection
	if err := Pool.Ping(context.Background()); err != nil {
		return fmt.Errorf("unable to ping database: %v", err)
	}

	log.Println("✓ Connected to CockroachDB")
	return nil
}

// Close closes the database connection pool
func Close() {
	if Pool != nil {
		Pool.Close()
	}
}

// RunMigrations creates the necessary tables
func RunMigrations() error {
	ctx := context.Background()

	migrations := []string{
		// Projects table
		`CREATE TABLE IF NOT EXISTS projects (
			id SERIAL PRIMARY KEY,
			status_text VARCHAR(50) NOT NULL,
			status_color VARCHAR(20) NOT NULL,
			image TEXT NOT NULL,
			title_en TEXT NOT NULL,
			title_pt TEXT NOT NULL,
			short_desc_en TEXT NOT NULL,
			short_desc_pt TEXT NOT NULL,
			full_desc_en TEXT,
			full_desc_pt TEXT,
			features_en TEXT[], -- Array of strings
			features_pt TEXT[],
			tech TEXT[] NOT NULL,
			link TEXT,
			created_at TIMESTAMPTZ DEFAULT NOW(),
			updated_at TIMESTAMPTZ DEFAULT NOW()
		)`,

		// Experience table
		`CREATE TABLE IF NOT EXISTS experiences (
			id SERIAL PRIMARY KEY,
			logo TEXT,
			company_en VARCHAR(255) NOT NULL,
			company_pt VARCHAR(255) NOT NULL,
			role_en VARCHAR(255) NOT NULL,
			role_pt VARCHAR(255) NOT NULL,
			period_en VARCHAR(100) NOT NULL,
			period_pt VARCHAR(100) NOT NULL,
			description_en TEXT NOT NULL,
			description_pt TEXT NOT NULL,
			tech TEXT[],
			achievements_en TEXT[],
			achievements_pt TEXT[],
			created_at TIMESTAMPTZ DEFAULT NOW(),
			updated_at TIMESTAMPTZ DEFAULT NOW()
		)`,

		// Contact messages table
		`CREATE TABLE IF NOT EXISTS contact_messages (
			id SERIAL PRIMARY KEY,
			name VARCHAR(255) NOT NULL,
			email VARCHAR(255) NOT NULL,
			message TEXT NOT NULL,
			read BOOLEAN DEFAULT FALSE,
			created_at TIMESTAMPTZ DEFAULT NOW()
		)`,

		// Documentation table
		`CREATE TABLE IF NOT EXISTS documentation (
			id SERIAL PRIMARY KEY,
			slug VARCHAR(255) UNIQUE NOT NULL,
			title_en TEXT NOT NULL,
			title_pt TEXT NOT NULL,
			content_en TEXT NOT NULL,
			content_pt TEXT NOT NULL,
			category VARCHAR(100) NOT NULL,
			published BOOLEAN DEFAULT FALSE,
			display_order INT DEFAULT 0,
			created_at TIMESTAMPTZ DEFAULT NOW(),
			updated_at TIMESTAMPTZ DEFAULT NOW()
		)`,

		// Create indexes
		`CREATE INDEX IF NOT EXISTS idx_projects_created ON projects(created_at DESC)`,
		`CREATE INDEX IF NOT EXISTS idx_experiences_created ON experiences(created_at DESC)`,
		`CREATE INDEX IF NOT EXISTS idx_messages_created ON contact_messages(created_at DESC)`,
		`CREATE INDEX IF NOT EXISTS idx_messages_read ON contact_messages(read)`,
		`CREATE INDEX IF NOT EXISTS idx_docs_slug ON documentation(slug)`,
		`CREATE INDEX IF NOT EXISTS idx_docs_category ON documentation(category)`,
		`CREATE INDEX IF NOT EXISTS idx_docs_published ON documentation(published)`,
		`CREATE INDEX IF NOT EXISTS idx_docs_order ON documentation(display_order, created_at DESC)`,
	}

	for _, migration := range migrations {
		_, err := Pool.Exec(ctx, migration)
		if err != nil {
			return fmt.Errorf("migration error: %v", err)
		}
	}

	log.Println("✓ Database migrations completed")
	return nil
}
