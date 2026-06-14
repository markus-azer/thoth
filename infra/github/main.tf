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
}

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
