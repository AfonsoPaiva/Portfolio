package config

import (
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	Port                string
	DatabaseURL         string
	APIKey              string
	MailgunAPIKey       string
	MailgunDomain       string
	MailgunFromName     string
	MailgunFromEmail    string
	MailgunToEmail      string
	MailgunSendThankYou string
	AllowedOrigins      string
}

var AppConfig *Config

func Load() error {
	// Load .env file if it exists
	godotenv.Load()

	AppConfig = &Config{
		Port:                getEnv("PORT", "8080"),
		DatabaseURL:         getEnv("DATABASE_URL", "postgresql://root@localhost:26257/portfolio?sslmode=disable"),
		APIKey:              getEnv("API_KEY", ""),
		MailgunAPIKey:       getEnv("MAILGUN_API_KEY", ""),
		MailgunDomain:       getEnv("MAILGUN_DOMAIN", ""),
		MailgunFromName:     getEnv("MAILGUN_FROM_NAME", "Portfolio Contact"),
		MailgunFromEmail:    getEnv("MAILGUN_FROM_EMAIL", ""),
		MailgunToEmail:      getEnv("MAILGUN_TO_EMAIL", ""),
		MailgunSendThankYou: getEnv("MAILGUN_SEND_THANKYOU", "true"),
		AllowedOrigins:      getEnv("ALLOWED_ORIGINS", "*"),
	}

	return nil
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
