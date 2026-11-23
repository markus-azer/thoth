---

name: new-genui-component
description: Add a component the agent can use in a reply. Use when the user asks to "add a genui component", "new generated UI component", or "let the agent show a [thing]".
---

# New Genui Component

`[name]` is lowercase (`link`). `[Name]` is PascalCase (`Link`). `[NAME]` is for rule IDs (`LINK`).

## Ask

1. Name, and what it shows.
2. Props, with a limit for each.
3. Whether it can sit inside a `Stack`.

## Steps

**Definition** (`packages/genui/src/components/[name].ts`)

- `defineComponent` with `name`, `description`, `props`, `component: null`. The prompt is built from the `description`.
- Each limit is a named exported constant with a message the model can act on.

**Library** (`packages/genui/src/components/index.ts`)

- Export it.
- Inside a `Stack`: add it to `CONTENT_COMPONENTS` in `content.ts`. Otherwise add it to `GENUI_COMPONENTS`.

**Spec** (`packages/genui/spec/components/[name].md`)

- One rule per limit, with the real number. IDs are `RULE-[NAME]-001`.

**Test** (`packages/genui/test/components/[name].test.ts`)

- One test per rule, titled with the rule text. Build inputs from the exported limits.

**Renderer** (`apps/web/src/features/chat/genui/components/[name].tsx`)

- Export `[Name]Renderer`, built with `withRenderer([Name], ...)`.
- Add it to `genui/library.ts`. Without a renderer the component shows nothing.
- Clickable components read `interactive` from `GenuiContext` and call `useTriggerAction`.

Then run `pnpm test`. The git hooks skip tests.

## Reference

`suggestions` in each of the paths above.
