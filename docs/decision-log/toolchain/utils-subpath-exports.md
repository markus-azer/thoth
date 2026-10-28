---
title: Subpath exports for @thoth/utils
status: accepted
date: 2026-10-28
related: [workspace-packages, tsup]
---

# Subpath exports for @thoth/utils

Each module is imported from its own subpath, such as `@thoth/utils/zod`. There is no root import.

The reason: the root barrel pulled pino into every importer. Browser code that only needed `z` failed to bundle.

Rejected:

- Moving only the logger out of the root. The next server-only dependency brings the problem back.
- A separate package for `z`. It adds a package for one re-export.
- `zod` directly in web. It gives two sources of `z`.
- Tree shaking the barrel. The bundler behavior was not verified.

Why: no import pulls in dependencies it does not use.
