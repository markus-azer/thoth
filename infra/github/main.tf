resource "github_repository" "repo" {
  name        = var.repo_name
  description = var.description
  visibility  = var.visibility

  has_issues   = true
  has_projects = false
  has_wiki     = false

  allow_merge_commit          = false
  allow_rebase_merge          = false
  allow_squash_merge          = true
  squash_merge_commit_title   = "PR_TITLE"
  squash_merge_commit_message = "COMMIT_MESSAGES"

  delete_branch_on_merge = true
  allow_auto_merge       = true

  vulnerability_alerts = true

  # Free on public repos. Private requires GHAS.
  security_and_analysis {
    secret_scanning {
      status = "enabled"
    }
    secret_scanning_push_protection {
      status = "enabled"
    }
  }
}

resource "github_repository_dependabot_security_updates" "repo" {
  repository = github_repository.repo.name
  enabled    = true
}

# TODO: enable private vulnerability reporting via Terraform once provider supports it.
# Tracking: https://github.com/integrations/terraform-provider-github/pull/2969
# Until then, enable manually in repo Settings → Code security.

resource "github_branch_protection" "main" {
  repository_id = github_repository.repo.node_id
  pattern       = "main"

  required_linear_history         = true
  require_conversation_resolution = true
  require_signed_commits          = true

  required_status_checks {
    strict   = true
    contexts = var.required_status_checks
  }
}
