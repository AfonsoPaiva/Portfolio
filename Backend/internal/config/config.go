package config

import (
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	Port                   string
	DatabaseURL            string
	APIKey                 string
	MailerSendAPIKey       string
	MailerSendFromName     string
	MailerSendFromEmail    string
	MailerSendToEmail      string
	AllowedOrigins         string
	MailerSendSendThankYou string
}

var AppConfig *Config

func Load() error {
	// Load .env file if it exists
	godotenv.Load()

	AppConfig = &Config{
		Port:                   getEnv("PORT", "8080"),
		DatabaseURL:            getEnv("DATABASE_URL", "postgresql://root@localhost:26257/portfolio?sslmode=disable"),
		APIKey:                 getEnv("API_KEY", ""),
		MailerSendAPIKey:       getEnv("MAILERSEND_API_KEY", ""),
		MailerSendFromName:     getEnv("MAILERSEND_FROM_NAME", "Portfolio Contact"),
		MailerSendFromEmail:    getEnv("MAILERSEND_FROM_EMAIL", ""),
		MailerSendToEmail:      getEnv("MAILERSEND_TO_EMAIL", ""),
		AllowedOrigins:         getEnv("ALLOWED_ORIGINS", "*"),
		MailerSendSendThankYou: getEnv("MAILERSEND_SEND_THANKYOU", "true"),
	}

	return nil
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
