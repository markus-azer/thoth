---
name: adding-ui-components
description: |
  Add or update a shadcn component in packages/ui. Use when the user asks to "add a ui component", "add a shadcn component", or "update the button".
---

# Adding ui components

Everything in `packages/ui/src/components` is generated. Do not edit it by hand.

## Steps

1. From the repo root, run the CLI with `pnpm dlx`:
   ```
   pnpm dlx shadcn@4.21.0 add <component> -c packages/ui
   ```
2. Fix formatting and `import type`:
   ```
   pnpm exec biome check --write packages/ui
   ```
3. Pin any dependency the CLI added to `packages/ui/package.json`. It writes carets.
4. Run `pnpm deadcode` and `pnpm typecheck`.

## Notes

- Use `pnpm dlx`, not the copy in `node_modules`. That copy crashes on the workspace's zod override.
- Step 2 changes only formatting and `import type`.
- To change a component, re-run step 1. Do not edit the output.
