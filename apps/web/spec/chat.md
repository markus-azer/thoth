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
- [RULE-CHAT-007] A visitor sends their first message → a thread is started and they get the reply.
- [RULE-CHAT-008] A visitor sends a follow-up → it goes to the same thread.
- [RULE-CHAT-009] The thread is not found → the visitor is told and the next message starts a new thread.
- [RULE-CHAT-010] The agent fails or the network drops → the visitor is asked to try again.
- [RULE-CHAT-011] A thread is started → it is always for the configured site handle.
- [RULE-CHAT-012] A visitor sends a message → it shows in the chat at once and the input clears.
- [RULE-CHAT-013] The reply fails → the message returns to the input and the visitor is told.
- [RULE-CHAT-014] A visitor opens another chat while a reply is pending → the reply is saved in the chat it was asked in.
- [RULE-CHAT-015] A visitor sends a message → it is saved in their browser once the reply arrives.
