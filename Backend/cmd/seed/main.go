package main

import (
	"context"
	"fmt"
	"log"

	"github.com/afonsopaiva/portfolio-api/internal/config"
	"github.com/afonsopaiva/portfolio-api/internal/database"
	"github.com/afonsopaiva/portfolio-api/internal/models"
	"github.com/afonsopaiva/portfolio-api/internal/repository"
)

func main() {
	// Load configuration
	if err := config.Load(); err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	// Connect to database
	if err := database.Connect(config.AppConfig.DatabaseURL); err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer database.Close()

	// Run migrations first
	if err := database.RunMigrations(); err != nil {
		log.Fatalf("Failed to run migrations: %v", err)
	}

	ctx := context.Background()
	projectRepo := repository.NewProjectRepository()
	experienceRepo := repository.NewExperienceRepository()

	// Seed Projects
	fmt.Println("🌱 Seeding projects...")
	projects := []models.CreateProjectInput{
		{
			StatusText:  "COMPLETED",
			StatusColor: "green",
			Image:       "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=500&fit=crop",
			TitleEn:     "Distributed Payment Gateway",
			TitlePt:     "Gateway de Pagamento Distribuído",
			ShortDescEn: "High-throughput payment processing with eventual consistency.",
			ShortDescPt: "Processamento de pagamentos de alto throughput com consistência eventual.",
			FullDescEn:  "A high-throughput payment processing engine handling idempotency keys and eventual consistency across microservices. Built with Java and Spring Boot, using Kafka for message queuing and ensuring reliable transaction processing.",
			FullDescPt:  "Motor de processamento de pagamentos de alto throughput lidando com chaves de idempotência e consistência eventual entre microsserviços. Construído com Java e Spring Boot, usando Kafka para filas de mensagens e garantindo processamento confiável de transações.",
			FeaturesEn:  []string{"Idempotency key handling", "Event-driven architecture", "99.9% uptime SLA", "Real-time transaction monitoring"},
			FeaturesPt:  []string{"Tratamento de chaves de idempotência", "Arquitetura orientada a eventos", "SLA de 99.9% uptime", "Monitoramento de transações em tempo real"},
			Tech:        []string{"#Java", "#Spring_Boot", "#Kafka"},
			Link:        "https://github.com",
		},
		{
			StatusText:  "ONGOING",
			StatusColor: "yellow",
			Image:       "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop",
			TitleEn:     "Real-time Analytics Pipeline",
			TitlePt:     "Pipeline de Analytics Real-time",
			ShortDescEn: "Log ingestion via gRPC with ElasticSearch indexing.",
			ShortDescPt: "Ingestão de logs via gRPC com indexação no ElasticSearch.",
			FullDescEn:  "Ingests terabytes of logs via gRPC, processes with Go workers, and indexes into ElasticSearch for instant querying. Handles massive data volumes with horizontal scaling capabilities.",
			FullDescPt:  "Ingere terabytes de logs via gRPC, processa com workers em Go e indexa no ElasticSearch para consultas instantâneas. Lida com volumes massivos de dados com capacidades de escalonamento horizontal.",
			FeaturesEn:  []string{"Horizontal scaling", "Real-time data processing", "Custom dashboards", "Alert system integration"},
			FeaturesPt:  []string{"Escalonamento horizontal", "Processamento de dados em tempo real", "Dashboards customizados", "Integração com sistema de alertas"},
			Tech:        []string{"#Golang", "#gRPC", "#Elastic"},
			Link:        "https://github.com",
		},
		{
			StatusText:  "PLANNING",
			StatusColor: "grey",
			Image:       "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=800&h=500&fit=crop",
			TitleEn:     "Infrastructure as Code CLI",
			TitlePt:     "CLI de Infra como Código",
			ShortDescEn: "CLI tool for AWS ECS deployments and Terraform management.",
			ShortDescPt: "Ferramenta CLI para deploys AWS ECS e gerenciamento Terraform.",
			FullDescEn:  "A custom CLI tool written in Rust to automate AWS ECS deployments and manage Terraform state files securely. Provides a streamlined workflow for infrastructure provisioning.",
			FullDescPt:  "Uma ferramenta CLI customizada em Rust para automatizar deploys no AWS ECS e gerenciar arquivos de estado do Terraform com segurança. Fornece um fluxo de trabalho simplificado para provisionamento de infraestrutura.",
			FeaturesEn:  []string{"Automated deployments", "State file encryption", "Multi-environment support", "Rollback capabilities"},
			FeaturesPt:  []string{"Deploys automatizados", "Criptografia de arquivos de estado", "Suporte multi-ambiente", "Capacidades de rollback"},
			Tech:        []string{"#Rust", "#AWS", "#Terraform"},
			Link:        "https://github.com",
		},
	}

	for _, p := range projects {
		project, err := projectRepo.Create(ctx, p)
		if err != nil {
			log.Printf("Failed to create project %s: %v", p.TitleEn, err)
		} else {
			fmt.Printf("  ✓ Created project: %s (ID: %d)\n", project.Title.En, project.ID)
		}
	}

	// Seed Experiences
	fmt.Println("\n🌱 Seeding experiences...")
	experiences := []models.CreateExperienceInput{
		{
			Logo:          "https://ui-avatars.com/api/?name=TC&background=00ff9d&color=000&size=96&bold=true",
			CompanyEn:     "TechCorp Solutions",
			CompanyPt:     "TechCorp Solutions",
			RoleEn:        "Senior Backend Engineer",
			RolePt:        "Engenheiro Backend Sênior",
			PeriodEn:      "2022 - Present",
			PeriodPt:      "2022 - Presente",
			DescriptionEn: "Leading development of high-performance microservices architecture, optimizing system throughput by 40% and reducing latency to sub-100ms.",
			DescriptionPt: "Liderando o desenvolvimento de arquitetura de microsserviços de alta performance, otimizando throughput do sistema em 40% e reduzindo latência para sub-100ms.",
			Tech:          []string{"#Java", "#Spring_Boot", "#Kubernetes", "#AWS"},
			Achievements: []models.Achievement{
				{En: "Architected event-driven systems handling 1M+ daily transactions", Pt: "Arquitetou sistemas orientados a eventos lidando com 1M+ transações diárias"},
				{En: "Implemented CI/CD pipelines reducing deployment time by 60%", Pt: "Implementou pipelines CI/CD reduzindo tempo de deploy em 60%"},
			},
		},
		{
			Logo:          "https://ui-avatars.com/api/?name=DF&background=bd00ff&color=fff&size=96&bold=true",
			CompanyEn:     "DataFlow Systems",
			CompanyPt:     "DataFlow Systems",
			RoleEn:        "Backend Developer",
			RolePt:        "Desenvolvedor Backend",
			PeriodEn:      "2020 - 2022",
			PeriodPt:      "2020 - 2022",
			DescriptionEn: "Developed real-time data processing pipelines and REST APIs serving 500K+ users with 99.9% uptime.",
			DescriptionPt: "Desenvolveu pipelines de processamento de dados em tempo real e APIs REST servindo 500K+ usuários com 99.9% de uptime.",
			Tech:          []string{"#Golang", "#PostgreSQL", "#Redis", "#Docker"},
			Achievements: []models.Achievement{
				{En: "Built scalable API gateway handling 10K RPS", Pt: "Construiu gateway de API escalável lidando com 10K RPS"},
				{En: "Optimized database queries improving response time by 70%", Pt: "Otimizou queries de banco de dados melhorando tempo de resposta em 70%"},
			},
		},
		{
			Logo:          "https://ui-avatars.com/api/?name=SX&background=ff9900&color=000&size=96&bold=true",
			CompanyEn:     "StartupXYZ",
			CompanyPt:     "StartupXYZ",
			RoleEn:        "Full Stack Developer",
			RolePt:        "Desenvolvedor Full Stack",
			PeriodEn:      "2018 - 2020",
			PeriodPt:      "2018 - 2020",
			DescriptionEn: "Built MVP from scratch, implementing both frontend and backend components for a SaaS platform.",
			DescriptionPt: "Construiu MVP do zero, implementando componentes frontend e backend para uma plataforma SaaS.",
			Tech:          []string{"#Node.js", "#React", "#MongoDB", "#Express"},
			Achievements: []models.Achievement{
				{En: "Launched product serving 50K+ users within 6 months", Pt: "Lançou produto servindo 50K+ usuários em 6 meses"},
				{En: "Implemented real-time features using WebSockets", Pt: "Implementou funcionalidades em tempo real usando WebSockets"},
			},
		},
	}

	for _, e := range experiences {
		exp, err := experienceRepo.Create(ctx, e)
		if err != nil {
			log.Printf("Failed to create experience %s: %v", e.CompanyEn, err)
		} else {
			fmt.Printf("  ✓ Created experience: %s (ID: %d)\n", exp.Company.En, exp.ID)
		}
	}

	fmt.Println("\n✅ Database seeded successfully!")
}
