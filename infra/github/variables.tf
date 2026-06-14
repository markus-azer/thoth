variable "owner" { type = string }
variable "repo_name" { type = string }
variable "description" { type = string }

variable "visibility" {
  type        = string
  description = "public or private"
}

variable "required_status_checks" {
  type        = list(string)
  description = "CI job names that must pass before merging into main."
  default     = []
}
