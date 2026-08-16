# Signs the JWTs.
resource "random_password" "better_auth" {
  length  = 40
  special = false # avoid colliding with Railway's ${{}} syntax
}
