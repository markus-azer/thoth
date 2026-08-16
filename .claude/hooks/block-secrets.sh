#!/usr/bin/env bash
# Block any tool from touching secret files. Greps the raw hook payload on
# stdin, so it catches Read(file_path), Bash(cat .env), git add .env, alike.

boundary='($|[^A-Za-z0-9_])'
secret_files="\\.env$boundary|\\.pem$boundary|\\.key$boundary|/secrets/|\\.tfstate$boundary|\\.tfvars$boundary"
safe_variants='(\.env\.(test|example|sample)|\.tfvars\.example)([^A-Za-z0-9]|$)'

# Drop the safe, conventionally-tracked variants before matching secrets.
if sed -E "s/$safe_variants/\3/g" | grep -qEi "$secret_files"; then
  echo 'Blocked: secret files (.env, *.pem, *.key, secrets/, *.tfstate, *.tfvars) are off-limits.' >&2
  exit 2
fi
