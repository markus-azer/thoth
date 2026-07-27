resource "railway_service" "api" {
  name               = "api"
  project_id         = railway_project.main.id
  source_repo        = var.project.repo
  source_repo_branch = var.project.branch
  config_path        = "railway.toml"
}

resource "railway_variable_collection" "api" {
  environment_id = local.environment_id
  service_id     = railway_service.api.id

  variables = [for name, value in local.api_env : { name = name, value = value }]
}

resource "railway_custom_domain" "api" {
  count          = var.api.domain == null ? 0 : 1
  environment_id = local.environment_id
  service_id     = railway_service.api.id
  domain         = var.api.domain
  target_port    = var.api.port
}
