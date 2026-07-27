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
    port      = number
    subdomain = string
    domain    = string # null for the free *.up.railway.app URL
  })
}
