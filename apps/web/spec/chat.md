---
title: Chat
workspace: apps/web
status: current
related: [web]
---

# Chat

A visitor asks questions about the site owner. The agent answers from the owner's bio.


## Rules

- [RULE-CHAT-001] A visitor sends a long message → it is trimmed and cut to 500 characters.
- [RULE-CHAT-002] A visitor sends a blank message → nothing is sent.
- [RULE-CHAT-003] A visitor gets a reply → the conversation is saved in their browser, newest first.
- [RULE-CHAT-004] A visitor saved over 20 conversations → only the 20 newest are kept.
- [RULE-CHAT-005] The saved conversations can't be read → the visitor starts with none.
- [RULE-CHAT-006] A visitor starts a new chat → it gets an id of its own, in any browser.
