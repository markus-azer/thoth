locals {
  environment_id = railway_project.main.default_environment.id

  postgres_env = {
    PGDATA            = "/var/lib/postgresql/data/pgdata"
    POSTGRES_USER     = var.db.name
    POSTGRES_PASSWORD = random_password.postgres.result
    POSTGRES_DB       = var.db.name
    DATABASE_URL      = "postgresql://${var.db.name}:${random_password.postgres.result}@$${{RAILWAY_PRIVATE_DOMAIN}}:5432/${var.db.name}"
  }

  api_env = {
    PORT         = tostring(var.api.port)
    METRICS_PORT = "9090"
    LOG_LEVEL    = "info"
    OTEL_ENABLED = "false"
    CORS_ORIGINS = "https://$${{RAILWAY_PUBLIC_DOMAIN}}"
    DATABASE_URL = "$${{Postgres.DATABASE_URL}}"
  }

  # service name -> its SQL dir. Add a line to onboard another service.
  migrations = {
    api = "apps/api/sql"
  }
}
