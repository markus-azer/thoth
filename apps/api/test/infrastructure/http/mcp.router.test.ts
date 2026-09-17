import express from "express";
import request from "supertest";
import { describe, expect, it } from "vitest";
import type { McpRequestContext, McpTool } from "~/infrastructure/http/mcp";
import { McpRouter } from "~/infrastructure/http/routes/mcp.router";

const accept = "application/json, text/event-stream";
const initialize = {
	jsonrpc: "2.0",
	id: 1,
	method: "initialize",
	params: {
		protocolVersion: "2024-11-05",
		capabilities: {},
		clientInfo: { name: "test", version: "1.0" },
	},
};

// register() runs before JSON-RPC dispatch, so `initialize` alone triggers
// it. No `tools/call` needed.
const appWith = (tool: McpTool) => {
	const router = new McpRouter([tool]);
	const app = express();
	app.use(express.json());
	app.use("/mcp", router.routes);
	return app;
};

const capturingTool = () => {
	let captured: McpRequestContext | undefined;
	const tool: McpTool = {
		register: (_server, context) => {
			captured = context;
		},
	};
	return { tool, context: () => captured };
};

describe("McpRouter", () => {
	it("RULE-MCP-003: `:identifier`, when present, passes through to the public tool unchanged", async () => {
		const { tool, context } = capturingTool();

		const res = await request(appWith(tool))
			.post("/mcp/markus-azer")
			.set("Accept", accept)
			.send(initialize);

		expect(res.status).toBe(200);
		expect(context()?.identifier).toBe("markus-azer");
	});

	it("RULE-MCP-004: Bare `/mcp` → no `:identifier`", async () => {
		const { tool, context } = capturingTool();

		const res = await request(appWith(tool))
			.post("/mcp")
			.set("Accept", accept)
			.send(initialize);

		expect(res.status).toBe(200);
		expect(context()?.identifier).toBeUndefined();
	});

	it("RULE-MCP-005: Empty `:identifier` segment (`/mcp/`) → same as bare `/mcp`", async () => {
		const { tool, context } = capturingTool();

		const res = await request(appWith(tool))
			.post("/mcp/")
			.set("Accept", accept)
			.send(initialize);

		expect(res.status).toBe(200);
		expect(context()?.identifier).toBeUndefined();
	});

	it("passes through `res.locals.principal` as `context.principal`", async () => {
		const { tool, context } = capturingTool();
		const principal = { userId: "u1", scopes: [] };

		const router = new McpRouter([tool]);
		const app = express();
		app.use(express.json());
		app.use((_req, res, next) => {
			res.locals["principal"] = principal;
			next();
		});
		app.use("/mcp", router.routes);

		const res = await request(app)
			.post("/mcp")
			.set("Accept", accept)
			.send(initialize);

		expect(res.status).toBe(200);
		expect(context()?.principal).toEqual(principal);
	});
});
