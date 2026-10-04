# @thoth/ui

shadcn/ui components and theme tokens, shared by the apps.

## Use it in an app

1. Import the tokens once, in the app's global CSS: `@import "@thoth/ui/globals.css";`
2. Import a component by name: `import { Button } from "@thoth/ui/components/button";`
3. Add `"@thoth/ui"` to `transpilePackages` in `next.config.ts`.

## Add or update a component

From the repo root:

1. `pnpm dlx shadcn@4.21.0 add <component> -c packages/ui`
2. `pnpm exec biome check --write packages/ui`

## Rules

- Do not edit `src/`. It is generated. To change a component, re-run step 1.
- Step 2 only fixes formatting and `import type`, so the files pass lint.
- Run the CLI with `pnpm dlx`. The copy in `node_modules` crashes on the workspace's zod override.

## TODO

- Recheck this package: generated vs owned files, theme tokens, dark mode.
