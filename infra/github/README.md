# GitHub Repo

Provisions the GitHub repo + branch protection.

```sh
cp terraform.tfvars.example terraform.tfvars

# auth — uncomment one
# export GITHUB_TOKEN=$(gh auth token)   # if logged in with gh
# export GITHUB_TOKEN=<pat>              # or a personal access token

terraform init && terraform apply
```
