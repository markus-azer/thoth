---

name: new-genui-component
description: Add a component the agent can use in a reply. Use when the user asks to "add a genui component", "new generated UI component", or "let the agent show a [thing]".
---

# New Genui Component

`[name]` is lowercase (`link`). `[Name]` is PascalCase (`Link`). `[NAME]` is for rule IDs (`LINK`).

## Ask

1. Name, and what it shows.
2. Props.
3. The rules for each prop: count, length, format, required.

## Steps

**Definition** (`packages/genui/src/components/[name].ts`)

- `defineComponent` with `name`, `description`, `props`, `component: null`.
- The prompt is built from the `description`.
- Each numeric limit is a named exported constant.
- Every rule has a message the model can act on.

**Library** (`packages/genui/src/components/index.ts`)

- Export it.
- Add it to `CONTENT_COMPONENTS` in `content.ts`.
- `Stack` is the root and only holds that list. A component outside it is never used.

**Spec** (`packages/genui/spec/components/[name].md`)

- One rule per validation rule.
- Use the real number for a numeric bound.
- IDs are `RULE-[NAME]-001`.

**Test** (`packages/genui/test/components/[name].test.ts`)

- One test per rule, titled with the rule text.
- Build numeric inputs from the exported limits.

**Renderer** (`apps/web/src/features/chat/genui/components/[name].tsx`)

- Export `[Name]Renderer`, built with `withRenderer([Name], ...)`.
- Add it to `genui/library.ts`.
- Without a renderer the component shows nothing.
- A component that sends a chat message calls `useTriggerAction`.
- It also reads `interactive` from `GenuiContext`.

Then run `pnpm test`. The git hooks skip tests.

## Reference

`suggestions` in each of the paths above.
