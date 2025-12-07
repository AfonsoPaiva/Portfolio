.PHONY: run build seed test clean

# Variables
BINARY_NAME=portfolio-api
SEED_BINARY=seed

# Development
run:
	go run cmd/api/main.go

# Build
build:
	go build -o bin/$(BINARY_NAME) cmd/api/main.go
	go build -o bin/$(SEED_BINARY) cmd/seed/main.go

# Seed database
seed:
	go run cmd/seed/main.go

# Install dependencies
deps:
	go mod download
	go mod tidy

# Clean build artifacts
clean:
	rm -rf bin/

# Run tests
test:
	go test -v ./...

# Lint
lint:
	golangci-lint run

# Database (CockroachDB)
db-start:
	cockroach start-single-node --insecure --listen-addr=localhost:26257 --http-addr=localhost:8081 --background

db-stop:
	cockroach quit --insecure

db-create:
	cockroach sql --insecure -e "CREATE DATABASE IF NOT EXISTS portfolio"

db-shell:
	cockroach sql --insecure --database=portfolio

# Docker CockroachDB
docker-db-start:
	docker run -d --name=portfolio-roach -p 26257:26257 -p 8081:8080 cockroachdb/cockroach:latest start-single-node --insecure
	@echo "Waiting for CockroachDB to start..."
	@sleep 5
	docker exec -it portfolio-roach ./cockroach sql --insecure -e "CREATE DATABASE IF NOT EXISTS portfolio"

docker-db-stop:
	docker stop portfolio-roach
	docker rm portfolio-roach

# All-in-one for development
dev: docker-db-start deps seed run
