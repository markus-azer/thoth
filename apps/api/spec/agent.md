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
- REPLIED. The agent returns a text reply.
- MODEL_UNAVAILABLE. The model call failed.


## Rules

- [RULE-AGENT-001] The agent can call the public tools on the thread owner's behalf.
- [RULE-AGENT-002] Private tools are never available to the agent.
- [RULE-AGENT-003] The owner's bio reaches the agent through tools, not the prompt.
- [RULE-AGENT-004] Tool failures and the five-round tool cap still end in REPLIED.
- [RULE-AGENT-005] A model that ignores the tool cap is stopped.
