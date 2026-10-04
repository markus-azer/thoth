# @thoth/ui

shadcn/ui components and theme tokens, shared by the apps.

## Use it in an app

1. Import the tokens once, in the app's global CSS: `@import "@thoth/ui/globals.css";`
2. Import a component by name: `import { Button } from "@thoth/ui/components/button";`
3. Add `"@thoth/ui"` to `transpilePackages` in `next.config.ts`.

## Components

Generated. To add or update one, use the `adding-ui-components` skill. Do not edit `src/components` by hand.

## TODO

- Recheck this package: generated vs owned files, theme tokens, dark mode.
