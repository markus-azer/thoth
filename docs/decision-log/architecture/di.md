---
title: Inversify for dependency injection
status: accepted
date: 2026-07-08
related: [lifecycle, http-framework]
---

# Inversify for dependency injection

Inversify was adopted to wire services in `apps/api`. Classes use `@injectable()` + constructor `@inject(Token)`. `main.ts` resolves them from a container built in `src/di/index.ts`.

Why: manual wiring in `main.ts` grows quadratically and hides who depends on whom. Service locators hide dependencies at call sites. Constructor injection keeps the graph visible per class. Needs `experimentalDecorators` + `emitDecoratorMetadata` — both already on at base.
