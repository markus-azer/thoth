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
