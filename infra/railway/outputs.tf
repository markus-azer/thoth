output "api_url" {
  description = "Custom domain URL if set. The free Railway domain is in the dashboard."
  value       = var.api.domain != null ? "https://${var.api.domain}" : null
}
