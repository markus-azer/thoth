---

title: Agent
workspace: apps/api
status: current
related: [mcp, feedback, bio]
---

# Agent

The chat agent answers a visitor's message on behalf of the thread owner. It can call the public MCP tools in-process.

## Inputs

- `threadId` and `message`. The agent loads the thread, the owner's `handle` and the history itself.

## Outputs

Semantic states, not the literal HTTP response.

- REPLIED. The agent returns a text reply and, sometimes, a UI program.
- MODEL_UNAVAILABLE. The model call failed.

## Rules

- [RULE-AGENT-001] The agent can call the public tools on the thread owner's behalf.
- [RULE-AGENT-002] Private tools are never available to the agent.
- [RULE-AGENT-003] The owner's bio reaches the agent through tools, not the prompt.
- [RULE-AGENT-004] A tool failure still ends in REPLIED.
- [RULE-AGENT-005] A model that ignores the five-round tool cap is stopped.
- [RULE-AGENT-006] The model writes the UI as one program, or none when no UI helps.
- [RULE-AGENT-007] Written UI is checked and retried once with the problems.
- [RULE-AGENT-008] A UI that stays invalid is dropped and the reply is text only.
- [RULE-AGENT-009] A link must point to a URL in the answer.
