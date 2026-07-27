# One-shot Flyway jobs, run `flyway migrate` in the private network.
resource "railway_service" "migrate" {
  for_each           = local.migrations
  name               = "migrate-${each.key}"
  project_id         = railway_project.main.id
  source_repo        = var.project.repo
  source_repo_branch = var.project.branch
  config_path        = "flyway/railway.toml"
}

resource "railway_variable_collection" "migrate" {
  for_each       = local.migrations
  environment_id = local.environment_id
  service_id     = railway_service.migrate[each.key].id
  variables = [for name, value in {
    MIGRATIONS      = each.value
    FLYWAY_URL      = "jdbc:postgresql://$${{Postgres.RAILWAY_PRIVATE_DOMAIN}}:5432/${var.db.name}"
    FLYWAY_USER     = var.db.name
    FLYWAY_PASSWORD = "$${{Postgres.POSTGRES_PASSWORD}}"
  } : { name = name, value = value }]
}
