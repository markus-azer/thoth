locals {
  environment_id = railway_project.main.default_environment.id

  postgres_env = {
    PGDATA            = "/var/lib/postgresql/data/pgdata"
    POSTGRES_USER     = var.db.name
    POSTGRES_PASSWORD = random_password.postgres.result
    POSTGRES_DB       = var.db.name
    DATABASE_URL      = "postgresql://${var.db.name}:${random_password.postgres.result}@$${{RAILWAY_PRIVATE_DOMAIN}}:5432/${var.db.name}"
  }
}
