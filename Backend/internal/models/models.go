package models

import (
	"time"
)

// LocalizedText represents text in multiple languages
type LocalizedText struct {
	En string `json:"en"`
	Pt string `json:"pt"`
}

// Status represents project status
type Status struct {
	Text  string `json:"text"`
	Color string `json:"color"`
}

// Project represents a portfolio project
type Project struct {
	ID               int           `json:"id"`
	Status           Status        `json:"status"`
	Image            string        `json:"image"`
	Title            LocalizedText `json:"title"`
	ShortDescription LocalizedText `json:"shortDescription"`
	FullDescription  LocalizedText `json:"fullDescription"`
	Features         LocalizedList `json:"features"`
	Tech             []string      `json:"tech"`
	Link             string        `json:"link"`
	CreatedAt        time.Time     `json:"createdAt"`
	UpdatedAt        time.Time     `json:"updatedAt"`
}

// LocalizedList represents a list of items in multiple languages
type LocalizedList struct {
	En []string `json:"en"`
	Pt []string `json:"pt"`
}

// Achievement represents an experience achievement
type Achievement struct {
	En string `json:"en"`
	Pt string `json:"pt"`
}

// Experience represents work experience
type Experience struct {
	ID           int           `json:"id"`
	Logo         string        `json:"logo"`
	Company      LocalizedText `json:"company"`
	Role         LocalizedText `json:"role"`
	Period       LocalizedText `json:"period"`
	Description  LocalizedText `json:"description"`
	Tech         []string      `json:"tech"`
	Achievements []Achievement `json:"achievements"`
	CreatedAt    time.Time     `json:"createdAt"`
	UpdatedAt    time.Time     `json:"updatedAt"`
}

// ContactMessage represents a contact form submission
type ContactMessage struct {
	ID        int       `json:"id"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	Message   string    `json:"message"`
	Read      bool      `json:"read"`
	CreatedAt time.Time `json:"createdAt"`
}

// CreateProjectInput represents input for creating a project
type CreateProjectInput struct {
	StatusText  string   `json:"statusText" binding:"required"`
	StatusColor string   `json:"statusColor" binding:"required"`
	Image       string   `json:"image" binding:"required"`
	TitleEn     string   `json:"titleEn" binding:"required"`
	TitlePt     string   `json:"titlePt" binding:"required"`
	ShortDescEn string   `json:"shortDescEn" binding:"required"`
	ShortDescPt string   `json:"shortDescPt" binding:"required"`
	FullDescEn  string   `json:"fullDescEn"`
	FullDescPt  string   `json:"fullDescPt"`
	FeaturesEn  []string `json:"featuresEn"`
	FeaturesPt  []string `json:"featuresPt"`
	Tech        []string `json:"tech" binding:"required"`
	Link        string   `json:"link"`
}

// CreateExperienceInput represents input for creating experience
type CreateExperienceInput struct {
	Logo          string        `json:"logo"`
	CompanyEn     string        `json:"companyEn" binding:"required"`
	CompanyPt     string        `json:"companyPt" binding:"required"`
	RoleEn        string        `json:"roleEn" binding:"required"`
	RolePt        string        `json:"rolePt" binding:"required"`
	PeriodEn      string        `json:"periodEn" binding:"required"`
	PeriodPt      string        `json:"periodPt" binding:"required"`
	DescriptionEn string        `json:"descriptionEn" binding:"required"`
	DescriptionPt string        `json:"descriptionPt" binding:"required"`
	Tech          []string      `json:"tech"`
	Achievements  []Achievement `json:"achievements"`
}

// ContactInput represents input for contact form
type ContactInput struct {
	Name    string `json:"name" binding:"required"`
	Email   string `json:"email" binding:"required,email"`
	Message string `json:"message" binding:"required"`
}

// APIResponse represents a standard API response
type APIResponse struct {
	Success bool        `json:"success"`
	Message string      `json:"message,omitempty"`
	Data    interface{} `json:"data,omitempty"`
	Error   string      `json:"error,omitempty"`
}
