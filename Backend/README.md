# Portfolio API

A Go-based REST API for the portfolio website, using CockroachDB for storage and gomail for email notifications.

## Features

- **Projects & Experience Management**: Full CRUD operations for portfolio content
- **Contact Form**: Stores messages and sends email notifications
- **API Key Protection**: Protected endpoints for admin operations
- **CockroachDB**: Distributed SQL database for reliable storage
- **Email Notifications**: Sends styled HTML emails for contact form submissions

## Prerequisites

- Go 1.21 or higher
- CockroachDB (local or cloud)
- SMTP server (Gmail, SendGrid, etc.)

## Quick Start

### 1. Install CockroachDB

```bash
# macOS
brew install cockroachdb/tap/cockroach

# Windows (download from https://www.cockroachlabs.com/docs/releases/)
# Or use Docker:
docker run -d --name=roach -p 26257:26257 -p 8080:8080 cockroachdb/cockroach:latest start-single-node --insecure
```

### 2. Start CockroachDB

```bash
# Start single-node cluster (development)
cockroach start-single-node --insecure --listen-addr=localhost:26257 --http-addr=localhost:8081

# Create the database
cockroach sql --insecure -e "CREATE DATABASE IF NOT EXISTS portfolio"
```

### 3. Configure Environment

```bash
# Copy example config
cp .env.example .env

# Edit .env with your settings
```

### 4. Install Dependencies

```bash
go mod download
```

### 5. Run the API

```bash
# Development
go run cmd/api/main.go

# Or build and run
go build -o portfolio-api cmd/api/main.go
./portfolio-api
```

### 6. Seed Initial Data

```bash
go run cmd/seed/main.go
```

## API Endpoints

### Public Endpoints (No Auth Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/health` | Health check |
| GET | `/api/v1/projects` | List all projects |
| GET | `/api/v1/projects/:id` | Get project by ID |
| GET | `/api/v1/experience` | List all experience |
| GET | `/api/v1/experience/:id` | Get experience by ID |
| POST | `/api/v1/contact` | Submit contact form |

### Protected Endpoints (API Key Required)

Include `X-API-Key: your-api-key` header or `Authorization: Bearer your-api-key`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/projects` | Create project |
| PUT | `/api/v1/projects/:id` | Update project |
| DELETE | `/api/v1/projects/:id` | Delete project |
| POST | `/api/v1/experience` | Create experience |
| PUT | `/api/v1/experience/:id` | Update experience |
| DELETE | `/api/v1/experience/:id` | Delete experience |
| GET | `/api/v1/messages` | List all messages |
| GET | `/api/v1/messages/unread` | List unread messages |
| GET | `/api/v1/messages/:id` | Get message by ID |
| PUT | `/api/v1/messages/:id/read` | Mark message as read |
| DELETE | `/api/v1/messages/:id` | Delete message |
| POST | `/api/v1/test-email` | Send test email |

## Example Requests

### Create a Project

```bash
curl -X POST http://localhost:8080/api/v1/projects \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-api-key" \
  -d '{
    "statusText": "COMPLETED",
    "statusColor": "green",
    "image": "https://example.com/image.jpg",
    "titleEn": "My Project",
    "titlePt": "Meu Projeto",
    "shortDescEn": "A great project",
    "shortDescPt": "Um ótimo projeto",
    "tech": ["#Go", "#React"],
    "link": "https://github.com/myproject"
  }'
```

### Submit Contact Form

```bash
curl -X POST http://localhost:8080/api/v1/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "message": "Hello! I would like to discuss a project."
  }'
```

### Get All Projects

```bash
curl http://localhost:8080/api/v1/projects
```

## Email Configuration

### Gmail Setup

1. Enable 2-Factor Authentication on your Google account
2. Generate an App Password: Google Account → Security → App Passwords
3. Use the app password in `SMTP_PASSWORD`

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=your-email@gmail.com
SMTP_TO=notification-recipient@example.com
```

### Other Providers

For SendGrid, Mailgun, etc., adjust the SMTP settings accordingly.

## Project Structure

```
Backend/
├── cmd/
│   ├── api/
│   │   └── main.go           # API server entry point
│   └── seed/
│       └── main.go           # Database seeder
├── internal/
│   ├── config/
│   │   └── config.go         # Configuration management
│   ├── database/
│   │   └── database.go       # Database connection & migrations
│   ├── handlers/
│   │   ├── project_handler.go
│   │   ├── experience_handler.go
│   │   └── contact_handler.go
│   ├── middleware/
│   │   └── auth.go           # API key authentication
│   ├── models/
│   │   └── models.go         # Data models
│   ├── repository/
│   │   ├── project_repository.go
│   │   ├── experience_repository.go
│   │   └── contact_repository.go
│   └── services/
│       └── email_service.go  # Email sending
├── .env.example
├── go.mod
├── Makefile
└── README.md
```

## License

MIT
