# Railway

Provisions the Railway project and its services from a GitHub repo.

```sh
cp terraform.tfvars.example terraform.tfvars # set the required vars
export RAILWAY_TOKEN="<token>"               # provider reads it automatically
terraform init && terraform apply
```
