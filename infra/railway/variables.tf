variable "project" {
  type = object({
    name   = string
    repo   = string
    branch = string
  })
}

variable "db" {
  type = object({
    name = string
  })
}

variable "api" {
  type = object({
    port   = number
    domain = string # null for the free *.up.railway.app URL
  })
}

# The GitHub OAuth app thoth federates login to.
variable "github" {
  type = object({
    client_id     = string
    client_secret = string
  })
  sensitive = true
}
