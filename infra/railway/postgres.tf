resource "random_password" "postgres" {
  length  = 40
  special = false # URL-safe inside DATABASE_URL
}

resource "railway_service" "postgres" {
  name         = "Postgres"
  project_id   = railway_project.main.id
  source_image = "ghcr.io/railwayapp-templates/postgres-ssl:16"

  volume = {
    name       = "postgres-data"
    mount_path = "/var/lib/postgresql/data"
  }
}

resource "railway_variable_collection" "postgres" {
  environment_id = local.environment_id
  service_id     = railway_service.postgres.id
  variables      = [for name, value in local.postgres_env : { name = name, value = value }]
}
