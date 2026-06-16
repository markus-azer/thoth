---
title: Pinned versions
status: accepted
date: 2026-06-16
related: []
---

# Pinned versions

No floating versions. Every dependency is pinned.

| Dimension | Pin | Enforced by |
|---|---|---|
| Node | exact in `.nvmrc` | `.npmrc` `engine-strict=true` |
| pnpm | exact in `packageManager` | `.npmrc` `package-manager-strict=true` |
| npm packages | exact (no `^`, no `~`) | `.npmrc` `save-exact=true` + lockfile |
| GitHub Actions | SHA + `# vX.Y.Z` comment | zizmor in CI, applied locally by `pinact` |
| Terraform providers | exact in `required_providers` | Terraform |
| Docker images | pinned tag, never `:latest` | TODO — hadolint when first Dockerfile lands |

Why: surprise upstream breakage is the costliest CI failure. Pinning makes upgrades intentional and reviewable through Dependabot PRs.
