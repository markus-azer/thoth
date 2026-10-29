---

title: Subpath exports for @thoth/utils
status: accepted
date: 2026-10-28
related: [workspace-packages, tsup]
---

# Subpath exports for @thoth/utils

Each module was exposed as its own subpath, such as `@thoth/utils/zod`. The root import was removed.

The reason: the root barrel pulled pino into every importer. Browser code that only needed `z` failed to bundle.

Rejected:
- Moving only the logger out of the root. The next server-only dependency would bring the problem back.
- A separate package for `z`. It would add a package for one re-export.
- `zod` directly in web. It would give two sources of `z`.
- Tree shaking the barrel. The bundler behavior was not verified.

Why: no import pulls in dependencies it does not use.
