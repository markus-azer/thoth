variable "project" {
  type = object({
    name   = string
    repo   = string
    branch = string
  })
}
