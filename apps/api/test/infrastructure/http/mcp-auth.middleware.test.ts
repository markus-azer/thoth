import express from "express";
import request from "supertest";
import { describe, expect, it, vi } from "vitest";
import { mcpAuthMiddleware } from "~/infrastructure/http/mcp-auth.middleware";

// Mirrors McpRouter: POST only, behind the `/mcp` prefix mount.
const routes = () => {
	const r = express.Router();
	const handle: express.RequestHandler = (_req, res) => {
		res.json({ ok: true, principal: res.locals["principal"] });
	};
	r.post("/", handle);
	r.post("/:identifier", handle);
	return r;
};

const app = (verify = vi.fn().mockResolvedValue(undefined)) => {
	const a = express();
	a.use(express.json());
	a.use(
		"/mcp",
		mcpAuthMiddleware(
			verify,
			new Set(["remember"]),
			"https://thoth/.well-known/oauth-protected-resource",
		),
		routes(),
	);
	return a;
};

const call = (name: string) => ({
	jsonrpc: "2.0",
	id: 1,
	method: "tools/call",
	params: { name },
});

describe("mcpAuthMiddleware", () => {
	it("lets a public tool call through with no token", async () => {
		const server = app();
		const body = call("ask");

		const res = await request(server).post("/mcp").send(body);

		expect(res.status).toBe(200);
	});

	it("RULE-MCP-010: A request with no tool call → no gate", async () => {
		const verify = vi.fn();
		const server = app(verify);

		const res = await request(server).post("/mcp");

		expect(res.status).toBe(200);
		expect(verify).not.toHaveBeenCalled();
	});

	// The verb that crashed in production. No route serves it, so the 404 is
	// Express falling through the POST-only router.
	it("does not gate or crash on a bodyless GET", async () => {
		const verify = vi.fn();
		const server = app(verify);

		const res = await request(server).get("/mcp");

		expect(res.status).toBe(404);
		expect(verify).not.toHaveBeenCalled();
	});

	it("RULE-MCP-011: A malformed message in a batch → skipped, the rest still gate", async () => {
		const server = app();
		const body = [null, "nope", call("remember")];

		const res = await request(server).post("/mcp").send(body);

		expect(res.status).toBe(401);
	});

	it("RULE-MCP-007: A private tool call on bare `/mcp`, no valid bearer → 401", async () => {
		const server = app();
		const body = call("remember");

		const res = await request(server).post("/mcp").send(body);

		expect(res.status).toBe(401);
		expect(res.headers["www-authenticate"]).toContain("Bearer");
	});

	it("401s a batch that hides a private tool call", async () => {
		const server = app();
		const body = [call("ask"), call("remember")];

		const res = await request(server).post("/mcp").send(body);

		expect(res.status).toBe(401);
	});

	it("lets a batch of only public tool calls through", async () => {
		const server = app();
		const body = [call("ask"), call("about_project")];

		const res = await request(server).post("/mcp").send(body);

		expect(res.status).toBe(200);
	});

	it("RULE-MCP-008: A private tool call on bare `/mcp`, valid bearer → runs", async () => {
		const principal = { userId: "u1", scopes: [] };
		const verify = vi.fn().mockResolvedValue(principal);
		const server = app(verify);
		const body = call("remember");

		const res = await request(server)
			.post("/mcp")
			.set("authorization", "Bearer good")
			.send(body);

		expect(res.status).toBe(200);
		expect(res.body.principal).toEqual(principal);
		expect(verify).toHaveBeenCalledWith("good");
	});

	it("accepts a lowercase bearer scheme", async () => {
		const verify = vi.fn().mockResolvedValue({ userId: "u1", scopes: [] });
		const server = app(verify);
		const body = call("remember");

		const res = await request(server)
			.post("/mcp")
			.set("authorization", "bearer good")
			.send(body);

		expect(res.status).toBe(200);
		expect(verify).toHaveBeenCalledWith("good");
	});

	it("401s a private tool call when the token fails to verify", async () => {
		const verify = vi.fn().mockResolvedValue(undefined);
		const server = app(verify);
		const body = call("remember");

		const res = await request(server)
			.post("/mcp")
			.set("authorization", "Bearer bad")
			.send(body);

		expect(res.status).toBe(401);
	});

	it("RULE-MCP-005: Empty `:identifier` segment (`/mcp/`) → same as bare `/mcp`", async () => {
		const server = app();
		const body = call("remember");

		const res = await request(server).post("/mcp/").send(body);

		expect(res.status).toBe(401);
	});

	it("RULE-MCP-006: A private tool call on `/mcp/:identifier` → 404", async () => {
		const server = app();
		const body = call("remember");

		const res = await request(server).post("/mcp/markus-azer").send(body);

		expect(res.status).toBe(404);
	});

	it("does not require a bearer to produce the 404 on `/mcp/:identifier`", async () => {
		const verify = vi.fn();
		const server = app(verify);
		const body = call("remember");

		const res = await request(server).post("/mcp/markus-azer").send(body);

		expect(res.status).toBe(404);
		expect(verify).not.toHaveBeenCalled();
	});
});
