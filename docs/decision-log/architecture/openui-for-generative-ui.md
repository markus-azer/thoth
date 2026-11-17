---

title: OpenUI for generative UI
status: accepted
date: 2026-11-17
related: []
---

# OpenUI for generative UI

OpenUI was adopted so chat replies could carry small UI. The model wrote an OpenUI Lang program, and the web app rendered it.

The deciding reason was a single definition. Components were declared once as zod schemas, and that one declaration built the prompt, checked the program and drove the renderer.

OpenUI Lang is line based, so a program could render while it streamed. The parser and renderer are open source and ran without a hosted service.

The cost was that the parser did not enforce schema limits such as counts, lengths and https. The API had to check them itself.

Why: one schema for prompt, validation and rendering, with streaming and no vendor required.
