import express from "express";
import request from "supertest";
import { describe, expect, it, vi } from "vitest";
import { mcpAuthMiddleware } from "~/infrastructure/http/mcp-auth.middleware";

const app = (verify = vi.fn().mockResolvedValue(undefined)) => {
	const a = express();
	a.use(express.json());
	a.use(
		mcpAuthMiddleware(
			verify,
			new Set(["remember"]),
			"https://thoth/.well-known/oauth-protected-resource",
		),
	);
	a.post("/mcp", (_req, res) => res.json({ ok: true }));
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

	it("401s a private tool call with no token", async () => {
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

	it("allows a private tool call when the token verifies", async () => {
		const verify = vi.fn().mockResolvedValue({ userId: "u1" });
		const server = app(verify);
		const body = call("remember");

		const res = await request(server)
			.post("/mcp")
			.set("authorization", "Bearer good")
			.send(body);

		expect(res.status).toBe(200);
		expect(verify).toHaveBeenCalledWith("good");
	});

	it("accepts a lowercase bearer scheme", async () => {
		const verify = vi.fn().mockResolvedValue({ userId: "u1" });
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
});
